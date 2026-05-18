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
        <section
            id="catering"
            className="grid gap-6 lg:grid-cols-[40%_60%] lg:px-12 items-stretch"
        >
            {/* Image */}
            <div
                className={[
                    "relative overflow-hidden rounded-md shadow-sm ring-1 ring-charcoal/10 mx-auto w-4/5 bg-cream",
                    isContain ? containBgClassName : "bg-clean",
                ].join(" ")}
            >
                <div
                    className={[
                        "relative",
                        // cover: fixed-ish ratio so all sections look consistent
                        !isContain ? "aspect-4/3 xl:aspect-auto lg:h-full" : "",
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
                            isContain ? "object-contain p-6" : "object-cover",
                            !isContain && imagePlacement === "top"
                                ? "object-top"
                                : "object-center",
                        ].join(" ")}
                        priority={false}
                    />
                </div>
            </div>

            {/* Copy */}
            <div className="flex flex-col justify-center bg-cream mx-2 px-2 sm:mx-4 sm:px-6 lg:mx-0 lg:px-0">
                <div className="space-y-4">
                    <div>
                        <p className="tracking-widest text-xs text-charcoal/60 font-semibold uppercase ml-1 mb-1">
                            {eyebrow}
                        </p>

                        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-charcoal">
                            {title}
                        </h2>
                    </div>

                    <div className="space-y-3 text-charcoal/70 leading-relaxed w-[95%] ml-1">
                        {body.map((p, idx) => (
                            <p key={idx}>{p}</p>
                        ))}
                    </div>

                    <div className="pt-3">
                        <Link
                            href={buttonHref}
                            className="inline-flex items-center justify-center rounded-xl bg-orange text-clean px-6 py-3 mx-1 font-semibold shadow transition duration-200 hover:bg-orange-hover active:bg-orange-active active:scale-[.98]"
                        >
                            {buttonLabel}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
