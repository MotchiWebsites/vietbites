import clsx from "clsx";

type Props = {
    /** Main heading text */
    title: string;
    /** Optional subtitle/description under the title */
    subtitle?: string | React.ReactNode;
    /** Alignment of the whole header block */
    align?: "left" | "center" | "right";
    /** Visual size of the title */
    size?: "sm" | "md" | "lg";
    /** Extra content under subtitle, e.g. <InstagramSocial /> */
    children?: React.ReactNode;
    /** Outer className if you need to adjust margins per page */
    className?: string;
};

export default function SectionHeader({
    title,
    subtitle,
    align = "center",
    size = "md",
    children,
    className,
}: Props) {
    const alignClass =
        align === "left"
            ? "text-left items-start"
            : align === "right"
            ? "text-right items-end"
            : "text-center items-center";

    const titleSize =
        size === "sm"
            ? "text-2xl md:text-3xl"
            : size === "lg"
            ? "text-3xl md:text-4xl"
            : "text-3xl md:text-4xl";

    return (
        <header className={clsx("flex flex-col gap-2", alignClass, className)}>
            <h1
                className={clsx(
                    "contact-heading font-semibold tracking-tight text-orange",
                    titleSize
                )}
            >
                {title}
            </h1>

            {subtitle ? (
                <p
                    className={clsx(
                        "text-sm md:text-base text-charcoal/70",
                        // keep subtitle widths nice on wide layouts but not too narrow on mobile
                        align === "center"
                            ? "max-w-full lg:max-w-3/4"
                            : "max-w-full"
                    )}
                >
                    {subtitle}
                </p>
            ) : null}

            {/* Slot for extras under the subtitle (buttons, social, chips, etc.) */}
            {children ? <div>{children}</div> : null}
        </header>
    );
}
