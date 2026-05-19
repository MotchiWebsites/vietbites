"use client";
import { LuAlarmClock } from "react-icons/lu";

export default function UrgentBanner() {
    return (
        <div className="rounded-lg border border-amber-200/60 bg-linear-to-r from-amber-50 to-orange/5 p-4 flex items-start gap-3 shadow-sm">
            <div className="flex-none inline-flex items-center justify-center h-9 w-9 rounded-md bg-orange text-white shadow-sm">
                <LuAlarmClock className="h-5 w-5" aria-hidden />
            </div>
            <div className="text-sm text-amber-900 leading-relaxed">
                <p className="font-semibold text-amber-900">
                    Need to reach us quickly?
                </p>
                <p className="mt-1 text-xs text-amber-800/90">
                    Start your subject line with{" "}
                    <span className="font-semibold tracking-wider font-mono text-amber-900">
                        [URGENT] -
                    </span>{" "}
                    and include a phone number so we can get back to you faster.
                </p>
            </div>
        </div>
    );
}
