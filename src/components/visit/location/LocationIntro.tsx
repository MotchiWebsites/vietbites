"use client";

import OpenToday from "@/components/homepage/Hero/OpenToday";
import type { OpeningHour } from "@/lib/notion/hours";
import SectionHeader from "../../common/SectionHeader";
import QRCode from "../../common/QRCode/QRCode";
import Image from "next/image";

import { FaPhone, FaLocationDot } from "react-icons/fa6";

function sanitizePhoneForHref(phone: string) {
    return phone.replace(/[^\d+]/g, "");
}

const address = process.env.NEXT_PUBLIC_VIETBITES_LOCATION || "246 Gerrard St E, Toronto, ON M5A 2G2";
const rawPhone = process.env.NEXT_PUBLIC_VIETBITES_PHONE || "(437) 607-8296";
const phoneHref = rawPhone ? `tel:${sanitizePhoneForHref(rawPhone)}` : "";

const displayAddress = address?.replace(
    /([A-Z]\d[A-Z])\s+(\d[A-Z]\d)$/i,
    "$1\u00A0$2",
);

function toMinutes(t: string) {
    const [hh, mm = "0"] = t.split(":").map((s) => s.trim());
    return Number(hh) * 60 + Number(mm);
}

function getToday(hours: OpeningHour[]) {
    const now = new Date();
    const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];

    const todayName = dayNames[now.getDay()];

    if (Array.isArray(hours)) {
        const found = hours.find(
            (h: OpeningHour) =>
                (h.day || "").toString().toLowerCase() === todayName,
        );
        if (found) return found;

        // If the hours array is sorted Monday..Sunday (Sort: 1..7), map
        // JS getDay() (0=Sun..6=Sat) to array index where Monday=0.
        const idx = (now.getDay() + 6) % 7; // 0->6 (Sun->6), 1->0 (Mon->0)
        return hours[idx];
    }

    if (hours && typeof hours === "object") {
        const mapped = (hours as any)[todayName];
        if (mapped) return mapped;
        const idx = (now.getDay() + 6) % 7;
        return (hours as any)[idx] ?? null;
    }

    return null;
}
function normalizeIntervals(
    today: OpeningHour | OpeningHour[] | null,
): { start: string; end: string } | null {
    if (!today) return null;

    if (Array.isArray(today)) {
        today = today[0];
        if (!today) return null;
    }

    if (today.closed) return null;

    if (today.open && today.close) {
        return {
            start: today.open,
            end: today.close,
        };
    }

    return null;
}

function statusMessage(hours: OpeningHour[]) {
    const now = new Date();
    const nowM = now.getHours() * 60 + now.getMinutes();
    const today = getToday(hours);
    const interval = today ? normalizeIntervals(today as OpeningHour) : null;

    if (!interval) {
        return "Unfortunately, we're closed :( Check our hours below!";
    }

    const openNow = (() => {
        try {
            return (
                nowM >= toMinutes(interval!.start) &&
                nowM < toMinutes(interval!.end)
            );
        } catch {
            return false;
        }
    })();

    if (openNow) {
        const minsLeft = toMinutes(interval.end) - nowM;
        return minsLeft <= 60
            ? "We're closing soon, come by quickly!"
            : "We're open right now, come visit us!";
    }

    if (nowM < toMinutes(interval.start)) {
        const startM = toMinutes(interval.start);
        const endM = toMinutes(interval.end);
        const format12 = (mins: number) => {
            const hh = Math.floor(mins / 60);
            const mm = mins % 60;
            const period = hh >= 12 ? "PM" : "AM";
            const hour12 = ((hh + 11) % 12) + 1; // convert 0->12, 13->1, etc.
            const pad = (n: number) => n.toString().padStart(2, "0");
            return `${hour12}:${pad(mm)} ${period}`;
        };
        return `We open later today at ${format12(startM)} until ${format12(
            endM,
        )}.`;
    }

    return "We're closed :( Check our hours below and visit another day.";
}

