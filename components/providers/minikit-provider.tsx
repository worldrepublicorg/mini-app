"use client"; // Required for Next.js

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect, useState } from "react";
import React from "react";

// Create a context to track MiniKit installation status
export const MiniKitContext = React.createContext({
  isInstalled: false,
  isInitializing: true,
  error: null as string | null,
  retry: () => {},
});

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Retry logic
  const installMiniKit = React.useCallback(() => {
    setIsInitializing(true);
    setIsInstalled(false);
    setError(null);

    let cancelled = false;
    let pollCount = 0;
    const maxPolls = 30; // 30 seconds max
    const pollDelay = 1000;

    const poll = () => {
      if (cancelled) return;
      const installed = MiniKit.isInstalled();
      if (installed) {
        setIsInstalled(true);
        setIsInitializing(false);
        setError(null);
      } else if (pollCount < maxPolls) {
        pollCount++;
        setTimeout(poll, pollDelay);
      } else {
        setIsInstalled(false);
        setIsInitializing(false);
        setError(
          "MiniKit could not be initialized. Please make sure you are using the World App and try again."
        );
      }
    };

    try {
      MiniKit.install();
      poll();
    } catch (e) {
      setIsInstalled(false);
      setIsInitializing(false);
      setError("Failed to initialize MiniKit. Please try again.");
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cleanup = installMiniKit();
    return cleanup;
  }, [installMiniKit]);

  return (
    <MiniKitContext.Provider
      value={{
        isInstalled,
        isInitializing,
        error,
        retry: installMiniKit,
      }}
    >
      {children}
    </MiniKitContext.Provider>
  );
}

// Utility hook to access MiniKit status
export function useMiniKit() {
  return React.useContext(MiniKitContext);
}
