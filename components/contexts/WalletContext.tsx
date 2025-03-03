"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { parseAbi } from "viem";
import { viemClient } from "@/lib/viemClient";
import { MiniKit } from "@worldcoin/minikit-js";

interface WalletContextProps {
  walletAddress: string | null;
  username: string | null;
  tokenBalance: string | null;
  claimableAmount: string | null;
  claimableAmountPlus: string | null;
  basicIncomeActivated: boolean;
  basicIncomePlusActivated: boolean;
  setWalletAddress: (address: string) => void;
  setUsername: (username: string) => void;
  fetchBasicIncomeInfo: () => Promise<void>;
  fetchBasicIncomePlusInfo: () => Promise<void>;
  fetchBalance: () => Promise<void>;
  setBasicIncomeActivated: (activated: boolean) => void;
  setBasicIncomePlusActivated: (activated: boolean) => void;
}

const WalletContext = createContext<WalletContextProps>({
  walletAddress: null,
  username: null,
  tokenBalance: null,
  claimableAmount: null,
  claimableAmountPlus: null,
  basicIncomeActivated: false,
  basicIncomePlusActivated: false,
  setWalletAddress: () => {},
  setUsername: () => {},
  fetchBasicIncomeInfo: async () => {},
  fetchBasicIncomePlusInfo: async () => {},
  fetchBalance: async () => {},
  setBasicIncomeActivated: () => {},
  setBasicIncomePlusActivated: () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(() => {
    const storedBalance = localStorage.getItem("tokenBalance");
    return storedBalance ? storedBalance : null;
  });
  const [claimableAmount, setClaimableAmount] = useState<string | null>(null);
  const [claimableAmountPlus, setClaimableAmountPlus] = useState<string | null>(
    null
  );
  const [basicIncomeActivated, setBasicIncomeActivatedState] = useState(false);
  const [basicIncomePlusActivated, setBasicIncomePlusActivatedState] =
    useState(false);

  const setBasicIncomeActivated = useCallback((activated: boolean) => {
    setBasicIncomeActivatedState(activated);
    localStorage.setItem("basicIncomeActivated", activated.toString());
  }, []);

  const setBasicIncomePlusActivated = useCallback((activated: boolean) => {
    setBasicIncomePlusActivatedState(activated);
    localStorage.setItem("basicIncomePlusActivated", activated.toString());
  }, []);

  const fromWei = useCallback(
    (value: bigint) => (Number(value) / 1e18).toString(),
    []
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data.walletAddress) {
          setWalletAddress(data.walletAddress);
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

  useEffect(() => {
    const storedActivated = localStorage.getItem("basicIncomeActivated");
    if (storedActivated !== null) {
      setBasicIncomeActivatedState(storedActivated === "true");
    }
    const storedActivatedPlus = localStorage.getItem(
      "basicIncomePlusActivated"
    );
    if (storedActivatedPlus !== null) {
      setBasicIncomePlusActivatedState(storedActivatedPlus === "true");
    }
  }, []);

  const fetchBasicIncomeInfo = useCallback(async () => {
    if (!walletAddress) return;
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
        const stake = fromWei(result[0]);
        const newClaimable = fromWei(result[1]);
        setClaimableAmount(newClaimable);
        setBasicIncomeActivated(stake !== "0");
      }
    } catch (error) {
      console.error("Error fetching basic income info:", error);
      setTimeout(fetchBasicIncomeInfo, 1000);
    }
  }, [walletAddress, setClaimableAmount, setBasicIncomeActivated, fromWei]);

  const fetchBasicIncomePlusInfo = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const result = await viemClient.readContract({
        address: "0x52dfee61180a0bcebe007e5a9cfd466948acca46",
        abi: parseAbi([
          "function getStakeInfo(address) external view returns (uint256, uint256)",
        ]),
        functionName: "getStakeInfo",
        args: [walletAddress as `0x${string}`],
      });

      if (Array.isArray(result) && result.length === 2) {
        const stake = fromWei(result[0]);
        const newClaimable = fromWei(result[1]);
        setClaimableAmountPlus(newClaimable);
        setBasicIncomePlusActivated(stake !== "0");
      }
    } catch (error) {
      console.error("Error fetching basic income info:", error);
      setTimeout(fetchBasicIncomePlusInfo, 1000);
    }
  }, [
    walletAddress,
    setClaimableAmountPlus,
    setBasicIncomePlusActivated,
    fromWei,
  ]);

  const fetchBalance = useCallback(async () => {
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
        localStorage.setItem("tokenBalance", newTokenBalance);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setTimeout(fetchBalance, 1000);
    }
  }, [walletAddress, setTokenBalance, fromWei]);

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
  }, [walletAddress, fetchBasicIncomeInfo]);

  useEffect(() => {
    if (!walletAddress) return;

    fetchBasicIncomePlusInfo();

    try {
      const unwatch = viemClient.watchContractEvent({
        address: "0x52dfee61180a0bcebe007e5a9cfd466948acca46",
        abi: parseAbi([
          "event RewardsClaimed(address indexed user, uint256 amount)",
        ]),
        eventName: "RewardsClaimed",
        args: { user: walletAddress },
        onLogs: fetchBasicIncomePlusInfo,
      });

      return () => unwatch();
    } catch (error) {
      console.error("Error watching RewardsClaimed events:", error);
    }
  }, [walletAddress, fetchBasicIncomePlusInfo]);

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
  }, [walletAddress, fetchBalance]);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        username,
        tokenBalance,
        claimableAmount,
        claimableAmountPlus,
        basicIncomeActivated,
        basicIncomePlusActivated,
        setWalletAddress,
        setUsername,
        fetchBasicIncomeInfo,
        fetchBasicIncomePlusInfo,
        fetchBalance,
        setBasicIncomeActivated,
        setBasicIncomePlusActivated,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
