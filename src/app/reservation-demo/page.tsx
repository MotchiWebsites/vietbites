"use client";

import { useMemo, useState } from "react";

import ReservationSearchCard from "@/components/reservation-demo/ReservationSearchCard";
import AvailableTimesCard from "@/components/reservation-demo/AvailableTimesCard";
import ReservationDetailsMockup from "@/components/reservation-demo/ReservationDetailsMockup";
import AdminDashboardMockup from "@/components/reservation-demo/AdminDashboardMockup";
import ViewToggle from "@/components/reservation-demo/ViewToggle";
import DemoGuide from "@/components/reservation-demo/DemoGuide";

import { mockSlots } from "@/lib/reservation-demo/mockData";
import type { ReservationSearch, TimeSlot } from "@/lib/reservation-demo/types";

type ViewMode = "customer" | "admin";

function timeToMinutes(time: string) {
    const [raw, period] = time.split(" ");
    const [h, m] = raw.split(":").map(Number);
    let hour = h;

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return hour * 60 + m;
}

export default function ReservationDemoPage() {
    const [view, setView] = useState<ViewMode>("customer");

    const [search, setSearch] = useState<ReservationSearch>({
        date: "",
        time: "",
        guests: "",
        seating: "",
    });

    const [searched, setSearched] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    const filteredSlots = useMemo(() => {
        if (!searched || !search.time) return [];

        const requested = timeToMinutes(search.time);

        return mockSlots.filter((slot) => {
            const seatingMatches =
                search.seating === "No preference" ||
                slot.seating === search.seating;

            const distance = Math.abs(timeToMinutes(slot.time) - requested);

            return seatingMatches && distance <= 45;
        });
    }, [searched, search.time, search.seating]);

    const alternativeSlots = useMemo(() => {
        if (!searched) return [];

        if (filteredSlots.length > 0) return [];

        return mockSlots.slice(0, 4);
    }, [searched, filteredSlots.length]);

    function handleSearch() {
        setSearched(true);
        setSelectedSlot(null);
    }

    return (
        <main className="min-h-screen bg-cream px-4 py-10 text-charcoal">
            <section className="mx-auto max-w-7xl space-y-8">
                <div className="text-center">
                    <p className="text-sm font-semibold tracking-[0.25em] text-orange">
                        VIETBITES RESERVATIONS
                    </p>
                    <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">
                        VietBites | Book a Table
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">
                        A concept preview showing how customers can book tables,
                        manage reservations, and how staff can view and update
                        reservations from an admin dashboard.
                    </p>
                    <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-orange/30 bg-orange/10 px-4 py-3 text-left">
                        <p className="text-sm font-semibold uppercase tracking-wide text-orange">
                            Hosted branch notice
                        </p>
                        <p className="mt-1 text-sm text-charcoal/80">
                            This hosted version is a mockup-only branch. All
                            routes currently redirect to this reservation demo,
                            so other site pages are intentionally unavailable
                            during this temporary session.
                        </p>
                    </div>
                </div>

                <ViewToggle view={view} onChange={setView} />

                <DemoGuide mode={view} />

                <div className="rounded-3xl transition-all duration-300 ease-out">
                    {view === "customer" ? (
                        <div
                            key="customer-view"
                            className="space-y-8 opacity-100 transition-all duration-300"
                        >
                            <ReservationSearchCard
                                search={search}
                                onChange={setSearch}
                                onSearch={handleSearch}
                            />

                            {searched && (
                                <AvailableTimesCard
                                    search={search}
                                    slots={filteredSlots}
                                    alternatives={alternativeSlots}
                                    selectedSlot={selectedSlot}
                                    onSelectSlot={setSelectedSlot}
                                />
                            )}

                            <ReservationDetailsMockup
                                search={search}
                                selectedSlot={selectedSlot}
                            />
                        </div>
                    ) : (
                        <div
                            key="admin-view"
                            className="opacity-100 transition-all duration-300"
                        >
                            <AdminDashboardMockup />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
