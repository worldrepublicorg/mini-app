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
  setWalletAddress: (address: string) => void;
  setUsername: (username: string) => void;
  fetchBasicIncomeInfo: () => Promise<void>;
  fetchBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextProps>({
  walletAddress: null,
  username: null,
  tokenBalance: null,
  claimableAmount: null,
  setWalletAddress: async () => {},
  setUsername: async () => {},
  fetchBasicIncomeInfo: async () => {},
  fetchBalance: async () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [claimableAmount, setClaimableAmount] = useState<string | null>(null);

  const fromWei = (value: bigint) => (Number(value) / 1e18).toString();

  useEffect(() => {
    if (MiniKit.user?.walletAddress) {
      setWalletAddress(MiniKit.user.walletAddress)
    }
    if (MiniKit.user?.username) {
      setUsername(MiniKit.user.username);
    }
  }, []);

  const fetchBasicIncomeInfo = async () => {
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
        setClaimableAmount(fromWei(result[1]));
      }
    } catch (error) {
      console.error("Error fetching basic income info:", error);
      setClaimableAmount(null);
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
        setTokenBalance(fromWei(balanceResult));
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setTokenBalance(null);
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
        setWalletAddress,
        setUsername,
        fetchBasicIncomeInfo,
        fetchBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
