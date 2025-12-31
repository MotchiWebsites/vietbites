"use client";

import { useEffect, useRef, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { useClickAway } from "react-use";

type MenuSectionLink = {
    id: string;
    label: string;
};

export default function MenuMobileNav({
    sections,
}: {
    sections: MenuSectionLink[];
}) {
    const [open, setOpen] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(
        sections[0]?.id ?? null
    );
    const [hasScrolled, setHasScrolled] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);

    useClickAway(containerRef, () => {
        if (open) setOpen(false);
    });

    useEffect(() => {
        if (!sections.length) return;

        const getActive = () => {
            // This is the line in the viewport we consider "current section"
            // (slightly below the top to account for any header)
            const threshold = 120;

            let current: string | null = sections[0]?.id ?? null;

            for (const { id } of sections) {
                const el = document.getElementById(id);
                if (!el) continue;

                const top = el.getBoundingClientRect().top;

                // once a section's heading is above the threshold line, it becomes current
                if (top <= threshold) current = id;
                else break; // important: headings are in DOM order, so we can stop early
            }

            return current;
        };

        const handleScroll = () => {
            const next = getActive();
            if (next) setActiveId(next);
            setHasScrolled(window.scrollY > 40);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [sections]);

    const handleClick = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;

        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setOpen(false);
    };

    const activeLabel =
        sections.find((s) => s.id === activeId)?.label ?? "Browse menu";

    return (
        <div
            id="menu"
            ref={containerRef}
            className={[
                "sm:hidden fixed inset-x-0 bottom-0 mb-0 z-30",
                "bg-cream/90 backdrop-blur-md",
                "border-t border-charcoal/20",
                "shadow-[0_-8px_24px_rgba(15,23,42,0.10)]",
            ].join(" ")}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange/10 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-green/10 blur-3xl"
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-charcoal/10" />
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-2 flex items-center justify-between h-16 gap-3">
                <p className="text-xs font-medium text-charcoal/70 uppercase tracking-wide">
                    Browse menu
                </p>
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="inline-flex items-center gap-2 rounded-full bg-clean px-3 py-1.5 text-xs font-semibold text-charcoal shadow-sm ring-1 ring-charcoal/10 active:scale-[.97] hover:cursor-pointer ease-in-out duration-200 transition"
                    aria-expanded={open}
                    aria-label="Open menu section navigator"
                >
                    <IoMenu className="h-4 w-4 text-orange" />
                    <span className="line-clamp-1">
                        {activeLabel || "Navigate"}
                    </span>
                </button>
            </div>

            {/* animated container: always in DOM so CSS transitions can run smoothly */}
            <div
                aria-hidden={!open}
                className={[
                    "mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pb-3 transition-all duration-300 ease-out overflow-hidden",
                    open
                        ? "max-h-[420px] opacity-100 translate-y-0 pointer-events-auto"
                        : "max-h-0 opacity-0 translate-y-1 pointer-events-none",
                ].join(" ")}
            >
                <div
                    className={[
                        "rounded-2xl bg-clean shadow-lg ring-1 ring-charcoal/10 p-3 flex flex-col gap-2 transform transition-all duration-300",
                        open ? "scale-100" : "scale-[.98]",
                    ].join(" ")}
                >
                    {sections.map(({ id, label }) => {
                        const isActive = id === activeId;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => handleClick(id)}
                                className={[
                                    "px-3 py-1.5 rounded-full text-xs font-semibold transition text-left",
                                    isActive
                                        ? "bg-orange text-clean shadow-sm"
                                        : "bg-cream text-charcoal/80 hover:bg-orange/10",
                                ].join(" ")}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
