"use client";
import { useState } from "react";
import FormField from "@/components/contact/ui/FormField";
import TextArea from "@/components/contact/ui/TextArea";
import PhoneInput from "@/components/contact/ui/PhoneInput";
import SelectBox from "@/components/contact/ui/SelectBox";

export default function ContactForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [reason, setReason] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    // Result state after submission
    type ResultState =
        | { type: "success"; message: string; refId?: string }
        | { type: "error"; message: string }
        | null;

    const [result, setResult] = useState<ResultState>(null);

    // Validation states
    const [overDescriptionLimit, setOverDescriptionLimit] = useState(false);
    const [phoneValid, setPhoneValid] = useState(true);

    // Anti-bot honeypot and timestamp
    const [startedAt] = useState(() => Date.now());
    const [company, setCompany] = useState(""); // honeypot

    const reasonHelp: Record<string, string> = {
        "catering requests":
            "Share the date/time, guest count, location, dietary needs, and budget range to help us quote fast.",
        "technical issues":
            "Tell us what page (e.g., menu), what you expected vs. what happened.",
        "customer complaints":
            "Share your order number, date, pickup/delivery location, and what went wrong so we can make it right.",
        suggestions:
            "Tell us what product or menu idea do you have. Any flavors, ingredients, or styles in mind?",
        "hiring inquiries":
            "Tell us what role you're interested in, your availability, and a link to your resume/LinkedIn.",
        other: "Provide as much detail about your inquiry as possible.",
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setResult(null);

        const payload = {
            name: `${firstName} ${lastName}`.trim(),
            email,
            subject: reason ? `${title} - [Category: ${reason}]` : title,
            message: description + (phone ? `\n\nPhone: ${phone}` : ""),
        };

        setLoading(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...payload,
                    company,
                    startedAt,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                // Show server-provided message
                throw new Error(json?.error || "Failed to send message.");
            }

            setResult({
                type: "success",
                message:
                    "Thank you for reaching out! We received your message. We will reply soon.",
                refId: json?.id,
            });
            // Clear form
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setReason("");
            setTitle("");
            setDescription("");
            setCompany("");
        } catch (err: unknown) {
            let message = "Something went wrong.";
            if (err instanceof Error && err.message) {
                message = err.message;
            }
            setResult({ type: "error", message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="rounded-lg px-5 md:px-6 space-y-5">
            {/* Top helper row with required note */}
            <div className="flex flex-col md:flex-row items-start justify-between">
                <div className="text-sm text-gray-600">
                    Please provide as much detail as you can.
                </div>
                <div className="text-xs text-gray-500">
                    Fields marked with <span className="text-red-600">*</span>{" "}
                    are required.
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField id="firstName" label="First name" required>
                    <input
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        autoComplete="given-name"
                        placeholder="Jane"
                    />
                </FormField>
                <FormField id="lastName" label="Last name" required>
                    <input
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        autoComplete="family-name"
                        placeholder="Doe"
                    />
                </FormField>
            </div>

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
                            if (value === "") {
                                setPhoneValid(true);
                            }
                        }}
                        onValidityChange={(ok) => setPhoneValid(ok)}
                    />
                </FormField>
            </div>

            <FormField
                id="reason"
                className="select-box"
                label="Reason for contacting us"
                required
            >
                <SelectBox
                    value={reason}
                    placeholder="Select a category for your request..."
                    onChange={setReason}
                    aria-label="Reason for contacting us"
                    className="data-placeholder:text-gray-400"
                >
                    <SelectBox.Item value="catering requests">
                        Catering / Event Request - Large orders & quotes
                    </SelectBox.Item>
                    <SelectBox.Item value="customer complaints">
                        Customer Complaint - Order or service
                    </SelectBox.Item>
                    <SelectBox.Item value="suggestions">
                        Suggestion - Product or menu improvement
                    </SelectBox.Item>
                    <SelectBox.Item value="hiring inquiries">
                        Hiring Inquiry - Job opportunities
                    </SelectBox.Item>
                    <SelectBox.Item value="technical issues">
                        Technical Issue - Website bug or suggestion
                    </SelectBox.Item>
                    <SelectBox.Item value="other">Other</SelectBox.Item>
                </SelectBox>
            </FormField>

            <FormField
                id="title"
                label="Subject"
                required
                hint="A short summary, e.g., 'Catering Order for December 20th, 2025'."
            >
                <input
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Subject of your message"
                />
            </FormField>

            <FormField
                id="description"
                label="Description (max 5,000 characters)"
                required
            >
                {/* Contextual guidance under description */}
                {reason && (
                    <div className="rounded-md bg-white text-sm text-charcoal/70 p-3 shadow-sm mb-2 border border-charcoal/10">
                        <p className="font-medium mb-1">
                            When filling out the description for {reason},
                            please make sure to:
                        </p>
                        <p className="font-semibold">{reasonHelp[reason]}</p>
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

            {/* Honeypot field to discourage bots */}
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
                        adjust to be able to submit the form.
                    </div>
                )}
                <button
                    type="submit"
                    disabled={
                        loading ||
                        overDescriptionLimit ||
                        !phoneValid ||
                        !firstName ||
                        !lastName ||
                        !email ||
                        !reason ||
                        !title ||
                        !description
                    }
                    className="inline-flex items-center justify-center rounded-md bg-orange px-5 py-2 text-white font-semibold shadow-sm "
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
