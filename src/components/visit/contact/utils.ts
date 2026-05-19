export function normalizeReason(input: string) {
    return input.trim().toLowerCase();
}

export function prettyReason(reason: string) {
    return reason
        .split(/[-_\s]+/)
        .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
        .join(" ");
}

export function buildSubjectWithCategory(title: string, reason: string) {
    const t = title.trim();
    const r = normalizeReason(reason);
    if (t && r) return `${t} - [Category: ${r}]`;
    if (t) return t;
    if (r) return `Contact Form Submission - [Category: ${r}]`;
    return "Contact Form Submission";
}

export type ReasonOption = {
    value: string;
    label: string;
    desc: string;
};

export type ResultState =
    | { type: "success"; message: string; refId?: string }
    | { type: "error"; message: string }
    | null;

export const reasonOptions: ReasonOption[] = [
    {
        value: "catering",
        label: "Catering & Events",
        desc: "For large orders, office catering, parties, and special events.",
    },
    {
        value: "wholesale",
        label: "B2B Partnership / Wholesale",
        desc: "For businesses interested in collaborations or carrying VietBites products.",
    },
    {
        value: "general inquiry",
        label: "General Inquiry",
        desc: "For questions about our menu, pricing, or store details.",
    },
    {
        value: "feedback & complaints",
        label: "Feedback & Complaints",
        desc: "Share your experience or concerns to help us improve.",
    },
    {
        value: "collaborations",
        label: "Media / Influencer Collaboration",
        desc: "For creators, press, or marketing partnership inquiries.",
    },
    {
        value: "custom orders",
        label: "Custom Orders / Special Requests",
        desc: "For personalized orders or specific requests (subject to availability).",
    },
    {
        value: "technical issues",
        label: "Technical Issues / Suggestions",
        desc: "For any bugs, website suggestions, or technical issues when using our products.",
    },
    {
        value: "other",
        label: "Other",
        desc: "If none of the categories fit, choose this and describe what you need.",
    },
];

export function formHeading(normalizedReason: string) {
    switch (normalizedReason) {
        case "wholesale":
            return {
                title: "Wholesale Application",
                subtitle: "Tell us about your business and what you're looking for.",
            };
        case "catering":
            return {
                title: "Catering Inquiry",
                subtitle: "Share your date, guest count, and any dietary needs.",
            };
        case "collaborations":
            return {
                title: "Collaboration Inquiry",
                subtitle: "Brands, creators, pop-ups, and community events.",
            };
        case "technical issues":
            return {
                title: "Report a Technical Issue",
                subtitle: "Tell us what happened and what you expected.",
            };
        default:
            return {
                title: "Contact VietBites",
                subtitle: "Send us a message and we'll get back to you soon.",
            };
    }
}

export const reasonHelp: Record<string, string> = {
    catering:
        "Share the date/time, guest count, location, dietary needs, and budget range to help us quote fast.",
    wholesale:
        "Let us know about your business, who your customers are, and what products you're interested in.",
    "general inquiry":
        "Feel free to ask about our menu, pricing, store hours, or any other questions you have.",
    "feedback & complaints":
        "Please provide details about your experience, including date, location, and what went right / wrong.",
    collaborations:
        "Tell us your idea, timeline, and what success looks like (pop-up, limited item, event, etc.).",
    "custom orders":
        "Let us know what you need, your timeline, and any special requests. We'll see what we can do!",
    "technical issues":
        "Tell us what page (e.g., menu), what you expected vs. what happened.",
    other: "Provide as much detail about your inquiry as possible.",
};

// Shared constants
export const SUBJECT_MAX = 160;