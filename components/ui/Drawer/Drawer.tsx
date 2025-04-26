"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

const Drawer = DrawerPrimitive.Root;
const DrawerTrigger: typeof DrawerPrimitive.Trigger = DrawerPrimitive.Trigger;
const DrawerClose: typeof DrawerPrimitive.Close = DrawerPrimitive.Close;

const DrawerContent: typeof DrawerPrimitive.Content = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPrimitive.Portal>
    <DrawerPrimitive.Overlay className="fixed inset-0 z-50">
      <div className="w-full h-full bg-gray-900 opacity-40" />
    </DrawerPrimitive.Overlay>

    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 h-auto flex flex-col rounded-t-2xl bg-gray-0 outline-none",
        className,
      )}
      {...props}
    >
      {/* The Drawer Title is added for accessibility purposes, ensuring that screen readers can identify the drawer's purpose. */}
      <DrawerPrimitive.Title className="sr-only" />
      <DrawerPrimitive.Handle className="my-2" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPrimitive.Portal>
));

DrawerContent.displayName = "DrawerContent";

export { Drawer, DrawerTrigger, DrawerClose, DrawerContent };
