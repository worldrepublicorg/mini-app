"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { parseAbi } from "viem";
import { viemClient } from "@/lib/viemClient";
import { MiniKit } from "@worldcoin/minikit-js";
import type { WalletContextProps, WalletProviderProps } from "@/lib/types";

const WalletContext = createContext<WalletContextProps>({
  walletAddress: null,
  username: null,
  tokenBalance: null,
  claimableAmount: null,
  claimableAmountPlus: null,
  basicIncomeActivated: false,
  basicIncomePlusActivated: false,
  rewardCount: 0,
  secureDocumentRewardCount: 0,
  setWalletAddress: () => {},
  setUsername: () => {},
  fetchBasicIncomeInfo: async () => {},
  fetchBasicIncomePlusInfo: async () => {},
  fetchBalance: async () => {},
  fetchRewardCount: async () => {},
  fetchSecureDocumentRewardCount: async () => {},
  setBasicIncomeActivated: () => {},
  setBasicIncomePlusActivated: () => {},
});

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
  const [rewardCount, setRewardCount] = useState(0);
  const [secureDocumentRewardCount, setSecureDocumentRewardCount] = useState(0);

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
        console.log("[WalletContext] Checking auth status");
        const res = await fetch("/api/me");
        const data = await res.json();
        console.log("[WalletContext] Auth status response:", data);
        if (data.walletAddress) {
          console.log(
            "[WalletContext] Setting wallet address:",
            data.walletAddress
          );
          setWalletAddress(data.walletAddress);
          if (MiniKit.user?.username) {
            console.log(
              "[WalletContext] Setting username:",
              MiniKit.user.username
            );
            setUsername(MiniKit.user.username);
          }
        }
      } catch (error) {
        console.error("[WalletContext] Error checking auth status", error);
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
    console.log(
      "[WalletContext] fetchBasicIncomeInfo called for:",
      walletAddress
    );
    try {
      console.log("[WalletContext] Fetching basic income info from contract");
      const result = await viemClient.readContract({
        address: "0x02c3B99D986ef1612bAC63d4004fa79714D00012",
        abi: parseAbi([
          "function getStakeInfo(address) external view returns (uint256, uint256)",
        ]),
        functionName: "getStakeInfo",
        args: [walletAddress as `0x${string}`],
      });
      console.log("[WalletContext] Basic income info result:", result);

      if (Array.isArray(result) && result.length === 2) {
        const stake = fromWei(result[0]);
        const newClaimable = fromWei(result[1]);
        console.log(
          "[WalletContext] Basic income claimable amount:",
          newClaimable
        );
        setClaimableAmount(newClaimable);
        setBasicIncomeActivated(stake !== "0");
        console.log(
          "[WalletContext] Updated basicIncomeActivated:",
          stake !== "0"
        );
      }
    } catch (error) {
      console.error("[WalletContext] Error fetching basic income info:", error);
      setTimeout(fetchBasicIncomeInfo, 1000);
    }
  }, [walletAddress, setClaimableAmount, setBasicIncomeActivated, fromWei]);

  const fetchBasicIncomePlusInfo = useCallback(async () => {
    if (!walletAddress) return;
    console.log(
      "[WalletContext] fetchBasicIncomePlusInfo called for:",
      walletAddress
    );
    try {
      console.log(
        "[WalletContext] Fetching basic income plus info from contract"
      );
      const result = await viemClient.readContract({
        address: "0x52dfee61180a0bcebe007e5a9cfd466948acca46",
        abi: parseAbi([
          "function getStakeInfo(address) external view returns (uint256, uint256)",
        ]),
        functionName: "getStakeInfo",
        args: [walletAddress as `0x${string}`],
      });
      console.log("[WalletContext] Basic income plus info result:", result);

      if (Array.isArray(result) && result.length === 2) {
        const stake = fromWei(result[0]);
        const newClaimable = fromWei(result[1]);
        console.log(
          "[WalletContext] Basic income plus claimable amount:",
          newClaimable
        );
        setClaimableAmountPlus(newClaimable);
        setBasicIncomePlusActivated(stake !== "0");
        console.log(
          "[WalletContext] Updated basicIncomePlusActivated:",
          stake !== "0"
        );
      }
    } catch (error) {
      console.error(
        "[WalletContext] Error fetching basic income plus info:",
        error
      );
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

  const fetchRewardCount = useCallback(async () => {
    if (!walletAddress) return;

    try {
      console.log("[Referral] Fetching reward count for user...");
      try {
        const referralABI = [
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
            ],
            name: "getRewardCount",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ] as const;

        const count = await viemClient.readContract({
          address:
            "0x372dCA057682994568be074E75a03Ced3dD9E60d" as `0x${string}`,
          abi: referralABI,
          functionName: "getRewardCount",
          args: [walletAddress as `0x${string}`],
        });

        console.log(
          `[Referral] User ${walletAddress} has been rewarded ${count} times`
        );
        setRewardCount(Number(count));
      } catch (error) {
        console.error(
          "[Referral] Error calling getRewardCount function:",
          error
        );
        setTimeout(fetchRewardCount, 1000);
      }
    } catch (error) {
      console.error("[Referral] Error checking reward count:", error);
      setTimeout(fetchRewardCount, 1000);
    }
  }, [walletAddress]);

  const fetchSecureDocumentRewardCount = useCallback(async () => {
    if (!walletAddress) return;

    try {
      console.log(
        "[Referral] Fetching secure document reward count for user..."
      );
      try {
        const referralABI = [
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
            ],
            name: "getRewardCount",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ] as const;

        const count = await viemClient.readContract({
          address:
            "0x012399Ce7108DD3B8C5583758816575f0c2FcD86" as `0x${string}`, // Update with real contract address
          abi: referralABI,
          functionName: "getRewardCount",
          args: [walletAddress as `0x${string}`],
        });

        console.log(
          `[Referral] User ${walletAddress} has been rewarded ${count} times on secure document contract`
        );
        setSecureDocumentRewardCount(Number(count));
      } catch (error) {
        console.error(
          "[Referral] Error calling secure document getRewardCount function:",
          error
        );
        setTimeout(fetchSecureDocumentRewardCount, 1000);
      }
    } catch (error) {
      console.error(
        "[Referral] Error checking secure document reward count:",
        error
      );
      setTimeout(fetchSecureDocumentRewardCount, 1000);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      fetchRewardCount();
      fetchSecureDocumentRewardCount();
    }
  }, [walletAddress, fetchRewardCount, fetchSecureDocumentRewardCount]);

  useEffect(() => {
    if (!walletAddress) return;
    console.log(
      "[WalletContext] Wallet address changed, fetching basic income info:",
      walletAddress
    );

    fetchBasicIncomeInfo();

    try {
      console.log(
        "[WalletContext] Setting up event watcher for RewardsClaimed"
      );
      const unwatch = viemClient.watchContractEvent({
        address: "0x02c3B99D986ef1612bAC63d4004fa79714D00012",
        abi: parseAbi([
          "event RewardsClaimed(address indexed user, uint256 amount)",
        ]),
        eventName: "RewardsClaimed",
        args: { user: walletAddress },
        onLogs: (logs: unknown) => {
          console.log("[WalletContext] RewardsClaimed event detected:", logs);
          fetchBasicIncomeInfo();
        },
      });

      return () => {
        console.log("[WalletContext] Cleaning up RewardsClaimed event watcher");
        unwatch();
      };
    } catch (error) {
      console.error(
        "[WalletContext] Error watching RewardsClaimed events:",
        error
      );
    }
  }, [walletAddress, fetchBasicIncomeInfo]);

  useEffect(() => {
    if (!walletAddress) return;
    console.log(
      "[WalletContext] Wallet address changed, fetching basic income plus info:",
      walletAddress
    );

    fetchBasicIncomePlusInfo();

    try {
      console.log(
        "[WalletContext] Setting up event watcher for RewardsClaimed (Plus)"
      );
      const unwatch = viemClient.watchContractEvent({
        address: "0x52dfee61180a0bcebe007e5a9cfd466948acca46",
        abi: parseAbi([
          "event RewardsClaimed(address indexed user, uint256 amount)",
        ]),
        eventName: "RewardsClaimed",
        args: { user: walletAddress },
        onLogs: (logs: unknown) => {
          console.log(
            "[WalletContext] RewardsClaimed (Plus) event detected:",
            logs
          );
          fetchBasicIncomePlusInfo();
        },
      });

      return () => {
        console.log(
          "[WalletContext] Cleaning up RewardsClaimed (Plus) event watcher"
        );
        unwatch();
      };
    } catch (error) {
      console.error(
        "[WalletContext] Error watching RewardsClaimed (Plus) events:",
        error
      );
    }
  }, [walletAddress, fetchBasicIncomePlusInfo]);

  useEffect(() => {
    if (!walletAddress) return;
    console.log(
      "[WalletContext] Wallet address changed, fetching balance:",
      walletAddress
    );

    fetchBalance();

    try {
      console.log("[WalletContext] Setting up event watcher for Transfer");
      const unwatch = viemClient.watchContractEvent({
        address: "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B",
        abi: parseAbi([
          "event Transfer(address indexed from, address indexed to, uint256 value)",
        ]),
        eventName: "Transfer",
        args: [walletAddress as `0x${string}`, walletAddress as `0x${string}`],
        onLogs: (logs: unknown) => {
          console.log("[WalletContext] Transfer event detected:", logs);
          fetchBalance();
        },
      });

      return () => {
        console.log("[WalletContext] Cleaning up Transfer event watcher");
        unwatch();
      };
    } catch (error) {
      console.error("[WalletContext] Error watching Transfer events:", error);
    }
  }, [walletAddress, fetchBalance]);

  useEffect(() => {
    if (!walletAddress) return;

    try {
      console.log(
        "[WalletContext] Setting up event watcher for RewardSent events"
      );
      const unwatch = viemClient.watchContractEvent({
        address: "0x372dCA057682994568be074E75a03Ced3dD9E60d" as `0x${string}`,
        abi: parseAbi([
          "event RewardSent(address indexed sender, address indexed recipient, uint256 amount)",
        ]),
        eventName: "RewardSent",
        args: { recipient: walletAddress },
        onLogs: (logs: unknown) => {
          console.log("[WalletContext] RewardSent event detected:", logs);
          fetchRewardCount(); // Update reward count when a new reward is received
          fetchBalance();
        },
      });

      return () => {
        console.log("[WalletContext] Cleaning up RewardSent event watcher");
        unwatch();
      };
    } catch (error) {
      console.error("[WalletContext] Error watching RewardSent events:", error);
    }
  }, [walletAddress, fetchRewardCount, fetchBalance]);

  // Watch for RewardSent events from the secure document contract
  useEffect(() => {
    if (!walletAddress) return;

    try {
      console.log(
        "[WalletContext] Setting up event watcher for secure document RewardSent events"
      );
      const unwatch = viemClient.watchContractEvent({
        address: "0x012399Ce7108DD3B8C5583758816575f0c2FcD86" as `0x${string}`, // Update with real contract address
        abi: parseAbi([
          "event RewardSent(address indexed sender, address indexed recipient, uint256 amount)",
        ]),
        eventName: "RewardSent",
        args: { recipient: walletAddress },
        onLogs: (logs: unknown) => {
          console.log(
            "[WalletContext] Secure document RewardSent event detected:",
            logs
          );
          fetchSecureDocumentRewardCount(); // Update reward count when a new reward is received
          fetchBalance();
        },
      });

      return () => {
        console.log(
          "[WalletContext] Cleaning up secure document RewardSent event watcher"
        );
        unwatch();
      };
    } catch (error) {
      console.error(
        "[WalletContext] Error watching secure document RewardSent events:",
        error
      );
    }
  }, [walletAddress, fetchSecureDocumentRewardCount, fetchBalance]);

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
        rewardCount,
        secureDocumentRewardCount,
        setWalletAddress,
        setUsername,
        fetchBasicIncomeInfo,
        fetchBasicIncomePlusInfo,
        fetchBalance,
        fetchRewardCount,
        fetchSecureDocumentRewardCount,
        setBasicIncomeActivated,
        setBasicIncomePlusActivated,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
