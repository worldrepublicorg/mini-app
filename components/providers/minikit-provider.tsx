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
    let cancelled = false;
    let pollCount = 0;
    const maxPolls = 10; // 10 seconds max
    const pollDelay = 1000;

    const installAndPoll = async () => {
      try {
        MiniKit.install();
        // Poll for installation
        const poll = () => {
          if (cancelled) return;
          const installed = MiniKit.isInstalled();
          if (installed) {
            setIsInstalled(true);
            setIsInitializing(false);
          } else if (pollCount < maxPolls) {
            pollCount++;
            setTimeout(poll, pollDelay);
          } else {
            setIsInstalled(false);
            setIsInitializing(false);
            console.error("MiniKit failed to install after polling.");
          }
        };
        poll();
      } catch (error) {
        setIsInstalled(false);
        setIsInitializing(false);
        console.error("Error initializing MiniKit:", error);
      }
    };

    installAndPoll();
    return () => {
      cancelled = true;
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
