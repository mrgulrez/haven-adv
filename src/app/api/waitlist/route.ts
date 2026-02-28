import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { name, email, source } = await request.json();

        // Validate input
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to admin
            subject: `New Waitlist Sign-up: ${name || 'User'}`,
            text: `
        New sign-up for Nuravya AI Waitlist!
        
        Name: ${name || 'N/A'}
        Email: ${email}
        Source: ${source || 'Website'}
        Date: ${new Date().toLocaleString()}
      `,
            html: `
        <h2>New Waitlist Sign-up 🎉</h2>
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Source:</strong> ${source || 'Website'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `,
        };

        // Auto-reply to user (optional but good for UX)
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to the Nuravya AI Waitlist!',
            text: `
        Hi ${name ? name.split(' ')[0] : 'there'},

        Thanks for joining the waitlist for Nuravya AI! You've secured your spot to be among the first to experience the future of compassionate AI companionship.

        We'll keep you updated on our launch progress and exclusive early-bird perks.

        Warmly,
        The Nuravya AI Team
      `,
            html: `
        <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #F59E0B;">Welcome to Nuravya AI</h1>
          <p>Hi ${name ? name.split(' ')[0] : 'there'},</p>
          <p>Thanks for joining the waitlist! You've secured your spot to be among the first to experience the future of compassionate AI companionship.</p>
          <p>We'll keep you updated on our launch progress and exclusive early-bird perks.</p>
          <br/>
          <p>Warmly,</p>
          <p><strong>The Nuravya AI Team</strong></p>
        </div>
      `
        };

        // Send emails
        await transporter.sendMail(mailOptions);
        try {
            await transporter.sendMail(userMailOptions);
        } catch (error) {
            console.error("Failed to send auto-reply:", error);
            // Continue even if auto-reply fails
        }

        return NextResponse.json({ success: true, message: 'Successfully joined waitlist' });
    } catch (error) {
        console.error('Waitlist API Error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
