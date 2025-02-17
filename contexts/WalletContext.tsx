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
import { getStoredUsername, getWalletAddress } from "@/lib/auth";
import { getIsUserVerified } from "@worldcoin/minikit-js";

interface WalletContextProps {
  walletAddress: string | null;
  username: string | null;
  tokenBalance: string | null;
  claimableAmount: string | null;
  hasBasicIncome: boolean;
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
  hasBasicIncome: false,
  setWalletAddress: async () => {},
  setUsername: async () => {},
  fetchBasicIncomeInfo: async () => {},
  fetchBalance: async () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [claimableAmount, setClaimableAmount] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [hasBasicIncome, setHasBasicIncome] = useState(false);

  const BASIC_INCOME_CONTRACT = "0x02c3B99D986ef1612bAC63d4004fa79714D00012";
  const TOKEN_CONTRACT = "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B";

  const TOKEN_ABI = parseAbi([
    "function balanceOf(address) external view returns (uint256)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
  ]);

  const fromWei = (value: bigint) => (Number(value) / 1e18).toString();

  const fetchBasicIncomeInfo = async () => {
    try {
      const result = await viemClient.readContract({
        address: BASIC_INCOME_CONTRACT,
        abi: parseAbi([
          "function getStakeInfo(address) external view returns (uint256, uint256)",
        ]),
        functionName: "getStakeInfo",
        args: [walletAddress as `0x${string}`],
      });

      if (Array.isArray(result) && result.length === 2) {
        const [rawStake] = result;
        setHasBasicIncome(Number(rawStake) > 0);
        setClaimableAmount(fromWei(result[1]));
      }
    } catch (error) {
      console.error("Error fetching basic income info:", error);
      setHasBasicIncome(false);
      setClaimableAmount(null);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;

    fetchBasicIncomeInfo();

    try {
      const unwatch = viemClient.watchContractEvent({
        address: BASIC_INCOME_CONTRACT,
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

  useEffect(() => {
    if (!walletAddress) return;

    fetchBalance();

    try {
      const unwatch = viemClient.watchContractEvent({
        address: TOKEN_CONTRACT,
        abi: parseAbi([
          "event Transfer(address indexed from, address indexed to, uint256 value)",
        ]),
        eventName: "Transfer",
        args: [null, walletAddress as `0x${string}`],
        onLogs: fetchBalance,
      });

      return () => unwatch();
    } catch (error) {
      console.error("Error watching Transfer events:", error);
    }
  }, [walletAddress]);

  useEffect(() => {
    const validateSession = async () => {
      const storedAddress = getWalletAddress();
      if (storedAddress) {
        const isValid = await getIsUserVerified(storedAddress);
        if (isValid) {
          setWalletAddress(storedAddress);
          setUsername(getStoredUsername());
        } else {
          document.cookie =
            "wallet-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }
    };
    validateSession();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        username,
        tokenBalance,
        claimableAmount,
        hasBasicIncome,
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
