"use client"; // Required for Next.js

import { ReactNode, useEffect, useState, useRef } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const initAttempts = useRef(0);
  const maxAttempts = 3;

  useEffect(() => {
    let isMounted = true;
    // Event handler references that need to be cleaned up
    let handleWalletAuthStart: Function | null = null;
    let handleWalletAuthComplete: Function | null = null;
    let handleWalletAuthError: Function | null = null;

    // Function to install MiniKit and ensure it's ready to use
    const initializeMiniKit = async () => {
      try {
        initAttempts.current += 1;
        console.log(
          `Attempting to initialize MiniKit (attempt ${initAttempts.current})...`
        );

        // Make sure MiniKit class is available
        if (!MiniKit) {
          console.error("MiniKit class not available");
          return false;
        }

        // Install MiniKit based on official documentation
        if (typeof MiniKit.install === "function") {
          MiniKit.install();
        } else {
          console.error("MiniKit.install is not a function");
          return false;
        }

        // Make sure the global instance is available
        window.MiniKit = MiniKit as any; // Type cast to avoid type conflicts

        console.log("MiniKit installed, waiting for commands to be ready...");

        // Register event handlers for wallet auth
        if (
          window.MiniKit &&
          typeof (window.MiniKit as any).on === "function"
        ) {
          // Register event handlers for wallet auth events
          handleWalletAuthStart = (data: any) => {
            console.log("Wallet auth started", data);
          };

          handleWalletAuthComplete = (payload: any) => {
            console.log("Wallet auth completed:", payload);
          };

          handleWalletAuthError = (error: any) => {
            console.error("Wallet auth error:", error);
          };

          // Register these handlers
          (window.MiniKit as any).on(
            "wallet-auth-start",
            handleWalletAuthStart
          );
          (window.MiniKit as any).on(
            "wallet-auth-complete",
            handleWalletAuthComplete
          );
          (window.MiniKit as any).on(
            "wallet-auth-error",
            handleWalletAuthError
          );

          console.log("Wallet auth event handlers registered");
        } else {
          console.warn(
            "MiniKit.on is not a function, event handling may not work"
          );
        }

        // Give commands time to initialize
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check if commands are available
        const checkCommands = () => {
          if (!window.MiniKit) {
            console.error("MiniKit not available in window");
            return false;
          }

          if (!window.MiniKit.commands) {
            console.error("MiniKit commands not available");
            return false;
          }

          const availableCommands = Object.keys(window.MiniKit.commands);
          console.log("Available MiniKit commands:", availableCommands);

          if (availableCommands.includes("walletAuth")) {
            console.log("walletAuth command is available!");
            return true;
          } else {
            console.warn("walletAuth command not found in:", availableCommands);
            return false;
          }
        };

        // First check
        if (!checkCommands()) {
          console.log("Commands not ready, waiting longer...");
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Reinstall MiniKit
          console.log("Reinstalling MiniKit...");
          if (typeof MiniKit.install === "function") {
            MiniKit.install();
          }

          // Wait again
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Check again
          const commandsAvailable = checkCommands();

          if (!commandsAvailable && isMounted) {
            console.warn("walletAuth command still not available after retry");

            // If we've tried less than max attempts, try again
            if (initAttempts.current < maxAttempts) {
              console.log(
                `Scheduling retry ${initAttempts.current + 1}/${maxAttempts}...`
              );
              setTimeout(initializeMiniKit, 2000);
              return false;
            } else {
              console.error(
                `Failed to initialize MiniKit after ${maxAttempts} attempts`
              );
            }
          }

          return commandsAvailable;
        }

        if (isMounted) {
          setIsInitialized(true);
          console.log("MiniKit initialization complete");

          // Check if running inside World App
          const isInstalledCheck =
            typeof MiniKit.isInstalled === "function"
              ? MiniKit.isInstalled()
              : false;
          console.log("Running inside World App:", isInstalledCheck);

          return true;
        }

        return false;
      } catch (e) {
        console.error("MiniKit initialization error:", e);

        // If we've tried less than max attempts, try again
        if (initAttempts.current < maxAttempts) {
          console.log(
            `Scheduling retry after error ${
              initAttempts.current + 1
            }/${maxAttempts}...`
          );
          setTimeout(initializeMiniKit, 2000);
        } else {
          console.error(
            `Failed to initialize MiniKit after ${maxAttempts} attempts due to errors`
          );
        }

        return false;
      }
    };

    // Start initialization
    initializeMiniKit();

    // Cleanup function
    return () => {
      isMounted = false;

      // Clean up event handlers
      if (window.MiniKit && typeof (window.MiniKit as any).off === "function") {
        if (handleWalletAuthStart) {
          (window.MiniKit as any).off(
            "wallet-auth-start",
            handleWalletAuthStart
          );
        }
        if (handleWalletAuthComplete) {
          (window.MiniKit as any).off(
            "wallet-auth-complete",
            handleWalletAuthComplete
          );
        }
        if (handleWalletAuthError) {
          (window.MiniKit as any).off(
            "wallet-auth-error",
            handleWalletAuthError
          );
        }
      }

      console.log("Cleaning up MiniKit provider");
    };
  }, []);

  return <>{children}</>;
}
