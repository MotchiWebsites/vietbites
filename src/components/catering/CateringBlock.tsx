import Image from "next/image";
import Link from "next/link";

type CateringBlockProps = {
    eyebrow: string;
    title: string;
    body: string[];
    buttonLabel: string;
    buttonHref: string;
    imageSrc: string;
    imageAlt: string;
    imagePlacement?: "top" | "center";
    imageFit?: "cover" | "contain";
    containBgClassName?: string; // optional background when using contain
};

export default function CateringBlock({
    eyebrow,
    title,
    body,
    buttonLabel,
    buttonHref,
    imageSrc,
    imageAlt,
    imagePlacement = "center",
    imageFit = "cover",
    containBgClassName = "bg-clean",
}: CateringBlockProps) {
    const isContain = imageFit === "contain";

    return (
        <section id="catering" className="w-full flex justify-center px-4 lg:px-0">
            <div className="w-full md:w-[90%] lg:w-4/5 grid gap-6 lg:grid-cols-[40%_60%] items-stretch place-items-stretch lg:px-12">
            {/* Image */}
            <div
                className={[
                    "relative overflow-hidden rounded-md shadow-sm ring-1 ring-charcoal/10 bg-cream w-full lg:mx-0",
                    isContain ? containBgClassName : "bg-clean",
                ].join(" ")}
            >
                <div
                    className={[
                        "relative w-full",
                        // cover: fixed-ish ratio on small screens, full height on lg
                        !isContain ? "aspect-4/3 lg:aspect-auto lg:h-full" : "",
                        // contain: allow block to size itself, show whole image
                        isContain ? "min-h-60 lg:min-h-80" : "",
                    ].join(" ")}
                >
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className={[
                            isContain ? "object-contain p-2" : "object-cover h-full w-full",
                            !isContain && imagePlacement === "top"
                                ? "object-top"
                                : "object-center",
                        ].join(" ")}
                        priority={false}
                    />
                </div>
            </div>

            {/* Copy */}
            <div className="flex flex-col justify-center bg-cream px-4 sm:px-6 lg:px-8 lg:mx-0 w-full">
                <div className="space-y-4">
                    <div>
                        <p className="tracking-widest text-xs text-charcoal/60 font-semibold uppercase mb-1">
                            {eyebrow}
                        </p>

                        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-charcoal">
                            {title}
                        </h2>
                    </div>

                    <div className="space-y-3 text-charcoal/70 leading-relaxed">
                        {body.map((p, idx) => (
                            <p key={idx}>{p}</p>
                        ))}
                    </div>

                    <div className="pt-3 flex">
                        <Link
                            href={buttonHref}
                            className="inline-flex items-center justify-center rounded-xl bg-orange text-clean px-6 py-3 mx-auto lg:mx-0 font-semibold shadow transition duration-200 hover:bg-orange-hover active:bg-orange-active active:scale-[.98]"
                        >
                            {buttonLabel}
                        </Link>
                    </div>
                </div>
            </div>
            </div>
        </section>
    );
}
