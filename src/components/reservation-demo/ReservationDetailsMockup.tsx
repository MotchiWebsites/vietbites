"use client";

import Image from "next/image";

import { useMemo, useState } from "react";
import type { ReservationSearch, TimeSlot } from "@/lib/reservation-demo/types";

export default function ReservationDetailsMockup({
    search,
    selectedSlot,
}: {
    search: ReservationSearch;
    selectedSlot: TimeSlot | null;
}) {
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [requests, setRequests] = useState("");
    const [confirmChecked, setConfirmChecked] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const emailIsValid = useMemo(() => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }, [email]);

    if (!selectedSlot) return null;

    const canSubmit =
        fullName.trim().length > 0 &&
        phone.trim().length > 0 &&
        emailIsValid &&
        confirmChecked;

    function handleSubmit() {
        if (!canSubmit) return;
        setSubmitted(true);
    }

    return (
        <section className="rounded-3xl border border-charcoal/10 bg-clean p-5 shadow-sm md:p-8">
            <div className="mb-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-orange">
                    CUSTOMER DETAILS
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold md:text-3xl">
                    Complete your reservation
                </h2>
                <p className="mt-2 text-sm text-charcoal/70">
                    Mockup of the guest information step after choosing a time.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                {submitted ? (
                    <div className="col-span-full">
                        <div className="rounded-2xl bg-green-50 border border-charcoal/10 p-6 text-center">
                            <Image
                                src="/images/logos/logoCircle.png"
                                alt="VietBites logo"
                                width={60}
                                height={60}
                                className="mx-auto pb-2"
                            />
                            <p className="text-2xl font-heading font-bold text-green-700">
                                Reservation confirmed
                            </p>
                            <p className="mt-2 text-sm text-green-700">
                                Thank you for your reservation. It has been received.<br />
                                A confirmation email will be sent to <span className="font-semibold">{email}</span>.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wide text-charcoal/65">
                                    Full name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3 text-sm md:text-base shadow-sm placeholder:font-semibold placeholder:text-charcoal/45 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wide text-charcoal/65">
                                    Phone number{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3 text-sm md:text-base shadow-sm placeholder:font-semibold placeholder:text-charcoal/45 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                                />
                                {!/^\+?[0-9\s\-()]+$/.test(phone) && phone.length > 0 && (
                                    <p className="mt-1 text-xs text-red-600">
                                        Please enter a valid phone number.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-wide text-charcoal/65">
                                    Email address{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3 text-sm md:text-base shadow-sm placeholder:font-semibold placeholder:text-charcoal/45 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                                />
                                {!emailIsValid && email.length > 0 && (
                                    <p className="mt-1 text-xs text-red-600">
                                        Please enter a valid email address.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-wide text-charcoal/65">
                                    Special requests (Optional)
                                </label>
                                <textarea
                                    rows={4}
                                    value={requests}
                                    onChange={(e) =>
                                        setRequests(e.target.value)
                                    }
                                    placeholder="Dietary restrictions, allergies, celebration notes..."
                                    className="w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3 text-sm md:text-base shadow-sm placeholder:font-semibold placeholder:text-charcoal/45 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                                />
                            </div>

                            <aside className="sm:col-span-2 rounded-2xl bg-cream p-5 w-full">
                                <p className="text-sm md:text-base font-bold uppercase tracking-wide text-charcoal/50">
                                    Reservation summary
                                </p>
                                <p className="mt-2 text-xs md:text-sm text-charcoal/60">
                                    Please review the details below before
                                    confirming.
                                </p>
                                <div className="mt-4 space-y-3 text-sm md:text-base text-charcoal/75">
                                    <p>
                                        <span className="font-semibold">
                                            Date:
                                        </span>{" "}
                                        {search.date}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Time:
                                        </span>{" "}
                                        {selectedSlot.time}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Guests:
                                        </span>{" "}
                                        {search.guests}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Seating:
                                        </span>{" "}
                                        {search.seating}
                                    </p>
                                </div>
                            </aside>

                            <div className="sm:col-span-2 flex items-center gap-3">
                                <input
                                    id="confirm-review"
                                    type="checkbox"
                                    checked={confirmChecked}
                                    onChange={(e) =>
                                        setConfirmChecked(e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-charcoal/20 text-orange focus:ring-orange"
                                />
                                <label
                                    htmlFor="confirm-review"
                                    className="text-sm text-charcoal/80"
                                >
                                    Please confirm all the details above before
                                    submitting your reservation{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                            </div>

                            <div className="sm:col-span-2">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={!canSubmit}
                                    className={
                                        "w-full rounded-xl px-6 py-3 text-sm md:text-base font-bold text-clean shadow-sm transition " +
                                        (canSubmit
                                            ? "bg-orange hover:bg-orange-hover"
                                            : "bg-charcoal/10 cursor-not-allowed opacity-60")
                                    }
                                >
                                    Confirm reservation
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
