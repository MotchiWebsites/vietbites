import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
    return (
        <main
            id="not-found"
            className="min-h-[70vh] flex items-center justify-center bg-cream px-4"
        >
            <div className="max-w-md w-full text-center rounded-2xl bg-white border border-charcoal/10 shadow-sm p-8">
                <div className="flex justify-center mb-4">
                    <FiAlertCircle
                        className="h-12 w-12 text-orange"
                        aria-hidden
                    />
                </div>

                <h1 className="text-2xl font-heading font-semibold text-charcoal">
                    Page not found
                </h1>

                <p className="mt-3 text-sm text-charcoal/70">
                    Sorry, the page you&apos;re looking for doesn&apos;t exist or may have
                    been moved.
                </p>

                <div className="mt-6 flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-md bg-orange px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-hover transition ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-orange/30"
                    >
                        Back to home
                    </Link>
                </div>

                <p className="mt-4 text-xs text-charcoal/50">
                    If you believe this is a mistake, please{" "}
                    <Link
                        href="/visit?reason=technical%20issues"
                        className="inline-block text-orange relative group"
                    >
                        <span className="relative z-10">contact us</span>
                        <span className="absolute left-0 -bottom-0.5 h-0.5 w-full bg-orange origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100" />
                    </Link>
                    .
                </p>
            </div>
        </main>
    );
}
