import Link from "next/link";
import Image from "next/image";

import Platforms from "./common/Platforms";
import type { Platform } from "@/lib/notion/platforms";
import { getPlatforms } from "@/lib/notion/platforms";

export default async function Footer() {
    const allPlatforms: Platform[] = await getPlatforms();

    return (
        <footer className="mt-16 mb-2 bg-clean border-t border-charcoal/10">
            {/* Slim brand accent */}
            <div className="h-1 bg-orange/80" />

            <div className="mx-auto max-w-6xl items-center justify-center px-5 md:px-20 py-10 grid gap-8 grid-cols-1 md:grid-cols-2">
                {/* Brand / tagline */}
                <div className="flex flex-col items-center md:items-start gap-3">
                    <Image
                        src="/images/banners/BannerNoBg.png"
                        alt="VietBites"
                        width={500}
                        height={200}
                        priority
                        className="rounded-md h-16 w-auto"
                    />
                    <div className="mt-3 flex flex-col gap-3 w-1/2 sm:w-1/3 md:flex-row md:w-full md:gap-4">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-lg bg-orange text-clean px-3 py-2 text-sm font-semibold shadow transition ease-in-out duration-300 hover:bg-orange-hover active:bg-orange-active active:scale-[.98] w-full sm:w-auto"
                        >
                            Order Online
                        </Link>
                        <Link
                            href="/menu"
                            className="inline-flex items-center justify-center button-outline py-2 px-3 text-sm font-heading font-medium rounded-lg w-full sm:w-auto"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>

                {/* Visit us */}
                <div className="text-sm flex flex-col justify-center items-center md:items-start">
                    <p className="mb-2 font-semibold text-charcoal font-heading">
                        Visit us
                    </p>
                    <a
                        href="https://maps.app.goo.gl/Fq7RaTVgy5xjsM9C6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-charcoal/90 hover:text-orange transition-colors ease-in-out duration-300"
                    >
                        <address className="not-italic text-center md:text-left">
                            {process.env.NEXT_PUBLIC_VIETBITES_LOCATION}
                        </address>
                    </a>
                    <p className="mt-2 text-charcoal/80 text-center md:text-left">
                        Open Sat to Thurs •{" "}
                        <Link
                            href="/location"
                            className="underline hover:text-orange ease-in-out duration-300 transition-colors"
                        >
                            Check our hours
                        </Link>
                    </p>

                    <div className="mt-3 flex gap-3 justify-center md:justify-start">
                        <Platforms items={allPlatforms} variant="compact" tone="subtle" />
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-charcoal/10 py-4 text-center text-xs text-charcoal/70">
                <p className="max-w-3/4 mx-auto">
                    © {new Date().getFullYear()} VietBites. Created by{" "}
                    <a
                        href="https://motchi.ca"
                        className="underline hover:text-orange ease-in-out duration-300 transition-colors"
                        target="_blank"
                    >
                        Mitchi Motcho Websites
                    </a>
                    . All rights reserved.
                </p>
            </div>
        </footer>
    );
}
