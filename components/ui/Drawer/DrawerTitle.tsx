"use client";

import { useEffect } from "react";
import { Typography } from "@/components/ui/Typography";

export interface DrawerTitleProps {
  children: React.ReactNode;
}

export const DrawerTitle = ({ children }: DrawerTitleProps) => {
  // Using useEffect to set the document title for accessibility
  useEffect(() => {
    if (typeof children === "string") {
      const title = children;
      // Set the drawer title in page for accessibility
      const drawerTitleElement = document.querySelector(".vaul-drawer-title");
      if (drawerTitleElement) {
        drawerTitleElement.textContent = title;
      }
    }
  }, [children]);

  return (
    <Typography
      as="h2"
      variant={{ variant: "heading", level: 1 }}
      className="text-center font-semibold"
    >
      {children}
    </Typography>
  );
};

DrawerTitle.displayName = "DrawerTitle";
