"use client";

import { useState } from "react";
import { FiCheckCircle, FiChevronDown } from "react-icons/fi";
import { LuArmchair } from "react-icons/lu";
import { adminReservations } from "@/lib/reservation-demo/mockData";
import DemoSelect from "./DemoSelect";
import SmoothDropdownSection from "./SmoothDropdownSection";
import type { ReservationStatus } from "@/lib/reservation-demo/types";

const stats = [
    { label: "Today's reservations", value: "28" },
    { label: "Currently seated", value: "42" },
    { label: "Walk-ins", value: "9" },
    { label: "No-shows", value: "2" },
];

const statusOptions: ReservationStatus[] = [
    "Confirmed",
    "Arrived",
    "Seated",
    "Completed",
    "No-show",
    "Cancelled",
];

const floorTables = [
    { id: "T1", seats: 2, status: "Available" },
    { id: "T2", seats: 2, status: "Seated" },
    { id: "T3", seats: 4, status: "Available" },
    { id: "T4", seats: 2, status: "Reserved" },
    { id: "T5", seats: 4, status: "Available" },
    { id: "T6", seats: 6, status: "Reserved" },
    { id: "T7", seats: 4, status: "Arrived" },
    { id: "BAR", seats: 6, status: "Open" },
];

const assignableTables = ["Pending", ...floorTables.map((table) => table.id)];

function statusClass(status: string) {
    if (status === "Seated") return "bg-sky-50 text-sky-700 border-sky-200";
    if (status === "Arrived")
        return "bg-amber-50 text-amber-700 border-amber-200";
    if (status === "No-show" || status === "Cancelled")
        return "bg-rose-50 text-rose-700 border-rose-200";
    if (status === "Completed")
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-stone-50 text-stone-700 border-stone-200";
}

function getChairCount(seats: number) {
    return Math.max(1, Math.ceil(seats / 2));
}

