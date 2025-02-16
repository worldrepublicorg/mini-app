"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";
import { Button } from "./ui/Button";

interface WalletAuthProps {
  onError?: (error: string) => void;
}

export function WalletAuth({ onError }: WalletAuthProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (message: string) => {
    onError?.(message);
    setIsLoading(false);
  };

  const signInWithWallet = async () => {
    if (!MiniKit.isInstalled()) {
      handleError("MiniKit is not installed");
      alert("Please open this app in the World App to connect your wallet.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/nonce`);
      if (!res.ok) throw new Error("Failed to fetch nonce");
      const { nonce } = await res.json();

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce,
        statement: "Sign in to World Republic",
        expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      if (finalPayload.status === "error") {
        handleError("Authentication failed");
        return;
      }

      const response = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: finalPayload, nonce }),
      });

      const result = await response.json();
      if (result.status !== "success" || !result.isValid) {
        handleError("Verification failed");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Error during wallet auth:", error);
      handleError("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={signInWithWallet} isLoading={isLoading} fullWidth>
      Connect wallet
    </Button>
  );
}
