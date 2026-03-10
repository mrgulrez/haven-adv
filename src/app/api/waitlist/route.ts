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
        secure: port === 465, // SSL for 465, STARTTLS for 587
        auth: { user, pass },
    });
}

const FROM = process.env.SMTP_FROM || 'Nuravya AI <hello@nuravya.com>';
const ADMIN_TO = process.env.SMTP_ADMIN_TO || process.env.SMTP_USER || 'gulrez@nuravya.com';

export async function POST(request: Request) {
    try {
        const { name, email, source } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const transporter = createTransporter();

        // If SMTP isn't configured, still return success so the UI doesn't break
        if (!transporter) {
            console.warn('[waitlist] SMTP not configured — skipping email send');
            return NextResponse.json({ success: true, message: 'Successfully joined waitlist' });
        }

        // Admin notification
        await transporter.sendMail({
            from: FROM,
            to: ADMIN_TO,
            subject: `New Waitlist Sign-up: ${name || 'User'}`,
            html: `
                <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #F59E0B;">New Waitlist Sign-up 🎉</h2>
                    <p><strong>Name:</strong> ${name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Source:</strong> ${source || 'Website'}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                </div>
            `,
        });

        // Welcome auto-reply to user (non-fatal)
        try {
            await transporter.sendMail({
                from: FROM,
                to: email,
                subject: 'Welcome to the Nuravya AI Waitlist!',
                html: `
                    <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #F59E0B;">Welcome to Nuravya AI 👋</h1>
                        <p>Hi ${name ? name.split(' ')[0] : 'there'},</p>
                        <p>Thanks for joining the waitlist! You're among the first to experience the future of compassionate AI companionship.</p>
                        <p>We'll keep you updated on our launch and exclusive early-bird perks.</p>
                        <br/>
                        <p>Warmly,<br/><strong>The Nuravya Team</strong></p>
                        <p style="color: #78716C; font-size: 12px; margin-top: 24px;">
                            Nuravya AI · <a href="https://nuravya.com" style="color: #F59E0B;">nuravya.com</a>
                        </p>
                    </div>
                `,
            });
        } catch (err) {
            console.error('Auto-reply failed (non-fatal):', err);
        }

        return NextResponse.json({ success: true, message: 'Successfully joined waitlist' });
    } catch (error) {
        console.error('Waitlist API Error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
