import type { ComponentProps } from "react";
import Image from "next/image";

export function PhotoStrip({
    images = [
        { src: "/images/story/Team1.jpg", alt: "Our team!" },
        { src: "/images/story/Team2.jpg", alt: "Our team!" },
        { src: "/images/story/Team3.jpg", alt: "Our team!" },
        { src: "/images/story/Team4.jpg", alt: "Our team!" },
    ],
}: {
    images?: { src: string; alt: string }[];
}) {
    const Img = ({ alt, ...props }: ComponentProps<typeof Image>) => (
        <Image alt={alt} {...props} />
    );

    return (
        <section className="mx-auto mt-12 max-w-6xl px-4 md:px-10">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {images.map((img, index) => {
                    return (
                        <figure
                            key={index}
                            className={[
                                "group relative overflow-hidden rounded-2xl ring-1 ring-charcoal/10 bg-clean shadow-sm transition-transform duration-300 will-change-transform",
                                // keep bouncing (lift) effect on hover/focus
                                "hover:shadow-lg hover:-translate-y-1 focus-within:shadow-lg focus-within:-translate-y-1",
                                // keyboard focus outline
                                "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-400",
                                // uniform height for all images
                                "h-52 md:h-64",
                            ].join(" ")}
                        >
                            <Img
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width:768px) 50vw, 25vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                priority={index < 2}
                            />

                            {/* focusable element for keyboard users */}
                            <a
                                tabIndex={0}
                                aria-label={img.alt}
                                className="absolute inset-0 z-10 focus:outline-none"
                            />
                        </figure>
                    );
                })}
            </div>
        </section>
    );
}
