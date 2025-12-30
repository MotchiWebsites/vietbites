import Image from "next/image";

export default function FounderLetter() {
    return (
        <section className="relative mx-auto mt-16 max-w-5xl px-2 md:px-10">
            {/* OUTER decorative quotes that frame the whole letter */}
            <div className="pointer-events-none absolute -top-2 -left-2 md:-top-8 md:-left-8 text-4xl sm:text-5xl md:text-8xl font-heading text-orange/20 select-none">
                “
            </div>
            <div className="pointer-events-none absolute -bottom-2 -right-2 md:-bottom-8 md:-right-8 text-4xl sm:text-5xl md:text-8xl font-heading text-orange/20 select-none">
                ”
            </div>

            <article className="relative rounded-2xl bg-cream ring-1 ring-charcoal/10 shadow-md p-6 md:p-10 overflow-hidden">
                {/* inner gradient background accent */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-linear-to-br from-orange/5 via-transparent to-green/5 opacity-60"
                />

                {/* inner content */}
                <div className="relative z-10">
                    <p className="text-base md:text-lg text-charcoal/90 first-letter:text-4xl first-letter:font-heading first-letter:font-bold first-letter:mr-1 first-letter:text-orange">
                        That dream took root in something close to my heart: the
                        food from my hometown, <strong>Hải Phòng</strong>,
                        Vietnam. In Toronto, we noticed a real lack of authentic{" "}
                        <em>bánh mì que</em> and Vietnamese desserts. These were
                        the flavors I grew up with, and I wanted to share them.
                    </p>

                    <p className="mt-4 text-base md:text-lg text-charcoal/90">
                        We actually tested the idea first, selling homemade
                        desserts through Facebook groups. People loved it. For
                        the first time, we thought maybe, just maybe, we could
                        do something bigger. With all the savings we had, we
                        opened <strong>VietBites</strong>.
                    </p>

                    {/* highlighted mission box */}
                    <div className="my-8 relative overflow-hidden rounded-xl bg-linear-to-br from-orange/10 via-orange/5 to-transparent ring-1 ring-orange/20 p-6 md:p-8 shadow-sm">
                        <div className="absolute left-0 top-0 h-1 w-full bg-orange/70 opacity-70" />
                        <p className="text-base md:text-lg text-charcoal/90 leading-relaxed font-medium">
                            <span className="block text-orange font-semibold mb-2">
                                Our Mission
                            </span>
                            To introduce nostalgic, authentic flavors to locals
                            and passersby, and to give people a little taste of
                            Vietnam, just the way I remember it.
                        </p>
                        <div className="absolute bottom-0 right-0 w-16 h-[3px] bg-orange/40 rounded-full translate-y-2 translate-x-2" />
                    </div>

                    <p className="text-base md:text-lg text-charcoal/90">
                        It hasn&apos;t been easy. As a first-time business
                        owner, we had to figure out everything, from designing
                        our own menu, to testing recipes, dealing with
                        landlords, even assembling furniture by hand. Every inch
                        of the shop was built with sweat, heart, and many
                        trials.
                    </p>

                    <p className="mt-4 text-base md:text-lg text-charcoal/90">
                        It&apos;s been tough, but also incredibly fun. Every
                        challenge reminded us why we started. Now, just weeks
                        after opening, we&apos;re still learning every day. But
                        seeing smiles on our guests&apos; faces and hearing how
                        much they love our bánh mì and desserts makes it all
                        worth it!
                    </p>

                    <p className="mt-6 text-sm text-charcoal/70 font-semibold font-heading">
                        — Lily, Founder
                    </p>
                </div>

                {/* corner stamp */}
                <div className="pointer-events-none absolute -right-4 -bottom-4 rotate-12 opacity-70">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full blur-sm bg-orange/30 opacity-60" />
                        <Image
                            src="/images/logos/LogoCircle.png"
                            alt="VietBites logo stamp"
                            width={100}
                            height={100}
                            className="relative w-[100px] h-[100px] object-contain mix-blend-multiply"
                        />
                    </div>
                </div>
            </article>
        </section>
    );
}
