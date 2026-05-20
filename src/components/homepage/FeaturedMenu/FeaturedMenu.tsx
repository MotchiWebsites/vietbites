import Link from "next/link";
import { getMenu } from "@/lib/notion/menu";
import MenuCard from "./MenuCard";

function pickFeatured(
    items: Awaited<ReturnType<typeof getMenu>>,
    count: number,
) {
    const highlight = items.filter(
        (i) => i.notes?.toUpperCase() === "HIGHLIGHT",
    );
    const fresh = items.filter((i) => i.notes?.toUpperCase() === "NEW");
    const rest = items.filter(
        (i) =>
            i.notes?.toUpperCase() !== "HIGHLIGHT" &&
            i.notes?.toUpperCase() !== "NEW",
    );
    return [...highlight, ...fresh, ...rest].slice(0, count);
}

export default function FeaturedMenu({
    menu,
}: {
    menu: Awaited<ReturnType<typeof getMenu>>;
}) {
    const featured = pickFeatured(menu, 4);

    return (
        <section id="menu" className="mt-10 mx-10">
            <div className="flex flex-col md:flex-row items-center sm:items-start justify-between gap-3">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                    <h2 className="text-2xl font-bold font-heading">
                        Customer Favourites
                    </h2>
                    <p className="text-sm text-charcoal/70 w-full md:max-w-3/4 lg:w-full lg:max-w-full">
                        A selection of our most popular dishes. To view more
                        details about these items, check out the full menu.
                    </p>
                </div>

                <div className="flex gap-3 flex-col lg:flex-row justify-center min-w-36">
                    <Link
                        href="/menu"
                        className="text-center rounded-lg bg-orange text-white px-5 py-2 text-sm font-semibold shadow hover:bg-orange-hover transition-colors focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
                    >
                        Full Menu
                    </Link>
                    <a
                        href="https://vietbites.pikapoint.io/"
                        target="_blank"
                        className="text-center rounded-lg bg-charcoal text-white px-5 py-2 text-sm font-semibold shadow hover:bg-charcoal/95 transition-colors focus:outline-none focus:ring-2 focus:ring-charcoal focus:ring-offset-2"
                    >
                        Order Now
                    </a>
                </div>
            </div>

            {featured.length ? (
                <ul className="mt-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-0">
                    {featured.map((item) => (
                        <li key={item.id}>
                            <MenuCard
                                id={item.id}
                                name={item.name}
                                vietName={item.vietName}
                                description={item.description}
                                price={item.price}
                                photo={item.photo}
                                note={item.notes}
                                tags={item.tags}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-charcoal/70 mt-3">
                    Menu is being prepared—please check back soon.
                </p>
            )}
        </section>
    );
}
