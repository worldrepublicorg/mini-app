"use client";

import { useState, useEffect, useCallback } from "react";
import { viemClient } from "@/lib/viemClient";
import { parseAbi } from "viem";

export function useWalletBalance(walletAddress: string | null) {
  const [tokenBalance, setTokenBalance] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("tokenBalance") || null;
    }
    return null;
  });

  const fromWei = useCallback(
    (value: bigint) => (Number(value) / 1e18).toString(),
    []
  );

  const fetchBalance = useCallback(async () => {
    if (!walletAddress) return;

    try {
      const balanceResult = await viemClient.readContract({
        address: "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B",
        abi: parseAbi([
          "function balanceOf(address) external view returns (uint256)",
        ]),
        functionName: "balanceOf",
        args: [walletAddress as `0x${string}`],
      });

      if (typeof balanceResult === "bigint") {
        const newTokenBalance = fromWei(balanceResult);
        setTokenBalance(newTokenBalance);
        if (typeof window !== "undefined") {
          localStorage.setItem("tokenBalance", newTokenBalance);
        }
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setTimeout(fetchBalance, 1000);
    }
  }, [walletAddress, fromWei]);

  useEffect(() => {
    if (!walletAddress) return;

    fetchBalance();

    try {
      const unwatch = viemClient.watchContractEvent({
        address: "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B",
        abi: parseAbi([
          "event Transfer(address indexed from, address indexed to, uint256 value)",
        ]),
        eventName: "Transfer",
        args: [null, walletAddress as `0x${string}`],
        onLogs: () => {
          fetchBalance();
        },
      });

      return () => {
        unwatch();
      };
    } catch (error) {
      console.error("Error setting up Transfer event listener:", error);
      return undefined;
    }
  }, [walletAddress, fetchBalance]);

  return {
    tokenBalance,
    fetchBalance,
  };
}