export default function LocationIntro({ hours }: { hours: OpeningHour[] }) {
    const scrollToWithOffset = (el: Element | null, offset = 100) => {
        if (!el || typeof window === "undefined") return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const top = (el as HTMLElement).getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    };

    return (
        <>
            <SectionHeader
                title="VISIT US"
                subtitle={
                    <>
                        We&apos;re located in Downtown Toronto! Come by for bánh
                        mì, drinks, and desserts. See today&apos;s hours and
                        directions below.
                    </>
                }
            />
            <div
                id="visit"
                className="rounded-xl bg-clean p-6 shadow-sm ring-1 ring-charcoal/10 max-w-lg xl:max-w-md mx-auto mt-6 space-y-4"
            >
                <div className="flex items-center gap-3">
                    <Image
                        src="/images/logos/LogoCircle.png"
                        alt="VietBites mark"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full"
                    />
                    <div>
                        <p className="font-heading font-bold text-lg tracking-wide text-orange">
                            VIETBITES
                        </p>
                        <p className="text-xs text-charcoal/70">
                            Desserts, Bánh Mì &amp; More
                        </p>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div
                        role="status"
                        aria-live="polite"
                        className="inline-flex items-center gap-3 w-full md:w-auto justify-center bg-linear-to-r from-orange/10 to-amber-50 border-2 border-orange/30 text-orange rounded-xl px-4 py-3 shadow-lg ring-1 ring-orange/20"
                    >
                        <span
                            className="shrink-0 h-3 w-3 rounded-full bg-orange shadow-md animate-pulse"
                            aria-hidden="true"
                        />
                        <div className="text-center">
                            <div className="text-base md:text-lg font-heading font-semibold leading-tight">
                                <OpenToday hours={hours} showLink={false} />
                            </div>
                            <div className="text-xs text-charcoal/70 mt-0.5">
                                {statusMessage(hours)}
                            </div>
                        </div>
                        <span
                            className="shrink-0 h-3 w-3 rounded-full bg-orange shadow-md animate-pulse"
                            aria-hidden="true"
                        />
                    </div>
                </div>


                <div className="w-full max-w-[520px] mx-auto mt-4 flex flex-col items-start gap-2 px-4 text-charcoal/80 font-medium">
                    {address && (
                        <p className="inline-flex items-center gap-2 text-xs md:text-sm text-center">
                            <FaLocationDot
                                className="h-4 w-4 text-orange shrink-0"
                                aria-hidden="true"
                            />
                            <span>{displayAddress}</span>
                        </p>
                    )}

                    {rawPhone && (
                        <p className="inline-flex items-center gap-2 text-xs md:text-sm">
                            <FaPhone
                                className="h-4 w-4 text-orange shrink-0"
                                aria-hidden="true"
                            />
                            <a
                                href={phoneHref}
                                className="text-charcoal/80 hover:underline"
                                aria-label={`Call ${rawPhone}`}
                            >
                                {rawPhone}
                            </a>
                        </p>
                    )}
                </div>

                <div className="mt-3 flex gap-3 justify-center">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md bg-orange px-3 py-2 text-sm font-semibold text-clean shadow hover:bg-orange-hover active:bg-orange-active"
                        onClick={() => scrollToWithOffset(document.getElementById("hours"), 100)}
                        aria-controls="hours"
                    >
                        View hours
                    </button>

                    <button
                        type="button"
                        className="button-outline inline-flex items-center justify-center rounded-md bg-clean border border-charcoal/10 px-3 py-2 text-sm font-semibold text-charcoal shadow hover:bg-gray-50 active:bg-gray-100"
                        onClick={() => scrollToWithOffset(document.getElementById("contact"), 100)}
                        aria-controls="contact"
                    >
                        Contact us
                    </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                    <p className="text-sm text-charcoal/80 sm:max-w-3/4 mb-2 sm:mb-0 text-center sm:text-left">
                        Follow us on Instagram for new specials and
                        behind-the-scenes.
                    </p>
                    <a
                        href="https://www.instagram.com/vietbites.to"
                        className="mx-auto inline-flex w-full max-w-[250px] items-center justify-center rounded-md bg-orange px-4 py-2 text-sm font-semibold text-clean shadow hover:bg-orange-hover active:bg-orange-active sm:w-auto sm:max-w-none sm:mx-0"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        @vietbites.to
                    </a>
                </div>

                {/* Instagram QR code */}
                <QRCode />
            </div>

            <hr className="my-4" />
        </>
    );
}