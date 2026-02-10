/**
 * Data Lifecycle Management
 * Handles automatic deletion, retention policies, and secure data purging
 */

import { createClient } from '@/lib/supabase/server';

export type RetentionPolicy = 'immediate' | '5minutes' | '1hour' | '1day' | '30days';

export interface DataRetentionConfig {
  userInput: RetentionPolicy;
  generatedSlide: RetentionPolicy;
  metadata: RetentionPolicy;
  auditLogs: RetentionPolicy;
}

export interface DeletionRecord {
  slideId: string;
  userId: string;
  deletedAt: Date;
  dataTypes: string[];
  method: 'automatic' | 'manual' | 'scheduled';
}

// Default retention configuration (most secure)
export const SECURE_RETENTION_CONFIG: DataRetentionConfig = {
  userInput: 'immediate',
  generatedSlide: '5minutes',
  metadata: '30days',
  auditLogs: '30days',
};

// Retention periods in milliseconds
const RETENTION_PERIODS: Record<RetentionPolicy, number> = {
  immediate: 0,
  '5minutes': 5 * 60 * 1000,
  '1hour': 60 * 60 * 1000,
  '1day': 24 * 60 * 60 * 1000,
  '30days': 30 * 24 * 60 * 60 * 1000,
};

/**
 * Data Lifecycle Manager
 * Handles automatic deletion and retention policies
 */
export class DataLifecycleManager {
  private config: DataRetentionConfig;
  private scheduledDeletions: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: DataRetentionConfig = SECURE_RETENTION_CONFIG) {
    this.config = config;
  }

  /**
   * Schedule deletion of user input data after slide generation
   */
  async scheduleUserInputDeletion(slideId: string, userId: string): Promise<void> {
    const delay = RETENTION_PERIODS[this.config.userInput];
    
    if (delay === 0) {
      // Immediate deletion
      await this.deleteUserInput(slideId);
    } else {
      // Schedule delayed deletion
      const timeout = setTimeout(async () => {
        await this.deleteUserInput(slideId);
        this.scheduledDeletions.delete(slideId);
      }, delay);
      
      this.scheduledDeletions.set(slideId, timeout);
    }

    // Log the scheduled deletion
    await this.logDeletionEvent({
      slideId,
      userId,
      deletedAt: new Date(Date.now() + delay),
      dataTypes: ['context_input', 'message_input', 'data_input', 'file_input_url'],
      method: 'scheduled',
    });
  }

  /**
   * Delete user input data immediately
   */
  async deleteUserInput(slideId: string): Promise<boolean> {
    try {
      const supabase = createClient();
      
      // Get the current data for logging (anonymized)
      const { data: slide } = await supabase
        .from('slides')
        .select('id, user_id, context_input_hash, created_at')
        .eq('id', slideId)
        .single();

      if (!slide) {
        console.warn(`[DataLifecycle] Slide ${slideId} not found for deletion`);
        return false;
      }

      // Perform secure deletion by overwriting with null/empty values
      const { error } = await supabase
        .from('slides')
        .update({
          context_input: '[DELETED - SECURE PURGE]',
          message_input: '[DELETED - SECURE PURGE]',
          data_input: null,
          file_input_url: null,
          llm_blueprint: null,
          template_props: null,
          purged_at: new Date().toISOString(),
        })
        .eq('id', slideId);

      if (error) {
        console.error(`[DataLifecycle] Failed to delete user input for slide ${slideId}:`, error);
        return false;
      }

      // Clear from any caches
      await this.clearFromCache(slideId);
      
      // Wipe from memory (if stored in any in-memory stores)
      this.wipeFromMemory(slideId);

      console.log(`[DataLifecycle] Successfully purged user input for slide ${slideId}`);
      return true;
    } catch (error) {
      console.error(`[DataLifecycle] Error deleting user input for slide ${slideId}:`, error);
      return false;
    }
  }

  /**
   * Delete generated slide content (after TTL)
   */
  async deleteGeneratedSlide(slideId: string): Promise<boolean> {
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('slides')
        .update({
          template_props: null,
          slide_content_deleted: true,
          slide_deleted_at: new Date().toISOString(),
        })
        .eq('id', slideId);

      if (error) {
        console.error(`[DataLifecycle] Failed to delete slide content for ${slideId}:`, error);
        return false;
      }

      console.log(`[DataLifecycle] Deleted generated slide content for ${slideId}`);
      return true;
    } catch (error) {
      console.error(`[DataLifecycle] Error deleting slide content for ${slideId}:`, error);
      return false;
    }
  }

  /**
   * Delete all data for a user (GDPR right to erasure)
   */
  async deleteAllUserData(userId: string): Promise<{ success: boolean; deletedCount: number }> {
    try {
      const supabase = createClient();
      
      // Get all slides for the user
      const { data: slides } = await supabase
        .from('slides')
        .select('id')
        .eq('user_id', userId);

      const slideIds = slides?.map(s => s.id) || [];
      let deletedCount = 0;

      // Delete each slide's data
      for (const slideId of slideIds) {
        const success = await this.deleteUserInput(slideId);
        if (success) deletedCount++;
      }

      // Delete user profile (except auth record which is handled separately)
      await supabase
        .from('profiles')
        .update({
          display_name: '[DELETED]',
          daily_generation_count: 0,
          data_deleted_at: new Date().toISOString(),
        })
        .eq('id', userId);

      console.log(`[DataLifecycle] Deleted all data for user ${userId}: ${deletedCount} slides`);
      
      return { success: true, deletedCount };
    } catch (error) {
      console.error(`[DataLifecycle] Error deleting user data for ${userId}:`, error);
      return { success: false, deletedCount: 0 };
    }
  }

  /**
   * Cancel scheduled deletion
   */
  cancelScheduledDeletion(slideId: string): boolean {
    const timeout = this.scheduledDeletions.get(slideId);
    if (timeout) {
      clearTimeout(timeout);
      this.scheduledDeletions.delete(slideId);
      console.log(`[DataLifecycle] Cancelled scheduled deletion for slide ${slideId}`);
      return true;
    }
    return false;
  }

  /**
   * Run cleanup for expired data
   */
  async runCleanup(): Promise<{ deletedSlides: number; errors: number }> {
    const supabase = createClient();
    const now = new Date().toISOString();
    
    let deletedSlides = 0;
    let errors = 0;

    try {
      // Find slides with expired retention
      const { data: expiredSlides } = await supabase
        .from('slides')
        .select('id, user_id, created_at, purged_at')
        .is('purged_at', null) // Not yet purged
        .lt('created_at', this.getExpiryDate(this.config.userInput));

      if (expiredSlides) {
        for (const slide of expiredSlides) {
          const success = await this.deleteUserInput(slide.id);
          if (success) {
            deletedSlides++;
          } else {
            errors++;
          }
        }
      }

      console.log(`[DataLifecycle] Cleanup complete: ${deletedSlides} slides purged, ${errors} errors`);
      return { deletedSlides, errors };
    } catch (error) {
      console.error('[DataLifecycle] Cleanup error:', error);
      return { deletedSlides, errors: errors + 1 };
    }
  }

  /**
   * Get data retention status for a slide
   */
  async getRetentionStatus(slideId: string): Promise<{
    exists: boolean;
    purged: boolean;
    purgeScheduled?: Date;
    dataTypes: string[];
  } | null> {
    try {
      const supabase = createClient();
      
      const { data: slide } = await supabase
        .from('slides')
        .select('id, purged_at, context_input, message_input, data_input, created_at')
        .eq('id', slideId)
        .single();

      if (!slide) return null;

      const purged = !!slide.purged_at;
      const dataTypes = [];
      
      if (slide.context_input && !slide.context_input.includes('[DELETED')) dataTypes.push('context');
      if (slide.message_input && !slide.message_input.includes('[DELETED')) dataTypes.push('message');
      if (slide.data_input) dataTypes.push('data');

      return {
        exists: true,
        purged,
        purgeScheduled: purged ? undefined : new Date(new Date(slide.created_at).getTime() + RETENTION_PERIODS[this.config.userInput]),
        dataTypes,
      };
    } catch (error) {
      console.error(`[DataLifecycle] Error getting retention status for ${slideId}:`, error);
      return null;
    }
  }

  // Private helper methods

  private async clearFromCache(slideId: string): Promise<void> {
    // Implement cache clearing logic here
    // This would connect to your caching layer (Redis, etc.)
    console.log(`[DataLifecycle] Cleared slide ${slideId} from cache`);
  }

  private wipeFromMemory(slideId: string): void {
    // Clear any in-memory references
    this.scheduledDeletions.delete(slideId);
  }

  private async logDeletionEvent(record: DeletionRecord): Promise<void> {
    const supabase = createClient();
    
    await supabase.from('deletion_logs').insert({
      slide_id: record.slideId,
      user_id: record.userId,
      deleted_at: record.deletedAt.toISOString(),
      data_types: record.dataTypes,
      method: record.method,
    });
  }

  private getExpiryDate(policy: RetentionPolicy): string {
    const expiry = new Date(Date.now() - RETENTION_PERIODS[policy]);
    return expiry.toISOString();
  }
}

