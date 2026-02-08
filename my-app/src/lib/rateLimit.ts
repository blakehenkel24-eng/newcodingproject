import { createClient } from './supabase/server';
import { UserProfile } from '@/types/input';

const DAILY_LIMIT = 5;
const TEST_EMAILS = [
  'test@slidetheory.com',
  'admin@slidetheory.com',
  'demo@slidetheory.com',
];

export async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number; profile: UserProfile; isTestUser: boolean }> {
  const supabase = createClient();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error || !profile) {
    throw new Error('Failed to fetch user profile');
  }
  
  // Check if this is a test user (unlimited generations)
  const isTestUser = TEST_EMAILS.includes(profile.email.toLowerCase());
  if (isTestUser) {
    return { allowed: true, remaining: 999, profile, isTestUser: true };
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  // Reset counter if it's a new day
  if (profile.last_generation_date !== today) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        daily_generation_count: 0,
        last_generation_date: today,
      })
      .eq('id', userId);
    
    if (updateError) {
      throw new Error('Failed to reset daily count');
    }
    
    profile.daily_generation_count = 0;
    profile.last_generation_date = today;
  }
  
  // Check if user has exceeded limit
  if (profile.daily_generation_count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0, profile, isTestUser: false };
  }
  
  const remaining = DAILY_LIMIT - profile.daily_generation_count;
  
  return { allowed: true, remaining, profile, isTestUser: false };
}

export async function incrementGenerationCount(userId: string): Promise<void> {
  const supabase = createClient();
  
  // Check if test user first
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single();
    
  if (profile && TEST_EMAILS.includes(profile.email.toLowerCase())) {
    // Don't increment for test users
    return;
  }
  
  const { error } = await supabase
    .from('profiles')
    .update({
      daily_generation_count: supabase.rpc('increment', { row_id: userId }),
    })
    .eq('id', userId);
  
  if (error) {
    // Fallback: fetch current count and update
    const { data: profile } = await supabase
      .from('profiles')
      .select('daily_generation_count')
      .eq('id', userId)
      .single();
    
    if (profile) {
      await supabase
        .from('profiles')
        .update({ daily_generation_count: profile.daily_generation_count + 1 })
        .eq('id', userId);
    }
  }
}
