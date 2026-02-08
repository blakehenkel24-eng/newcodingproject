import { NextRequest, NextResponse } from 'next/server';
import { captureLead, Lead } from '@/lib/supabase';
import { subscribeToList, sendResourceWelcomeEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.source) {
      return NextResponse.json(
        { success: false, error: 'Email and source are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Capture lead in Supabase
    const lead: Lead = {
      email: body.email.toLowerCase().trim(),
      name: body.name?.trim(),
      company: body.company?.trim(),
      source: body.source,
      resource_downloaded: body.resource_downloaded,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      subscribed: true,
    };

    const captureResult = await captureLead(lead);

    if (!captureResult.success) {
      return NextResponse.json(
        { success: false, error: captureResult.error },
        { status: 500 }
      );
    }

    // Subscribe to email list (async, don't wait)
    subscribeToList({
      email: lead.email,
      firstName: lead.name?.split(' ')[0],
      lastName: lead.name?.split(' ').slice(1).join(' '),
      company: lead.company,
      source: lead.source,
      tags: lead.resource_downloaded ? [lead.resource_downloaded] : [],
    }).catch(console.error);

    // Send welcome email if it's a resource download
    if (lead.resource_downloaded && body.send_welcome !== false) {
      sendResourceWelcomeEmail(
        lead.email,
        body.resource_title || 'Resource'
      ).catch(console.error);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in lead capture:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
