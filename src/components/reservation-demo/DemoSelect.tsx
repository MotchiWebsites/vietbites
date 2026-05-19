import type { ReactNode } from "react";
import { IoChevronDown } from "react-icons/io5";

export default function DemoSelect({
    label,
    required = false,
    value,
    onChange,
    children,
}: {
    label: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    children: ReactNode;
}) {
    const isPlaceholder = value.length === 0;

    return (
        <label className="space-y-2">
            <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-charcoal/60">
                {label}
                {required && <span className="text-red-500">*</span>}
            </span>

            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={
                        "w-full appearance-none rounded-xl border border-charcoal/10 bg-white px-4 py-3 pr-11 text-sm shadow-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20 " +
                        (isPlaceholder || value === "yyyy-mm-dd"
                            ? "font-semibold text-charcoal/40"
                            : "text-charcoal")
                    }
                >
                    {children}
                </select>

                <span
                    className={
                        "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs " +
                        (isPlaceholder || value === "yyyy-mm-dd"
                            ? "text-charcoal/35"
                            : "text-charcoal/50")
                    }
                >
                    <IoChevronDown size={20} />
                </span>
            </div>
        </label>
    );
}
