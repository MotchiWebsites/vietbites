"use client";
import * as React from "react";

type PhoneInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
> & {
    value: string; // controlled formatted value (or "")
    onChange: (value: string) => void; // receives formatted string (or "")
    onValidityChange?: (valid: boolean) => void; // empty = valid, full 10 digits = valid
};

const MAX_NATIONAL = 10; // US/CA national digits

// ---- helpers ---------------------------------------------------------------

function getNationalDigits(raw: string) {
    // strip all non-digits
    const digits = raw.replace(/\D/g, "");
    // remove leading country code if present
    const national = digits.startsWith("1") ? digits.slice(1) : digits;
    // clamp to 10
    return national.slice(0, MAX_NATIONAL);
}

function formatFromNational(national: string) {
    if (national.length === 0) return ""; // show empty when no input
    const a = national.slice(0, 3);
    const b = national.slice(3, 6);
    const c = national.slice(6, 10);

    let out = "+1";
    if (a) out += ` (${a}`;
    if (a.length === 3) out += ")";
    if (b) out += ` ${b}`;
    if (c) out += `-${c}`;
    return out;
}

function countNationalBeforeCaret(formatted: string, caret: number) {
    // count digits before caret, excluding the leading country code digit in "+1"
    let count = 0;
    for (let i = 0; i < Math.min(caret, formatted.length); i++) {
        const ch = formatted[i];
        if (/\d/.test(ch)) {
            // skip the first digit if it is the '1' after '+'
            if (!(i === 1 && formatted[0] === "+" && ch === "1")) {
                count++;
            }
        }
    }
    return count;
}

function caretPosForNationalIndex(formatted: string, index: number) {
    // return the position AFTER the index-th national digit
    if (index <= 0) {
        // place after "+1 " if present, otherwise at end
        const plus1End = formatted.startsWith("+1") ? 2 : 0;
        // if we have " +1 (" then prefer after that
        const openParen = formatted.indexOf("(");
        if (openParen >= 0) return Math.min(openParen + 1, formatted.length);
        return Math.min(plus1End, formatted.length);
    }
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
        const ch = formatted[i];
        if (/\d/.test(ch)) {
            if (!(i === 1 && formatted[0] === "+" && ch === "1")) {
                count++;
                if (count === index) {
                    return i + 1; // caret after this digit
                }
            }
        }
    }
    return formatted.length;
}

// ---- component -------------------------------------------------------------

export default function PhoneInput({
    value,
    onChange,
    onValidityChange,
    className,
    id,
    ...rest
}: PhoneInputProps) {
    const ref = React.useRef<HTMLInputElement | null>(null);

    // validity: empty OR full 10 digits is valid
    const national = React.useMemo(() => getNationalDigits(value), [value]);
    const valid = national.length === 0 || national.length === MAX_NATIONAL;

    React.useEffect(() => {
        onValidityChange?.(valid);
    }, [valid, onValidityChange]);

    // handle general input (typing, paste) with caret preservation
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const caret = e.target.selectionStart ?? raw.length;

        // derive intended digit index before caret in the RAW (pre-format) string
        const digitsBefore = countNationalBeforeCaret(raw, caret);

        // new national digits from raw
        const nextNational = getNationalDigits(raw);
        const nextFormatted = formatFromNational(nextNational);

        // map the same digit index to a caret in the new formatted value
        const nextCaret = caretPosForNationalIndex(nextFormatted, digitsBefore);

        onChange(nextFormatted);

        // set caret after React re-renders
        requestAnimationFrame(() => {
            if (ref.current) {
                ref.current.setSelectionRange(nextCaret, nextCaret);
            }
        });
    };

    // handle Backspace/Delete across formatting characters
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!ref.current) return;
        const current = value ?? "";
        const caret = ref.current.selectionStart ?? current.length;

        if (e.key !== "Backspace" && e.key !== "Delete") return;

        e.preventDefault(); // we will manage the mutation + caret

        const currNational = getNationalDigits(current);
        const digitsBefore = countNationalBeforeCaret(current, caret);

        const removeIndex =
            e.key === "Backspace" ? digitsBefore - 1 : digitsBefore;

        if (removeIndex < 0 || removeIndex >= currNational.length) {
            // nothing to remove; if Backspace at very start, allow no-op
            return;
        }

        const nextNational =
            currNational.slice(0, removeIndex) +
            currNational.slice(removeIndex + 1);

        const nextFormatted = formatFromNational(nextNational);

        // for Backspace, caret should sit after the previous digit index
        // for Delete, caret stays at the same digit index
        const targetDigitIndex =
            e.key === "Backspace"
                ? Math.max(0, digitsBefore - 1)
                : digitsBefore;

        const nextCaret = caretPosForNationalIndex(
            nextFormatted,
            targetDigitIndex
        );

        onChange(nextFormatted);

        requestAnimationFrame(() => {
            if (ref.current) {
                ref.current.setSelectionRange(nextCaret, nextCaret);
            }
        });
    };

    return (
        <input
            ref={ref}
            id={id}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            inputMode="tel"
            autoComplete="tel"
            placeholder="(555) 555-5555"
            aria-invalid={value ? !valid || undefined : undefined}
            className={
                "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm " +
                "focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 " +
                (className ? ` ${className}` : "")
            }
            {...rest}
        />
    );
}
