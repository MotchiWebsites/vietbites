"use client";

import {
    ReactNode,
    useId,
    cloneElement,
    isValidElement,
    ReactElement,
} from "react";
import Hint from "@/components/contact/ui/Hint";

function isDomElement(el: ReactElement) {
    return typeof el.type === "string"; // "input", "textarea", etc.
}

export default function FormField({
    id,
    label,
    required,
    hint,
    children,
    className,
}: {
    id?: string;
    label: ReactNode;
    required?: boolean;
    hint?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    const autoId = useId();
    const controlId = id || autoId;

    return (
        <div
            className={
                "flex flex-col gap-2" + (className ? ` ${className}` : "")
            }
        >
            <div className="flex items-center gap-2">
                <label
                    htmlFor={controlId}
                    className="font-semibold text-sm mx-1 text-gray-800"
                >
                    {label}{" "}
                    {required ? (
                        <span className="text-red-600">*</span>
                    ) : (
                        <span className="sr-only">(optional)</span>
                    )}
                </label>
                {hint ? <Hint>{hint}</Hint> : null}
            </div>

            {isValidElement(children) && isDomElement(children)
                ? (() => {
                      const child = children as ReactElement<
                          Record<string, unknown>
                      >;
                      return cloneElement(child, {
                          ...child.props,
                          id: child.props?.id ?? controlId,
                          "aria-required": required || undefined,
                      });
                  })()
                : children}
        </div>
    );
}
