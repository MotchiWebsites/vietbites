import TimeSlotCard from "./TimeSlotCard";
import type { ReservationSearch, TimeSlot } from "@/lib/reservation-demo/types";

export default function AvailableTimesCard({
    search,
    slots,
    alternatives,
    selectedSlot,
    onSelectSlot,
}: {
    search: ReservationSearch;
    slots: TimeSlot[];
    alternatives: TimeSlot[];
    selectedSlot: TimeSlot | null;
    onSelectSlot: (slot: TimeSlot) => void;
}) {
    const hasExactOrNearby = slots.length > 0;

    return (
        <section className="rounded-3xl border border-charcoal/10 bg-clean p-5 shadow-sm md:p-8">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-semibold tracking-[0.2em] text-orange">
                        AVAILABLE TIMES
                    </p>
                    <h2 className="mt-2 font-heading text-2xl font-bold md:text-3xl">
                        Choose a reservation time
                    </h2>
                    <p className="mt-2 text-sm text-charcoal/70">
                        Guests can compare nearby slots before entering their
                        details.
                    </p>
                </div>

                <div className="rounded-full bg-cream px-4 py-2 text-sm font-semibold text-charcoal/70">
                    {search.date} · {search.time} · {search.guests} ·{" "}
                    {search.seating}
                </div>
            </div>

            {hasExactOrNearby ? (
                <>
                    <p className="mb-3 text-sm font-semibold text-charcoal/70">
                        Available times near your request:
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {slots.map((slot) => (
                            <TimeSlotCard
                                key={`${slot.time}-${slot.seating}`}
                                slot={slot}
                                selected={
                                    selectedSlot?.time === slot.time &&
                                    selectedSlot?.seating === slot.seating
                                }
                                onSelect={() => onSelectSlot(slot)}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="space-y-4">
                    <div className="rounded-2xl border border-dashed border-charcoal/20 bg-cream/70 p-6 text-center">
                        <p className="font-heading text-xl font-bold text-charcoal">
                            Nothing close is available
                        </p>
                        <p className="mx-auto mt-2 max-w-xl text-sm text-charcoal/70">
                            Unfortunately, we do not have anything close to your
                            selected time and seating preference. Here are some
                            other options we can offer instead.
                        </p>
                    </div>

                    {alternatives.length > 0 && (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {alternatives.map((slot) => (
                                <TimeSlotCard
                                    key={`${slot.time}-${slot.seating}`}
                                    slot={slot}
                                    selected={
                                        selectedSlot?.time === slot.time &&
                                        selectedSlot?.seating === slot.seating
                                    }
                                    onSelect={() => onSelectSlot(slot)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
