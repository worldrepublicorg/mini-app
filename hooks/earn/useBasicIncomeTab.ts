import { useState, useEffect, useCallback, useRef } from "react";
import { useWallet } from "@/components/contexts/WalletContext";
import { viemClient } from "@/lib/viemClient";
import { parseAbi } from "viem";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import type { ToastType } from "@/components/ui/Toast";

// Types for hook arguments
interface UseBasicIncomeTabArgs {
  lang: string;
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

// Types for MiniKit transaction payloads (partial)
type FinalPayload = {
  status: string;
  transaction_id?: string;
  error_code?: string;
  description?: string;
};

export function useBasicIncomeTab({ lang, showToast }: UseBasicIncomeTabArgs) {
  const {
    walletAddress,
    basicIncomeActivated,
    basicIncomePlusActivated,
    claimableAmount,
    claimableAmountPlus,
    fetchBalance,
    fetchBasicIncomeInfo,
    fetchBasicIncomePlusInfo,
  } = useWallet();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isClaimingBasic, setIsClaimingBasic] = useState<boolean>(false);
  const [isClaimingPlus, setIsClaimingPlus] = useState<boolean>(false);
  const [isClaimableLoading, setIsClaimableLoading] = useState<boolean>(true);
  const [displayClaimable, setDisplayClaimable] = useState<number>(
    (Number(claimableAmount) || 0) + (Number(claimableAmountPlus) || 0)
  );
  const [txType, setTxType] = useState<
    null | "setup-basic" | "setup-plus" | "claim-basic" | "claim-plus"
  >(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const { isSuccess } = useWaitForTransactionReceipt({
    client: viemClient,
    appConfig: { app_id: process.env.NEXT_PUBLIC_APP_ID as `app_${string}` },
    transactionId: transactionId || "",
  });

  // Real-time claimable calculation and localStorage sync
  useEffect(() => {
    if (
      claimableAmount === undefined ||
      claimableAmount === null ||
      claimableAmountPlus === undefined ||
      claimableAmountPlus === null
    )
      return;
    setIsClaimableLoading(false);
    const rate = 1 / 1728000;
    const ratePlus = 56 / 1728000;
    const currentClaimable = Number(claimableAmount);
    const currentClaimablePlus = Number(claimableAmountPlus);
    let baseValue: number;
    let startTime: number;
    const storedBase = localStorage.getItem("basicIncomeBase");
    const storedStartTime = localStorage.getItem("basicIncomeStartTime");
    if (storedBase && storedStartTime) {
      baseValue = parseFloat(storedBase);
      startTime = parseInt(storedStartTime, 10);
      if (currentClaimable > baseValue || currentClaimable < baseValue) {
        baseValue = currentClaimable;
        startTime = Date.now();
        localStorage.setItem("basicIncomeBase", baseValue.toString());
        localStorage.setItem("basicIncomeStartTime", startTime.toString());
      }
    } else {
      baseValue = currentClaimable;
      startTime = Date.now();
      localStorage.setItem("basicIncomeBase", baseValue.toString());
      localStorage.setItem("basicIncomeStartTime", startTime.toString());
    }
    let baseValuePlus: number;
    let startTimePlus: number;
    const storedBasePlus = localStorage.getItem("basicIncomePlusBase");
    const storedStartTimePlus = localStorage.getItem(
      "basicIncomePlusStartTime"
    );
    if (storedBasePlus && storedStartTimePlus) {
      baseValuePlus = parseFloat(storedBasePlus);
      startTimePlus = parseInt(storedStartTimePlus, 10);
      if (
        currentClaimablePlus > baseValuePlus ||
        currentClaimablePlus < baseValuePlus
      ) {
        baseValuePlus = currentClaimablePlus;
        startTimePlus = Date.now();
        localStorage.setItem("basicIncomePlusBase", baseValuePlus.toString());
        localStorage.setItem(
          "basicIncomePlusStartTime",
          startTimePlus.toString()
        );
      }
    } else {
      baseValuePlus = currentClaimablePlus;
      startTimePlus = Date.now();
      localStorage.setItem("basicIncomePlusBase", baseValuePlus.toString());
      localStorage.setItem(
        "basicIncomePlusStartTime",
        startTimePlus.toString()
      );
    }
    const updateDisplay = () => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const newValue = baseValue + elapsedSeconds * rate;
      let totalValue = newValue;
      if (basicIncomePlusActivated) {
        const elapsedSecondsPlus = (Date.now() - startTimePlus) / 1000;
        const newValuePlus = baseValuePlus + elapsedSecondsPlus * ratePlus;
        totalValue += newValuePlus;
      }
      setDisplayClaimable(totalValue);
    };
    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);
    return () => clearInterval(interval);
  }, [claimableAmount, claimableAmountPlus, basicIncomePlusActivated]);

  // Fallback polling and event listeners
  const currentTxRef = useRef<string | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackStartedRef = useRef<boolean>(false);
  const clearFallbackTimer = () => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    fallbackStartedRef.current = false;
  };
  const finishTx = (txId?: string | null) => {
    if (txId && txId !== currentTxRef.current) return;
    setIsSubmitting(false);
    setIsClaimingBasic(false);
    setIsClaimingPlus(false);
    setTxType(null);
    setTransactionId(null);
    clearFallbackTimer();
    currentTxRef.current = null;
  };
  const pollForSetupOrClaimChange = async (
    fetchFn: () => Promise<void>,
    prevValue: string,
    getValue: () => string,
    maxAttempts = 30,
    interval = 2000
  ) => {
    let attempts = 0;
    while (attempts < maxAttempts) {
      await fetchFn();
      const newValue = getValue();
      if (newValue !== prevValue) {
        break;
      }
      await new Promise((res) => setTimeout(res, interval));
      attempts++;
    }
  };
  // --- SETUP BASIC ---
  const sendSetup = useCallback(async () => {
    if (!MiniKit.isInstalled()) return;
    if (isSubmitting) return;
    clearFallbackTimer();
    setIsSubmitting(true);
    setTxType("setup-basic");
    setTransactionId(null);
    currentTxRef.current = null;
    try {
      const prevStake = claimableAmount || "0";
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: "0x02c3B99D986ef1612bAC63d4004fa79714D00012",
            abi: parseAbi(["function stake() external"]),
            functionName: "stake",
            args: [],
          },
        ],
      });
      const payload = finalPayload as FinalPayload;
      if (payload.status === "error") {
        finishTx();
      } else {
        setTransactionId(payload.transaction_id || null);
        currentTxRef.current = payload.transaction_id || null;
        fallbackTimerRef.current = setTimeout(() => {
          if (!fallbackStartedRef.current) {
            fallbackStartedRef.current = true;
            pollForSetupOrClaimChange(
              fetchBasicIncomeInfo,
              prevStake,
              () => claimableAmount || "0"
            ).finally(() => finishTx(payload.transaction_id));
          }
        }, 7000);
      }
    } catch (error) {
      finishTx();
    }
  }, [isSubmitting, claimableAmount, fetchBasicIncomeInfo]);
  // --- SETUP PLUS ---
  const sendSetupPlus = useCallback(async () => {
    if (!MiniKit.isInstalled()) return;
    if (isSubmitting) return;
    clearFallbackTimer();
    setIsSubmitting(true);
    setTxType("setup-plus");
    setTransactionId(null);
    currentTxRef.current = null;
    try {
      const prevStake = claimableAmountPlus || "0";
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: "0x52dfee61180a0bcebe007e5a9cfd466948acca46",
            abi: parseAbi(["function stake() external"]),
            functionName: "stake",
            args: [],
          },
        ],
      });
      const payload = finalPayload as FinalPayload;
      if (payload.status === "error") {
        finishTx();
      } else {
        setTransactionId(payload.transaction_id || null);
        currentTxRef.current = payload.transaction_id || null;
        fallbackTimerRef.current = setTimeout(() => {
          if (!fallbackStartedRef.current) {
            fallbackStartedRef.current = true;
            pollForSetupOrClaimChange(
              fetchBasicIncomePlusInfo,
              prevStake,
              () => claimableAmountPlus || "0"
            ).finally(() => finishTx(payload.transaction_id));
          }
        }, 7000);
      }
    } catch (error) {
      finishTx();
    }
  }, [isSubmitting, claimableAmountPlus, fetchBasicIncomePlusInfo]);
  // --- CLAIM BASIC ---
  const sendClaim = useCallback(async () => {
    if (!MiniKit.isInstalled()) return;
    if (isClaimingBasic) return;
    clearFallbackTimer();
    setIsClaimingBasic(true);
    setTxType("claim-basic");
    setTransactionId(null);
    currentTxRef.current = null;
    try {
      const prevClaim = claimableAmount || "0";
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: "0x02c3B99D986ef1612bAC63d4004fa79714D00012",
            abi: parseAbi(["function claimRewards() external"]),
            functionName: "claimRewards",
            args: [],
          },
        ],
      });
      const payload = finalPayload as FinalPayload;
      if (payload.status === "error") {
        finishTx();
      } else {
        setTransactionId(payload.transaction_id || null);
        currentTxRef.current = payload.transaction_id || null;
        fallbackTimerRef.current = setTimeout(() => {
          if (!fallbackStartedRef.current) {
            fallbackStartedRef.current = true;
            pollForSetupOrClaimChange(
              fetchBasicIncomeInfo,
              prevClaim,
              () => claimableAmount || "0"
            ).finally(() => finishTx(payload.transaction_id));
          }
        }, 7000);
      }
    } catch (error) {
      finishTx();
    }
  }, [isClaimingBasic, claimableAmount, fetchBasicIncomeInfo]);
  // --- CLAIM PLUS ---
  const sendClaimPlus = useCallback(async () => {
    if (!MiniKit.isInstalled()) return;
    if (isClaimingPlus) return;
    clearFallbackTimer();
    setIsClaimingPlus(true);
    setTxType("claim-plus");
    setTransactionId(null);
    currentTxRef.current = null;
    try {
      const prevClaim = claimableAmountPlus || "0";
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: "0x52dfee61180a0bcebe007e5a9cfd466948acca46",
            abi: parseAbi(["function claimRewards() external"]),
            functionName: "claimRewards",
            args: [],
          },
        ],
      });
      const payload = finalPayload as FinalPayload;
      if (payload.status === "error") {
        finishTx();
      } else {
        setTransactionId(payload.transaction_id || null);
        currentTxRef.current = payload.transaction_id || null;
        fallbackTimerRef.current = setTimeout(() => {
          if (!fallbackStartedRef.current) {
            fallbackStartedRef.current = true;
            pollForSetupOrClaimChange(
              fetchBasicIncomePlusInfo,
              prevClaim,
              () => claimableAmountPlus || "0"
            ).finally(() => finishTx(payload.transaction_id));
          }
        }, 7000);
      }
    } catch (error) {
      finishTx();
    }
  }, [isClaimingPlus, claimableAmountPlus, fetchBasicIncomePlusInfo]);
  // Listen for transaction receipts
  useEffect(() => {
    if (
      isSuccess &&
      txType &&
      transactionId &&
      transactionId === currentTxRef.current
    ) {
      if (isSubmitting || isClaimingBasic || isClaimingPlus) {
        let poll: Promise<any> = Promise.resolve();
        if (txType === "setup-basic") {
          fetchBasicIncomeInfo();
          poll = pollForSetupOrClaimChange(
            fetchBasicIncomeInfo,
            "",
            () => claimableAmount || "0"
          );
        } else if (txType === "setup-plus") {
          fetchBasicIncomePlusInfo();
          poll = pollForSetupOrClaimChange(
            fetchBasicIncomePlusInfo,
            "",
            () => claimableAmountPlus || "0"
          );
        } else if (txType === "claim-basic") {
          localStorage.setItem("basicIncomeBase", "0");
          localStorage.setItem("basicIncomeStartTime", Date.now().toString());
          fetchBasicIncomeInfo();
          fetchBalance();
          poll = pollForSetupOrClaimChange(
            fetchBasicIncomeInfo,
            "",
            () => claimableAmount || "0"
          );
        } else if (txType === "claim-plus") {
          localStorage.setItem("basicIncomePlusBase", "0");
          localStorage.setItem(
            "basicIncomePlusStartTime",
            Date.now().toString()
          );
          fetchBasicIncomePlusInfo();
          fetchBalance();
          poll = pollForSetupOrClaimChange(
            fetchBasicIncomePlusInfo,
            "",
            () => claimableAmountPlus || "0"
          );
        }
        poll.finally(() => {
          finishTx(transactionId);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, txType, transactionId]);
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearFallbackTimer();
      currentTxRef.current = null;
    };
  }, []);

  return {
    walletAddress,
    basicIncomeActivated,
    basicIncomePlusActivated,
    isClaimableLoading,
    displayClaimable,
    isSubmitting,
    isClaimingBasic,
    isClaimingPlus,
    sendSetup,
    sendSetupPlus,
    sendClaim,
    sendClaimPlus,
  };
}
