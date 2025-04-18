import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Tick } from "@/components/ui/Icons/Tick";

const DEFAULT_ADORNMENT_WIDTH = 1.5;

export const textareaVariants = cva(
  "peer font-sans w-full rounded-xl border-2 border-gray-100 bg-gray-100 p-4 text-[15px] leading-none placeholder:text-gray-500 text-gray-900 outline-none transition duration-300 file:hidden placeholder:focus:border-gray-200 focus:bg-gray-0 focus:shadow-card focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      error: {
        true: "border-error-700 bg-error-100 focus:border-error-700 focus:bg-error-100",
      },
      isFocused: {
        true: "border-gray-200 bg-gray-0 shadow-card",
        false: "",
      },
    },
    defaultVariants: {
      error: false,
      isFocused: false,
    },
  }
);

export const iconVariants = cva(
  "absolute top-1 bottom-1 flex items-center justify-center overflow-hidden text-gray-400",
  {
    variants: {
      disabled: {
        true: "text-gray-300 cursor-not-allowed",
      },
      error: {
        true: "text-error-700",
      },
      position: {
        start: "left-1",
        end: "right-1",
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

export interface TextareaProps
  extends Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      "className" | "style"
    >,
    VariantProps<typeof textareaVariants> {
  /**
   * If true, the textarea will display in an error state with error styling
   */
  error?: boolean;
  /**
   * If true, the textarea will display in a valid state with success styling
   */
  isValid?: boolean;
  /**
   * Element to be rendered at the start (left side) of the textarea.
   * The component passed to this prop must accept a `style` prop.
   * The component should use currentColor to match the Textarea's styling.
   * To change styles based on textarea focus, use Tailwind's `group-*` modifiers
   * since the textarea is wrapped in a group class.
   */
  startAdornment?: React.ReactNode;
  /**
   * Element to be rendered at the end (right side) of the textarea.
   * The component passed to this prop must accept a `style` prop.
   * The component should use currentColor to match the Textarea's styling.
   * To change styles based on textarea focus, use Tailwind's `group-*` modifiers
   * since the textarea is wrapped in a group class.
   */
  endAdornment?: React.ReactNode;
  /**
   * Width of the start adornment in rem
   * @default 1.25
   */
  startAdornmentWidth?: number;
  /**
   * Width of the end adornment in rem
   * @default 1.25
   */
  endAdornmentWidth?: number;
  /**
   * If true, the textarea will display in a focused state with focus styling
   * @default false
   */
  isFocused?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      error,
      startAdornment,
      endAdornment,
      isValid,
      startAdornmentWidth = DEFAULT_ADORNMENT_WIDTH,
      endAdornmentWidth = DEFAULT_ADORNMENT_WIDTH,
      isFocused = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="group relative flex w-full items-start">
        {startAdornment && (
          <div
            className={cn(
              iconVariants({ error, disabled, position: "start" }),
              "mt-4"
            )}
            style={{ width: `${startAdornmentWidth + 0.75}rem` }}
          >
            {startAdornment}
          </div>
        )}
        <textarea
          ref={ref}
          disabled={disabled}
          className={cn(
            textareaVariants({ error, isFocused }),
            "min-h-[80px] resize-y"
          )}
          {...props}
          style={{
            ...(startAdornment && {
              paddingLeft: `${1 + startAdornmentWidth}rem`,
            }),
            ...(endAdornment && {
              paddingRight: `${1 + endAdornmentWidth}rem`,
            }),
            ...(isValid && {
              paddingRight: `${1 + DEFAULT_ADORNMENT_WIDTH}rem`,
            }),
          }}
        />
        {(isValid || endAdornment) && (
          <div
            className={cn(
              iconVariants({ error, disabled, position: "end" }),
              "mt-4"
            )}
            style={{ width: `${endAdornmentWidth + 0.75}rem` }}
          >
            {isValid ? <Tick className="text-success-700" /> : endAdornment}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
