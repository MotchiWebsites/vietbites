import { NextResponse } from "next/server";
import crypto from "crypto";
import type { BrevoEmailPayload } from "@/lib/email/brevo";
import { sendBrevoEmail } from "@/lib/email/brevo";
import {
    buildAdminEmailText,
    buildAdminEmailHtml,
    buildConfirmEmailHtml,
} from "@/lib/email/templates";

export const runtime = "nodejs";

type ContactPayload = {
    name: string;
    email: string;
    subject: string;
    message: string;
    meta?: Record<string, string>;
    company?: string;
    startedAt?: number;
};

function isEmail(s: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeMessage(s: string) {
    return s.replace(/\r\n/g, "\n").replace(/^\s+/, "").trimEnd();
}

function sanitizeMeta(meta: unknown): Record<string, string> | undefined {
    if (!isPlainObject(meta)) return undefined;

    const out: Record<string, string> = {};
    const entries = Object.entries(meta).slice(0, 25); // guardrail

    for (const [kRaw, vRaw] of entries) {
        const k = String(kRaw).trim();
        if (!k) continue;

        const v = typeof vRaw === "string" ? vRaw : String(vRaw ?? "");
        const value = v.trim();
        if (!value) continue;

        // keep rows readable in email
        const key = k.slice(0, 60);
        let val = value.slice(0, 300);

        if (key.toLowerCase() === "reason") {
            val = toTitleCase(val);
        }

        out[key] = val;
    }

    return Object.keys(out).length ? out : undefined;
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

// Subject max length
const SUBJECT_MAX = 160;

// --- in-memory rate limiter (OK for single instance; if you scale horizontally, move to KV/Redis) ---
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
        return {
            ok: true,
            remaining: MAX_REQUESTS - 1,
            resetAt: now + WINDOW_MS,
        };
    }

    if (entry.count >= MAX_REQUESTS) {
        return { ok: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count += 1;
    return {
        ok: true,
        remaining: MAX_REQUESTS - entry.count,
        resetAt: entry.resetAt,
    };
}

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);

        const rl = rateLimit(ip);
        if (!rl.ok) {
            const retryInSec = Math.max(
                1,
                Math.ceil((rl.resetAt - Date.now()) / 1000),
            );
            const retryInMin = Math.ceil(retryInSec / 60);

            return NextResponse.json(
                {
                    error: `Too many messages sent from this network. Please try again in about ${retryInMin} minutes.`,
                    code: "RATE_LIMIT",
                    retryInSec,
                },
                { status: 429, headers: { "Retry-After": String(retryInSec) } },
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
                    {
                        error: "Please take a moment to review your message and try again.",
                        code: "TOO_FAST",
                    },
                    { status: 400 },
                );
            }
        }

        const name = String(body.name ?? "")
            .trim()
            .slice(0, 120);
        const email = String(body.email ?? "")
            .trim()
            .slice(0, 254);
        const message = normalizeMessage(body.message || "");
        const meta = sanitizeMeta(body.meta);

        const subjectRaw = String(body.subject ?? "")
            .replace(/\s+/g, " ")
            .trim();
        const subjectCapped = subjectRaw.slice(0, SUBJECT_MAX);

        if (!name || !email || !subjectCapped || !message) {
            return NextResponse.json(
                {
                    error: "Please fill in all required fields.",
                    code: "VALIDATION",
                },
                { status: 400 },
            );
        }
        if (!isEmail(email)) {
            return NextResponse.json(
                {
                    error: "Please enter a valid email address.",
                    code: "VALIDATION",
                },
                { status: 400 },
            );
        }
        if (message.length > 5000) {
            return NextResponse.json(
                {
                    error: "Your message is too long. Please keep it under 5,000 characters.",
                    code: "VALIDATION",
                },
                { status: 400 },
            );
        }

        const apiKey = process.env.BREVO_API_KEY;
        const fromEmail = process.env.BREVO_ADMIN_FROM_EMAIL;
        const fromName = process.env.BREVO_ADMIN_FROM_NAME || "VietBites";
        const confirmFromEmail = process.env.BREVO_CONFIRM_FROM_EMAIL;
        const confirmFromName =
            process.env.BREVO_CONFIRM_FROM_NAME ||
            "No Reply | VietBites Toronto";
        const toEmail = process.env.BREVO_TO_EMAIL;
        const techCcEmail =
            process.env.BREVO_TECH_CC_EMAIL || "admin@motchi.ca";
        const techCcName = "VietBites Tech Support";

        if (!apiKey || !fromEmail || !toEmail || !confirmFromEmail) {
            return NextResponse.json(
                {
                    error: "Server email is not configured yet. Please try again later.",
                    code: "SERVER_CONFIG",
                },
                { status: 500 },
            );
        }

        const msgId = crypto.randomBytes(6).toString("hex");

        const categoryRaw = extractCategory(subjectCapped);
        const categoryTitle = categoryRaw ? toTitleCase(categoryRaw) : "";
        const subjectNormalized = categoryTitle
            ? subjectCapped.replace(
                  /\[Category:\s*([^\]]+)\]/i,
                  `[Category: ${categoryTitle}]`,
              )
            : subjectCapped;

        const adminHtml = buildAdminEmailHtml({
            msgId,
            name,
            email,
            subject: subjectNormalized,
            categoryTitle: categoryTitle || undefined,
            message,
            meta,
        });

        const adminText = buildAdminEmailText({
            msgId,
            name,
            email,
            subject: subjectNormalized,
            categoryTitle: categoryTitle || undefined,
            message,
            meta,
        });

        const isTech = categoryRaw.toLowerCase() === "technical issues";

        const adminPayload: BrevoEmailPayload = {
            sender: { email: fromEmail, name: fromName },
            to: [{ email: toEmail, name: "VietBites" }],
            ...(isTech
                ? { cc: [{ email: techCcEmail, name: techCcName }] }
                : {}),
            replyTo: { email, name },
            subject: subjectNormalized,
            htmlContent: adminHtml,
            textContent: adminText,
        };

        const sentAdmin = await sendBrevoEmail(apiKey, adminPayload);
        if (!sentAdmin.ok) {
            // Make sure your sendBrevoEmail returns status; if not, update it (snippet below)
            if (sentAdmin.status === 429) {
                return NextResponse.json(
                    {
                        error: "We're receiving a high volume of messages right now. Please try again shortly.",
                        code: "EMAIL_RATE_LIMIT",
                    },
                    { status: 429 },
                );
            }

            return NextResponse.json(
                {
                    error: "We could not send your message right now. Please try again in a minute.",
                    code: "BREVO_FAIL",
                },
                { status: 502 },
            );
        }

        // Confirmation always uses the submitted name — for wholesale that is Contact name.
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
        };

        const sentConfirm = await sendBrevoEmail(apiKey, confirmPayload);
        if (!sentConfirm.ok) {
            // Don't block the form if the confirmation email fails
            console.warn("Confirmation email failed:", sentConfirm.errText);
        }

        return NextResponse.json({ ok: true, id: msgId });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {
                error: "Something went wrong. Please try again.",
                code: "UNKNOWN",
            },
            { status: 500 },
        );
    }
}
