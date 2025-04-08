"use client";

import * as React from "react";
import * as RadixSelect from "@radix-ui/react-select";

import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils"; // Ensure this path is correct

export const Select = ({ children, ...props }) => {
  return <RadixSelect.Root {...props}>{children}</RadixSelect.Root>;
};

export const SelectTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <RadixSelect.Trigger
      ref={ref}
      className={cn(
        "flex items-center bg-white justify-between rounded-md border px-3 py-2 text-sm focus:outline-none",
        className
      )}
      {...props}
    >
      <RadixSelect.Value placeholder="Select an option" />
      <ChevronDown className="h-4 w-4 opacity-50" />
    </RadixSelect.Trigger>
  )
);
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <RadixSelect.Portal>
      <RadixSelect.Content
        ref={ref}
        className={cn(
          "mt-1 max-h-60 bg-white w-full overflow-auto rounded-md border bg-white text-sm shadow-lg",
          className
        )}
        {...props}
      >
        <RadixSelect.Viewport>{children}</RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  )
);
SelectContent.displayName = "SelectContent";

export const SelectItem = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <RadixSelect.Item
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md py-2 px-3 text-sm outline-none focus:bg-gray-100",
        className
      )}
      {...props}
    >
      <RadixSelect.ItemIndicator>
        <Check className="h-4 w-4" />
      </RadixSelect.ItemIndicator>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  )
);
SelectItem.displayName = "SelectItem";

export const SelectValue = RadixSelect.Value;
