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
  isLoggedIn: boolean;
  walletAddress: string | null;
  username: string | null;
  basicIncomeInfo: {
    claimableAmount: string;
  } | null;
  tokenBalance: string | null;
  setWalletData: (address: string | null, username: string | null) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const WalletContext = createContext<WalletContextProps>({
  isLoggedIn: false,
  walletAddress: null,
  username: null,
  basicIncomeInfo: null,
  tokenBalance: null,
  setWalletData: () => {},
  setIsLoggedIn: () => {}, // Default empty function
});

interface WalletProviderProps {
  children: ReactNode;
}

const stakingContractABI = parseAbi([
  "function getStakeInfo(address) external view returns (uint256, uint256)",
  "function stake() external",
  "function claimRewards() external",
  "event RewardsClaimed(address indexed user, uint256 amount)",
]);

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [basicIncomeInfo, setBasicIncomeInfo] =
    useState<WalletContextProps["basicIncomeInfo"]>(null);
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

  const fetchBasicIncomeInfo = async () => {
    if (!walletAddress) return;

    try {
      const result = await viemClient.readContract({
        address: "0x2f08c17B30e6622F8B780fb58835Fc0927E2dc8e",
        abi: parseAbi([
          "function getStakeInfo(address) external view returns (uint256, uint256)",
        ]),
        functionName: "getStakeInfo",
        args: [walletAddress as `0x${string}`],
      });

      if (Array.isArray(result) && result.length === 2) {
        setBasicIncomeInfo({
          claimableAmount: (Number(result[1]) / 1e18).toString(),
        });
      }
    } catch (error) {
      console.error("Error fetching basic income info:", error);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;

    const unwatch = viemClient.watchContractEvent({
      address: "0x2f08c17B30e6622F8B780fb58835Fc0927E2dc8e",
      abi: stakingContractABI,
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
        basicIncomeInfo,
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
