"use client";

import type { ReactNode } from "react";
import { ToastProvider as InnerToastProvider } from "@/components/ui/Toast";

export function ToastProvider({ children }: { children: ReactNode }) {
	return <InnerToastProvider>{children}</InnerToastProvider>;
}
