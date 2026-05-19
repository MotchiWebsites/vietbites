import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        localPatterns: [{ pathname: "/api/notion-file", search: "*" }],
        unoptimized: true,
    },
    async redirects() {
        return [
            {
                // Temporary hosting behavior: send all page routes to reservation demo.
                source: "/:path((?!reservation-demo|_next|api|.*\\..*).*)",
                destination: "/reservation-demo",
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
