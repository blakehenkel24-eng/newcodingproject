-- Test User Setup for SlideTheory
-- Run this in Supabase SQL Editor to create a test user with unlimited generations

-- Option 1: Create test user manually (if you know the user ID after signup)
-- UPDATE profiles 
-- SET tier = 'test', daily_generation_count = 0
-- WHERE email = 'test@slidetheory.com';

-- Option 2: Add a test tier column for unlimited access
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free';

-- Option 3: Create test user via auth.users (requires Supabase Auth Admin)
-- Note: This should be done through Supabase Dashboard > Authentication > Users > Add User

-- Test emails that bypass rate limits (configured in src/lib/rateLimit.ts):
-- - test@slidetheory.com
-- - admin@slidetheory.com  
-- - demo@slidetheory.com

-- To use:
-- 1. Sign up with one of the test emails above at /signup
-- 2. The rate limit bypass is automatic - no limit on generations
-- 3. You'll see "Test User" badge in the UI (if implemented)

-- For existing users, you can upgrade them to 'pro' tier:
-- UPDATE profiles SET tier = 'pro' WHERE email = 'user@example.com';
