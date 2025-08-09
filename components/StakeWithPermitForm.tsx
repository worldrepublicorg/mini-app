"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { parseAbi } from "viem";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWallet } from "@/components/contexts/WalletContext";
import { viemClient } from "@/lib/viemClient";
import { useToast } from "@/components/ui/Toast";
import { useTranslations } from "@/hooks/useTranslations";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";

interface StakeWithPermitFormProps {
  stakedBalance: string;
  displayAvailableReward: string | null;
  fetchStakedBalance: () => Promise<void>;
  fetchAvailableReward: () => Promise<void>;
  lang: string;
}

const STAKING_CONTRACT_ADDRESS = "0x234302Db10A54BDc11094A8Ef816B0Eaa5FCE3f7";
const MAIN_TOKEN_ADDRESS = "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B";

type TxType = null | "deposit" | "withdraw" | "collect";

export function StakeWithPermitForm({
  stakedBalance,
  displayAvailableReward,
  fetchStakedBalance,
  fetchAvailableReward,
  lang,
}: StakeWithPermitFormProps) {
  const { walletAddress, tokenBalance, fetchBalance } = useWallet();
  const { showToast } = useToast();
  const [amount, setAmount] = useState("");
  const [selectedAction, setSelectedAction] = useState<"deposit" | "withdraw">(
    "deposit"
  );

  // Unified transaction state
  const [txType, setTxType] = useState<TxType>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dictionary = useTranslations(lang);

  // Add a ref to track if fallback polling has started, and a ref for the timer
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackStartedRef = useRef(false);

  // Helper to clear fallback timer
  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    fallbackStartedRef.current = false;
  }, []);

  // Helper: call this when the UI should be reset after tx
  const finishTx = useCallback(
    (txId?: string) => {
      if (txId && txId !== transactionId) return; // Only finish for the current tx
      setIsLoading(false);
      setTxType(null);
      setTransactionId(null);
      clearFallbackTimer();
    },
    [transactionId, clearFallbackTimer]
  );

  // Helper: fetch staked balance value (returns string)
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
    return (Number(result) / 1e18).toString();
  };

  // Helper: fetch available reward value (returns string)
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
    return (Number(result) / 1e18).toString();
  };

  // Poll for staked balance change
  const pollForStakedBalanceChange = async (
    prevStakedBalance: string,
    maxAttempts = 30,
    interval = 2000
  ) => {
    let attempts = 0;
    while (attempts < maxAttempts) {
      const newStakedBalance = await fetchStakedBalanceValue();
      if (newStakedBalance !== prevStakedBalance) {
        await fetchStakedBalance();
        await fetchAvailableReward();
        await fetchBalance();
        break;
      }
      await new Promise((res) => setTimeout(res, interval));
      attempts++;
    }
  };

  // Poll for available reward change
  const pollForAvailableRewardChange = async (
    prevAvailableReward: string,
    maxAttempts = 30,
    interval = 2000
  ) => {
    let attempts = 0;
    while (attempts < maxAttempts) {
      const newAvailableReward = await fetchAvailableRewardValue();
      if (newAvailableReward !== prevAvailableReward) {
        await fetchAvailableReward();
        await fetchBalance();
        break;
      }
      await new Promise((res) => setTimeout(res, interval));
      attempts++;
    }
  };

  // Fast path: event listeners (already present in useEffect below)
  // They should call finishTx() after updating state

  // Fallback polling for stake/withdraw
  const startFallbackPollingStaked = async (prevStakedBalance: string) => {
    fallbackStartedRef.current = true;
    await pollForStakedBalanceChange(prevStakedBalance);
    finishTx();
  };

  // Fallback polling for collect
  const startFallbackPollingReward = async (prevAvailableReward: string) => {
    fallbackStartedRef.current = true;
    await pollForAvailableRewardChange(prevAvailableReward);
    finishTx();
  };

  const currentTxRef = useRef<string | null>(null);

  const handleStake = async () => {
    if (isLoading) return; // Prevent overlapping transactions
    clearFallbackTimer(); // Clean up any previous timers
    if (!MiniKit.isInstalled()) {
      showToast(
        dictionary?.components?.toasts?.wallet?.connectInWorldApp,
        "error"
      );
      return;
    }
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
        // Start fallback timer (7s)
        fallbackTimerRef.current = setTimeout(() => {
          if (!fallbackStartedRef.current) {
            startFallbackPollingStaked(prevStakedBalance);
          }
        }, 7000);
      }
    } catch (error: any) {
      finishTx();
    }
  };

  const handleWithdraw = async () => {
    if (!MiniKit.isInstalled()) {
      showToast(
        dictionary?.components?.toasts?.wallet?.connectInWorldApp,
        "error"
      );
      return;
    }
    let withdrawAmount: bigint;
    try {
      withdrawAmount = BigInt(Number(amount) * 1e18 - 9999999);
    } catch (error) {
      return;
    }
    if (withdrawAmount <= 0n) return;
    const withdrawAmountStr = withdrawAmount.toString();
    setIsLoading(true);
    setTxType("withdraw");
    try {
      const prevStakedBalance = await fetchStakedBalanceValue();
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
            abi: parseAbi(["function withdraw(uint256 amount) external"]),
            functionName: "withdraw",
            args: [withdrawAmountStr],
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
        fallbackTimerRef.current = setTimeout(() => {
          if (!fallbackStartedRef.current) {
            startFallbackPollingStaked(prevStakedBalance);
          }
        }, 7000);
      }
    } catch (error: any) {
      finishTx();
    }
  };

  const handleCollect = async () => {
    if (!MiniKit.isInstalled()) {
      showToast(
        dictionary?.components?.toasts?.wallet?.connectInWorldApp,
        "error"
      );
      return;
    }
    setIsLoading(true);
    setTxType("collect");
    try {
      const prevAvailableReward = await fetchAvailableRewardValue();
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
        fallbackTimerRef.current = setTimeout(() => {
          if (!fallbackStartedRef.current) {
            startFallbackPollingReward(prevAvailableReward);
          }
        }, 7000);
      }
    } catch (error: any) {
      finishTx();
    }
  };

  const { isSuccess } = useWaitForTransactionReceipt({
    client: viemClient,
    appConfig: {
      app_id: "app_66c83ab8c851fb1e54b1b1b62c6ce39d",
    },
    transactionId: transactionId!,
  });

  useEffect(() => {
    if (!walletAddress) return;

    const unwatchStakedWithPermit = viemClient.watchContractEvent({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: parseAbi([
        "event StakedWithPermit(address indexed user, uint256 amount)",
      ]),
      eventName: "StakedWithPermit",
      args: { user: walletAddress },
      onLogs: (logs: any) => {
        if (
          currentTxRef.current &&
          logs[0]?.transactionHash === currentTxRef.current
        ) {
          finishTx(currentTxRef.current);
        }
      },
    });

    const unwatchWithdrawn = viemClient.watchContractEvent({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: parseAbi(["event Withdrawn(address indexed user, uint256 amount)"]),
      eventName: "Withdrawn",
      args: { user: walletAddress },
      onLogs: (logs: any) => {
        if (
          currentTxRef.current &&
          logs[0]?.transactionHash === currentTxRef.current
        ) {
          finishTx(currentTxRef.current);
        }
      },
    });

    const unwatchRedeemed = viemClient.watchContractEvent({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: parseAbi([
        "event Redeemed(address indexed user, uint256 rewardAmount)",
      ]),
      eventName: "Redeemed",
      args: { user: walletAddress },
      onLogs: async (logs: any) => {
        if (
          currentTxRef.current &&
          logs[0]?.transactionHash === currentTxRef.current
        ) {
          finishTx(currentTxRef.current);
        }
      },
    });

    return () => {
      unwatchStakedWithPermit();
      unwatchWithdrawn();
      unwatchRedeemed();
      clearFallbackTimer();
    };
  }, [
    walletAddress,
    fetchAvailableReward,
    fetchStakedBalance,
    fetchBalance,
    clearFallbackTimer,
    finishTx,
  ]);

  useEffect(() => {
    if (isSuccess && txType && transactionId === currentTxRef.current) {
      // Only finish if not already finished by event or fallback 2
      if (isLoading) {
        fetchStakedBalance();
        fetchAvailableReward();
        fetchBalance();
        pollForBalanceUpdate(
          fetchStakedBalance,
          fetchAvailableReward,
          fetchBalance
        ).finally(() => {
          finishTx();
        });
      }
    }
  }, [
    isSuccess,
    txType,
    transactionId,
    isLoading,
    fetchStakedBalance,
    fetchAvailableReward,
    fetchBalance,
    finishTx,
  ]);

  return (
    <div className="w-full">
      <div className="mb-2 flex gap-1">
        <button
          type="button"
          onClick={() => {
            setSelectedAction("deposit");
            setAmount("");
          }}
          className={`h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200 ${
            selectedAction === "deposit" ? "bg-gray-100" : ""
          }`}
        >
          {dictionary?.components?.stakeForm?.deposit}
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedAction("withdraw");
            setAmount("");
          }}
          className={`h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200 ${
            selectedAction === "withdraw" ? "bg-gray-100" : ""
          }`}
        >
          {dictionary?.components?.stakeForm?.withdraw}
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <Typography
            as="p"
            variant={{ variant: "body", level: 2 }}
            className="mb-4 text-[17px] font-medium text-gray-900"
          >
            {dictionary?.components?.stakeForm?.balance}
          </Typography>
          <Typography
            variant={{ variant: "number", level: 6 }}
            className="mb-4 font-['Rubik'] text-base"
          >
            {Number(stakedBalance).toFixed(2)} WDD
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={
              selectedAction === "deposit"
                ? dictionary?.components?.stakeForm?.depositPlaceholder
                : dictionary?.components?.stakeForm?.withdrawPlaceholder
            }
            className={`-ml-2 mr-2 h-9 w-full rounded-xl pl-2 ${
              amount ? "font-['Rubik'] text-[17px]" : "font-sans"
            }`}
          />
          <button
            type="button"
            onClick={() =>
              setAmount(
                selectedAction === "deposit"
                  ? (Math.floor(Number(tokenBalance) * 1e9) / 1e9).toFixed(9) ||
                      "0"
                  : (Math.floor(Number(stakedBalance) * 1e9) / 1e9).toFixed(
                      9
                    ) || "0"
              )
            }
            className={`flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-gray-100 px-4 font-sans text-sm font-medium leading-narrow tracking-normal ${
              amount ===
                (selectedAction === "deposit"
                  ? (Math.floor(Number(tokenBalance) * 1e9) / 1e9).toFixed(9) ||
                    "0"
                  : (Math.floor(Number(stakedBalance) * 1e9) / 1e9).toFixed(
                      9
                    ) || "0") ||
              (selectedAction === "deposit"
                ? Number(tokenBalance) <= 0
                : Number(stakedBalance) <= 0)
                ? "text-gray-400"
                : "text-gray-900"
            }`}
          >
            {dictionary?.components?.stakeForm?.max}
          </button>
        </div>
      </div>

      <div className="mb-6 mt-4 flex items-center justify-between gap-2 px-2">
        <Typography
          as="p"
          variant={{ variant: "body", level: 2 }}
          className="text-[17px] font-medium text-gray-900"
        >
          {dictionary?.components?.stakeForm?.interest}
        </Typography>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCollect}
            isLoading={isLoading}
            variant="primary"
            size="sm"
            className="mr-2 h-9 min-w-20 rounded-full px-4 font-sans"
          >
            {dictionary?.components?.stakeForm?.collect}
          </Button>
          <Typography
            variant={{ variant: "number", level: 6 }}
            className="font-['Rubik'] text-base"
            data-testid="reward-value"
          >
            {displayAvailableReward}
          </Typography>
        </div>
      </div>

      {selectedAction === "deposit" ? (
        <Button onClick={handleStake} isLoading={isLoading} fullWidth>
          {dictionary?.components?.stakeForm?.depositButton}
        </Button>
      ) : (
        <Button onClick={handleWithdraw} isLoading={isLoading} fullWidth>
          {dictionary?.components?.stakeForm?.withdrawButton}
        </Button>
      )}
    </div>
  );
}

async function pollForBalanceUpdate(
  fetchStakedBalance: () => Promise<void>,
  fetchAvailableReward: () => Promise<void>,
  fetchBalance: () => Promise<void>,
  attempts = 3,
  delay = 1000
) {
  for (let i = 0; i < attempts; i++) {
    await fetchStakedBalance();
    await fetchAvailableReward();
    await fetchBalance();
    await new Promise((res) => setTimeout(res, delay));
  }
}
