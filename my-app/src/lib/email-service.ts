// Email service integration placeholder
// This file provides a clean interface for email service providers
// Currently supports SendGrid and Mailchimp (configure as needed)

export interface EmailSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  tags?: string[];
  source: string;
}

export interface SendOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

// Email service configuration
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'sendgrid'; // 'sendgrid' | 'mailchimp' | 'none'
const FROM_EMAIL = process.env.FROM_EMAIL || 'hello@slidetheory.com';
const FROM_NAME = process.env.FROM_NAME || 'SlideTheory';

/**
 * Subscribe an email to the mailing list
 * This is a placeholder - integrate with your email provider
 */
export async function subscribeToList(subscriber: EmailSubscriber): Promise<{ success: boolean; error?: string }> {
  try {
    switch (EMAIL_PROVIDER) {
      case 'sendgrid':
        return await subscribeWithSendGrid(subscriber);
      case 'mailchimp':
        return await subscribeWithMailchimp(subscriber);
      default:
        // No email provider configured - just log
        console.log('Email subscription (no provider):', subscriber);
        return { success: true };
    }
  } catch (error) {
    console.error('Error subscribing to list:', error);
    return { success: false, error: 'Failed to subscribe' };
  }
}

/**
 * Send a transactional email
 * This is a placeholder - integrate with your email provider
 */
export async function sendEmail(options: SendOptions): Promise<{ success: boolean; error?: string }> {
  try {
    switch (EMAIL_PROVIDER) {
      case 'sendgrid':
        return await sendWithSendGrid(options);
      default:
        console.log('Email (no provider):', options);
        return { success: true };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send welcome email after resource download
 */
export async function sendResourceWelcomeEmail(email: string, resourceName: string): Promise<{ success: boolean; error?: string }> {
  const subject = `Your ${resourceName} is ready!`;
  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0D9488;">Thanks for downloading ${resourceName}!</h1>
      <p>Hi there,</p>
      <p>Thanks for downloading <strong>${resourceName}</strong> from SlideTheory. We hope you find it valuable!</p>
      <p>Here are a few other resources you might find useful:</p>
      <ul>
        <li><a href="https://slidetheory.com/resources/mckinsey-slide-templates">McKinsey Slide Template Library</a></li>
        <li><a href="https://slidetheory.com/blog">Our Blog</a> - Tips on consulting-style presentations</li>
        <li><a href="https://slidetheory.com">Try SlideTheory</a> - Generate slides in seconds</li>
      </ul>
      <p>Have questions? Just reply to this email.</p>
      <p>Best,<br>The SlideTheory Team</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

// SendGrid integration placeholder
async function subscribeWithSendGrid(subscriber: EmailSubscriber): Promise<{ success: boolean; error?: string }> {
  // TODO: Implement SendGrid Marketing Campaigns API
  // const sgClient = require('@sendgrid/client');
  // sgClient.setApiKey(process.env.SENDGRID_API_KEY);
  // 
  // const data = {
  //   contacts: [{
  //     email: subscriber.email,
  //     first_name: subscriber.firstName,
  //     last_name: subscriber.lastName,
  //     custom_fields: {
  //       company: subscriber.company,
  //       source: subscriber.source,
  //     },
  //   }],
  // };
  //
  // await sgClient.request({
  //   method: 'PUT',
  //   url: '/v3/marketing/contacts',
  //   body: data,
  // });

  console.log('SendGrid subscription:', subscriber);
  return { success: true };
}

async function sendWithSendGrid(options: SendOptions): Promise<{ success: boolean; error?: string }> {
  // TODO: Implement SendGrid Mail API
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  //
  // await sgMail.send({
  //   to: options.to,
  //   from: options.from || `${FROM_NAME} <${FROM_EMAIL}>`,
  //   subject: options.subject,
  //   text: options.text,
  //   html: options.html,
  // });

  console.log('SendGrid email:', options);
  return { success: true };
}

// Mailchimp integration placeholder
async function subscribeWithMailchimp(subscriber: EmailSubscriber): Promise<{ success: boolean; error?: string }> {
  // TODO: Implement Mailchimp API
  // const mailchimp = require('@mailchimp/mailchimp_marketing');
  // mailchimp.setConfig({
  //   apiKey: process.env.MAILCHIMP_API_KEY,
  //   server: process.env.MAILCHIMP_SERVER_PREFIX,
  // });
  //
  // await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
  //   email_address: subscriber.email,
  //   status: 'subscribed',
  //   merge_fields: {
  //     FNAME: subscriber.firstName,
  //     LNAME: subscriber.lastName,
  //     COMPANY: subscriber.company,
  //   },
  //   tags: subscriber.tags,
  // });

  console.log('Mailchimp subscription:', subscriber);
  return { success: true };
}
