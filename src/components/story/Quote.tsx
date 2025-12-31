import Image from "next/image";

export default function Quote() {
    return (
        <section className="mx-auto mt-16 max-w-5xl px-6 md:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-orange/6 via-cream/6 to-green/6 p-8 md:p-12 ring-1 ring-charcoal/10 shadow-lg backdrop-blur-sm">
                {/* decorative corner */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-orange/8 blur-3xl"
                />
                {/* decorative quote mark */}
                <div
                    className="absolute top-6 left-6 h-8 w-8 text-orange/40 hidden lg:block text-7xl font-heading select-none"
                    aria-hidden="true"
                >
                    “
                </div>
                <div
                    className="absolute bottom-6 right-6 h-8 w-8 text-orange/40 hidden lg:block text-7xl font-heading select-none"
                    aria-hidden="true"
                >
                    ”
                </div>

                <blockquote className="text-xl md:text-2xl font-heading font-semibold italic h-full flex items-center justify-center text-orange leading-relaxed md:leading-tight tracking-tight">
                    <span className="lg:hidden">“</span>
                    Just one more bite...
                    <span className="lg:hidden">”</span>
                </blockquote>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <Image
                        src="/images/banners/Banner.png"
                        alt="VietBites logo"
                        className="w-1/4 max-w-48 min-w-32 h-auto shrink-0 rounded-lg shadow-sm object-cover"
                        width={32}
                        height={32}
                    />
                </div>
            </div>
        </section>
    );
}
