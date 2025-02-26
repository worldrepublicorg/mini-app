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
  walletAddress: string | null;
  username: string | null;
  tokenBalance: string | null;
  claimableAmount: string | null;
  basicIncomeActivated: boolean;
  isBasicIncomeLoading: boolean;
  setWalletAddress: (address: string) => void;
  setUsername: (username: string) => void;
  fetchBasicIncomeInfo: () => Promise<void>;
  fetchBalance: () => Promise<void>;
  setBasicIncomeActivated: (activated: boolean) => void;
}

const WalletContext = createContext<WalletContextProps>({
  walletAddress: null,
  username: null,
  tokenBalance: null,
  claimableAmount: null,
  basicIncomeActivated: false,
  isBasicIncomeLoading: false,
  setWalletAddress: async () => {},
  setUsername: async () => {},
  fetchBasicIncomeInfo: async () => {},
  fetchBalance: async () => {},
  setBasicIncomeActivated: async () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [claimableAmount, setClaimableAmount] = useState<string | null>(null);
  const [basicIncomeActivated, setBasicIncomeActivated] = useState(false);
  const [isBasicIncomeLoading, setIsBasicIncomeLoading] = useState(false);

  const fromWei = (value: bigint) => (Number(value) / 1e18).toString();

  // Rehydrate authentication status on mount by calling /api/me
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data.walletAddress) {
          setWalletAddress(data.walletAddress);
          // Optionally, fetch username or other user data based on walletAddress
          if (MiniKit.user?.username) {
            setUsername(MiniKit.user.username);
          }
        }
      } catch (error) {
        console.error("Error checking auth status", error);
      }
    };

    checkAuthStatus();
  }, []);

  const fetchBasicIncomeInfo = async () => {
    if (!walletAddress) return;
    setIsBasicIncomeLoading(true);
    try {
      const result = await viemClient.readContract({
        address: "0x02c3B99D986ef1612bAC63d4004fa79714D00012",
        abi: parseAbi([
          "function getStakeInfo(address) external view returns (uint256, uint256)",
        ]),
        functionName: "getStakeInfo",
        args: [walletAddress as `0x${string}`],
      });

      if (Array.isArray(result) && result.length === 2) {
        const newClaimable = fromWei(result[1]);
        setClaimableAmount(newClaimable);
        if (newClaimable !== "0") setBasicIncomeActivated(true);
      }
    } catch (error) {
      console.error("Error fetching basic income info:", error);
    } finally {
      setIsBasicIncomeLoading(false);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;

    fetchBasicIncomeInfo();

    try {
      const unwatch = viemClient.watchContractEvent({
        address: "0x02c3B99D986ef1612bAC63d4004fa79714D00012",
        abi: parseAbi([
          "event RewardsClaimed(address indexed user, uint256 amount)",
        ]),
        eventName: "RewardsClaimed",
        args: { user: walletAddress },
        onLogs: fetchBasicIncomeInfo,
      });

      return () => unwatch();
    } catch (error) {
      console.error("Error watching RewardsClaimed events:", error);
    }
  }, [walletAddress]);

  const fetchBalance = async () => {
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
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

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
        args: [walletAddress as `0x${string}`, walletAddress as `0x${string}`],
        onLogs: fetchBalance,
      });

      return () => unwatch();
    } catch (error) {
      console.error("Error watching Transfer events:", error);
    }
  }, [walletAddress]);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        username,
        tokenBalance,
        claimableAmount,
        basicIncomeActivated,
        isBasicIncomeLoading,
        setWalletAddress,
        setUsername,
        fetchBasicIncomeInfo,
        fetchBalance,
        setBasicIncomeActivated,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
