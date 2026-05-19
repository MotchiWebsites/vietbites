"use client";

import React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    max?: number;
    onCountChange?: (count: number) => void;
    onValidityChange?: (overLimit: boolean) => void;
};

function getCount(value: Props["value"]) {
    if (typeof value === "string") return value.length;
    if (typeof value === "number") return String(value).length;
    return 0;
}

export default function CountedInput({
    id,
    className,
    value = "",
    onChange,
    max = 160,
    onCountChange,
    onValidityChange,
    rows = 2,
    ...props
}: Props) {
    const count = getCount(value);
    const over = count > max;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const len = e.target.value.length;

        onCountChange?.(len);
        onValidityChange?.(len > max);
        onChange?.(e);
    };

    return (
        <div className="relative w-full">
            <textarea
                id={id}
                value={value}
                onChange={handleChange}
                maxLength={max}
                rows={rows}
                aria-invalid={over || undefined}
                className={
                    "w-full resize-none rounded-md border bg-white px-3 pt-2 pb-6 text-base leading-snug shadow-sm " +
                    "wrap-break-word whitespace-pre-wrap overflow-hidden " +
                    (over
                        ? "border-red-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 "
                        : "border-gray-300 focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 ") +
                    (className ? ` ${className}` : "")
                }
                {...props}
            />

            <div
                className={
                    "absolute right-3 bottom-2 select-none text-[10px] sm:text-xs " +
                    (over ? "text-red-600" : "text-gray-500")
                }
                aria-hidden
            >
                {count}/{max}
            </div>
        </div>
    );
}
