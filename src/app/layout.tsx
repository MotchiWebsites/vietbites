import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Be_Vietnam_Pro, Source_Sans_3 } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-be-vietnam",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "VietBites Toronto | Vietnamese Desserts And Banh Mi",
    template: "%s | VietBites Toronto",
  },
  description:
    "VietBites is a Vietnamese restuarant/cafe in Downtown Toronto serving bánh mì, chè sweet soups, drinks, and desserts inspired by Vietnamese culture from Hải Phòng.",
  openGraph: {
    siteName: "VietBites",
    type: "website",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "192x192" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
        <body
            className={`${beVietnam.variable} ${sourceSans.variable} antialiased`}
        >
            <Navbar />
            <main>{children}</main>
            <Footer />

            <Script id="ld-json-localbusiness" type="application/ld+json">
            {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Restaurant",
                name: "VietBites",
                image: `${defaultUrl}/opengraph-image.png`,
                url: defaultUrl,
                telephone:
                    process.env.NEXT_PUBLIC_VIETBITES_PHONE || "(437) 607-8296",
                address: {
                    "@type": "PostalAddress",
                    streetAddress:
                        process.env.NEXT_PUBLIC_VIETBITES_LOCATION ||
                        "246 Gerrard St E, Toronto, ON M5A 2G2",
                    addressLocality: "Toronto",
                    addressRegion: "ON",
                    postalCode: "M5A",
                    addressCountry: "CA",
                },
                servesCuisine: ["Vietnamese"],
                priceRange: "$",
            })}
            </Script>
        </body>
    </html>
  );
}
