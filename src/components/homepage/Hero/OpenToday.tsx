import { getHours } from "@/lib/notion/hours";
import Link from "next/link";

export default function OpenToday({
    hours,
    showLink = true,
    className = "",
}: {
    hours: Awaited<ReturnType<typeof getHours>>;
    showLink?: boolean;
    className?: string;
}) {
    if (!hours?.length) return null;

    // Expect "Sort" 1..7 for Mon..Sun
    const idx = new Date().getDay(); // 0=Sun..6=Sat
    const map: Record<number, string> = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    };
    const todayName = map[idx];

    // Find today's hours, fallback to first match if multiple
    const today = hours.find(
        (h) => (h.day || "").toLowerCase() === todayName.toLowerCase()
    );
    if (!today) return null;

    // Show hours if open, even if open/close are empty strings or null
    const isClosed = today.closed === true || (!today.open && !today.close);

    // Helper to convert "HH:mm" or "H:mm" to 12-hour format
    function to12Hour(time?: string | null) {
        if (!time) return "—";
        const [h, m] = time.split(":").map(Number);
        if (isNaN(h) || isNaN(m)) return time;
        const hour = ((h + 11) % 12) + 1;
        const ampm = h >= 12 ? "PM" : "AM";
        return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
    }

    return (
        <p className={`${className}`}>
            Today&apos;s Hours:{" "}
            {isClosed ? (
                <span className="font-semibold">Closed</span>
            ) : (
                <span className="font-semibold">
                    <br className="sm:hidden" />
                    {to12Hour(today.open)} - {to12Hour(today.close)}
                </span>
            )}{" "}
            {showLink && (
                <Link
                    href="/visit"
                    className="underline hover:text-orange transition-colors"
                >
                    (see full hours)
                </Link>
            )}
        </p>
    );
}
