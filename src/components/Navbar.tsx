"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Twirl as Hamburger } from "hamburger-react";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/story", label: "Our Story" },
    { href: "/visit", label: "Visit Us" },
    { href: "/menu", label: "Menu" },
    { href: "/catering", label: "Catering" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header
            id="navbar"
            className="sticky top-0 z-90 bg-clean/95 backdrop-blur supports-backdrop-filter:bg-clean/80 border-b border-charcoal/10 shadow-sm"
        >
            <div className="h-1 bg-orange/80"></div>

            <nav className="mx-auto max-w-360 px-4 py-3 flex items-center justify-between">
                {/* Left: Logo */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange rounded-md transition-transform ease-in-out duration-300 hover:scale-105 active:scale-100"
                    onClick={() => setOpen(false)}
                >
                    <Image
                        src="/images/banners/BannerNoBg.png"
                        alt="VietBites"
                        width={500}
                        height={200}
                        className="rounded-md h-12 w-auto"
                        priority
                    />
                </Link>

                {/* Desktop nav */}
                <ul className="hidden lg:flex items-center gap-6 font-medium font-heading">
                    {navLinks.map((l) => {
                        const active = pathname === l.href;
                        return (
                            <li key={l.href}>
                                <Link
                                    href={l.href}
                                    className={`relative transition-colors ${
                                        active
                                            ? "text-orange font-bold"
                                            : "text-charcoal/90 hover:text-orange"
                                    } before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-0 before:bg-orange before:transition-all before:duration-300 hover:before:w-full`}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        );
                    })}
                    <li>
                        <a
                            href="https://vietbites.pikapoint.io/"
                            target="_blank"
                            className="inline-flex items-center rounded-full bg-orange text-clean px-4 py-2 text-sm font-semibold shadow transition duration-200 hover:bg-orange-hover active:bg-orange-active active:scale-[.98]"
                        >
                            Order Now
                        </a>
                    </li>
                </ul>

                {/* Mobile hamburger */}
                <div className="relative z-120 lg:hidden">
                    <Hamburger
                        toggled={open}
                        toggle={setOpen}
                        rounded
                        size={22}
                        color="var(--charcoal)"
                    />
                </div>
            </nav>

            {/* Mobile drawer */}
            <nav
                className={`lg:hidden bg-clean border-t border-charcoal/10 transition-[max-height,opacity] duration-200 overflow-hidden ${
                    open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="mx-3 my-3 rounded-xl bg-clean shadow-sm">
                    <ul
                        className="px-2 py-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        {navLinks.map((l) => {
                            const active = pathname === l.href;
                            return (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center justify-between rounded-lg px-3 py-3 active:scale-[.98] transition ${
                                            active
                                                ? "bg-orange/10 text-orange font-semibold"
                                                : "text-charcoal/95"
                                        }`}
                                    >
                                        <span>{l.label}</span>
                                        {/* Right arrow icon for navigation */}
                                        <span className="ml-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="h-4 w-4 opacity-70"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}

                        <li className="pt-1">
                            <a
                                href="https://vietbites.pikapoint.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block max-w-sm mx-auto text-center rounded-full bg-orange text-clean px-4 py-2 font-semibold shadow hover:bg-clay transition-colors active:scale-[.98]"
                            >
                                Order Now
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Mobile sticky CTA (Order Now) */}
            <div
                className={`lg:hidden fixed inset-x-0 bottom-4 z-40 flex justify-end right-20 ${open ? "hidden" : ""}`}
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                <a
                    href="https://vietbites.pikapoint.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-4 w-1/2 max-w-50 rounded-full bg-orange text-clean px-5 py-2.5 text-center text-sm font-semibold shadow-lg transition-transform duration-150 hover:bg-orange-hover active:scale-[.98] sm:px-6 sm:py-3 sm:text-base"
                >
                    Order Now
                </a>
            </div>
        </header>
    );
}
