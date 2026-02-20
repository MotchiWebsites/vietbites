import "server-only";
import clsx from "clsx";
import type { OpeningHour } from "@/lib/notion/hours";

import { getPlatforms } from "@/lib/notion/platforms";
import type { Platform } from "@/lib/notion/platforms";
import Platforms from "@/components/common/Platforms";

function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function normalizeHours(
    hours: OpeningHour[]
): Array<{ day: string; open?: string; close?: string; closed?: boolean }> {
    const order = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    if (Array.isArray(hours)) {
        return hours
            .map((h: OpeningHour) => ({
                day: capitalize(h.day),
                open: h.open,
                close: h.close,
                closed: Boolean(h.closed ?? (h.open === "" && h.close === "")),
            }))
            .sort((a, b) => order.indexOf(a.day) - order.indexOf(b.day));
    }

    // If no hours provided, return all days closed
    return [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ].map((d) => ({ day: d, closed: true }));
}

export default async function HoursTable({ hours }: { hours: OpeningHour[] }) {
    const rows = normalizeHours(hours);

    const allPlatforms: Platform[] = await getPlatforms();
    const platforms = allPlatforms.filter(
        (p) =>
            p.name === "Instagram" ||
            p.name === "Facebook" ||
            p.name === "TikTok" ||
            p.name === "Email" ||
            p.name === "DoorDash" ||
            p.name === "UberEats" ||
            p.name === "PikaPoint"
    );

    return (
        <section
            aria-label="Business hours"
            className="max-w-lg mx-auto rounded-2xl"
        >
            <p className="px-5 sm:px-6 py-4 xl:py-8 text-center text-xs text-charcoal/60">
                Holiday hours may vary. Please check our socials below for
                updates.
            </p>
            <ul role="list" className="divide-y divide-transparent">
                {rows.map((r, idx) => {
                    const isClosed = r.closed || (!r.open && !r.close);

                    return (
                        <li key={`${r.day}-${idx}`}>
                            {idx !== 0 && (
                                <div className="py-4">
                                    <hr className="w-full" />
                                </div>
                            )}

                            <div className="px-5 sm:px-6 py-3.5 grid grid-cols-[1fr_auto] items-center gap-3">
                                <span
                                    className={clsx(
                                        "font-heading font-extrabold tracking-tight",
                                        "text-[color-mix(in_oklab,var(--green)_85%,black_0%)]",
                                        "text-base sm:text-lg"
                                    )}
                                >
                                    {r.day}
                                </span>

                                {isClosed ? (
                                    <span className="inline-flex items-center rounded-full bg-charcoal/5 text-charcoal/60 px-2.5 py-0.5 text-xs sm:text-sm font-semibold">
                                        Closed
                                    </span>
                                ) : (
                                    <time
                                        className="font-heading font-extrabold text-orange text-sm sm:text-base"
                                        dateTime={`${r.open}-${r.close}`}
                                    >
                                        {r.open} - {r.close}
                                    </time>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            <hr className="my-6 w-full" />
            <div className="py-4 my-4">
                <Platforms
                    items={platforms}
                    variant="compact"
                    align="between"
                />
            </div>
        </section>
    );
}
