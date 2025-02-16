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
  setWalletAddress: (address: string | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
  claimableAmount: string | null;
  tokenBalance: string | null;
  fetchBasicIncomeInfo: () => Promise<void>;
  fetchBalance: () => Promise<void>;
  isBasicIncomeSetup: boolean;
}

const WalletContext = createContext<WalletContextProps>({
  walletAddress: null,
  setWalletAddress: async () => {},
  username: null,
  setUsername: async () => {},
  claimableAmount: null,
  tokenBalance: null,
  fetchBasicIncomeInfo: async () => {},
  fetchBalance: async () => {},
  isBasicIncomeSetup: false,
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [claimableAmount, setClaimableAmount] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isBasicIncomeSetup, setIsBasicIncomeSetup] = useState<boolean>(false);

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
        const [stakedAmount, rawClaimableAmount] = result;
        setIsBasicIncomeSetup(stakedAmount > 0n);
        const claimableAmount = fromWei(rawClaimableAmount);
        setClaimableAmount(claimableAmount);
      }
    } catch (error) {
      console.error("Error fetching basic income info:", error);
      setClaimableAmount(null);
      setIsBasicIncomeSetup(false);
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
        setWalletAddress,
        username,
        setUsername,
        claimableAmount,
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
        isBasicIncomeSetup,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
