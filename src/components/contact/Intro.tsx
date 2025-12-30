"use client";
import Link from "next/link";
import { FaInfoCircle } from "react-icons/fa";
import UrgentBanner from "./UrgentBanner";
import Tips from "./Tips";

export default function Intro({ className = "" }: { className?: string }) {
    return (
        <aside
            className={
                "rounded-xl md:rounded-2xl bg-linear-to-br from-cream via-white to-amber-50 border border-orange/10 shadow-sm p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 w-full max-w-full sm:max-w-4xl mx-auto " +
                className
            }
        >
            {/* Friendly header banner */}
            <UrgentBanner />

            <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-orange">
                    Need a hand?
                </h2>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-charcoal/80 leading-relaxed">
                    Whether it&apos;s a question, request, or bit of feedback, we&apos;re
                    happy to hear from you! You&apos;ll usually get a response within{" "}
                    <span className="font-semibold text-charcoal">
                        3-5 business days
                    </span>
                    .
                </p>
            </div>

            <Tips
                items={[
                    {
                        icon: (
                            <FaInfoCircle
                                className="h-4 w-4 sm:h-5 sm:w-5 text-orange"
                                aria-hidden
                            />
                        ),
                        text: (
                            <>
                                For order questions, please include your{" "}
                                <span className="font-medium text-orange">
                                    order number
                                </span>
                                .
                            </>
                        ),
                    },
                    {
                        icon: (
                            <FaInfoCircle
                                className="h-4 w-4 sm:h-5 sm:w-5 text-orange"
                                aria-hidden
                            />
                        ),
                        text: (
                            <>
                                For catering or events, let us know your{" "}
                                <span className="font-medium text-orange">
                                    date
                                </span>
                                ,{" "}
                                <span className="font-medium text-orange">
                                    guest count
                                </span>
                                , and{" "}
                                <span className="font-medium text-orange">
                                    location
                                </span>
                                .
                            </>
                        ),
                    },
                ]}
            />

            <div className="rounded-lg bg-orange/5 border border-orange/10 p-3 sm:p-5">
                <p className="text-sm sm:text-sm font-semibold text-charcoal mb-2">
                    Helpful details to include
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-charcoal/80 space-y-1">
                    <li>A clear summary of what you need or noticed.</li>
                    <li>Relevant order or event details.</li>
                </ul>
                <p className="mt-3 text-xs text-charcoal/60">
                    Curious about when we’re open?{" "}
                    <Link
                        href="/location"
                        aria-label="Check our business hours"
                        className="font-semibold text-orange underline underline-offset-2 hover:text-orange-hover transition-all"
                    >
                        Check our hours
                    </Link>
                </p>
            </div>
        </aside>
    );
}
