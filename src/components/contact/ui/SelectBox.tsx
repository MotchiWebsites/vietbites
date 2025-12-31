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
                        "z-50 overflow-hidden rounded-md border border-gray-100 bg-white shadow-lg " +
                        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                    }
                    position="popper"
                    sideOffset={6}
                >
                    {/* optional: make viewport text responsive too */}
                    <Select.Viewport className="p-1 text-sm md:text-base">
                        {children}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}

type ItemProps = React.ComponentPropsWithoutRef<typeof Select.Item>;

function SelectBoxItem({ children, className, ...props }: ItemProps) {
    return (
        <Select.Item
            className={
                "relative flex w-full cursor-pointer select-none items-center gap-2 rounded px-3 py-2 text-gray-800 text-sm md:text-base " +
                "outline-none data-highlighted:bg-orange-50 data-highlighted:text-orange " + // highlight on hover/keys
                "data-[state=checked]:bg-orange-100 data-[state=checked]:text-orange " + // selected style
                "text-left " +
                (className ? ` ${className}` : "")
            }
            {...props}
        >
            <Select.ItemText className="truncate">{children}</Select.ItemText>
            <Select.ItemIndicator className="ml-auto text-orange">
                <LuCheck className="h-4 w-4" aria-hidden />
            </Select.ItemIndicator>
        </Select.Item>
    );
}

const SelectBox = Object.assign(SelectBoxRoot, { Item: SelectBoxItem });
export default SelectBox;
