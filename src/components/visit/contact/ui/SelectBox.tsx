"use client";
import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { LuChevronDown, LuCheck } from "react-icons/lu";

type SelectBoxProps = {
    id?: string;
    name?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    children: React.ReactNode;
    "aria-label"?: string;
    className?: string;
};

function SelectBoxRoot({
    id,
    name,
    value,
    onChange,
    placeholder,
    children,
    className,
    ...rest
}: SelectBoxProps) {
    return (
        <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger
                id={id}
                name={name}
                // Left-align the value, keep arrow on the right.
                className={
                    "w-full inline-flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm " +
                    // responsive text size: text-sm on mobile/SM, text-base on MD+
                    "text-sm md:text-base " +
                    "focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 " +
                    (className ? ` ${className}` : "")
                }
                {...rest}
            >
                {/* Make the value take full width and left-align; gray only when showing placeholder */}
                <Select.Value
                    placeholder={placeholder}
                    className="w-full text-left truncate text-gray-900 data-placeholder:text-gray-400"
                />
                <Select.Icon>
                    <LuChevronDown
                        className="ml-2 h-5 w-5 flex-none text-gray-500"
                        aria-hidden
                    />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    className={
                        "z-50 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg " +
                        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 " +
                        "w-[min(75vw,28rem)] max-w-[75vw] max-h-[40vh] md:max-h-[50vh]"
                    }
                    position="popper"
                    sideOffset={8}
                    collisionPadding={12}
                >
                    {/* scroll buttons (nice on desktop, harmless on mobile) */}
                    <Select.ScrollUpButton className="flex h-8 items-center justify-center text-gray-500">
                        ▲
                    </Select.ScrollUpButton>

                    <Select.Viewport className="p-2 max-h-[60vh] overflow-y-auto overflow-x-hidden overscroll-contain">
                        {children}
                    </Select.Viewport>

                    <Select.ScrollDownButton className="flex h-8 items-center justify-center text-gray-500">
                        ▼
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}

type ItemProps = React.ComponentPropsWithoutRef<typeof Select.Item> & {
    label: string;
    desc?: string;
};

function SelectBoxItem({ label, desc, className, ...props }: ItemProps) {
    return (
        <Select.Item
            className={
                "relative w-full cursor-pointer select-none rounded-lg px-3 py-2 " +
                "outline-none data-highlighted:bg-orange-50 data-highlighted:text-orange " +
                "data-[state=checked]:bg-orange-100 data-[state=checked]:text-orange " +
                (className ? ` ${className}` : "")
            }
            {...props}
        >
            <div className="flex items-start gap-2">
                {/* This is what Radix uses in the Trigger when selected */}
                <Select.ItemText>
                    <span className="block text-sm md:text-base font-medium text-charcoal text-left">
                        {label}
                    </span>
                </Select.ItemText>

                <Select.ItemIndicator className="ml-auto mt-0.5 text-orange">
                    <LuCheck className="h-4 w-4" aria-hidden />
                </Select.ItemIndicator>
            </div>

            {/* This is only for the dropdown list UI */}
            {desc ? (
                <p className="mt-0.5 text-xs text-charcoal/60 leading-snug text-left">
                    {desc}
                </p>
            ) : null}
        </Select.Item>
    );
}

const SelectBox = Object.assign(SelectBoxRoot, { Item: SelectBoxItem });
export default SelectBox;
