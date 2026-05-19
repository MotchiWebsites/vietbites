import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname === "/reservation-demo" ||
        pathname.startsWith("/reservation-demo/") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        PUBLIC_FILE.test(pathname)
    ) {
        return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = "/reservation-demo";
    url.search = "";

    // Temporary hosting behavior for this branch.
    return NextResponse.redirect(url, 307);
}

export const config = {
    matcher: ["/:path*"],
};
