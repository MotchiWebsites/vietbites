import { FiSettings, FiUser } from "react-icons/fi";

type ViewMode = "customer" | "admin";

export default function ViewToggle({
    view,
    onChange,
}: {
    view: ViewMode;
    onChange: (view: ViewMode) => void;
}) {
    const isAdmin = view === "admin";

    return (
        <div className="mx-auto flex w-full max-w-sm items-center justify-center gap-4 rounded-full border border-charcoal/10 bg-clean px-4 py-3 shadow-sm">
            <button
                type="button"
                onClick={() => onChange("customer")}
                className={
                    "flex items-center gap-2 text-sm font-semibold transition " +
                    (!isAdmin ? "text-orange" : "text-charcoal/50")
                }
            >
                <FiUser size={17} />
                Customer
            </button>

            <button
                type="button"
                role="switch"
                aria-checked={isAdmin}
                aria-label="Toggle between customer and admin view"
                onClick={() => onChange(isAdmin ? "customer" : "admin")}
                className="relative h-7 w-12 rounded-full! bg-transparent! p-0! shadow-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/40 hover:bg-transparent!"
            >
                <span
                    aria-hidden="true"
                    className={
                        "absolute inset-0 rounded-full transition-colors duration-300 bg-charcoal"
                    }
                />
                <span
                    aria-hidden="true"
                    className={
                        "absolute left-0.5 top-0.5 h-6 w-6 transform-gpu rounded-full bg-white shadow-sm transition-transform duration-300 ease-out will-change-transform " +
                        (isAdmin ? "translate-x-5" : "translate-x-0")
                    }
                />
            </button>

            <button
                type="button"
                onClick={() => onChange("admin")}
                className={
                    "flex items-center gap-2 text-sm font-semibold transition " +
                    (isAdmin ? "text-orange" : "text-charcoal/50")
                }
            >
                Admin
                <FiSettings size={17} />
            </button>
        </div>
    );
}
