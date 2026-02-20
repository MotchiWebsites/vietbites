import clsx from "clsx";
import { type ReactNode } from "react";
import {
    SiInstagram,
    SiFacebook,
    SiTiktok,
    SiDoordash,
    SiUbereats,
} from "react-icons/si";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { MdLanguage, MdOutlineMail, MdOutlineLocationOn } from "react-icons/md";
import { GrMultimedia } from "react-icons/gr"; // fallback icon

// Brand color definitions
const brandStyles: Record<
    string,
    { bg: string; text: string; hover: string; ring?: string; border?: string }
> = {
    Socials: {
        bg: "bg-orange/10",
        text: "text-orange",
        hover: "hover:bg-orange hover:text-clean",
        ring: "ring-orange/20",
        border: "border-orange/40",
    },
    DoorDash: {
        bg: "bg-red-50",
        text: "text-red-600",
        hover: "hover:bg-red-600 hover:text-white",
        ring: "ring-red-200",
        border: "border-red-300",
    },
    UberEats: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        hover: "hover:bg-emerald-700 hover:text-white",
        ring: "ring-emerald-200",
        border: "border-emerald-300",
    },
    PikaPoint: {
        bg: "bg-stone-50",
        text: "text-stone-600",
        hover: "hover:bg-stone-600 hover:text-white",
        ring: "ring-stone-200",
        border: "border-stone-300",
    },
    other: {
        bg: "bg-charcoal/5",
        text: "text-charcoal",
        hover: "hover:bg-charcoal hover:text-clean",
        ring: "ring-charcoal/10",
        border: "border-charcoal/30",
    },
};

// Default icons
const defaultIcons: Record<string, ReactNode> = {
    Instagram: (
        <SiInstagram className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
    ),
    Facebook: (
        <SiFacebook className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
    ),
    TikTok: <SiTiktok className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />,
    Website: (
        <MdLanguage className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
    ),
    Email: (
        <MdOutlineMail className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
    ),
    Location: (
        <MdOutlineLocationOn
            className="h-5 w-5 md:h-6 md:w-6"
            aria-hidden="true"
        />
    ),
    DoorDash: (
        <SiDoordash className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
    ),
    UberEats: (
        <SiUbereats className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
    ),
    PikaPoint: (
        <HiOutlineShoppingBag
            className="h-5 w-5 md:h-6 md:w-6"
            aria-hidden="true"
        />
    ),
    other: (
        <GrMultimedia className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
    ),
};

export type PlatformBadgeProps = {
    name?: string;
    url: string;
    /** for full variant label text, e.g. "@vietbites.to" */
    label?: string;
    /** override icon if needed */
    icon?: ReactNode;
    /** "compact" = icon only; "full" = icon + label */
    variant?: "compact" | "full";
    /** "solid" = vibrant, "subtle" = bordered/ghost style */
    tone?: "solid" | "subtle";
    /** on mobile, should the badge take full width? (compact variant only) */
    fullWidthOnMobile?: boolean;
    /** aria label when compact has no visible text */
    ariaLabel?: string;
    className?: string;
};
export default function PlatformBadge({
    name = "other",
    url,
    label,
    icon,
    variant = "full",
    tone = "solid",
    fullWidthOnMobile = false,
    ariaLabel,
    className,
}: PlatformBadgeProps) {
    const brand =
        name === "Instagram" ||
        name === "Facebook" ||
        name === "TikTok" ||
        name === "Website" ||
        name === "Email" ||
        name === "Location"
            ? brandStyles.Socials
            : (brandStyles[name] ?? brandStyles.other);

    const Icon = icon ?? defaultIcons[name] ?? defaultIcons.other;

    const isFullWidth = variant === "full" && fullWidthOnMobile;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={variant === "compact" ? ariaLabel || label : undefined}
            className={clsx(
                "relative inline-flex items-center gap-2 rounded-full border transition duration-200",
                "px-4 py-2 text-sm md:text-base font-semibold font-heading",
                variant === "compact" && "w-12 h-12 p-0 justify-center",
                isFullWidth ? "w-full sm:w-fit justify-center" : "w-fit",
                tone === "solid" ||
                    name === "UberEats" ||
                    name === "DoorDash" ||
                    name === "PikaPoint"
                    ? [brand.bg, brand.text, brand.hover]
                    : [
                          "bg-transparent",
                          brand.text,
                          brand.hover,
                          "border-current",
                          "hover:shadow-sm",
                      ],
                "ring-1",
                brand.ring ?? "ring-transparent",
                "transform-gpu will-change-transform hover:scale-[1.03] active:scale-[.98]",
                "outline-none focus-visible:ring-2 focus-visible:ring-orange/40",
                tone === "subtle" && brand.border,
                className,
            )}
            style={{ transformOrigin: "center" }}
        >
            <span className="shrink-0">{Icon}</span>
            {variant === "full" && label ? (
                <span className="truncate">{label}</span>
            ) : null}
        </a>
    );
}
