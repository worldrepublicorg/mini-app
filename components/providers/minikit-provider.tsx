"use client"; // Required for Next.js

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect, useState } from "react";
import React from "react";

// Create a context to track MiniKit installation status
export const MiniKitContext = React.createContext({
  isInstalled: false,
  isInitializing: true,
});

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20; // 20 × 500ms = 10 seconds
    const checkInterval = 500;
    let interval: NodeJS.Timeout | null = null;

    const checkInstalled = () => {
      const importedInstalled = MiniKit.isInstalled?.() ?? false;
      const windowInstalled =
        typeof window !== "undefined" &&
        (window as any).MiniKit &&
        (window as any).MiniKit.isInstalled?.();
      return importedInstalled || windowInstalled;
    };

    const tryInstall = async () => {
      try {
        await MiniKit.install();
      } catch (e) {
        // Ignore install errors, we'll still poll
      }
      interval = setInterval(() => {
        attempts++;
        const installed = checkInstalled();
        if (installed || attempts >= maxAttempts) {
          setIsInstalled(!!installed);
          setIsInitializing(false);
          if (interval) clearInterval(interval);
        }
      }, checkInterval);
    };

    tryInstall();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <MiniKitContext.Provider value={{ isInstalled, isInitializing }}>
      {children}
    </MiniKitContext.Provider>
  );
}

// Utility hook to access MiniKit status
export function useMiniKit() {
  return React.useContext(MiniKitContext);
}
