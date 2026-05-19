import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        localPatterns: [
            { pathname: '/api/notion-file', search: '*' },
        ],
        unoptimized: true,
    },
    async redirects() {
        return [
            {
                source: "/contact",
                destination: "/visit",
                permanent: true,
            },
            {
                source: "/location",
                destination: "/visit",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
