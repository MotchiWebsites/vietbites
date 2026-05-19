"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";

import FormField from "@/components/visit/contact/ui/FormField";
import TextArea from "@/components/visit/contact/ui/TextArea";
import PhoneInput from "@/components/visit/contact/ui/PhoneInput";
import SelectBox from "@/components/visit/contact/ui/SelectBox";
import CountedInput from "@/components/visit/contact/ui/CountedInput";
import ContactFormHeader from "./ContactFormHeader";
import ContactFormFooter from "./ContactFormFooter";
import {
    normalizeReason,
    prettyReason,
    buildSubjectWithCategory,
    reasonOptions,
    ResultState,
    formHeading,
    reasonHelp,
    SUBJECT_MAX,
} from "../utils";

type RecaptchaVersion = "v3" | "v2";

type ContactPayload = {
    name: string;
    email: string;
    subject: string;
    message: string;
    meta?: Record<string, string>;
};

type ApiErrorResponse = {
    ok: false;
    code: string;
    error: string;
    retryInSec?: number;
};

type ApiSuccessResponse = { ok: true; id?: string };

// Minimal typing for grecaptcha used here
type Grecaptcha = {
    ready: (cb: () => void) => void;
    execute: (siteKey: string, opts?: { action?: string }) => Promise<string>;
    render: (el: Element | null, opts: any) => number;
    reset: (widgetId?: number) => void;
};

declare global {
    interface Window {
        grecaptcha?: Grecaptcha;
    }
}

