import "server-only";
import type { Metadata } from "next";
import { Suspense } from "react";

import Intro from "@/components/contact/Intro";
import ContactForm from "@/components/contact/ContactForm";
import SectionHeader from "@/components/common/SectionHeader";
import Platforms from "@/components/common/Platforms";

import { getPlatforms } from "@/lib/notion/platforms";
import type { Platform } from "@/lib/notion/platforms";

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Contact VietBites in Toronto with questions about our menu, catering, collaborations, or feedback. Reach us by form or social media platforms.",
    openGraph: {
        title: "Contact VietBites In Toronto",
        description:
            "Get in touch with VietBites in Downtown Toronto. Use the contact form or connect through Instagram, Facebook, TikTok, or delivery partners.",
    },
    twitter: {
        title: "Contact VietBites In Toronto",
        description:
            "Contact VietBites for questions, feedback, or catering inquiries. Use the contact form or reach us on social platforms and delivery apps.",
    },
};

type SearchParams = { [key: string]: string | string[] | undefined };

type PageProps = {
    searchParams?: Promise<SearchParams>;
};

export default async function ContactPage({ searchParams }: PageProps) {
    const sp = (await searchParams) ?? {};

    const reasonParam = sp.reason;
    const initialReason =
        typeof reasonParam === "string"
            ? reasonParam
            : (reasonParam?.[0] ?? "");

    const allPlatforms: Platform[] = await getPlatforms();
    const platforms = allPlatforms.filter(
        (p) =>
            p.name === "Instagram" ||
            p.name === "Facebook" ||
            p.name === "TikTok" ||
            p.name === "Location" ||
            p.name === "DoorDash" ||
            p.name === "UberEats" ||
            p.name === "PikaPoint",
    );

    return (
        <main className="mx-auto w-full max-w-7xl bg-cream">
            <section className="mx-auto w-full px-4 md:px-6 lg:px-8 pb-10 pt-4 rounded-lg section-cream">
                <SectionHeader
                    className="max-w-4xl mx-auto"
                    title="CONTACT US"
                    subtitle="The VietBites team is here to help you with any questions or concerns!"
                >
                    <Platforms
                        items={platforms}
                        variant="full"
                        align="center"
                    />
                </SectionHeader>

                <div className="mt-8 grid grid-cols-1 gap-6">
                    <Intro />
                    <div className="max-w-5xl mx-auto w-full">
                        <Suspense fallback={<div>Loading form...</div>}>
                            <ContactForm
                                key={initialReason}
                                initialReason={initialReason}
                            />
                        </Suspense>
                    </div>
                </div>
            </section>
        </main>
    );
}
