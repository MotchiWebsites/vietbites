export type BrevoEmailPayload = {
    sender: { email: string; name?: string };
    to: Array<{ email: string; name?: string }>;
    cc?: Array<{ email: string; name?: string }>;
    replyTo?: { email: string; name?: string };
    subject: string;
    htmlContent?: string;
    textContent?: string;
};

export async function sendBrevoEmail(apiKey: string, payload: BrevoEmailPayload) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": apiKey,
            "content-type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errText = await res.text();
        return {
            ok: false as const,
            status: res.status,
            errText,
        };
    }

    return { ok: true as const };
}