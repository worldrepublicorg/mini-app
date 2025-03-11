"use client";

import { ToastProvider as InnerToastProvider } from "@/components/ui/Toast";
import { ReactNode } from "react";

export function ToastProvider({ children }: { children: ReactNode }) {
  return <InnerToastProvider>{children}</InnerToastProvider>;
}
