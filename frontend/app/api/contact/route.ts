import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('--- NEW CONTACT FORM SUBMISSION ---');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------------');

    // In a real application, you would send an email here using Resend, SendGrid, etc.
    // Or post the data to a Strapi endpoint (e.g., /api/contact-messages)

    // Redirect to a success page or back to contact with a query param
    return NextResponse.redirect(new URL('/contact?success=true', request.url));
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.redirect(new URL('/contact?error=true', request.url));
  }
}
