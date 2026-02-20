import "server-only";
import type { Metadata } from "next";
import PartnershipBlock from "@/components/partnerships/PartnershipBlock";
import SectionHeader from "@/components/common/SectionHeader";

export const metadata: Metadata = {
    title: "Partnerships",
    description:
        "Work with VietBites Toronto on wholesale (B2B), catering, and collaborations. Submit an inquiry and we’ll get back to you soon.",
    openGraph: {
        title: "Partnerships | VietBites Toronto",
        description:
            "Wholesale (B2B), catering, and collaborations with VietBites Toronto. Submit an inquiry and we’ll get back to you soon.",
    },
    twitter: {
        title: "Partnerships | VietBites Toronto",
        description:
            "Wholesale (B2B), catering, and collaborations with VietBites Toronto. Submit an inquiry and we’ll get back to you soon.",
    },
};

function contactUrl(reason: string) {
    return `/contact?reason=${encodeURIComponent(reason)}`;
}

export default function PartnershipPage() {
    return (
        <main className="max-w-7xl mx-auto rounded-lg section-cream shadow-sm px-4 md:px-6 lg:px-8 pb-12 pt-6 space-y-10">
            <section className="pt-3 mx-4">
                <SectionHeader
                    title="PARTNERSHIPS"
                    subtitle="Wholesale (B2B), catering, and collaborations. Built for cafés, events, and brands looking for something special."
                />
            </section>

            <hr />

            <section className="space-y-10">
                <PartnershipBlock
                    eyebrow="Wholesale"
                    title="Business Supply (B2B)"
                    body={[
                        "Our wholesale program is built for cafés, restaurants, and retailers who want to offer customers something beyond the usual.",
                        "With VietBites, you’re not just adding a product, you’re bringing in a menu staple inspired by Vietnamese flavors, made with care and consistency.",
                        "Apply below and tell us what you’re looking for. We’ll follow up with pricing, lead times, and next steps.",
                    ]}
                    buttonLabel="Wholesale Application"
                    buttonHref={contactUrl("wholesale")}
                    imageSrc="/images/logos/Logo.png"
                    imageAlt="VietBites wholesale products"
                    imagePlacement="center"
                    imageFit="contain"
                />

                <hr />

                <PartnershipBlock
                    eyebrow="On-site"
                    title="Event Catering"
                    body={[
                        "We can support meetings, parties, and events with a VietBites experience that’s easy for guests and simple for planners.",
                        "Our catering is flexible: share your date, guest count, location, and any dietary needs, and we’ll suggest options that fit.",
                        "Whether it’s a small team gathering or a larger celebration, we’ll help make it smooth and memorable.",
                    ]}
                    buttonLabel="Contact Us"
                    buttonHref={contactUrl("catering")}
                    imageSrc="/images/menu/banh-mi-que.jpeg"
                    imageAlt="VietBites catering food preparation"
                    imagePlacement="center"
                />

                <hr />

                <PartnershipBlock
                    eyebrow="Partnership"
                    title="Collaborations"
                    body={[
                        "We love teaming up with brands, creators, and local businesses for limited items, pop-ups, and custom concepts.",
                        "If you have an idea (a special menu item, a themed collaboration, or a community event) we’ll work with you from concept to execution.",
                        "Send us your goals and timeline, and we’ll reply with a meeting or a plan that makes sense for both sides.",
                    ]}
                    buttonLabel="Contact Us"
                    buttonHref={contactUrl("collaborations")}
                    imageSrc="/images/banners/VerticalArt.jpg"
                    imageAlt="VietBites collaboration art"
                    imagePlacement="top"
                />

                <hr />
            </section>
        </main>
    );
}
