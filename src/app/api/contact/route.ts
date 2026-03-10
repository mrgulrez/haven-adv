import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ── SMTP transport (GoDaddy / company email) ──────────────────────────────
function createTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) return null;

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
}

const FROM = process.env.SMTP_FROM || 'Nuravya AI <hello@nuravya.com>';
const ADMIN_TO = process.env.SMTP_ADMIN_TO || process.env.SMTP_USER || 'gulrez@nuravya.com';

export async function POST(request: Request) {
    try {
        const { firstName, lastName, email, message } = await request.json();

        if (!email || !message) {
            return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
        }

        const transporter = createTransporter();

        if (!transporter) {
            console.warn('[contact] SMTP not configured — skipping email send');
            return NextResponse.json({ success: true, message: 'Message sent successfully' });
        }

        // Admin notification
        await transporter.sendMail({
            from: FROM,
            to: ADMIN_TO,
            subject: `New Contact Message from ${firstName} ${lastName}`,
            html: `
                <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto; border: 1px solid #E7E5E4; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #F59E0B; margin-top: 0;">New Contact Message ✉️</h2>
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: #F5F5F4; padding: 15px; border-radius: 8px;">
                        ${message.replace(/\n/g, '<br/>')}
                    </div>
                    <p style="color: #78716C; font-size: 12px; margin-top: 20px;">Received on ${new Date().toLocaleString()}</p>
                </div>
            `,
        });

        // Confirmation to user (non-fatal)
        try {
            await transporter.sendMail({
                from: FROM,
                to: email,
                subject: 'We received your message - Nuravya AI',
                html: `
                    <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #F59E0B;">Message Received ✅</h1>
                        <p>Hi ${firstName},</p>
                        <p>Thanks for reaching out! We'll get back to you within 24 hours.</p>
                        <div style="border-left: 4px solid #F59E0B; padding-left: 15px; margin: 20px 0; color: #78716C;">
                            <p>"${message.replace(/\n/g, '<br/>')}"</p>
                        </div>
                        <p>Warmly,<br/><strong>The Nuravya Team</strong></p>
                        <p style="color: #78716C; font-size: 12px; margin-top: 24px;">
                            Nuravya AI · <a href="https://nuravya.com" style="color: #F59E0B;">nuravya.com</a>
                        </p>
                    </div>
                `,
            });
        } catch (err) {
            console.error('Contact confirmation failed (non-fatal):', err);
        }

        return NextResponse.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
