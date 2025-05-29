import { useState, useEffect, useCallback, useRef } from "react";
import { useWallet } from "@/components/contexts/WalletContext";
import { viemClient } from "@/lib/viemClient";
import { parseAbi } from "viem";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { useToast } from "@/components/ui/Toast";
import { useMiniKit } from "@/components/providers/minikit-provider";

export function useSavingsTab({
  lang,
  dictionary,
}: {
  lang: string;
  dictionary: any;
}) {
  const { walletAddress, tokenBalance, fetchBalance } = useWallet();
  const { showToast } = useToast();
  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const [availableReward, setAvailableReward] = useState<string>("0");
  const [displayAvailableReward, setDisplayAvailableReward] = useState<
    string | null
  >(null);
  const [amount, setAmount] = useState("");
  const [selectedAction, setSelectedAction] = useState<"deposit" | "withdraw">(
    "deposit"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [txType, setTxType] = useState<
    null | "deposit" | "withdraw" | "collect"
  >(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackStartedRef = useRef(false);
  const currentTxRef = useRef<string | null>(null);
  const { isInstalled } = useMiniKit();

  const STAKING_CONTRACT_ADDRESS = "0x234302Db10A54BDc11094A8Ef816B0Eaa5FCE3f7";
  const MAIN_TOKEN_ADDRESS = "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B";

  // Utility
  const fromWei = useCallback(
    (value: bigint) => (Number(value) / 1e18).toString(),
    []
  );

  // Fetch staked balance
  const fetchStakedBalance = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const balanceAbi = parseAbi([
        "function balanceOf(address account) external view returns (uint256)",
      ]);
      const result: bigint = await viemClient.readContract({
        address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
        abi: balanceAbi,
        functionName: "balanceOf",
        args: [walletAddress],
      });
      const balance = fromWei(result);
      setStakedBalance(balance);
      localStorage.setItem("stakedBalance", balance);
    } catch (error) {
      setTimeout(fetchStakedBalance, 1000);
    }
  }, [walletAddress, fromWei]);

  // Fetch available reward
  const fetchAvailableReward = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const availableAbi = parseAbi([
        "function available(address account) external view returns (uint256)",
      ]);
      const result: bigint = await viemClient.readContract({
        address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
        abi: availableAbi,
        functionName: "available",
        args: [walletAddress],
      });
      const resultAsString = fromWei(result);
      setAvailableReward(resultAsString);
      localStorage.setItem("savingsRewardBase", resultAsString);
      localStorage.setItem("savingsRewardStartTime", Date.now().toString());
    } catch (error) {
      // silent fail
    }
  }, [walletAddress, fromWei]);

  // Real-time reward calculation
  useEffect(() => {
    if (!stakedBalance || !availableReward) return;
    let baseValue = Number(availableReward);
    let startTime = Date.now();
    const storedBase = localStorage.getItem("savingsRewardBase");
    const storedStartTime = localStorage.getItem("savingsRewardStartTime");
    if (storedBase && storedStartTime) {
      baseValue = parseFloat(storedBase);
      startTime = parseInt(storedStartTime, 10);
      if (Math.abs(Number(availableReward) - baseValue) > 0.000001) {
        baseValue = Number(availableReward);
        startTime = Date.now();
        localStorage.setItem("savingsRewardBase", baseValue.toString());
        localStorage.setItem("savingsRewardStartTime", startTime.toString());
      }
    }
    const interestRate = 1 / (86400 * 529);
    const stakedBalanceNum = Number(stakedBalance);
    const updateDisplay = () => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const interestEarned = stakedBalanceNum * interestRate * elapsedSeconds;
      const totalReward = baseValue + interestEarned;
      let decimalPlaces = 11;
      if (stakedBalanceNum >= 1000000) decimalPlaces = 3;
      else if (stakedBalanceNum >= 100000) decimalPlaces = 4;
      else if (stakedBalanceNum >= 10000) decimalPlaces = 5;
      else if (stakedBalanceNum >= 1000) decimalPlaces = 6;
      else if (stakedBalanceNum >= 100) decimalPlaces = 7;
      else if (stakedBalanceNum >= 10) decimalPlaces = 8;
      else if (stakedBalanceNum >= 1) decimalPlaces = 9;
      else if (stakedBalanceNum >= 0.1) decimalPlaces = 10;
      setDisplayAvailableReward(totalReward.toFixed(decimalPlaces));
    };
    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);
    return () => clearInterval(interval);
  }, [stakedBalance, availableReward]);

  // Fetch on wallet change
  useEffect(() => {
    if (!walletAddress) {
      setDisplayAvailableReward(null);
      return;
    }
    fetchAvailableReward();
    fetchStakedBalance();
    const fetchInterval = setInterval(
      () => {
        fetchAvailableReward();
        fetchStakedBalance();
      },
      5 * 60 * 1000
    );
    return () => clearInterval(fetchInterval);
  }, [walletAddress, fetchAvailableReward, fetchStakedBalance]);

  // Shared pendingTx state and polling ref
  const [pendingTx, setPendingTx] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Transaction logic
  const finishTx = (txId?: string) => {
    if (txId && txId !== transactionId) return;
    setIsLoading(false);
    setTxType(null);
    setTransactionId(null);
    setPendingTx(false);
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
  };
  const fetchStakedBalanceValue = async (): Promise<string> => {
    if (!walletAddress) return "0";
    const result: bigint = await viemClient.readContract({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: parseAbi([
        "function balanceOf(address account) external view returns (uint256)",
      ]),
      functionName: "balanceOf",
      args: [walletAddress],
    });
    return fromWei(result);
  };
  const fetchAvailableRewardValue = async (): Promise<string> => {
    if (!walletAddress) return "0";
    const result: bigint = await viemClient.readContract({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: parseAbi([
        "function available(address account) external view returns (uint256)",
      ]),
      functionName: "available",
      args: [walletAddress],
    });
    return fromWei(result);
  };

  // Centralized refetch function for all balances (sequential)
  const refetchBalancesSequentially = useCallback(async () => {
    // Fetch staked balance first
    const newStakedBalance = await fetchStakedBalanceValue();
    setStakedBalance(newStakedBalance);

    // Then fetch reward (which may depend on new staked balance)
    const newAvailableReward = await fetchAvailableRewardValue();
    setAvailableReward(newAvailableReward);

    // Then fetch wallet balance
    await fetchBalance();
  }, [fetchStakedBalanceValue, fetchAvailableRewardValue, fetchBalance]);

  // Improved polling logic: starts immediately after tx, stops on receipt or balance change
  const startPolling = useCallback(
    async (prevStakedBalance: string, prevAvailableReward?: string) => {
      let attempts = 0;
      const maxAttempts = 30;
      const poll = async () => {
        if (!pendingTx) return; // Stop if tx is no longer pending
        let changed = false;
        if (prevAvailableReward !== undefined) {
          const newReward = await fetchAvailableRewardValue();
          if (newReward !== prevAvailableReward) changed = true;
        } else {
          const newBalance = await fetchStakedBalanceValue();
          if (newBalance !== prevStakedBalance) changed = true;
        }
        if (changed) {
          await refetchBalancesSequentially();
          setPendingTx(false);
          return;
        }
        attempts++;
        if (attempts < maxAttempts) {
          pollingRef.current = setTimeout(poll, 2000);
        } else {
          showToast(
            dictionary?.components?.toasts?.wallet?.pollingTimeout ||
              "Transaction may not have completed. Please refresh.",
            "error"
          );
          setPendingTx(false);
        }
      };
      poll();
    },
    [
      pendingTx,
      fetchStakedBalanceValue,
      fetchAvailableRewardValue,
      refetchBalancesSequentially,
      showToast,
      dictionary,
    ]
  );

  const handleStake = async () => {
    const windowKit =
      typeof window !== "undefined" &&
      (window as any).MiniKit &&
      (window as any).MiniKit.isInstalled?.();
    if (!isInstalled && !MiniKit.isInstalled() && !windowKit) {
      showToast(
        dictionary?.components?.stakeForm?.installMiniKit ||
          dictionary?.components?.toasts?.wallet?.connectInWorldApp ||
          "Please open this app in the World App to use this feature.",
        "error"
      );
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    setTxType("deposit");
    setTransactionId(null);
    currentTxRef.current = null;
    let stakeAmount: bigint;
    try {
      stakeAmount = BigInt(Number(amount) * 1e18 - 9999999);
    } catch (error) {
      return;
    }
    if (stakeAmount <= 0n) return;
    const stakeAmountStr = stakeAmount.toString();
    const nonce = Date.now().toString();
    const currentTime = Math.floor(Date.now() / 1000);
    const deadline = currentTime + 600;
    const permitArg = [
      [MAIN_TOKEN_ADDRESS, stakeAmountStr],
      nonce,
      deadline.toString(),
    ];
    const transferDetailsArg = [STAKING_CONTRACT_ADDRESS, stakeAmountStr];
    try {
      const prevStakedBalance = await fetchStakedBalanceValue();
      setPendingTx(true);
      startPolling(prevStakedBalance);
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
            abi: parseAbi([
              "function stakeWithPermit(uint256 amount, ((address token, uint256 amount) permitted, uint256 nonce, uint256 deadline) permit, (address to, uint256 requestedAmount) transferDetails, bytes signature)",
            ]),
            functionName: "stakeWithPermit",
            args: [
              stakeAmountStr,
              permitArg,
              transferDetailsArg,
              "PERMIT2_SIGNATURE_PLACEHOLDER_0",
            ],
          },
        ],
        permit2: [
          {
            permitted: {
              token: MAIN_TOKEN_ADDRESS,
              amount: stakeAmountStr,
            },
            spender: STAKING_CONTRACT_ADDRESS,
            nonce,
            deadline: deadline.toString(),
          },
        ],
      });
      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          const errorMessage =
            (finalPayload as any).description ||
            dictionary?.components?.toasts?.wallet?.stakingError;
          showToast(errorMessage, "error");
        }
        finishTx();
      } else {
        setTransactionId(finalPayload.transaction_id);
        currentTxRef.current = finalPayload.transaction_id;
        setAmount("");
        localStorage.setItem("savingsRewardBase", "0");
        localStorage.setItem("savingsRewardStartTime", Date.now().toString());
        // Polling already started above
      }
    } catch (error: any) {
      finishTx();
    }
  };
  const handleWithdraw = async () => {
    const windowKit =
      typeof window !== "undefined" &&
      (window as any).MiniKit &&
      (window as any).MiniKit.isInstalled?.();
    if (!isInstalled && !MiniKit.isInstalled() && !windowKit) {
      showToast(
        dictionary?.components?.stakeForm?.installMiniKit ||
          dictionary?.components?.toasts?.wallet?.connectInWorldApp ||
          "Please open this app in the World App to use this feature.",
        "error"
      );
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    setTxType("withdraw");
    try {
      const prevStakedBalance = await fetchStakedBalanceValue();
      setPendingTx(true);
      startPolling(prevStakedBalance);
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
            abi: parseAbi(["function withdraw(uint256 amount) external"]),
            functionName: "withdraw",
            args: [amount],
          },
        ],
      });
      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          const errorMessage =
            (finalPayload as any).description ||
            dictionary?.components?.toasts?.wallet?.withdrawError;
          showToast(errorMessage, "error");
        }
        finishTx();
      } else {
        setTransactionId(finalPayload.transaction_id);
        currentTxRef.current = finalPayload.transaction_id;
        setAmount("");
        localStorage.setItem("savingsRewardBase", "0");
        localStorage.setItem("savingsRewardStartTime", Date.now().toString());
        // Polling already started above
      }
    } catch (error: any) {
      finishTx();
    }
  };
  const handleCollect = async () => {
    const windowKit =
      typeof window !== "undefined" &&
      (window as any).MiniKit &&
      (window as any).MiniKit.isInstalled?.();
    if (!isInstalled && !MiniKit.isInstalled() && !windowKit) {
      showToast(
        dictionary?.components?.stakeForm?.installMiniKit ||
          dictionary?.components?.toasts?.wallet?.connectInWorldApp ||
          "Please open this app in the World App to use this feature.",
        "error"
      );
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    setTxType("collect");
    try {
      const prevAvailableReward = await fetchAvailableRewardValue();
      setPendingTx(true);
      startPolling("", prevAvailableReward);
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
            abi: parseAbi(["function redeem() external"]),
            functionName: "redeem",
            args: [],
          },
        ],
      });
      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          const errorMessage =
            (finalPayload as any).description ||
            dictionary?.components?.toasts?.wallet?.collectError;
          showToast(errorMessage, "error");
        }
        finishTx();
      } else {
        setTransactionId(finalPayload.transaction_id);
        currentTxRef.current = finalPayload.transaction_id;
        // Polling already started above
      }
    } catch (error: any) {
      finishTx();
    }
  };
  const { isSuccess } = useWaitForTransactionReceipt({
    client: viemClient,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_APP_ID as `app_${string}`,
    },
    transactionId: transactionId || "",
  });
  useEffect(() => {
    if (
      isSuccess &&
      txType &&
      transactionId === currentTxRef.current &&
      pendingTx
    ) {
      refetchBalancesSequentially();
      setPendingTx(false);
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
      finishTx();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, txType, transactionId, pendingTx]);
  return {
    stakedBalance,
    displayAvailableReward,
    amount,
    setAmount,
    selectedAction,
    setSelectedAction,
    isLoading,
    handleStake,
    handleWithdraw,
    handleCollect,
    tokenBalance: tokenBalance ?? "0",
  };
}
