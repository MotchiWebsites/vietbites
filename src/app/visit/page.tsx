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
