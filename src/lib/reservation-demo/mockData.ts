import type { AdminReservation, TimeSlot } from "./types";

export const timeOptions = [
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
];

export const guestOptions = ["2 guests", "4 guests", "6 guests", "8 guests"];

export const seatingOptions = [
    "Indoor",
    "Patio",
    "Bar seating",
    "No preference",
] as const;

export const mockSlots: TimeSlot[] = [
    {
        time: "6:30 PM",
        label: "Early dinner",
        status: "Available",
        seating: "Indoor",
        available: true,
        tablesLeft: 4,
    },
    {
        time: "7:00 PM",
        label: "Popular",
        status: "2 tables left",
        seating: "Indoor",
        available: true,
        tablesLeft: 2,
    },
    {
        time: "7:30 PM",
        label: "Best match",
        status: "Available",
        seating: "Indoor",
        available: true,
        tablesLeft: 3,
    },
    {
        time: "8:00 PM",
        label: "Limited",
        status: "1 table left",
        seating: "Patio",
        available: true,
        tablesLeft: 1,
    },
    {
        time: "8:30 PM",
        label: "Bar option",
        status: "Available",
        seating: "Bar seating",
        available: true,
        tablesLeft: 2,
    },
];

export const adminReservations: AdminReservation[] = [
    {
        id: "VB-1024",
        time: "6:30 PM",
        name: "Emily Chen",
        guests: 2,
        table: "T4",
        status: "Confirmed",
        notes: "Birthday dinner",
    },
    {
        id: "VB-1025",
        time: "7:00 PM",
        name: "Daniel Nguyen",
        guests: 4,
        table: "T7",
        status: "Arrived",
        notes: "High chair requested",
    },
    {
        id: "VB-1026",
        time: "7:30 PM",
        name: "Sophia Tran",
        guests: 2,
        table: "T2",
        status: "Seated",
        notes: "Window seating if possible",
    },
    {
        id: "VB-1027",
        time: "8:00 PM",
        name: "Marcus Lee",
        guests: 6,
        table: "Pending",
        status: "Confirmed",
        notes: "Large group",
    },
];
