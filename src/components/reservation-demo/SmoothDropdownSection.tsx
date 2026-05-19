"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

type SmoothDropdownSectionProps = {
    title: string;
    description: string;
    actionLabel?: string;
    defaultOpen?: boolean;
    className?: string;
    children: ReactNode;
};

export default function SmoothDropdownSection({
    title,
    description,
    actionLabel = "Collapse or expand",
    defaultOpen = false,
    className = "",
    children,
}: SmoothDropdownSectionProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={className}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-end justify-between gap-3 text-left"
                aria-expanded={open}
            >
                <div>
                    <p className="font-heading text-lg font-bold">{title}</p>
                    <p className="text-sm text-clean/60">{description}</p>
                </div>

                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-clean/50">
                    <span>{actionLabel}</span>
                    <span
                        className={
                            "inline-flex h-6 w-6 items-center justify-center rounded-full bg-clean/10 text-clean/70 transition-transform duration-300 " +
                            (open ? "rotate-180" : "")
                        }
                    >
                        <FiChevronDown size={14} />
                    </span>
                </span>
            </button>

            <div
                className={
                    "grid transition-all duration-300 ease-out " +
                    (open
                        ? "mt-4 grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0")
                }
            >
                <div className="overflow-hidden">{children}</div>
            </div>
        </div>
    );
}
