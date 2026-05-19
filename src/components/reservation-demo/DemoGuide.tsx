"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const guideItems = [
    {
        title: "Indoor availability",
        text: "Choose Indoor around 7:00 PM to show nearby indoor reservation slots.",
    },
    {
        title: "Patio availability",
        text: "Choose Patio around 8:00 PM to show the limited patio slot.",
    },
    {
        title: "Bar seating",
        text: "Choose Bar seating around 8:30 PM to show the bar seating option.",
    },
    {
        title: "No close availability",
        text: "Choose Patio at 12:00 PM to show the no-close-match message with alternate options.",
    },
];

const adminItems = [
    {
        title: "Manage reservation statuses",
        text: "Move guests through the workflow from confirmed to arrived, seated, completed, or no-show.",
    },
    {
        title: "Handle walk-ins",
        text: "Quickly add walk-ins, assign tables, and seat guests without requiring a prior reservation.",
    },
    {
        title: "Assign and free tables",
        text: "Track occupied tables, reassign seating, and release tables when guests complete their visit.",
    },
    {
        title: "Monitor upcoming service",
        text: "View upcoming reservations, guest notes, party sizes, and service timing in one dashboard.",
    },
];

export default function DemoGuide(
    { mode = "customer" }: { mode?: "customer" | "admin" } = {
        mode: "customer",
    },
) {
    const [open, setOpen] = useState(false);

    return (
        <div
            id="res-demo"
            className="overflow-hidden rounded-3xl border border-clean/10 bg-charcoal text-clean shadow-sm"
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-clean/5 md:px-6"
            >
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange">
                        {mode === "admin" ? "ADMIN GUIDE" : "Mockup guide"}
                    </p>
                    <p className="mt-1 font-heading text-xl font-bold">
                        How to test the reservation flow
                    </p>
                    <p className="mt-1 text-sm text-clean/60">
                        Open this guide to try the mock data scenarios.
                    </p>
                </div>

                <span
                    className={
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clean/10 text-orange transition-transform duration-300 " +
                        (open ? "rotate-180" : "")
                    }
                >
                    <FiChevronDown size={20} />
                </span>
            </button>

            <div
                className={
                    "grid transition-all duration-300 ease-out " +
                    (open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0")
                }
            >
                <div className="overflow-hidden">
                    <div className="grid gap-3 border-t border-clean/10 px-5 py-5 text-sm md:grid-cols-2 md:px-6">
                        {(mode === "admin" ? adminItems : guideItems).map(
                            (item) => (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-clean/10 bg-cream text-charcoal p-4"
                                >
                                    <p className="font-heading text-base font-bold">
                                        {item.title}
                                    </p>
                                    <p className="mt-2 leading-relaxed text-charcoal/65">
                                        {item.text}
                                    </p>
                                </div>
                            ),
                        )}

                        <div className="col-span-full mt-2">
                            <p className="text-sm text-clean">
                                Note: This is a static mockup to demonstrate the
                                reservation flow and visual design. It does not
                                show live data or push updates. In a full
                                implementation these controls and views would be
                                integrated into the website so staff and
                                customers remain in the same design system and
                                workflow.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
