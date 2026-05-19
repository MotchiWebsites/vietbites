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
    recaptchaToken?: string;
    recaptchaVersion?: "v3" | "v2";
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

// Rate limit adapter (memory default with production swappable implementation)
import {
    consumeIp,
    consumeEmail,
    consumeBurst,
    isDuplicate,
    setDuplicate,
    hasQuotaError,
} from "@/lib/rate-limit";

function getClientIp(req: Request) {
    const xff = req.headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();
    return "unknown";
}

// rateLimit and rateLimitEmail removed; use adapter functions from src/lib/rate-limit.ts

function isLikelySpamContent(message: string) {
    // simple heuristics: too many urls or excessive short repetitive content
    const urlMatches = message.match(/https?:\/\/[\S]+/gi) || [];
    if (urlMatches.length > 3) return true;

    // a short message with many non-alphanumeric chars
    const nonAlpha = (message.match(/[^\w\s\.,!?:;\-()]/g) || []).length;
    if (message.length < 50 && nonAlpha > 10) return true;

    return false;
}

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);

        const rl = await consumeIp(ip);
        if (!rl.ok) {
            const retryInSec = Math.max(
                1,
                Math.ceil((rl.resetAt - Date.now()) / 1000),
            );
            const retryInMin = Math.ceil(retryInSec / 60);
            return NextResponse.json(
                {
                    ok: false,
                    error: `Too many messages sent from this network. Please try again in about ${retryInMin} minutes.`,
                    code: "RATE_LIMIT_IP",
                    retryInSec,
                },
                { status: 429, headers: { "Retry-After": String(retryInSec) } },
            );
        }

        // Burst protection (short window)
        try {
            const burst = await consumeBurst(ip, 30 * 1000, 2);
            if (!burst.ok) {
                const retryInSec = Math.max(
                    1,
                    Math.ceil((burst.resetAt - Date.now()) / 1000),
                );
                return NextResponse.json(
                    {
                        ok: false,
                        error: "Too many requests. Please wait a moment.",
                        code: "RATE_LIMIT_BURST",
                        retryInSec,
                    },
                    {
                        status: 429,
                        headers: { "Retry-After": String(retryInSec) },
                    },
                );
            }
        } catch (err) {
            console.warn("burst check failed, allowing request", err);
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
                        ok: false,
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

        // Server-side reCAPTCHA verification.
        const recaptchaSecretV3 = process.env.RECAPTCHA_SECRET_KEY;
        const recaptchaSecretV2 = process.env.RECAPTCHA_V2_SECRET_KEY;
        const token = String(body.recaptchaToken ?? "");
        const declaredVersion = body.recaptchaVersion;

        if (recaptchaSecretV3 || recaptchaSecretV2) {
            if (!token) {
                return NextResponse.json(
                    {
                        ok: false,
                        error: "Missing captcha token.",
                        code: "RECAPTCHA_MISSING",
                    },
                    { status: 400 },
                );
            }

            // helper to verify with a secret
            async function verifyToken(secret: string, tokenToVerify: string) {
                const form = new URLSearchParams();
                form.set("secret", secret);
                form.set("response", tokenToVerify);
                form.set("remoteip", ip);

                const r = await fetch(
                    "https://www.google.com/recaptcha/api/siteverify",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: form.toString(),
                    },
                );

                return r.json();
            }

            try {
                // If client declared a version, enforce that verification strictly
                if (declaredVersion === "v3") {
                    if (!recaptchaSecretV3) {
                        return NextResponse.json(
                            {
                                ok: false,
                                error: "reCAPTCHA v3 not configured on server.",
                                code: "RECAPTCHA_VERSION_MISMATCH",
                            },
                            { status: 400 },
                        );
                    }
                    const jr = await verifyToken(recaptchaSecretV3, token);
                    const success = Boolean(jr.success);
                    const score =
                        typeof jr.score === "number" ? jr.score : undefined;
                    const action =
                        typeof jr.action === "string" ? jr.action : undefined;
                    const errs: string[] = Array.isArray(jr["error-codes"])
                        ? jr["error-codes"]
                        : [];
                    const isQuota = hasQuotaError(errs);

                    if (!success) {
                        if (isQuota) {
                            console.warn(
                                "reCAPTCHA v3 quota exceeded — failing open",
                                jr,
                            );
                            // fail-open for v3 (low-risk contact form)
                        } else {
                            console.warn("reCAPTCHA v3 failed", jr);
                            return NextResponse.json(
                                {
                                    ok: false,
                                    error: "Captcha verification failed.",
                                    code: "RECAPTCHA_FAIL",
                                },
                                { status: 400 },
                            );
                        }
                    }
                    if (typeof score === "number" && score < 0.4) {
                        console.warn("reCAPTCHA v3 low score", score, jr);
                        return NextResponse.json(
                            {
                                ok: false,
                                error: "Captcha verification flagged this request as suspicious.",
                                code: "RECAPTCHA_LOW_SCORE",
                            },
                            { status: 400 },
                        );
                    }
                    if (action && action !== "contact_form") {
                        console.warn(
                            "reCAPTCHA v3 action mismatch",
                            action,
                            jr,
                        );
                        return NextResponse.json(
                            {
                                ok: false,
                                error: "Captcha verification mismatch.",
                                code: "RECAPTCHA_ACTION",
                            },
                            { status: 400 },
                        );
                    }
                } else if (declaredVersion === "v2") {
                    if (!recaptchaSecretV2) {
                        return NextResponse.json(
                            {
                                ok: false,
                                error: "reCAPTCHA v2 not configured on server.",
                                code: "RECAPTCHA_VERSION_MISMATCH",
                            },
                            { status: 400 },
                        );
                    }
                    const jr2 = await verifyToken(recaptchaSecretV2, token);
                    const success2 = Boolean(jr2.success);
                    const errs2: string[] = Array.isArray(jr2["error-codes"])
                        ? jr2["error-codes"]
                        : [];
                    const isQuota2 = hasQuotaError(errs2);
                    if (!success2) {
                        if (isQuota2) {
                            console.warn("reCAPTCHA v2 quota exceeded", jr2);
                            return NextResponse.json(
                                {
                                    ok: false,
                                    error: "Captcha quota exceeded. Please try again later.",
                                    code: "RECAPTCHA_QUOTA_EXCEEDED",
                                },
                                { status: 503 },
                            );
                        }
                        console.warn("reCAPTCHA v2 failed", jr2);
                        return NextResponse.json(
                            {
                                ok: false,
                                error: "Captcha verification failed.",
                                code: "RECAPTCHA_FAIL",
                            },
                            { status: 400 },
                        );
                    }
                } else {
                    // No declared version from client: keep previous behavior (try v3 then v2)
                    let verified = false;
                    if (recaptchaSecretV3) {
                        const jr = await verifyToken(recaptchaSecretV3, token);
                        const success = Boolean(jr.success);
                        const score =
                            typeof jr.score === "number" ? jr.score : undefined;
                        const action =
                            typeof jr.action === "string"
                                ? jr.action
                                : undefined;
                        const errs: string[] = Array.isArray(jr["error-codes"])
                            ? jr["error-codes"]
                            : [];
                        const isQuota = hasQuotaError(errs);

                        if (
                            success &&
                            (typeof score !== "number" || score >= 0.4) &&
                            (!action || action === "contact_form")
                        ) {
                            verified = true;
                        } else {
                            if (!recaptchaSecretV2) {
                                if (!success) {
                                    if (isQuota) {
                                        console.warn(
                                            "reCAPTCHA v3 quota exceeded — failing open",
                                            jr,
                                        );
                                        // fail-open for v3
                                    } else {
                                        console.warn("reCAPTCHA v3 failed", jr);
                                        return NextResponse.json(
                                            {
                                                ok: false,
                                                error: "Captcha verification failed.",
                                                code: "RECAPTCHA_FAIL",
                                            },
                                            { status: 400 },
                                        );
                                    }
                                }
                                if (typeof score === "number" && score < 0.4) {
                                    console.warn(
                                        "reCAPTCHA v3 low score",
                                        score,
                                        jr,
                                    );
                                    return NextResponse.json(
                                        {
                                            ok: false,
                                            error: "Captcha verification flagged this request as suspicious.",
                                            code: "RECAPTCHA_LOW_SCORE",
                                        },
                                        { status: 400 },
                                    );
                                }
                                if (action && action !== "contact_form") {
                                    console.warn(
                                        "reCAPTCHA v3 action mismatch",
                                        action,
                                        jr,
                                    );
                                    return NextResponse.json(
                                        {
                                            ok: false,
                                            error: "Captcha verification mismatch.",
                                            code: "RECAPTCHA_ACTION",
                                        },
                                        { status: 400 },
                                    );
                                }
                            }
                        }
                    }
                    if (!verified && recaptchaSecretV2) {
                        const jr2 = await verifyToken(recaptchaSecretV2, token);
                        const success2 = Boolean(jr2.success);
                        const errs2: string[] = Array.isArray(
                            jr2["error-codes"],
                        )
                            ? jr2["error-codes"]
                            : [];
                        const isQuota2 = hasQuotaError(errs2);
                        if (success2) verified = true;
                        else {
                            if (isQuota2) {
                                console.warn(
                                    "reCAPTCHA v2 quota exceeded",
                                    jr2,
                                );
                                return NextResponse.json(
                                    {
                                        ok: false,
                                        error: "Captcha quota exceeded. Please try again later.",
                                        code: "RECAPTCHA_QUOTA_EXCEEDED",
                                    },
                                    { status: 503 },
                                );
                            }
                            console.warn("reCAPTCHA v2 failed", jr2);
                            return NextResponse.json(
                                {
                                    ok: false,
                                    error: "Captcha verification failed.",
                                    code: "RECAPTCHA_FAIL",
                                },
                                { status: 400 },
                            );
                        }
                    }
                }
            } catch (err) {
                console.error("reCAPTCHA verification error", err);
                return NextResponse.json(
                    {
                        ok: false,
                        error: "Captcha verification error.",
                        code: "RECAPTCHA_ERROR",
                    },
                    { status: 500 },
                );
            }
        }

        if (!name || !email || !subjectCapped || !message) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Please fill in all required fields.",
                    code: "VALIDATION",
                },
                { status: 400 },
            );
        }
        if (!isEmail(email)) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Please enter a valid email address.",
                    code: "VALIDATION",
                },
                { status: 400 },
            );
        }
        if (message.length > 5000) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Your message is too long. Please keep it under 5,000 characters.",
                    code: "VALIDATION",
                },
                { status: 400 },
            );
        }

        // Content heuristics
        if (isLikelySpamContent(message)) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Your message looks like spam.",
                    code: "SPAM_SUSPECT",
                },
                { status: 400 },
            );
        }

        // Per-email rate limit
        const erl = await consumeEmail(email.toLowerCase());
        if (!erl.ok) {
            const retryInSec = Math.max(
                1,
                Math.ceil((erl.resetAt - Date.now()) / 1000),
            );
            return NextResponse.json(
                {
                    ok: false,
                    error: `Too many messages from this email address. Try again in ${Math.ceil(retryInSec / 60)} minutes.`,
                    code: "RATE_LIMIT_EMAIL",
                    retryInSec,
                },
                { status: 429, headers: { "Retry-After": String(retryInSec) } },
            );
        }

        // Duplicate message detection. Uses durable store in production via adapter.
        const dedupeWindow = 10 * 60 * 1000; // 10 minutes
        let dedupeHash: string | null = null;

        try {
            dedupeHash = crypto
                .createHash("sha256")
                .update(
                    email.toLowerCase() +
                        "|" +
                        subjectCapped +
                        "|" +
                        message.slice(0, 1000),
                )
                .digest("hex");

            const dup = await isDuplicate(dedupeHash);

            if (dup) {
                return NextResponse.json(
                    {
                        ok: false,
                        error: "Duplicate message detected.",
                        code: "DUPLICATE",
                    },
                    { status: 409 },
                );
            }
        } catch (err) {
            console.warn("dedupe check failed", err);
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
                    ok: false,
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

        let sentAdmin;
        try {
            sentAdmin = await sendBrevoEmail(apiKey, adminPayload);
        } catch (err) {
            console.error("Brevo send error", err);
            return NextResponse.json(
                {
                    ok: false,
                    error: "We could not send your message right now.",
                    code: "BREVO_FAIL",
                },
                { status: 502 },
            );
        }
        if (!sentAdmin.ok) {
            if (sentAdmin.status === 429) {
                const retryInSec = 60; // best-effort; Brevo may include Retry-After in real responses
                return NextResponse.json(
                    {
                        ok: false,
                        error: "We're receiving a high volume of messages right now. Please try again shortly.",
                        code: "EMAIL_RATE_LIMIT",
                        retryInSec,
                    },
                    {
                        status: 429,
                        headers: { "Retry-After": String(retryInSec) },
                    },
                );
            }
            return NextResponse.json(
                {
                    ok: false,
                    error: "We could not send your message right now. Please try again in a minute.",
                    code: "BREVO_FAIL",
                },
                { status: 502 },
            );
        }

        // Mark this message as seen for deduplication
        if (dedupeHash) {
            try {
                await setDuplicate(dedupeHash, dedupeWindow);
            } catch (err) {
                console.warn("dedupe set failed", err);
            }
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
                ok: false,
                error: "Something went wrong. Please try again.",
                code: "UNKNOWN",
            },
            { status: 500 },
        );
    }
}
