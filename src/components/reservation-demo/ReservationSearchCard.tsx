import Image from "next/image";

import DemoSelect from "./DemoSelect";
import type {
    ReservationSearch,
    SeatingPreference,
} from "@/lib/reservation-demo/types";
import {
    guestOptions,
    seatingOptions,
    timeOptions,
} from "@/lib/reservation-demo/mockData";

function RequiredLabel({ children }: { children: string }) {
    return (
        <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-charcoal/60">
            {children}
            <span className="text-red-500">*</span>
        </span>
    );
}

export default function ReservationSearchCard({
    search,
    onChange,
    onSearch,
}: {
    search: ReservationSearch;
    onChange: (next: ReservationSearch) => void;
    onSearch: () => void;
}) {
    const canSearch =
        search.date && search.time && search.guests && search.seating;
    const isDatePlaceholder = search.date.length === 0;

    return (
        <section className="overflow-hidden rounded-3xl border border-charcoal/10 bg-clean shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-64 bg-charcoal/5 lg:min-h-full">
                    <div className="absolute inset-4 overflow-hidden rounded-3xl border-2 border-dashed border-charcoal/15 bg-charcoal/5 p-3 sm:p-4">
                        <div className="relative h-full min-h-64 overflow-hidden rounded-2xl bg-charcoal/10">
                            <Image
                                src="/images/reservation-demo/restaurant.jpeg"
                                alt="Booking widget preview"
                                fill
                                sizes="(min-width: 1024px) 45vw, 100vw"
                                className="object-cover object-center"
                                priority
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/5 to-transparent" />

                            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                                <div className="max-w-xs rounded-2xl bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal/50">
                                        Restaurant photo
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-charcoal">
                                        A full-width visual space for the dining
                                        room or patio.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 md:p-8">
                    <div className="mb-6">
                        <p className="text-sm font-semibold tracking-[0.2em] text-orange">
                            CUSTOMER VIEW
                        </p>
                        <h2 className="mt-2 font-heading text-2xl font-bold md:text-3xl">
                            Reserve a table
                        </h2>
                        <p className="mt-2 text-sm text-charcoal/70">
                            A simple customer booking widget inspired by
                            OpenTable-style flows.
                        </p>
                        <div className="mt-4 rounded-2xl border border-charcoal/20 bg-charcoal shadow-md px-4 py-3">
                            <p className="text-sm text-clean">
                                Demo only! This dashboard is a static mockup
                                meant to demonstrate workflows and UI concepts.
                                It does not sync live reservations or update in
                                real time.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-cream p-4 md:p-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="space-y-2">
                                <RequiredLabel>Date</RequiredLabel>
                                <input
                                    type="date"
                                    value={search.date}
                                    onChange={(e) =>
                                        onChange({
                                            ...search,
                                            date: e.target.value,
                                        })
                                    }
                                    className={
                                        "w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3 text-sm shadow-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20 " +
                                        (isDatePlaceholder
                                            ? "font-semibold text-charcoal/40 [&::-webkit-datetime-edit]:font-semibold [&::-webkit-datetime-edit]:text-charcoal/40 [&::-webkit-datetime-edit-fields-wrapper]:font-semibold [&::-webkit-datetime-edit-fields-wrapper]:text-charcoal/40"
                                            : "text-charcoal")
                                    }
                                />
                            </label>

                            <DemoSelect
                                label="Time"
                                required
                                value={search.time}
                                onChange={(time) =>
                                    onChange({ ...search, time })
                                }
                            >
                                <option value="">Select time</option>
                                {timeOptions.map((time) => (
                                    <option key={time}>{time}</option>
                                ))}
                            </DemoSelect>

                            <DemoSelect
                                label="Guests"
                                required
                                value={search.guests}
                                onChange={(guests) =>
                                    onChange({ ...search, guests })
                                }
                            >
                                <option value="">Party size</option>
                                {guestOptions.map((guests) => (
                                    <option key={guests}>{guests}</option>
                                ))}
                            </DemoSelect>

                            <DemoSelect
                                label="Seating"
                                required
                                value={search.seating}
                                onChange={(seating) =>
                                    onChange({
                                        ...search,
                                        seating: seating as SeatingPreference,
                                    })
                                }
                            >
                                <option value="">Seating preference</option>
                                {seatingOptions.map((seating) => (
                                    <option key={seating}>{seating}</option>
                                ))}
                            </DemoSelect>
                        </div>

                        <div className="mt-5 flex justify-center">
                            <button
                                type="button"
                                onClick={onSearch}
                                disabled={!canSearch}
                                className="w-full rounded-xl bg-orange px-6 py-3 text-sm font-bold text-clean shadow-sm transition hover:bg-orange-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-56"
                            >
                                Find a table
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
