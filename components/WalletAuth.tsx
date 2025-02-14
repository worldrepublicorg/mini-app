"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { Button } from "./ui/Button";

interface WalletAuthProps {
  onError?: (error: string) => void;
}

export function WalletAuth({ onError }: WalletAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setWalletData, setIsLoggedIn } = useWallet();

  const signInWithWallet = async () => {
    if (!MiniKit.isInstalled()) {
      onError?.("MiniKit is not installed");
      alert("Please open this app in the World App to connect your wallet.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/nonce`);
      const { nonce } = await res.json();

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        expirationTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      });

      if (finalPayload.status === "error") {
        onError?.("Authentication failed");
        return;
      }

      const response = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: finalPayload, nonce }),
      });

      const result = await response.json();

      if (result.status === "success" && result.isValid) {
        const fetchedWalletAddress = MiniKit.user?.walletAddress;
        if (fetchedWalletAddress) {
          let fetchedUsername = null;
          try {
            const usernameRes = await fetch(
              `https://usernames.worldcoin.org/api/v1/${fetchedWalletAddress}`,
            );
            if (!usernameRes.ok) {
              throw new Error("Failed to fetch username");
            }
            const usernameData = await usernameRes.json();
            fetchedUsername = usernameData.username || "Unknown";
          } catch (error: any) {
            console.error("Error fetching username:", error);
          } finally {
            setWalletData(fetchedWalletAddress, fetchedUsername);
            setIsLoggedIn(true);
          }
        }
      } else {
        onError?.("Verification failed");
      }
    } catch (error) {
      console.error("Error during wallet auth:", error);
      onError?.("Authentication failed");
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
