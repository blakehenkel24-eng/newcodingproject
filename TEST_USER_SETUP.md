# Test User Setup Guide

## Quick Setup (Easiest Method)

### Step 1: Sign Up with Test Email
Go to your app's signup page and create an account with one of these emails:

- `test@slidetheory.com`
- `admin@slidetheory.com`
- `demo@slidetheory.com`

Use any password (minimum 6 characters).

### Step 2: Verify Email (if required)
If email verification is enabled, check your Supabase dashboard:
1. Go to Supabase Dashboard > Authentication > Users
2. Find the test user
3. Click "Confirm email" 

Or use any email address and verify it through your email provider.

### Step 3: Login and Test
1. Go to `/login`
2. Login with the test email and password
3. You now have **unlimited slide generations!**

---

## How It Works

The test user bypass is implemented in `src/lib/rateLimit.ts`:

```typescript
const TEST_EMAILS = [
  'test@slidetheory.com',
  'admin@slidetheory.com',
  'demo@slidetheory.com',
];
```

When a user with one of these emails logs in:
- Rate limit check always returns `allowed: true`
- Remaining count shows as 999
- Generation count never increments

---

## Alternative: Upgrade Existing User

If you already have an account and want to make it a test user:

### Option A: Change Your Email
1. In Supabase Dashboard, go to Authentication > Users
2. Find your user
3. Update email to `test@slidetheory.com`
4. Confirm the email change

### Option B: Add Your Email to Test List
Edit `src/lib/rateLimit.ts` and add your email:

```typescript
const TEST_EMAILS = [
  'test@slidetheory.com',
  'admin@slidetheory.com',
  'demo@slidetheory.com',
  'youremail@example.com', // Add your email here
];
```

Then redeploy to Vercel.

---

## For Development/Local Testing

When running locally, you can also temporarily disable rate limits:

1. Edit `src/lib/rateLimit.ts`
2. Change `DAILY_LIMIT` to a high number:
   ```typescript
   const DAILY_LIMIT = 9999;
   ```

Or return `allowed: true` for all users (not recommended for production):

```typescript
return { allowed: true, remaining: 999, profile, isTestUser: false };
```

---

## Adding a Pro/Enterprise Tier

To add a proper tier system:

1. Run the migration:
   ```bash
   cd my-app
   npx supabase db push
   ```

2. Or execute in SQL Editor:
   ```sql
   ALTER TABLE profiles 
   ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free';
   ```

3. Update rate limit logic:
   ```typescript
   const tierLimits = {
     free: 5,
     pro: 50,
     enterprise: 999,
     test: 999,
   };
   ```

4. Update user tier in Supabase:
   ```sql
   UPDATE profiles SET tier = 'pro' WHERE email = 'user@example.com';
   ```

---

## Test User Credentials Template

| Email | Password | Purpose |
|-------|----------|---------|
| test@slidetheory.com | Test123! | General testing |
| admin@slidetheory.com | Admin123! | Admin features testing |
| demo@slidetheory.com | Demo123! | Demo presentations |

**Note:** Change these passwords after first login!
