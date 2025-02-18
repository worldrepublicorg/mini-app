"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";
import { Button } from "./ui/Button";
import { useWallet } from "@/components/contexts/WalletContext";

interface WalletAuthProps {
  onError?: (error: string) => void;
  onSuccess?: (walletAddress: string, username: string) => void;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 8,
  delay = 1000
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    // Wait for a bit before retrying
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchWithRetry(url, options, retries - 1, delay);
  }
}

export function WalletAuth({ onError, onSuccess }: WalletAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setWalletAddress, setUsername } = useWallet();

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
      // Fetch nonce with retry
      const nonceRes = await fetchWithRetry(`/api/nonce`);
      const { nonce } = await nonceRes.json();

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce,
        statement: "Sign in to World Republic",
        expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      if (finalPayload.status === "error") {
        handleError("Authentication failed");
        return;
      }

      // Complete SIWE with retry
      const completeRes = await fetchWithRetry("/api/complete-siwe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: finalPayload, nonce }),
      });
      const result = await completeRes.json();

      if (result.status === "success" && result.isValid) {
        const fetchedWalletAddress = MiniKit.user?.walletAddress;
        if (fetchedWalletAddress) {
          setWalletAddress(fetchedWalletAddress);

          let fetchedUsername = null;
          try {
            // Optionally, retry fetching the username as well
            const usernameRes = await fetchWithRetry(
              `https://usernames.worldcoin.org/api/v1/${fetchedWalletAddress}`
            );
            const usernameData = await usernameRes.json();
            fetchedUsername = usernameData.username || "Unknown";
          } catch (error: any) {
            console.error("Error fetching username:", error);
          } finally {
            setUsername(fetchedUsername);
            onSuccess?.(fetchedWalletAddress, fetchedUsername);
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
