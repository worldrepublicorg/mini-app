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
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    const initializeMiniKit = async () => {
      try {
        await MiniKit.install();

        // Add a small delay to ensure complete initialization
        setTimeout(() => {
          const installed = MiniKit.isInstalled();
          console.log("MiniKit installed status:", installed);
          setIsInstalled(installed);
          setIsInitializing(false);
        }, 500);
      } catch (error) {
        console.error("Error initializing MiniKit:", error);

        // Retry logic
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(
            `Retrying MiniKit initialization (${retryCount}/${maxRetries})...`
          );
          setTimeout(initializeMiniKit, retryDelay);
        } else {
          console.error("Failed to initialize MiniKit after retries");
          setIsInitializing(false);
        }
      }
    };

    initializeMiniKit();

    return () => {
      // Cleanup if needed
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
