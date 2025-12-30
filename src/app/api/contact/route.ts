import { NextResponse } from "next/server";
import crypto from "crypto";
import type { BrevoEmailPayload } from "@/lib/email/brevo";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { buildAdminEmailText, buildAdminEmailHtml, buildConfirmEmailHtml } from "@/lib/email/templates";

export const runtime = "nodejs";

type ContactPayload = {
    name: string;
    email: string;
    subject: string;
    message: string;
    company?: string;
    startedAt?: number;
};

function isEmail(s: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request) {
    const xff = req.headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();
    return "unknown";
}

function rateLimit(ip: string) {
    const now = Date.now();
    const entry = ipHits.get(ip);

    if (!entry || now > entry.resetAt) {
        ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return { ok: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS };
    }

    if (entry.count >= MAX_REQUESTS) {
        return { ok: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count += 1;
    return { ok: true, remaining: MAX_REQUESTS - entry.count, resetAt: entry.resetAt };
}

function toTitleCase(input: string) {
    return input
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}

// Extract "technical issues" from: "... [Category: technical issues]"
function extractCategory(subject: string) {
    const m = subject.match(/\[Category:\s*([^\]]+)\]/i);
    return (m?.[1] ?? "").trim();
}

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);

        const rl = rateLimit(ip);
        if (!rl.ok) {
            const retryInSec = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
            const retryInMin = Math.ceil(retryInSec / 60);

            return NextResponse.json(
                {
                    error: `Too many messages sent from this network. Please try again in about ${retryInMin} minutes.`,
                    code: "RATE_LIMIT",
                    retryInSec,
                },
                { status: 429, headers: { "Retry-After": String(retryInSec) } }
            );
        }

        const body = (await req.json()) as ContactPayload;

        // Honeypot
        if (body.company && body.company.trim().length > 0) {
            return NextResponse.json({ ok: true });
        }

        // Timing check
        if (typeof body.startedAt === "number") {
            const elapsed = Date.now() - body.startedAt;
            if (elapsed < 2000) {
                return NextResponse.json(
                    { error: "Please take a moment to review your message and try again.", code: "TOO_FAST" },
                    { status: 400 }
                );
            }
        }

        const name = (body.name || "").trim();
        const email = (body.email || "").trim();
        const subjectRaw = (body.subject || "").trim();
        const message = (body.message || "").trim();

        if (!name || !email || !subjectRaw || !message) {
            return NextResponse.json({ error: "Please fill in all required fields.", code: "VALIDATION" }, { status: 400 });
        }
        if (!isEmail(email)) {
            return NextResponse.json({ error: "Please enter a valid email address.", code: "VALIDATION" }, { status: 400 });
        }
        if (message.length > 5000) {
            return NextResponse.json(
                { error: "Your message is too long. Please keep it under 5,000 characters.", code: "VALIDATION" },
                { status: 400 }
            );
        }

        const apiKey = process.env.BREVO_API_KEY;
        const fromEmail = process.env.BREVO_ADMIN_FROM_EMAIL;
        const fromName = process.env.BREVO_ADMIN_FROM_NAME || "VietBites";
        const confirmFromEmail = process.env.BREVO_CONFIRM_FROM_EMAIL;
        const confirmFromName = process.env.BREVO_CONFIRM_FROM_NAME || "No Reply | VietBites Toronto";
        const toEmail = process.env.BREVO_TO_EMAIL;
        const techCcEmail = process.env.BREVO_TECH_CC_EMAIL || "admin@motchi.ca";
        const techCcName = "VietBites Tech Support";

        if (!apiKey || !fromEmail || !toEmail || !confirmFromEmail) {
            return NextResponse.json(
                { error: "Server email is not configured yet. Please try again later.", code: "SERVER_CONFIG" },
                { status: 500 }
            );
        }

        const msgId = crypto.randomBytes(6).toString("hex");

        const categoryRaw = extractCategory(subjectRaw);
        const categoryTitle = categoryRaw ? toTitleCase(categoryRaw) : "";
        const subjectNormalized = categoryTitle
            ? subjectRaw.replace(/\[Category:\s*([^\]]+)\]/i, `[Category: ${categoryTitle}]`)
            : subjectRaw;

        const adminHtml = buildAdminEmailHtml({
            msgId,
            name,
            email,
            subject: subjectNormalized,
            categoryTitle: categoryTitle || undefined,
            message,
        });

        const adminText = buildAdminEmailText({
            msgId,
            name,
            email,
            subject: subjectNormalized,
            categoryTitle: categoryTitle || undefined,
            message,
        });

        const isTech = categoryRaw.toLowerCase() === "technical issues";

        const adminPayload: BrevoEmailPayload = {
            sender: { email: fromEmail, name: fromName },
            to: [{ email: toEmail, name: "VietBites" }],
            ...(isTech ? { cc: [{ email: techCcEmail, name: techCcName }] } : {}),
            replyTo: { email, name },
            subject: subjectNormalized,
            htmlContent: adminHtml,
            textContent: adminText,
        };

        const sentAdmin = await sendBrevoEmail(apiKey, adminPayload);
        if (!sentAdmin.ok) {
            if (sentAdmin.status === 429) {
                return NextResponse.json(
                    { error: "We’re receiving a high volume of messages right now. Please try again shortly.", code: "EMAIL_RATE_LIMIT" },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: "We could not send your message right now. Please try again in a minute.", code: "BREVO_FAIL" },
                { status: 502 }
            );
        }


        const confirmHtml = buildConfirmEmailHtml({ msgId, name });

        const confirmPayload: BrevoEmailPayload = {
            sender: { email: confirmFromEmail, name: confirmFromName },
            to: [{ email, name }],
            subject: "VietBites Contact Form | We received your message",
            textContent:
                `Thanks for reaching out to VietBites. We received your message and will reply soon.\n\n` +
                `Reference ID: ${msgId}\n\n` +
                `Please do not reply to this message.\n\nVietBites Team`,
            htmlContent: confirmHtml,
            // no replyTo on purpose
        };

        const sentConfirm = await sendBrevoEmail(apiKey, confirmPayload);
        if (!sentConfirm.ok) {
            console.warn("Confirmation email failed:", sentConfirm.errText);
        }

        return NextResponse.json({ ok: true, id: msgId });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong. Please try again.", code: "UNKNOWN" }, { status: 500 });
    }
}
