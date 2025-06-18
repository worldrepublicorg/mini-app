"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

type LookupResult = {
  address: string;
  // ... other fields from API if any
} | null;

export const useUsernameLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LookupResult>(null);

  const lookup = async (username: string) => {
    if (!username || !username.trim()) {
      setError("Please enter a username");
      return null;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      if (MiniKit.isInstalled()) {
        const response = await fetch(
          `https://usernames.worldcoin.org/api/v1/${encodeURIComponent(username.trim())}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("Username not found");
          } else {
            setError(`Error: ${response.status} ${response.statusText}`);
          }
          return null;
        }

        const data = await response.json();
        setResult(data);
        return data.address || null;
      } else {
        setError("Please install MiniKit to look up usernames");
        return null;
      }
    } catch (err) {
      console.error("[Username] Error looking up username via API:", err);
      setError("Failed to look up username. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { lookup, isLoading, error, result, setError, setResult };
};
