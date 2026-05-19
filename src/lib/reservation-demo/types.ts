export type SeatingPreference =
    | "Indoor"
    | "Patio"
    | "Bar seating"
    | "No preference";

export type ReservationSearch = {
    date: string;
    time: string;
    guests: string;
    seating: SeatingPreference | "";
};

export type TimeSlot = {
    time: string;
    label: string;
    status: string;
    seating: SeatingPreference;
    available: boolean;
    tablesLeft?: number;
};

export type ReservationStatus =
    | "Confirmed"
    | "Arrived"
    | "Seated"
    | "Completed"
    | "No-show"
    | "Cancelled";

export type AdminReservation = {
    id: string;
    time: string;
    name: string;
    guests: number;
    table: string;
    status: ReservationStatus;
    notes?: string;
};
