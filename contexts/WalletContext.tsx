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
  fetchBasicIncomeInfo: () => Promise<void>;
  fetchBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextProps>({
  basicIncomeInfo: null,
  tokenBalance: null,
  fetchBasicIncomeInfo: async () => {},
  fetchBalance: async () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

const BASIC_INCOME_CONTRACT = "0x02c3B99D986ef1612bAC63d4004fa79714D00012";
const TOKEN_CONTRACT = "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B";

const BASIC_INCOME_ABI = parseAbi([
  "function getStakeInfo(address) external view returns (uint256, uint256)",
  "event RewardsClaimed(address indexed user, uint256 amount)",
]);

const TOKEN_ABI = parseAbi([
  "function balanceOf(address) external view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]);

const fromWei = (value: bigint) => (Number(value) / 1e18).toString();

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [basicIncomeInfo, setBasicIncomeInfo] =
    useState<WalletContextProps["basicIncomeInfo"]>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const walletAddress = MiniKit.walletAddress;

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
      setBasicIncomeInfo(null);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;

    try {
      const unwatch = viemClient.watchContractEvent({
        address: BASIC_INCOME_CONTRACT,
        abi: parseAbi([
          "event RewardsClaimed(address indexed user, uint256 amount)",
        ]),
        eventName: "RewardsClaimed",
        args: { user: walletAddress },
        onLogs: () => {
          fetchBasicIncomeInfo();
        },
      });

      return () => unwatch();
    } catch (error) {
      console.error("Error watching RewardsClaimed events:", error);
    }
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
        setTokenBalance(null);
      }
    };

    if (walletAddress) {
      fetchBalance();

      try {
        const unwatch = viemClient.watchContractEvent({
          address: TOKEN_CONTRACT,
          abi: parseAbi([
            "event Transfer(address indexed from, address indexed to, uint256 value)",
          ]),
          eventName: "Transfer",
          args: { from: walletAddress, to: walletAddress },
          onLogs: () => {
            fetchBalance();
          },
        });

        return () => unwatch();
      } catch (error) {
        console.error("Error watching Transfer events:", error);
      }
    }
  }, [walletAddress]);

  return (
    <WalletContext.Provider
      value={{
        basicIncomeInfo,
        tokenBalance,
        fetchBasicIncomeInfo,
        fetchBalance: async () => {
          const balanceResult = await viemClient.readContract({
            address: TOKEN_CONTRACT,
            abi: TOKEN_ABI,
            functionName: "balanceOf",
            args: [walletAddress as `0x${string}`],
          });
          setTokenBalance(fromWei(balanceResult));
        },
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
