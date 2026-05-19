export default function ContactFormHeader({
    title,
    subtitle,
}: {
    title: string;
    subtitle: string;
}) {
    return (
        <>
            <p className="pb-2 pt-4 px-1 mx-auto text-center text-xs lg:text-sm text-charcoal/70">
                {subtitle}
            </p>

            <div className="flex flex-col xl:flex-row items-start justify-between pb-2">
                <div className="text-sm text-gray-600">
                    Please provide as much detail as you can.
                </div>
                <div className="text-xs text-gray-500">
                    Fields marked with <span className="text-red-600">*</span> are required.
                </div>
            </div>

            {title !== "Contact VietBites" && (
                <h2 className="pt-4 pb-2 px-1 mx-auto text-center text-lg lg:text-xl font-bold text-charcoal">
                    VietBites - {title}
                </h2>
            )}
        </>
    );
}
