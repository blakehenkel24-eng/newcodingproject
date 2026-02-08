import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client for client-side usage
export const createClientClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Server client for server-side usage (requires service role for admin operations)
export const createServerClient = () => {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

// Types for leads table
export interface Lead {
  id?: string;
  email: string;
  name?: string;
  company?: string;
  source: string;
  resource_downloaded?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at?: string;
  subscribed?: boolean;
}

// Lead capture function
export async function captureLead(lead: Lead): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient();
    
    const { error } = await supabase
      .from('leads')
      .insert([{
        ...lead,
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      // Handle duplicate email gracefully
      if (error.code === '23505') {
        return { success: true }; // Already exists, but we don't want to block the user
      }
      console.error('Error capturing lead:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error capturing lead:', error);
    return { success: false, error: 'Failed to capture lead' };
  }
}