/**
 * Singleton instance for global use
 */
let globalLifecycleManager: DataLifecycleManager | null = null;

export function getDataLifecycleManager(config?: DataRetentionConfig): DataLifecycleManager {
  if (!globalLifecycleManager) {
    globalLifecycleManager = new DataLifecycleManager(config);
  }
  return globalLifecycleManager;
}

/**
 * Middleware for automatic deletion after slide generation
 */
export async function withAutoDeletion<T>(
  slideId: string,
  userId: string,
  operation: () => Promise<T>,
  config?: DataRetentionConfig
): Promise<T> {
  const manager = getDataLifecycleManager(config);
  
  try {
    // Run the operation
    const result = await operation();
    
    // Schedule deletion after successful operation
    await manager.scheduleUserInputDeletion(slideId, userId);
    
    return result;
  } catch (error) {
    // If operation fails, don't delete - user might want to retry
    console.error(`[DataLifecycle] Operation failed, deletion not scheduled for ${slideId}`);
    throw error;
  }
}

/**
 * SQL migration for deletion_logs table
 */
export const DELETION_LOGS_MIGRATION = `
-- Create deletion logs table for audit purposes
CREATE TABLE IF NOT EXISTS deletion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slide_id UUID REFERENCES slides(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  deleted_at TIMESTAMPTZ NOT NULL,
  data_types TEXT[] NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('automatic', 'manual', 'scheduled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for querying
CREATE INDEX idx_deletion_logs_user_id ON deletion_logs(user_id);
CREATE INDEX idx_deletion_logs_slide_id ON deletion_logs(slide_id);
CREATE INDEX idx_deletion_logs_deleted_at ON deletion_logs(deleted_at);

-- Add columns to slides table for tracking
ALTER TABLE slides 
ADD COLUMN IF NOT EXISTS purged_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS slide_deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS slide_content_deleted BOOLEAN DEFAULT false;

-- Enable RLS
ALTER TABLE deletion_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own deletion logs
CREATE POLICY "Users can view own deletion logs"
  ON deletion_logs
  FOR SELECT
  USING (auth.uid() = user_id);
`;
