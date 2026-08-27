import nodemailer from 'nodemailer';
import { z } from 'zod';
import {
    enforcePublicFormLimit,
    escapeHtml,
    noStoreJson,
    plainTextToHtml,
} from '@/lib/server/public-form-security';

const contactSchema = z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().max(80).default(''),
    email: z.string().trim().email().max(254),
    message: z.string().trim().min(10).max(4_000),
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
        secure: port === 465,
        auth: { user, pass },
    });
}

const FROM = process.env.SMTP_FROM || 'Nuravya AI <hello@nuravya.com>';
const ADMIN_TO = process.env.SMTP_ADMIN_TO || process.env.SMTP_USER || 'gulrez@nuravya.com';

export async function POST(request: Request) {
    const limited = enforcePublicFormLimit(request, 'contact');
    if (limited) return limited;

    try {
        const parsed = contactSchema.safeParse(await request.json());
        if (!parsed.success) {
            return noStoreJson({ error: 'Please check the form and try again.' }, { status: 400 });
        }

        const { firstName, lastName, email, message, website } = parsed.data;
        if (website) return noStoreJson({ success: true, message: 'Message received' });

        const transporter = createTransporter();

        if (!transporter) {
            console.error('[contact] SMTP is not configured');
            return noStoreJson({ error: 'Messaging is temporarily unavailable.' }, { status: 503 });
        }

        const safeFirstName = escapeHtml(firstName);
        const safeLastName = escapeHtml(lastName);
        const safeEmail = escapeHtml(email);
        const safeMessage = plainTextToHtml(message);

        // Admin notification
        await transporter.sendMail({
            from: FROM,
            to: ADMIN_TO,
            replyTo: email,
            subject: `New contact message from ${firstName} ${lastName}`.replace(/[\r\n]/g, ' '),
            html: `
                <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto; border: 1px solid #E7E5E4; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #F59E0B; margin-top: 0;">New Contact Message ✉️</h2>
                    <p><strong>Name:</strong> ${safeFirstName} ${safeLastName}</p>
                    <p><strong>Email:</strong> ${safeEmail}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: #F5F5F4; padding: 15px; border-radius: 8px;">
                        ${safeMessage}
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
                        <p>Hi ${safeFirstName},</p>
                        <p>Thanks for reaching out! We'll get back to you within 24 hours.</p>
                        <div style="border-left: 4px solid #F59E0B; padding-left: 15px; margin: 20px 0; color: #78716C;">
                            <p>“${safeMessage}”</p>
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

        return noStoreJson({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact API Error:', error);
        return noStoreJson({ error: 'Failed to send message' }, { status: 500 });
    }
}
