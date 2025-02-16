"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { parseAbi } from "viem";
import { viemClient } from "@/lib/viemClient";
import { MiniKit } from "@worldcoin/minikit-js";

interface WalletContextProps {
  basicIncomeInfo: {
    claimableAmount: string;
  } | null;
  tokenBalance: string | null;
}

const WalletContext = createContext<WalletContextProps>({
  basicIncomeInfo: null,
  tokenBalance: null,
});

interface WalletProviderProps {
  children: ReactNode;
}

// Add these constants at the top
const BASIC_INCOME_CONTRACT = "0x2f08c17B30e6622F8B780fb58835Fc0927E2dc8e";
const TOKEN_CONTRACT = "0xAAC7d5E9011Fc0fC80bF707DDcC3D56DdfDa9084";

const BASIC_INCOME_ABI = parseAbi([
  "function getStakeInfo(address) external view returns (uint256, uint256)",
  "event RewardsClaimed(address indexed user, uint256 amount)",
]);

const TOKEN_ABI = parseAbi([
  "function balanceOf(address) external view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]);

// Utility function
const fromWei = (value: bigint) => (Number(value) / 1e18).toString();

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [basicIncomeInfo, setBasicIncomeInfo] =
    useState<WalletContextProps["basicIncomeInfo"]>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const walletAddress = MiniKit.user?.walletAddress;

  const fetchBasicIncomeInfo = async () => {
    if (!walletAddress) return;

    try {
      const result = await viemClient.readContract({
        address: BASIC_INCOME_CONTRACT,
        abi: BASIC_INCOME_ABI,
        functionName: "getStakeInfo",
        args: [walletAddress as `0x${string}`],
      });

      if (Array.isArray(result) && result.length === 2) {
        setBasicIncomeInfo({
          claimableAmount: fromWei(result[1]),
        });
      }
    } catch (error) {
      console.error("Error fetching basic income info:", error);
      setBasicIncomeInfo(null); // Reset on error
    }
  };

  useEffect(() => {
    if (!walletAddress) return;

    const unwatch = viemClient.watchContractEvent({
      address: "0x2f08c17B30e6622F8B780fb58835Fc0927E2dc8e",
      abi: parseAbi([
        "event RewardsClaimed(address indexed user, uint256 amount)",
      ]),
      eventName: "RewardsClaimed",
      args: { user: walletAddress },
      onLogs: () => {
        fetchBasicIncomeInfo();
      },
    });

    fetchBasicIncomeInfo();

    return () => {
      unwatch();
    };
  }, [walletAddress]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) return;

      try {
        const balanceResult = await viemClient.readContract({
          address: TOKEN_CONTRACT,
          abi: TOKEN_ABI,
          functionName: "balanceOf",
          args: [walletAddress as `0x${string}`],
        });

        if (typeof balanceResult === "bigint") {
          setTokenBalance(fromWei(balanceResult));
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setTokenBalance(null); // Reset on error
      }
    };

    if (walletAddress) {
      // Initial fetch
      fetchBalance();

      // Watch for Transfer events
      const unwatch = viemClient.watchContractEvent({
        address: "0xAAC7d5E9011Fc0fC80bF707DDcC3D56DdfDa9084",
        abi: parseAbi([
          "event Transfer(address indexed from, address indexed to, uint256 value)",
        ]),
        eventName: "Transfer",
        args: { from: walletAddress, to: walletAddress },
        onLogs: () => {
          fetchBalance();
        },
      });

      return () => {
        unwatch();
      };
    }
  }, [walletAddress]);

  return (
    <WalletContext.Provider
      value={{
        basicIncomeInfo,
        tokenBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
