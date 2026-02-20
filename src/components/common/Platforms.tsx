import clsx from "clsx";
import type { Platform } from "@/lib/notion/platforms";
import PlatformBadge from "./PlatformBadge";

export type PlatformsProps = {
    items: Platform[];
    variant?: "compact" | "full";
    align?: "left" | "center" | "right" | "between";
    className?: string;
    tone?: "solid" | "subtle";
};

export default function Platforms({
    items,
    variant = "full",
    align = "center",
    tone = "solid",
    className,
}: PlatformsProps) {
    const justify =
        align === "left"
            ? "justify-start"
            : align === "right"
              ? "justify-end"
              : align === "between"
                ? "justify-between"
                : "justify-center";

    return (
        <div
            className={clsx(
                "mt-3 overflow-visible flex flex-wrap gap-3 sm:gap-4",
                justify,
                className,
            )}
        >
            {items.map((it, i) => (
                <PlatformBadge
                    key={`${it.name}-${i}`}
                    name={it.name}
                    url={it.url!}
                    label={variant === "full" ? it.label : undefined}
                    ariaLabel={it.label}
                    variant={variant}
                    tone={tone}
                />
            ))}
        </div>
    );
}
