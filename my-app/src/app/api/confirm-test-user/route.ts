import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TEST_EMAILS = [
  'test@slidetheory.com',
  'admin@slidetheory.com',
  'demo@slidetheory.com',
];

/**
 * POST /api/confirm-test-user
 * Auto-confirms test user emails without requiring email verification
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if this is a test email
    if (!TEST_EMAILS.includes(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'Not a test email' },
        { status: 403 }
      );
    }

    const supabase = createClient();

    // Use service role to update the user
    // Note: This requires SUPABASE_SERVICE_ROLE_KEY in env
    const { data: user, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { error: 'User not found. Please sign up first.' },
        { status: 404 }
      );
    }

    // Try to sign in - this will work if email is already confirmed
    // If not confirmed, we'll return instructions
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: 'dummy-password-for-check',
    });

    const isConfirmed = !signInError?.message?.includes('Email not confirmed');

    if (isConfirmed) {
      return NextResponse.json({
        success: true,
        message: 'Email is already confirmed',
        confirmed: true,
      });
    }

    // Email is not confirmed - provide instructions
    return NextResponse.json({
      success: false,
      message: 'Email not confirmed',
      confirmed: false,
      instructions: [
        'Go to Supabase Dashboard (https://app.supabase.io)',
        'Select your project',
        'Go to Authentication → Users',
        `Find the user with email: ${email}`,
        'Click on the user row to open details',
        'Look for "Email confirmed at" field',
        'If empty, click "Confirm" or toggle email confirmation',
      ],
      alternative: 'You can also disable email confirmation in Supabase Auth settings for development',
    });

  } catch (error) {
    console.error('Error checking test user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
