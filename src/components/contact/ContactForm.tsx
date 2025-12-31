"use client";

import { useEffect, useMemo, useState } from "react";
import FormField from "@/components/contact/ui/FormField";
import TextArea from "@/components/contact/ui/TextArea";
import PhoneInput from "@/components/contact/ui/PhoneInput";
import SelectBox from "@/components/contact/ui/SelectBox";
import CountedInput from "@/components/contact/ui/CountedInput";

type ResultState =
    | { type: "success"; message: string; refId?: string }
    | { type: "error"; message: string }
    | null;

type ReasonOption = {
    value: string; // for redirects/backend
    label: string; // name shown
    desc: string; // frontend-only helper text
};

function normalizeReason(input: string) {
    return input.trim().toLowerCase();
}

function prettyReason(reason: string) {
    return reason.replaceAll("-", " ").replaceAll("_", " ").trim();
}

function buildSubjectWithCategory(title: string, reason: string) {
    const t = title.trim();
    const r = normalizeReason(reason);
    if (t && r) return `${t} - [Category: ${r}]`;
    if (t) return t;
    if (r) return `Contact Form Submission - [Category: ${r}]`;
    return "Contact Form Submission";
}

export default function ContactForm({
    initialReason = "",
}: {
    initialReason?: string;
}) {
    const reasonOptions: ReasonOption[] = useMemo(
        () => [
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
        ],
        []
    );

    // Reason
    const allowedReasons = useMemo(
        () => new Set(reasonOptions.map((o) => o.value)),
        [reasonOptions]
    );

    const [reason, setReason] = useState(() => {
        const r = normalizeReason(initialReason);
        return allowedReasons.has(r) ? r : "";
    });

    useEffect(() => {
        const r = normalizeReason(initialReason);
        if (r && allowedReasons.has(r)) setReason(r);
    }, [initialReason, allowedReasons]);

    // Identity
    const [contactName, setContactName] = useState("");
    const [orgName, setOrgName] = useState(""); // Business / Institution name (optional generally)

    // Wholesale extras
    const [businessWebsite, setBusinessWebsite] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [businessLocation, setBusinessLocation] = useState("");
    const [estimatedVolume, setEstimatedVolume] = useState("");

    // Shared
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ResultState>(null);

    // Validation
    const [overDescriptionLimit, setOverDescriptionLimit] = useState(false);
    const [phoneValid, setPhoneValid] = useState(true);
    const SUBJECT_MAX = 160;
    const [overSubjectLimit, setOverSubjectLimit] = useState(false);

    // Anti-bot
    const [startedAt] = useState(() => Date.now());
    const [company, setCompany] = useState("");

    const normalizedReason = normalizeReason(reason);
    const isWholesale = normalizedReason === "wholesale";

    const formHeading = useMemo(() => {
        switch (normalizedReason) {
            case "wholesale":
                return {
                    title: "Wholesale Application",
                    subtitle:
                        "Tell us about your business and what you’re looking for.",
                };
            case "catering":
                return {
                    title: "Catering Inquiry",
                    subtitle:
                        "Share your date, guest count, and any dietary needs.",
                };
            case "collaborations":
                return {
                    title: "Collaboration Inquiry",
                    subtitle:
                        "Brands, creators, pop-ups, and community events.",
                };
            case "technical issues":
                return {
                    title: "Report a Technical Issue",
                    subtitle: "Tell us what happened and what you expected.",
                };
            default:
                return {
                    title: "Contact VietBites",
                    subtitle:
                        "Send us a message and we’ll get back to you soon.",
                };
        }
    }, [normalizedReason]);

    const reasonHelp: Record<string, string> = {
        catering:
            "Share the date/time, guest count, location, dietary needs, and budget range to help us quote fast.",
        wholesale:
            "Let us know about your business, who your customers are, and what products you’re interested in.",
        "general inquiry":
            "Feel free to ask about our menu, pricing, store hours, or any other questions you have.",
        "feedback & complaints":
            "Please provide details about your experience, including date, location, and what went right / wrong.",
        collaborations:
            "Tell us your idea, timeline, and what success looks like (pop-up, limited item, event, etc.).",
        "custom orders":
            "Let us know what you need, your timeline, and any special requests. We’ll see what we can do!",
        "technical issues":
            "Tell us what page (e.g., menu), what you expected vs. what happened.",
        other: "Provide as much detail about your inquiry as possible.",
    };

    const reasonLabel = useMemo(() => {
        const opt = reasonOptions.find((o) => o.value === normalizedReason);
        return opt?.label ?? (normalizedReason ? normalizedReason : "-");
    }, [reasonOptions, normalizedReason]);

    function buildMeta(): Record<string, string> {
        const meta: Record<string, string> = {
            Reason: reasonLabel,
            "Business / Institution": orgName || "-",
        };

        if (phone.trim()) meta["Phone"] = phone.trim();

        if (isWholesale) {
            meta["Business Type"] = businessType || "-";
            meta["Website / Instagram"] = businessWebsite || "-";
            meta["Location"] = businessLocation || "-";
            meta["Estimated Volume"] = estimatedVolume || "-";
        }

        return meta;
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setResult(null);

        const payload = {
            name: contactName.trim(),
            email: email.trim(),
            subject: buildSubjectWithCategory(title, normalizedReason),
            message: description.trim(),
            meta: buildMeta(),
        };

        setLoading(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...payload,
                    // anti-bot fields are separate, not part of message/meta
                    company,
                    startedAt,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json?.error || "Failed to send message.");
            }

            setResult({
                type: "success",
                message:
                    "Thank you for reaching out! We received your message. We will reply soon.",
                refId: json?.id,
            });

            // Clear form
            setReason("");
            setContactName("");
            setOrgName("");
            setBusinessWebsite("");
            setBusinessType("");
            setBusinessLocation("");
            setEstimatedVolume("");
            setEmail("");
            setPhone("");
            setTitle("");
            setDescription("");
            setCompany("");
        } catch (err: unknown) {
            const msg =
                err instanceof Error && err.message
                    ? err.message
                    : "Something went wrong.";
            setResult({ type: "error", message: msg });
        } finally {
            setLoading(false);
        }
    }

    const requiredDisabled =
        loading ||
        overDescriptionLimit ||
        overSubjectLimit ||
        !phoneValid ||
        !email ||
        !reason ||
        !title ||
        !description ||
        !contactName ||
        (isWholesale && !orgName);

    return (
        <form
            onSubmit={onSubmit}
            className="rounded-lg sm:px-5 md:px-6 space-y-5"
        >
            <hr />

            {/* Heading (match your lighter style) */}
            <div className="space-y-1 px-1 mx-auto text-center">
                <p className="tracking-widest text-xs text-charcoal/60 font-semibold uppercase">
                    {normalizedReason
                        ? prettyReason(normalizedReason)
                        : "contact"}
                </p>

                <h2 className="text-xl md:text-2xl font-heading font-semibold text-charcoal">
                    {formHeading.title}
                </h2>

                <p className="text-sm text-charcoal/70">
                    {formHeading.subtitle}
                </p>
            </div>

            <div className="flex flex-col md:flex-row items-start justify-between">
                <div className="text-sm text-gray-600">
                    Please provide as much detail as you can.
                </div>
                <div className="text-xs text-gray-500">
                    Fields marked with <span className="text-red-600">*</span>{" "}
                    are required.
                </div>
            </div>

            {/* Reason first */}
            <FormField
                id="reason"
                className="select-box"
                label="Reason for contacting us"
                required
            >
                <SelectBox
                    id="reason"
                    value={reason}
                    placeholder="Select a category for your request..."
                    onChange={setReason}
                    aria-label="Reason for contacting us"
                    className="data-placeholder:text-gray-400"
                >
                    {reasonOptions.map((opt) => (
                        <div key={opt.value}>
                            <SelectBox.Item
                                value={opt.value}
                                label={opt.label}
                                desc={opt.desc}
                            />
                            <hr id="reason-divider" className="my-2 hidden md:block" />
                        </div>
                    ))}
                </SelectBox>
            </FormField>

            {/* Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                    id="contactName"
                    label="Contact name"
                    required
                    hint="Who should we follow up with?"
                >
                    <input
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        placeholder="Your name"
                        autoComplete="name"
                    />
                </FormField>

                <FormField
                    id="orgName"
                    label="Business / Institution name"
                    required={isWholesale}
                    hint={
                        isWholesale
                            ? "Required for wholesale"
                            : "Optional for individuals"
                    }
                >
                    <input
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        required={isWholesale}
                        placeholder="Company, café, school, organization"
                        autoComplete="organization"
                    />
                </FormField>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                    id="email"
                    label="Email"
                    required
                    hint="We'll use this to reply to you."
                >
                    <input
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                    />
                </FormField>

                <FormField
                    id="phone"
                    label="Phone"
                    hint="If your request is urgent, please provide your phone number."
                >
                    <PhoneInput
                        id="phone"
                        value={phone}
                        onChange={(value) => {
                            setPhone(value);
                            if (value === "") setPhoneValid(true);
                        }}
                        onValidityChange={(ok) => setPhoneValid(ok)}
                    />
                </FormField>
            </div>

            {/* Wholesale extras */}
            {isWholesale && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                        id="businessType"
                        label="Business type"
                        hint="e.g., café, restaurant, retailer"
                    >
                        <input
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                            type="text"
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            placeholder="Café"
                        />
                    </FormField>

                    <FormField
                        id="businessWebsite"
                        label="Website / Instagram"
                        hint="Optional"
                    >
                        <input
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                            type="text"
                            value={businessWebsite}
                            onChange={(e) => setBusinessWebsite(e.target.value)}
                            placeholder="https://..."
                        />
                    </FormField>

                    <FormField
                        id="businessLocation"
                        label="Location"
                        hint="City / area"
                    >
                        <input
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                            type="text"
                            value={businessLocation}
                            onChange={(e) =>
                                setBusinessLocation(e.target.value)
                            }
                            placeholder="Toronto, ON"
                        />
                    </FormField>

                    <FormField
                        id="estimatedVolume"
                        label="Estimated volume"
                        hint="Rough estimate is fine"
                    >
                        <input
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                            type="text"
                            value={estimatedVolume}
                            onChange={(e) => setEstimatedVolume(e.target.value)}
                            placeholder="e.g., 50 units/week"
                        />
                    </FormField>
                </div>
            )}

            {/* Subject */}
            <FormField
                id="title"
                label="Subject"
                required
                hint="A short summary, e.g., 'Wholesale Pricing Request' or 'Catering for March 10'."
            >
                <CountedInput
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    max={SUBJECT_MAX}
                    onValidityChange={setOverSubjectLimit}
                    placeholder="Subject of your message"
                />
            </FormField>

            {/* Description */}
            <FormField
                id="description"
                label="Description (max 5,000 characters)"
                required
            >
                {reason && (
                    <div className="rounded-md bg-white text-sm text-charcoal/70 p-3 shadow-sm mb-2 border border-charcoal/10">
                        <p className="font-medium mb-1">
                            When filling out the description for{" "}
                            {prettyReason(reason)}, please make sure to:
                        </p>
                        <p className="font-semibold">
                            {reasonHelp[normalizedReason] || reasonHelp.other}
                        </p>
                    </div>
                )}

                <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Tell us more…"
                    onValidityChange={setOverDescriptionLimit}
                    max={5000}
                    id="description"
                />
            </FormField>

            {/* Honeypot */}
            <div className="sr-only" aria-hidden>
                <label htmlFor="company">Company</label>
                <input
                    id="company"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                />
            </div>

            <div className="flex flex-col items-center pt-2">
                {!phoneValid && (
                    <div className="block text-sm text-red-600 mb-2">
                        Please enter a valid phone number or leave the field
                        empty.
                    </div>
                )}
                {overDescriptionLimit && (
                    <div className="text-sm text-red-600 mb-1">
                        You have exceeded the 5000 character limit. Please
                        adjust to submit.
                    </div>
                )}

                <button
                    type="submit"
                    disabled={requiredDisabled}
                    className="inline-flex items-center justify-center rounded-md bg-orange px-5 py-2 text-white font-semibold shadow-sm"
                >
                    {loading ? "Submitting…" : "Submit Request"}
                </button>
            </div>

            {result && (
                <div
                    className={[
                        "flex flex-col items-center text-sm text-center rounded-lg border p-4 gap-2",
                        result.type === "success"
                            ? "border-green-300 bg-green-50 text-green-900 shadow-sm"
                            : "border-red-200 bg-red-50 text-red-700",
                    ].join(" ")}
                    role={result.type === "error" ? "alert" : "status"}
                    aria-live={result.type === "error" ? "assertive" : "polite"}
                >
                    <p className="font-semibold">
                        {result.type === "success"
                            ? "Message received"
                            : "Could not send"}
                    </p>

                    <p className="mt-1 text-charcoal/80">{result.message}</p>

                    {result.type === "success" && result.refId && (
                        <p className="mt-2 text-xs text-charcoal/60 font-medium">
                            Reference ID:{" "}
                            <span className="font-mono">{result.refId}</span>
                        </p>
                    )}

                    {result.type === "success" && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-charcoal/60">
                            <img
                                src="/images/logos/LogoCircle.png"
                                alt="VietBites"
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                            <span className="font-semibold">
                                VietBites Team
                            </span>
                        </div>
                    )}
                </div>
            )}
        </form>
    );
}
