import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL
            ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
            : "http://localhost:3000";

    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/menu`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/story`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/visit`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/catering`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        // contact merged into /visit
    ];
}