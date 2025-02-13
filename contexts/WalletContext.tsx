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

interface WalletContextProps {
  walletAddress: string | null;
  username: string | null;
  isLoggedIn: boolean;
  stakeInfo: {
    tokensStaked: string;
    rewards: string;
    staked: string;
    lastStaked: string | null;
  } | null;
  tokenBalance: string | null;
  setWalletData: (address: string | null, username: string | null) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const WalletContext = createContext<WalletContextProps>({
  walletAddress: null,
  username: null,
  isLoggedIn: false,
  stakeInfo: null,
  tokenBalance: null,
  setWalletData: () => {},
  setIsLoggedIn: () => {}, // Default empty function
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [stakeInfo, setStakeInfo] =
    useState<WalletContextProps["stakeInfo"]>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage on initial mount
    const storedAddress = localStorage.getItem("walletAddress");
    const storedUsername = localStorage.getItem("username");
    if (storedAddress) {
      setWalletAddress(storedAddress);
      setIsLoggedIn(true); // Set isLoggedIn based on stored address
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchStakeInfo = async () => {
      if (!walletAddress) return;

      try {
        const stakeInfoResult = await viemClient.readContract({
          address: "0x2f08c17B30e6622F8B780fb58835Fc0927E2dc8e",
          abi: parseAbi([
            "function getStakeInfo(address) external view returns (uint256, uint256)",
          ]),
          functionName: "getStakeInfo",
          args: [walletAddress as `0x${string}`],
        });

        if (Array.isArray(stakeInfoResult) && stakeInfoResult.length === 2) {
          setStakeInfo({
            tokensStaked: (Number(stakeInfoResult[0]) / 1e18).toString(),
            rewards: (Number(stakeInfoResult[1]) / 1e18).toString(),
            staked: "0",
            lastStaked: null,
          });
        }
      } catch (error) {
        console.error("Error fetching stake info:", error);
      }
    };

    if (walletAddress) {
      fetchStakeInfo();
      const interval = setInterval(fetchStakeInfo, 1000);
      return () => clearInterval(interval);
    }
  }, [walletAddress]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) return;

      try {
        const balanceResult = await viemClient.readContract({
          address: "0xAAC7d5E9011Fc0fC80bF707DDcC3D56DdfDa9084",
          abi: parseAbi([
            "function balanceOf(address) external view returns (uint256)",
          ]),
          functionName: "balanceOf",
          args: [walletAddress as `0x${string}`],
        });

        if (typeof balanceResult === "bigint") {
          setTokenBalance((Number(balanceResult) / 1e18).toString());
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    if (walletAddress) {
      fetchBalance();
      const interval = setInterval(fetchBalance, 1000);
      return () => clearInterval(interval);
    }
  }, [walletAddress]);

  const setWalletData = (address: string | null, username: string | null) => {
    setWalletAddress(address);
    setUsername(username);
    // Save to localStorage whenever the data changes
    if (address) {
      localStorage.setItem("walletAddress", address);
    } else {
      localStorage.removeItem("walletAddress");
    }
    if (username) {
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("username");
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        username,
        isLoggedIn,
        stakeInfo,
        tokenBalance,
        setWalletData,
        setIsLoggedIn,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
