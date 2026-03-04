import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, message } = await request.json();

    // Validate input
    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${firstName} ${lastName}`,
      text: `
        New message from Nuravya AI Contact Form!
        
        Name: ${firstName} ${lastName}
        Email: ${email}
        Message: ${message}
        Date: ${new Date().toLocaleString()}
      `,
      html: `
        <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto; border: 1px solid #E7E5E4; padding: 20px; rounded-xl;">
          <h2 style="color: #F59E0B; margin-top: 0;">New Contact Message ✉️</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #F5F5F4; padding: 15px; border-radius: 8px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <p style="color: #78716C; font-size: 12px; margin-top: 20px;">Received on ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    // Confirmation to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your message - Nuravya AI',
      text: `
        Hi ${firstName},
        
        Thank you for reaching out to Nuravya AI! We've received your message and our team will get back to you as soon as possible (usually within 24 hours).
        
        Your message:
        "${message}"
        
        Warmly,
        The Nuravya AI Team
      `,
      html: `
        <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #F59E0B;">Message Received</h1>
          <p>Hi ${firstName},</p>
          <p>Thank you for reaching out to Nuravya AI! We've received your message and our team will get back to you as soon as possible (usually within 24 hours).</p>
          <div style="border-left: 4px solid #F59E0B; padding-left: 15px; margin: 20px 0; color: #78716C; italic;">
            <p>"${message.replace(/\n/g, '<br/>')}"</p>
          </div>
          <p>We appreciate your interest in our mission to build a true, everyday companion through AI.</p>
          <br/>
          <p>Warmly,</p>
          <p><strong>The Nuravya Team@Enord</strong></p>
        </div>
      `
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    try {
      await transporter.sendMail(userMailOptions);
    } catch (error) {
      console.error("Failed to send contact confirmation:", error);
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
