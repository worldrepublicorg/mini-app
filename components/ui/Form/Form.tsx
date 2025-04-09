import { cn } from "@/lib/utils";
import type { FormProps as RadixFormProps } from "@radix-ui/react-form";
import * as RadixForm from "@radix-ui/react-form";
import { forwardRef } from "react";

import { typographyVariants } from "../Typography";

export type FormProps = RadixFormProps;
export const Root = RadixForm.Root;
export const Field = RadixForm.Field;
export const Control = RadixForm.Control;
export const Message = forwardRef<
  React.ElementRef<typeof RadixForm.Message>,
  React.ComponentPropsWithoutRef<typeof RadixForm.Message> & {
    error?: boolean;
    textAlign?: "left" | "center" | "right";
  }
>(({ className, error, textAlign = "left", ...props }, ref) => (
  <div
    className={cn(
      "flex items-center justify-center px-2",
      textAlign === "left" && "justify-start",
      textAlign === "center" && "justify-center",
      textAlign === "right" && "justify-end"
    )}
  >
    <RadixForm.Message
      ref={ref}
      className={cn(
        "mt-1 flex h-[1.625rem] items-center",
        typographyVariants({
          variant: "body",
          level: 3,
        }),
        error ? "text-error-700" : "text-gray-500"
      )}
      {...props}
    />
  </div>
));
export const ValidityState: typeof RadixForm.ValidityState =
  RadixForm.ValidityState;
export const Submit: typeof RadixForm.Submit = RadixForm.Submit;
