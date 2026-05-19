import type { Metadata } from "next";
import "server-only";

import { getHours } from "@/lib/notion/hours";
import LocationIntro from "@/components/visit/location/LocationIntro";
import HoursTable from "@/components/visit/location/HoursTable";
import ContactForm from "@/components/visit/contact/contactForm/ContactForm";
import FrameSection from "@/components/common/FrameSection";

export const metadata: Metadata = {
    title: "Visit Us",
    description:
        "Hours, location, and contact - check VietBites hours and get in touch.",
    openGraph: {
        title: "Visit Us | VietBites Toronto",
        description:
            "Hours, location, and contact - check VietBites hours and get in touch.",
    },
    twitter: {
        title: "Visit Us | VietBites Toronto",
        description:
            "Hours, location, and contact - check VietBites hours and get in touch.",
    },
};

function googleMapsEmbedSrc() {
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.074289893019!2d-79.37107992344025!3d43.66202617109976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cbc0f751d687%3A0x881dfbd1330e66d6!2sVietBites!5e0!3m2!1sen!2sca!4v1731557500000!5m2!1sen!2sca";
}

const googleMapsUrl = process.env.NEXT_PUBLIC_VIETBITES_GOOGLE_MAPS_URL || "https://www.google.com/maps/place/Vietbites/@43.6620262,-79.3720876,17z/data=!3m1!4b1!4m6!3m5!1s0x89d4cbc0f751d687:0x881dfbd1330e66d6!8m2!3d43.6620262!4d-79.3695127!16s%2Fg%2F11x6gcgm8t?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D";
const directionsUrl = process.env.NEXT_PUBLIC_VIETBITES_DIRECTIONS_URL || googleMapsUrl;

export default async function VisitPage({ searchParams }: { searchParams?: Record<string, string> | Promise<Record<string, string>> }) {
    const hours = await getHours();

    // `searchParams` may be a Promise in some Next.js runtimes — unwrap if necessary
    let resolvedSearchParams: Record<string, string> = {};
    if (searchParams) {
        // detect a Thenable
        if (typeof (searchParams as any)?.then === "function") {
            resolvedSearchParams = await (searchParams as Promise<Record<string, string>>);
        } else {
            resolvedSearchParams = searchParams as Record<string, string>;
        }
    }

    const initialReason = (resolvedSearchParams?.reason || resolvedSearchParams?.r || resolvedSearchParams?.ref || "") as string;

    return (
        <main
            id="visit"
            className="max-w-7xl mx-auto bg-cream px-4 md:px-6 lg:px-8 pb-12 pt-6 space-y-8"
        >
            <LocationIntro hours={hours} />

            <section className="grid gap-6 lg:grid-cols-2 items-start">
                <FrameSection
                    id="hours"
                    title="HOURS"
                    className="w-full md:w-4/5 mx-auto lg:w-full"
                    frameClass="center-frame"
                >
                    <HoursTable hours={hours} />

                    <div className="mt-6">
                        <div className="rounded-lg overflow-hidden ring-1 ring-charcoal/8 shadow-sm">
                            <div
                                className="relative w-full"
                                style={{ paddingTop: "56.25%" }}
                            >
                                <iframe
                                    src={googleMapsEmbedSrc()}
                                    className="absolute inset-0 w-full h-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="VietBites location map"
                                />
                            </div>
                        </div>

                        {/* Buttons — centered ≤lg, left on xl+ */}
                        <div className="mt-2 pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <a
                                href={directionsUrl}
                                className="text-center rounded-lg bg-orange text-clean px-5 py-3 font-semibold shadow transition duration-200 hover:bg-orange-hover active:bg-orange-active active:scale-[.98]"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                Get Directions
                            </a>

                            <a
                                href={googleMapsUrl}
                                className="text-center button-outline px-5 py-3 text-sm md:text-base font-heading font-medium rounded-lg"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                View in Google Maps
                            </a>
                        </div>
                        
                    </div>
                </FrameSection>

                <FrameSection
                    id="contact"
                    title="CONTACT US"
                    className="w-full md:w-4/5 mx-auto lg:w-full"
                    frameClass="center-frame"
                >
                    <div className="max-w-2xl lg:max-w-xl mx-auto">
                        <ContactForm initialReason={initialReason} />
                    </div>
                </FrameSection>
            </section>
        </main>
    );
}
