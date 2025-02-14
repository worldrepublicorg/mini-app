"use client";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "../../../lib/utils";
import { typographyVariants } from "../Typography";

const pillVariants = cva(
  "inline-flex h-9 items-center rounded-full px-4 transition-colors duration-200",
  {
    variants: {
      checked: {
        true: "bg-gray-100",
        false: "bg-transparent",
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
);

export interface PillProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "style">,
    VariantProps<typeof pillVariants> {
  /**
   * Whether the pill is checked
   * @default false
   */
  checked?: boolean;
  /**
   * Whether the pill is rendered as a child component
   * @default false
   */
  asChild?: boolean;
}

export const Pill = forwardRef<HTMLButtonElement, PillProps>(
  ({ checked, children, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          pillVariants({ checked }),
          typographyVariants({ variant: "subtitle", level: 3 }),
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Pill.displayName = "Pill";

export default Pill;
