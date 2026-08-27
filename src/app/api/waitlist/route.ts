import nodemailer from 'nodemailer';
import { z } from 'zod';
import {
    enforcePublicFormLimit,
    escapeHtml,
    noStoreJson,
} from '@/lib/server/public-form-security';

const waitlistSchema = z.object({
    name: z.string().trim().max(120).optional().default(''),
    email: z.string().trim().email().max(254),
    source: z.string().trim().max(80).optional().default('Website'),
    website: z.string().max(0).optional(),
}).strict();

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
    const limited = enforcePublicFormLimit(request, 'waitlist');
    if (limited) return limited;

    try {
        const parsed = waitlistSchema.safeParse(await request.json());
        if (!parsed.success) {
            return noStoreJson({ error: 'Please enter a valid email address.' }, { status: 400 });
        }

        const { name, email, source, website } = parsed.data;
        if (website) return noStoreJson({ success: true, message: 'Successfully joined waitlist' });

        const transporter = createTransporter();

        if (!transporter) {
            console.error('[waitlist] SMTP is not configured');
            return noStoreJson({ error: 'Waitlist signup is temporarily unavailable.' }, { status: 503 });
        }

        const safeName = escapeHtml(name || 'N/A');
        const safeEmail = escapeHtml(email);
        const safeSource = escapeHtml(source || 'Website');

        // Admin notification
        await transporter.sendMail({
            from: FROM,
            to: ADMIN_TO,
            subject: `New Waitlist Sign-up: ${name || 'User'}`,
            html: `
                <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #F59E0B;">New Waitlist Sign-up 🎉</h2>
                    <p><strong>Name:</strong> ${safeName}</p>
                    <p><strong>Email:</strong> ${safeEmail}</p>
                    <p><strong>Source:</strong> ${safeSource}</p>
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
                        <p>Hi ${name ? escapeHtml(name.split(' ')[0]) : 'there'},</p>
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

        return noStoreJson({ success: true, message: 'Successfully joined waitlist' });
    } catch (error) {
        console.error('Waitlist API Error:', error);
        return noStoreJson({ error: 'Failed to process request' }, { status: 500 });
    }
}
