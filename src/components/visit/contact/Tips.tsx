"use client";
import { ReactNode } from "react";

export default function Tips({
    items,
}: {
    items: { icon: ReactNode; text: ReactNode }[];
}) {
    return (
        <div className="space-y-3 text-sm text-gray-700">
            {items.map((item, i) => (
                <div className="flex items-center gap-3" key={i}>
                    <span className="flex-none mt-0.5 inline-flex items-center justify-center h-8 w-8 rounded-md bg-orange/10 text-orange">
                        {item.icon}
                    </span>
                    <p className="leading-tight font-medium text-gray-700">{item.text}</p>
                </div>
            ))}
        </div>
    );
}
