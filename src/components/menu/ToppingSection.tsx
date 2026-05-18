import Image from "next/image";
import type { MenuItem } from "@/lib/notion/menu";
import FrameSection from "@/components/common/FrameSection";
import Price from "@/components/menu/MenuPrice";

type ToppingsVariant = "banhmi" | "drinks";

type Props = {
    title: string;
    items: MenuItem[];
    variant?: ToppingsVariant;
    intro?: React.ReactNode;
    frameClass?: "center-frame" | "left-frame" | "right-frame";
    nameClamp?: 1 | 2 | 3;
};

export default function ToppingsSection({
    title,
    items,
    variant = "banhmi",
    intro,
    frameClass = "left-frame",
    nameClamp = 2,
}: Props) {
    if (!items?.length) return null;

    const defaultIntro =
        variant === "drinks" ? (
            <p className="text-xs xl:text-sm italic text-charcoal/70 py-4">
                Add any of these toppings to your drink!
            </p>
        ) : (
            <p className="text-xs xl:text-sm italic text-charcoal/70 py-4">
                Don&apos;t want something below? Tell us — we&apos;ll leave it
                out!
            </p>
        );

    const clampClass =
        nameClamp === 1
            ? "line-clamp-1"
            : nameClamp === 2
              ? "line-clamp-2"
              : "line-clamp-3";

    return (
        <FrameSection title={title} frameClass={frameClass}>
            {intro ?? defaultIntro}

            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6 py-4">
                {items.map((it) => (
                    <div key={it.id} className="h-full">
                        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3">
                            <div className="shrink-0">
                                {it.photo ? (
                                    <Image
                                        src={it.photo}
                                        alt={it.name}
                                        width={112}
                                        height={112}
                                        className="h-24 w-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-clean ring-1 ring-charcoal/10 flex items-center justify-center">
                                        <span className="text-[11px] text-charcoal/60">
                                            Coming Soon
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 sm:mt-0 w-full grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-y-1 sm:gap-y-0 text-center sm:text-left mb-2">
                                <span
                                    className={`text-sm md:text-base font-medium font-heading text-orange leading-tight ${clampClass}`}
                                >
                                    {it.name}
                                </span>

                                {typeof it.price === "number" ? (
                                    <span className="text-sm text-orange font-semibold leading-tight justify-self-center sm:justify-self-end">
                                        <Price value={it.price} />
                                    </span>
                                ) : (
                                    // Reserve the space at ≥sm so columns stay aligned; on mobile we don't need it
                                    <span className="hidden sm:block opacity-0 select-none">
                                        0
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </FrameSection>
    );
}