export default function ContactForm({
    initialReason = "",
}: {
    initialReason?: string;
}) {
    const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
    const RECAPTCHA_V2_SITE_KEY =
        process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || RECAPTCHA_SITE_KEY;
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Reason
    const allowedReasons = useMemo(
        () => new Set(reasonOptions.map((o) => o.value)),
        [],
    );

    const [reason, setReason] = useState(() => {
        const r = normalizeReason(initialReason);
        return allowedReasons.has(r) ? r : "";
    });

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
    const [overSubjectLimit, setOverSubjectLimit] = useState(false);

    // Anti-bot
    const [startedAt] = useState(() => Date.now());
    const [company, setCompany] = useState("");

    // Submitted state
    const [submitted, setSubmitted] = useState(false);

    const normalizedReason = normalizeReason(reason);
    const isWholesale = normalizedReason === "wholesale";

    const scrollToWithOffset = (el: Element | null, offset = 100) => {
        if (!el || typeof window === "undefined") return;
        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        const top =
            (el as HTMLElement).getBoundingClientRect().top +
            window.pageYOffset -
            offset;
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    };

    useEffect(() => {
        const getParam = (key: string) => searchParams.get(key)?.trim() || "";

        const rawReason =
            getParam("reason") || getParam("r") || getParam("ref");

        const parsedReason = normalizeReason(rawReason || initialReason);

        if (parsedReason && allowedReasons.has(parsedReason)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setReason(parsedReason);
        }

        const nameParam = getParam("name");
        const orgParam = getParam("org") || getParam("business");
        const emailParam = getParam("email");
        const phoneParam = getParam("phone");
        const titleParam = getParam("title") || getParam("subject");
        const messageParam = getParam("message") || getParam("description");

        if (nameParam) setContactName(nameParam);
        if (orgParam) setOrgName(orgParam);
        if (emailParam) setEmail(emailParam);
        if (phoneParam) setPhone(phoneParam);
        if (titleParam) setTitle(titleParam);
        if (messageParam) setDescription(messageParam);
        const hasQueryParams = Boolean(searchParams.toString());

        if (hasQueryParams) {
            const el = document.getElementById("contact");
            if (el) {
                requestAnimationFrame(() => scrollToWithOffset(el, 100));
            }
            // clean URL after applying params
            router.replace(pathname, { scroll: false });
        }
    }, [searchParams, initialReason, allowedReasons, router, pathname]);

    // Load reCAPTCHA v3 script if site key is provided
    useEffect(() => {
        if (!RECAPTCHA_SITE_KEY) return;
        if (typeof window === "undefined") return;
        const w = window as Window & { grecaptcha?: Grecaptcha };
        if (w.grecaptcha) return; // already loaded

        const s = document.createElement("script");
        s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);

        return () => {
            // don't remove script on unmount; let it persist for other pages
        };
    }, [RECAPTCHA_SITE_KEY]);

    // v2 fallback state and refs
    const [showV2, setShowV2] = useState(false);
    const v2ContainerRef = useRef<HTMLDivElement | null>(null);
    const pendingPayloadRef = useRef<ContactPayload | null>(null);
    const v2WidgetIdRef = useRef<number | null>(null);

    // Load and render v2 widget when requested
    useEffect(() => {
        if (!showV2) return;
        if (typeof window === "undefined") return;
        const w = window as Window & { grecaptcha?: Grecaptcha };

        // Load v2 script if needed
        if (!w.grecaptcha || typeof w.grecaptcha.render !== "function") {
            const s = document.createElement("script");
            s.src = "https://www.google.com/recaptcha/api.js"; // v2 global
            s.async = true;
            s.defer = true;
            document.head.appendChild(s);
            s.onload = () => {
                tryRenderV2();
            };
        } else {
            tryRenderV2();
        }

        function tryRenderV2() {
            try {
                if (!v2ContainerRef.current) return;
                // Render only once
                if ((v2ContainerRef.current as any)._rendered) return;

                const site = RECAPTCHA_V2_SITE_KEY;
                if (!site) return;

                const grecaptcha = window.grecaptcha;

                if (!grecaptcha || typeof grecaptcha.render !== "function") {
                    return;
                }

                v2WidgetIdRef.current = grecaptcha.render(
                    v2ContainerRef.current,
                    {
                        sitekey: site,
                        callback: (token: string) => {
                            // when user completes v2, submit pending payload
                            if (pendingPayloadRef.current) {
                                submitPayload(
                                    pendingPayloadRef.current,
                                    token,
                                    "v2",
                                );
                                pendingPayloadRef.current = null;
                            }
                        },
                    },
                );

                (v2ContainerRef.current as any)._rendered = true;
            } catch (err) {
                console.warn("Failed to render reCAPTCHA v2", err);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showV2, RECAPTCHA_V2_SITE_KEY]);

    const reasonLabel = useMemo(() => {
        const opt = reasonOptions.find((o) => o.value === normalizedReason);
        return opt?.label ?? (normalizedReason ? normalizedReason : "-");
    }, [normalizedReason]);

    const heading = useMemo(
        () => formHeading(normalizedReason),
        [normalizedReason],
    );

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

    async function submitPayload(
        payload: ContactPayload,
        recaptchaToken: string,
        recaptchaVersion?: RecaptchaVersion,
    ) {
        setLoading(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...payload,
                    company,
                    startedAt,
                    recaptchaToken,
                    recaptchaVersion,
                }),
            });
            const json = (await res.json()) as
                | ApiSuccessResponse
                | ApiErrorResponse;

            if (!res.ok) {
                if (json.ok !== false) {
                    throw new Error("Failed to send message.");
                }

                // If server flagged low v3 score or recaptcha failure, show v2
                const shouldShowV2Fallback =
                    recaptchaVersion !== "v2" &&
                    (json.code === "RECAPTCHA_LOW_SCORE" ||
                        json.code === "RECAPTCHA_FAIL" ||
                        json.code === "RECAPTCHA_ACTION" ||
                        json.code === "RECAPTCHA_MISSING");

                if (shouldShowV2Fallback) {
                    pendingPayloadRef.current = payload;
                    setShowV2(true);
                    setResult(null);
                    return;
                }

                // Handle failed v2 attempts
                if (
                    recaptchaVersion === "v2" &&
                    (json.code === "RECAPTCHA_FAIL" ||
                        json.code === "RECAPTCHA_QUOTA_EXCEEDED" ||
                        json.code === "RECAPTCHA_ERROR")
                ) {
                    setShowV2(false);
                    pendingPayloadRef.current = null;

                    try {
                        const grecaptcha = window.grecaptcha;
                        if (
                            grecaptcha &&
                            typeof grecaptcha.reset === "function"
                        ) {
                            if (v2WidgetIdRef.current != null) {
                                grecaptcha.reset(v2WidgetIdRef.current);
                            }
                        }
                    } catch {
                        // non-fatal
                    }

                    setResult({
                        type: "error",
                        message:
                            "We could not verify your request right now. Please try again later. If the issue continues, please contact us by phone or email directly.",
                    });

                    return;
                }

                // Handle rate limits and quota messaging
                if (
                    json.code === "RATE_LIMIT_IP" ||
                    json.code === "RATE_LIMIT_BURST"
                ) {
                    const wait = json.retryInSec ?? 60;
                    setResult({
                        type: "error",
                        message: `Too many requests from your network. Try again in ${Math.ceil(wait / 60)} minute(s).`,
                    });
                    return;
                }
                if (json.code === "RATE_LIMIT_EMAIL") {
                    const wait = json.retryInSec ?? 60 * 60;
                    setResult({
                        type: "error",
                        message: `Too many messages from this email. Try again in ${Math.ceil(wait / 60)} minute(s).`,
                    });
                    return;
                }

                // Handle reCAPTCHA quota or service issues
                if (
                    json.code === "RECAPTCHA_QUOTA_EXCEEDED" ||
                    json.code === "RECAPTCHA_TEMPORARY_FAILURE"
                ) {
                    setResult({
                        type: "error",
                        message:
                            "Verification service temporarily unavailable. Please try again in a little while.",
                    });
                    return;
                }

                throw new Error(json?.error || "Failed to send message.");
            }

            if (json.ok !== true) {
                throw new Error("Unexpected response from server.");
            }

            setResult({
                type: "success",
                message:
                    "Thank you for reaching out! We received your message. We will reply soon.",
                refId: json.id,
            });

            setSubmitted(true);

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

            // Hide and reset v2 widget if present
            setShowV2(false);
            pendingPayloadRef.current = null;
            try {
                const grecaptcha = window.grecaptcha;

                if (grecaptcha && typeof grecaptcha.reset === "function") {
                    if (v2WidgetIdRef.current != null) {
                        grecaptcha.reset(v2WidgetIdRef.current);
                    }
                }
            } catch (err) {
                // non-fatal
            }
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

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setResult(null);

        if (loading) return; // prevent double submissions

        const payload = {
            name: contactName.trim(),
            email: email.trim(),
            subject: buildSubjectWithCategory(title, normalizedReason),
            message: description.trim(),
            meta: buildMeta(),
        };

        // Try v3 first
        let recaptchaToken = "";
        try {
            if (RECAPTCHA_SITE_KEY && typeof window !== "undefined") {
                const grecaptcha = window.grecaptcha;

                if (grecaptcha && typeof grecaptcha.execute === "function") {
                    recaptchaToken = await new Promise<string>(
                        (resolve, reject) => {
                            grecaptcha.ready(() => {
                                grecaptcha
                                    .execute(RECAPTCHA_SITE_KEY, {
                                        action: "contact_form",
                                    })
                                    .then((t: string) => resolve(t))
                                    .catch(reject);
                            });
                        },
                    );
                }
            }
        } catch (err) {
            console.warn("reCAPTCHA v3 execute failed", err);
        }

        // submit (server may respond requesting v2)
        if (recaptchaToken) {
            await submitPayload(payload, recaptchaToken, "v3");
        } else {
            await submitPayload(payload, recaptchaToken);
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

    if (submitted && result?.type === "success") {
        return (
            <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-8 text-center shadow-sm animate-in fade-in duration-300">
                <Image
                    src="/images/logos/LogoCircle.png"
                    alt="VietBites"
                    width={40}
                    height={40}
                    className="mx-auto mb-4 rounded-full"
                />

                <p className="font-heading text-xl font-bold text-green-700">
                    Message sent
                </p>

                <p className="mt-3 text-charcoal/80">{result.message}</p>

                {result.refId && (
                    <p className="mt-3 text-sm text-charcoal/60">
                        Reference ID: {result.refId}
                    </p>
                )}

                <p className="mt-5 text-sm text-charcoal/60">
                    If you need to send another message, please refresh the
                    page.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="rounded-lg lg:px-2 space-y-6">
            <ContactFormHeader
                title={heading.title}
                subtitle={heading.subtitle}
            />

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
                            <hr
                                id="reason-divider"
                                className="my-2 hidden md:block"
                            />
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
                        id="contactName"
                        name="contactName"
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
                        id="orgName"
                        name="orgName"
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
                        id="email"
                        name="email"
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
                            id="businessType"
                            name="businessType"
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
                            id="businessWebsite"
                            name="businessWebsite"
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
                            id="businessLocation"
                            name="businessLocation"
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
                            id="estimatedVolume"
                            name="estimatedVolume"
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

            {/* reCAPTCHA v2 fallback */}
            {showV2 && (
                <div className="rounded-lg border border-orange/20 bg-orange/5 p-4 space-y-3 text-center">
                    <p className="text-sm font-medium text-charcoal">
                        We need an extra verification step.
                    </p>
                    <p className="text-sm text-charcoal/70">
                        Please complete the captcha below to continue.
                    </p>

                    <div className="flex justify-center">
                        <div id="recaptcha-v2" ref={v2ContainerRef} />
                    </div>
                </div>
            )}

            <ContactFormFooter
                loading={loading}
                requiredDisabled={requiredDisabled}
                result={result}
            />
        </form>
    );
}
