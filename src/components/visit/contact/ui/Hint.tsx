"use client";
import { useRef, useState, type ReactNode } from "react";
import { LuX } from "react-icons/lu";
import { FaInfoCircle } from "react-icons/fa";
import { useClickAway } from "react-use";

export default function Hint({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const hintRef = useRef<HTMLDivElement>(null);

    useClickAway(hintRef, () => setOpen(false));

    return (
        <div className="relative flex items-center gap-2" ref={hintRef}>
            {/* Info button */}
            <div
                role="button"
                aria-expanded={open}
                aria-controls="hint-content"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-white text-orange hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 shadow transition ease-in-out duration-300 cursor-pointer"
            >
                <FaInfoCircle className="h-4 w-4" aria-hidden />
                <span className="sr-only">More info</span>
            </div>

            {/* Hint box */}
            <div
                id="hint-content"
                aria-hidden={!open}
                className={[
                    "absolute z-50",
                    "left-1/2 top-full mt-2 -translate-x-1/2",
                    "w-64 max-w-[90vw]",
                    "rounded-lg border border-gray-100 bg-white p-3 text-xs text-gray-700 shadow-xl ring-1 ring-black/5",
                    "transition-all duration-200 ease-out",
                    open
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-1 scale-95 pointer-events-none",
                ].join(" ")}
            >
                {/* Close button */}
                <div
                    role="button"
                    aria-label="Close hint"
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className="absolute top-2 right-2 inline-flex items-center justify-center h-5 w-5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                    <LuX className="h-3 w-3" aria-hidden />
                </div>

                <div className="font-semibold text-gray-900 mb-1">Hint</div>
                <div className="text-gray-700 font-medium">{children}</div>
            </div>
        </div>
    );
}
