"use client";
import Link from "next/link";
import Image from "next/image";

export function StoryHero() {
    return (
        <section className="relative overflow-hidden rounded-2xl section-cream sm:mx-6 px-6 py-16 md:px-10 md:py-20 lg:py-24">
            {/* subtle brand blobs */}
            <div
                aria-hidden
                className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange/10 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-green/10 blur-3xl"
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-charcoal/10" />

            <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-[1.1fr_.9fr] items-center">
                <div>
                    <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange ring-1 ring-orange/20">
                        Our Story
                    </p>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight text-orange">
                        How we opened our first bánh mì & dessert shop at 23.
                    </h1>

                    <p className="mt-4 text-base md:text-lg text-charcoal/80 max-w-prose">
                        Hi, I&apos;m{" "}
                        <span className="font-semibold text-orange">Lily</span>{" "}
                        (VietBites founder). A few months ago, my partner and I
                        were still working in the restaurant industry, surrounded
                        by hustle, energy, and the love of food. We kept
                        dreaming about{" "}
                        <span className="text-orange font-semibold">
                            opening a place of our own
                        </span>
                        .
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href="/menu"
                            className="rounded-lg bg-orange text-clean px-5 py-3 font-semibold shadow transition hover:bg-orange-hover active:bg-orange-active"
                        >
                            Explore the Menu
                        </Link>
                        <Link
                            href="/location"
                            className="button-outline px-5 py-3 rounded-lg font-heading font-medium"
                        >
                            Visit Us
                        </Link>
                    </div>
                </div>

                {/* framed image placeholder (swap with real media later) */}
                <div className="relative mx-auto w-full max-w-md">
                    <div
                        data-role="story-img-wrap"
                        className="relative aspect-5/6 rounded-xl overflow-hidden ring-1 ring-charcoal/10 shadow-sm"
                    >
                        <Image
                            src="/images/story/Team1.jpg"
                            alt="VietBites team"
                            fill
                            sizes="(max-width:1024px) 100vw, 420px"
                            className="object-cover"
                            priority
                            onError={(e: any) => {
                                // hide the broken img element and show the placeholder div
                                try {
                                    const img = e?.target as HTMLElement | null;
                                    if (img) img.style.display = "none";
                                    const wrapper = img?.closest('[data-role="story-img-wrap"]') as HTMLElement | null;
                                    const ph = wrapper?.querySelector('[data-placeholder]') as HTMLElement | null;
                                    if (ph) ph.style.display = "flex";
                                } catch {
                                    console.error("Failed to load story hero image placeholder");
                                }
                            }}
                        />

                        {/* gradient overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/10 via-transparent to-transparent" />

                        {/* fallback placeholder (hidden by default, shown if image fails to load) */}
                        <div
                            data-placeholder
                            style={{ display: "none" }}
                            className="absolute inset-0 flex-col items-center justify-center gap-2 hidden bg-clean text-charcoal/80 p-4"
                        >
                            <div className="flex items-center justify-center h-full w-full">
                                <div className="text-center">
                                    <div className="mb-2 text-sm font-semibold">Image unavailable</div>
                                    <div className="text-xs">We&apos;re working on getting the photo up.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* sticker badges */}
                    <span className="absolute -left-3 -top-3 -rotate-6 rounded-md bg-clean px-2 py-1 text-[10px] font-bold text-orange ring-1 ring-orange/30 shadow">
                        Hai Phòng Roots
                    </span>
                    <span className="absolute -right-3 -bottom-3 rotate-[5deg] rounded-md bg-orange px-2 py-1 text-[10px] font-bold text-clean shadow">
                        Since 2025
                    </span>
                </div>
            </div>
        </section>
    );
}
