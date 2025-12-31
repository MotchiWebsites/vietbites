import "server-only";
import type { Metadata } from "next";

import { getAnnouncements } from "@/lib/notion/announcements";
import { getMenu } from "@/lib/notion/menu";
import { getHours } from "@/lib/notion/hours";

import Hero from "@/components/homepage/Hero/Hero";
import Announcements from "@/components/homepage/Announcements";
import FeaturedMenu from "@/components/homepage/FeaturedMenu/FeaturedMenu";
import LocationSection from "@/components/common/LocationSection";

export const metadata: Metadata = {
    title: "VietBites | Vietnamese Cuisine in Toronto",
    description:
        "Visit VietBites in Downtown Toronto for Vietnamese bánh mì, chè sweet soups, drinks, and desserts inspired by Hải Phòng. See our hours, location, and featured menu.",
    openGraph: {
        title: "VietBites Vietnamese Desserts And Banh Mi In Toronto",
        description:
            "VietBites is a Vietnamese bakery and cafe in Downtown Toronto serving bánh mì, chè sweet soups, specialty drinks, and desserts with roots in Hải Phòng.",
    },
    twitter: {
        title: "VietBites Vietnamese Desserts And Banh Mi In Toronto",
        description:
            "Discover VietBites in Downtown Toronto for Vietnamese bánh mì, chè sweet soups, drinks, and desserts inspired by Hải Phòng street flavors.",
    },
};

export default async function HomePage() {
    // fetch in parallel
    const [annPromise, menuPromise, hoursPromise] = [
        getAnnouncements(),
        getMenu(),
        getHours(),
    ];

    const [announcements, menu, hours] = await Promise.all([
        annPromise,
        menuPromise,
        hoursPromise,
    ]);

    return (
        <>
            <Hero hours={hours} />

            {announcements.length > 0 && <hr />}

            <Announcements announcements={announcements} />

            <hr />

            <FeaturedMenu menu={menu} />

            <hr />

            <LocationSection />
        </>
    );
}
