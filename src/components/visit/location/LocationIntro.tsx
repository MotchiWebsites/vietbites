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
            <hr className="my-4" />
        </>
    );
}