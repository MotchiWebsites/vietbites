import React from "react";

export default function ContactFormFooter({
    loading,
    requiredDisabled,
    result,
}: {
    loading: boolean;
    requiredDisabled: boolean;
    result: {
        type: "success" | "error";
        message: string;
        refId?: string;
    } | null;
}) {
    return (
        <>
            {result && (
                <div
                    className={[
                        "flex flex-col items-center text-sm text-center rounded-lg border p-4 gap-2",
                        result.type === "success"
                            ? "border-green-300 bg-green-50 text-green-900 shadow-sm"
                            : "border-red-200 bg-red-50 text-red-700",
                    ].join(" ")}
                    role={result.type === "error" ? "alert" : "status"}
                    aria-live={result.type === "error" ? "assertive" : "polite"}
                >
                    <p className="font-semibold">
                        {result.type === "success"
                            ? "Message received"
                            : "Could not send..."}
                    </p>

                    <p className="mt-1 text-charcoal/80">{result.message}</p>

                    {result.type === "success" && result.refId && (
                        <p className="mt-2 text-xs text-charcoal/60 font-medium">
                            Reference ID:{" "}
                            <span className="font-mono">{result.refId}</span>
                        </p>
                    )}

                    {result.type === "success" && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-charcoal/60">
                            <img
                                src="/images/logos/LogoCircle.png"
                                alt="VietBites"
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                            <span className="font-semibold">
                                VietBites Team
                            </span>
                        </div>
                    )}
                </div>
            )}
            <div className="flex flex-col items-center pt-2">
                <button
                    type="submit"
                    disabled={requiredDisabled}
                    className="inline-flex items-center justify-center rounded-md bg-orange px-5 py-2 text-white font-semibold shadow-sm"
                >
                    {loading ? "Submitting…" : "Submit Request"}
                </button>
            </div>
        </>
    );
}
