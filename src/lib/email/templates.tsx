function escapeHtml(input: unknown) {
    const s = String(input ?? "");
    return s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

const LINK_STYLE = "color:#c2410c;text-decoration:underline;";

function isProbablyUrl(v: string) {
    const s = v.trim();
    if (/^mailto:/i.test(s)) return true;
    if (/^https?:\/\//i.test(s)) return true;
    // domain.tld but NOT email
    return /^[^\s@]+\.[a-z]{2,}(\/|$)/i.test(s);
}

function normalizeUrl(v: string) {
    const s = v.trim();
    if (/^mailto:/i.test(s)) return s;
    if (/^https?:\/\//i.test(s)) return s;
    if (isProbablyUrl(s)) return `https://${s}`;
    return s;
}

function renderMetaValue(v: string) {
    const value = v.trim();
    if (!value) return "-";

    if (isProbablyUrl(value)) {
        const href = normalizeUrl(value);
        return `<a href="${escapeHtml(
            href
        )}" style="${LINK_STYLE}">${escapeHtml(value)}</a>`;
    }

    return escapeHtml(value);
}

function sortMeta(meta: Record<string, string>) {
    const order = [
        "Reason",
        "Business / Institution",
        "Phone",
        "Business Type",
        "Website / Instagram",
        "Location",
        "Estimated Volume",
    ];
    return Object.entries(meta).sort(([a], [b]) => {
        const ia = order.indexOf(a);
        const ib = order.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
    });
}

export function buildAdminEmailText(args: {
    msgId: string;
    name: string;
    email: string;
    subject: string;
    categoryTitle?: string;
    message: string;
    meta?: Record<string, string>;
}) {
    const { msgId, name, email, subject, categoryTitle, message, meta } = args;

    const metaLines =
        meta && Object.keys(meta).length
            ? [
                  "",
                  "Details:",
                  ...sortMeta(meta).map(
                      ([k, v]) =>
                          `- ${k}: ${String(v ?? "")
                              .replace(/\s+/g, " ")
                              .trim()}`
                  ),
              ]
            : [];

    return [
        `VietBites Contact Form Submission - ${msgId}`,
        `ID: ${msgId}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        categoryTitle ? `Category: ${categoryTitle}` : "",
        ...metaLines,
        "",
        "Message:",
        message,
    ]
        .filter(Boolean)
        .join("\n");
}

export function buildAdminEmailHtml(args: {
    msgId: string;
    name: string;
    email: string;
    subject: string;
    categoryTitle?: string;
    message: string;
    meta?: Record<string, string>;
}) {
    const { msgId, name, email, subject, categoryTitle, message, meta } = args;
    const emailHref = email.trim();

    const metaRows =
        meta && Object.keys(meta).length
            ? sortMeta(meta)
                  .map(
                      ([k, v]) => `
                        <tr>
                            <td style="padding:4px 10px 4px 0;color:#6b7280;white-space:nowrap;">
                                ${escapeHtml(k)}
                            </td>
                            <td style="padding:4px 0;word-break:break-word;overflow-wrap:anywhere;">
                                ${renderMetaValue(v)}
                            </td>
                        </tr>
                    `
                  )
                  .join("")
            : "";

    return `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111827;line-height:1.5;">

        <h2 style="margin:0 0 12px 0;">New VietBites Contact Form Submission</h2>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            <tr>
                <td style="padding:4px 10px 4px 0;color:#6b7280;">ID</td>
                <td style="padding:4px 0;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Courier New',monospace;">
                    ${escapeHtml(msgId)}
                </td>
            </tr>
            <tr>
                <td style="padding:4px 10px 4px 0;color:#6b7280;">Name</td>
                <td style="padding:4px 0;">${escapeHtml(name)}</td>
            </tr>
            <tr>
                <td style="padding:4px 10px 4px 0;color:#6b7280;">Email</td>
                <td style="padding:4px 0;">
                    <a href="mailto:${emailHref}" style="${LINK_STYLE}">${escapeHtml(
        email
    )}</a>
                </td>
            </tr>
            <tr>
                <td style="padding:4px 10px 4px 0;color:#6b7280;">Subject</td>
                <td style="padding:4px 0;">${escapeHtml(subject)}</td>
            </tr>
            ${
                categoryTitle
                    ? `<tr>
                    <td style="padding:4px 10px 4px 0;color:#6b7280;">Category</td>
                    <td style="padding:4px 0;">${escapeHtml(categoryTitle)}</td>
                </tr>`
                    : ""
            }
        </table>

        ${
            metaRows
                ? `
                <div style="margin-top:14px;">
                <div style="font-size:12px;color:#6b7280;margin-bottom:6px;text-decoration:underline;">
                    Details:
                </div>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-left:10px;">
                    ${metaRows}
                </table>
                </div>
            `
                : ""
        }

        <div style="margin-top:14px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">
            <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">Message</div>
            <div style="white-space:pre-wrap;">${escapeHtml(message)}</div>
        </div>
        </div>
    `;
}

export function buildConfirmEmailHtml(args: { msgId: string; name: string }) {
    const { msgId, name } = args;
    const safeName = name.trim() ? name.trim() : "there";

    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="x-apple-disable-message-reformatting" />
                <title>We received your message</title>
            </head>
            <body style="margin:0;padding:0;background-color:#f8f5ef;">
                <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
                    VietBites received your message. Reference ID: ${escapeHtml(
                        msgId
                    )}
                </div>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8f5ef;">
                    <tr>
                        <td align="center" style="padding:24px 12px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #eee6d8;border-radius:16px;overflow:hidden;">
                                <tr>
                                    <td style="padding:20px 20px 10px 20px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                        <tr>
                                        <td align="left" style="vertical-align:middle;">
                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="vertical-align:middle;padding-right:10px;">
                                                <img
                                                    src="https://vietbites.ca/images/logos/LogoCircle.png"
                                                    width="36"
                                                    height="36"
                                                    alt="VietBites"
                                                    style="display:block;border-radius:999px;outline:none;text-decoration:none;border:none;"
                                                />
                                                </td>
                                                <td style="vertical-align:middle;">
                                                <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;font-weight:700;color:#111827;line-height:1.2;">
                                                    VietBites
                                                </div>
                                                <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.2;padding-top:2px;">
                                                    Message confirmation
                                                </div>
                                                </td>
                                            </tr>
                                            </table>
                                        </td>
                                        <td align="right" style="vertical-align:middle;">
                                            <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                            Ref: <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;color:#111827;">${escapeHtml(
                                                msgId
                                            )}</span>
                                            </div>
                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:0 20px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                        <td style="height:1px;background-color:#f1f5f9;line-height:1px;font-size:1px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:18px 20px 10px 20px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                        <td style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;color:#111827;line-height:1.6;">
                                            <div style="margin:0 0 12px 0;">
                                                Hello <strong>${escapeHtml(
                                                    safeName
                                                )}</strong>,
                                            </div>
                                            <div style="margin:0 0 12px 0;">
                                                Thanks for reaching out to <strong>VietBites</strong>. We received your message and will reply soon.
                                            </div>

                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:12px 0 0 0;">
                                            <tr>
                                                <td style="background-color:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:12px 14px;">
                                                <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#9a3412;line-height:1.4;">
                                                    Reference ID
                                                </div>
                                                <div style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;font-size:14px;color:#111827;line-height:1.4;padding-top:4px;">
                                                    ${escapeHtml(msgId)}
                                                </div>
                                                </td>
                                            </tr>
                                            </table>

                                            <div style="margin:14px 0 0 0;font-size:12px;color:#6b7280;">
                                                If you need to follow up, contact us through the website again and include the reference ID above.
                                            </div>
                                            <div style="margin:14px 0 0 0;font-size:12px;color:#6b7280;">
                                                This is an automated confirmation. Please <strong>do not reply to this email</strong>.
                                            </div>
                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:0 20px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="height:1px;background-color:#f1f5f9;line-height:1px;font-size:1px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:14px 20px 18px 20px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="left" style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.6;">
                                                    VietBites Team<br/>
                                                    Toronto, Ontario
                                                </td>
                                                <td align="right" style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.6;">
                                                    <a href="https://vietbites.ca" style="color:#c2410c;text-decoration:underline;">vietbites.ca</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;">
                                <tr>
                                    <td style="padding:12px 0 0 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:11px;color:#9ca3af;line-height:1.4;text-align:center;">
                                        You received this email because you submitted a message on VietBites.ca.
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
}