export default function AdminDashboardMockup() {
    const [showWalkIn, setShowWalkIn] = useState(false);
    const [walkInAdded, setWalkInAdded] = useState(false);

    const [reservations, setReservations] = useState(
        adminReservations.map((r) => ({ ...r })),
    );

    function updateStatus(id: string, status: ReservationStatus) {
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status } : r)),
        );
    }

    function updateTable(id: string, table: string) {
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, table } : r)),
        );
    }

    return (
        <section
            id="res-demo"
            className="rounded-3xl border border-charcoal/10 bg-charcoal p-5 text-clean shadow-sm md:p-8"
        >
            <div className="mb-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-orange">
                    ADMIN VIEW
                </p>
                <h2 className="mt-2 font-heading text-2xl text-clean! font-bold md:text-3xl">
                    Reservation management dashboard
                </h2>
                <p className="mt-2 text-sm text-clean/70">
                    Staff can manage bookings, mark arrivals, assign tables, and
                    view notes.
                </p>

                <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 px-4 py-3">
                    <p className="text-sm text-yellow-100">
                        Demo only! This dashboard is a static mockup meant to
                        demonstrate workflows and UI concepts. It does not sync
                        live reservations or update in real time.
                    </p>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-clean/10 bg-clean/10 p-4"
                    >
                        <p className="text-sm text-clean/60">{stat.label}</p>
                        <p className="mt-2 font-heading text-3xl font-bold">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Workflow */}
            <div className="mt-6 rounded-2xl border border-clean/10 bg-clean/5 p-5">
                <p className="font-heading text-lg font-bold">
                    Reservation workflow
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    {["Confirmed", "Arrived", "Seated", "Completed"].map(
                        (step, i) => (
                            <div key={step} className="flex items-center gap-3">
                                <span className="rounded-full bg-clean/10 px-4 py-2 font-semibold text-clean">
                                    {step}
                                </span>
                                {i < 3 && (
                                    <span className="text-clean/40">→</span>
                                )}
                            </div>
                        ),
                    )}
                    <span className="text-clean/40">or</span>
                    <span className="rounded-full bg-red-500/10 px-4 py-2 font-semibold text-red-200">
                        No-show
                    </span>
                </div>
            </div>

            {/* Floor Plan */}
            <SmoothDropdownSection
                defaultOpen
                title="Simple floor plan"
                description="Static table layout showing table status and capacity."
                className="mt-6 rounded-2xl border border-clean/10 bg-clean/5 p-5"
            >
                <div className="grid gap-3 rounded-2xl bg-clean p-4 text-charcoal sm:grid-cols-2 lg:grid-cols-4">
                    <p className="col-span-full text-sm text-charcoal/80 font-medium">
                        Note: In a full implementation, this floor plan would
                        show the actual restaurant layout and be interactive,
                        showing real-time status updates, allowing staff to
                        click tables for details, and integrating with the
                        reservation system to reflect current bookings and
                        walk-ins.
                    </p>
                    {floorTables.map((table) => (
                        <div
                            key={table.id}
                            className="rounded-2xl border border-charcoal/10 bg-cream p-4 text-center shadow-sm"
                        >
                            <div className="grid grid-cols-[auto_auto_auto] items-center justify-center gap-2 text-charcoal/45">
                                <div className="flex items-center gap-1">
                                    {Array.from({
                                        length: getChairCount(table.seats),
                                    }).map((_, chairIndex) => (
                                        <LuArmchair
                                            key={`${table.id}-left-${chairIndex}`}
                                            className="h-4 w-4 -scale-x-100 transform"
                                        />
                                    ))}
                                </div>
                                <p className="font-heading text-2xl font-bold text-charcoal">
                                    {table.id}
                                </p>
                                <div className="flex items-center gap-1">
                                    {Array.from({
                                        length: getChairCount(table.seats),
                                    }).map((_, chairIndex) => (
                                        <LuArmchair
                                            key={`${table.id}-right-${chairIndex}`}
                                            className="h-4 w-4"
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                                {table.seats} seats
                            </p>
                            <span
                                className={
                                    "mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium " +
                                    statusClass(table.status)
                                }
                            >
                                {table.status}
                            </span>
                        </div>
                    ))}
                </div>
            </SmoothDropdownSection>

            {/* Reservations */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-clean/10 bg-clean text-charcoal">
                <div className="flex flex-col gap-3 border-b border-charcoal/10 bg-cream px-4 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="font-heading text-lg font-bold">
                            Upcoming Reservations
                        </p>
                        <p className="text-sm text-charcoal/60">
                            Today’s upcoming confirmed, arrived, and seated
                            guests.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setShowWalkIn((v) => !v);
                            setWalkInAdded(false);
                        }}
                        className="rounded-xl bg-orange px-4 py-2 text-sm font-bold text-clean"
                    >
                        {showWalkIn ? "Close walk-in" : "Add walk-in"}
                    </button>
                </div>

                {showWalkIn &&
                    (walkInAdded ? (
                        <div className="border-b border-charcoal/10 bg-clean px-4 py-4">
                            <div className="flex items-center gap-4 rounded-2xl bg-green-50 p-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                                    <FiCheckCircle
                                        className="text-green-700"
                                        size={28}
                                    />
                                </div>
                                <div>
                                    <p className="font-heading text-sm font-bold text-green-700">
                                        Walk-in seated
                                    </p>
                                    <p className="text-sm text-charcoal/70">
                                        The walk-in has been added and marked as
                                        seated. Assigned table updated.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="border-b border-charcoal/10 bg-clean px-4 py-4">
                            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/65">
                                        Guest name
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="Enter name"
                                        className="mt-1 w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3 text-sm shadow-sm placeholder:font-semibold placeholder:text-charcoal/45 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                                    />
                                </div>

                                <DemoSelect
                                    label="Guests"
                                    value=""
                                    onChange={() => {}}
                                >
                                    <option value="">Number of guests</option>
                                    <option value="1">1 guest</option>
                                    <option value="2">2 guests</option>
                                    <option value="4">4 guests</option>
                                    <option value="6">6 guests</option>
                                </DemoSelect>

                                <DemoSelect
                                    label="Table"
                                    value=""
                                    onChange={() => {}}
                                >
                                    <option value="">Assign table</option>
                                    <option value="T1">T1</option>
                                    <option value="T2">T2</option>
                                    <option value="T4">T4</option>
                                    <option value="T7">T7</option>
                                </DemoSelect>

                                <button
                                    type="button"
                                    onClick={() => setWalkInAdded(true)}
                                    className="rounded-xl bg-charcoal px-5 py-3 text-sm font-bold text-clean md:self-end"
                                >
                                    Seat walk-in
                                </button>
                            </div>
                        </div>
                    ))}

                {/* Desktop table */}
                <div className="hidden grid-cols-5 bg-charcoal px-4 py-3 text-xs font-bold uppercase tracking-wide text-clean md:grid">
                    <span>Time</span>
                    <span>Name</span>
                    <span>Guests</span>
                    <span>Status</span>
                    <span>Table</span>
                </div>

                <div className="hidden md:block">
                    {reservations.map((res) => (
                        <div
                            key={res.id}
                            className="grid grid-cols-5 items-center border-t border-charcoal/10 px-4 py-4 text-sm"
                        >
                            <span className="font-semibold">{res.time}</span>
                            <span>{res.name}</span>
                            <span>{res.guests}</span>
                            <span>
                                <select
                                    value={res.status}
                                    onChange={(e) =>
                                        updateStatus(
                                            res.id,
                                            e.target.value as ReservationStatus,
                                        )
                                    }
                                    className={
                                        "rounded-full border px-3 py-2 text-xs font-medium outline-none transition-colors text-center [text-align-last:center] " +
                                        statusClass(res.status)
                                    }
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status}>{status}</option>
                                    ))}
                                </select>
                            </span>
                            <div className="relative inline-block w-full sm:w-36">
                                <select
                                    value={res.table}
                                    onChange={(e) =>
                                        updateTable(res.id, e.target.value)
                                    }
                                    className="w-full appearance-none rounded-full font-semibold border border-charcoal/10 bg-white px-3 py-2 pr-9 text-center text-sm text-charcoal/70 shadow-sm outline-none transition-colors [text-align-last:center] focus:border-orange focus:ring-2 focus:ring-orange/20"
                                >
                                    {assignableTables.map((table) => (
                                        <option key={table} value={table}>
                                            {table}
                                        </option>
                                    ))}
                                </select>
                                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/35" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile cards */}
                <div className="space-y-3 p-4 md:hidden">
                    {reservations.map((res) => (
                        <div
                            key={res.id}
                            className="rounded-2xl border border-charcoal/10 bg-cream p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-heading text-lg font-bold">
                                        {res.name}
                                    </p>
                                    <p className="text-sm text-charcoal/60">
                                        {res.time} · {res.guests} guests
                                    </p>
                                </div>
                                <div className="relative w-28 shrink-0">
                                    <select
                                        value={res.table}
                                        onChange={(e) =>
                                            updateTable(res.id, e.target.value)
                                        }
                                        className="w-full font-semibold appearance-none rounded-full border border-charcoal/10 bg-white px-3 py-2 pr-8 text-center text-sm text-charcoal/70 shadow-sm outline-none transition-colors [text-align-last:center] focus:border-orange focus:ring-2 focus:ring-orange/20"
                                    >
                                        {assignableTables.map((table) => (
                                            <option key={table} value={table}>
                                                {table}
                                            </option>
                                        ))}
                                    </select>
                                    <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/35" />
                                </div>
                            </div>

                            {res.notes && (
                                <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm text-charcoal/70">
                                    {res.notes}
                                </p>
                            )}

                            <label className="mt-4 block space-y-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
                                    Update status
                                </span>
                                <select
                                    value={res.status}
                                    onChange={(e) =>
                                        updateStatus(
                                            res.id,
                                            e.target.value as ReservationStatus,
                                        )
                                    }
                                    className={
                                        "w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-colors text-center [text-align-last:center] " +
                                        statusClass(res.status)
                                    }
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status}>{status}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
