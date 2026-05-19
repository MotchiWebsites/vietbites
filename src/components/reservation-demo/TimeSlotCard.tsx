import type { TimeSlot } from "@/lib/reservation-demo/types";

export default function TimeSlotCard({
    slot,
    selected,
    onSelect,
}: {
    slot: TimeSlot;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <div
            className={
                "rounded-2xl border p-4 text-left shadow-sm transition-all duration-150 " +
                (selected
                    ? "border-orange bg-orange/10 ring-2 ring-orange/20"
                    : "border-charcoal/10 bg-white hover:-translate-y-0.5 hover:border-orange/40 hover:bg-orange/5 hover:shadow-md")
            }
            id="res-demo"
        >
            <button
                type="button"
                onClick={onSelect}
                className="w-full text-left bg-transparent p-0"
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="font-heading text-2xl font-bold text-charcoal">
                            {slot.time}
                        </p>
                        <p className="mt-1 text-sm text-charcoal/60">
                            {slot.seating} · Table for guests
                        </p>
                    </div>

                    <span className="rounded-full bg-orange/10 px-3 py-1 text-xs font-bold text-orange">
                        {slot.label}
                    </span>
                </div>

                <p className="mt-4 text-sm font-semibold text-charcoal/70">
                    {slot.status}
                </p>
            </button>
        </div>
    );
}
