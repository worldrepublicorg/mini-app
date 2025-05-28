"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { parseAbi } from "viem";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWallet } from "@/components/contexts/WalletContext";
import { viemClient } from "@/lib/viemClient";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { useToast } from "@/components/ui/Toast";
import { useTranslations } from "@/hooks/useTranslations";

interface StakeWithPermitFormProps {
  stakedBalance: string;
  displayAvailableReward: string | null;
  fetchStakedBalance: () => Promise<void>;
  fetchAvailableReward: () => Promise<void>;
  lang: string;
}

const STAKING_CONTRACT_ADDRESS = "0x234302Db10A54BDc11094A8Ef816B0Eaa5FCE3f7";
const MAIN_TOKEN_ADDRESS = "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B";

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

  const { isSuccess } = useWaitForTransactionReceipt({
    client: viemClient,
    appConfig: {
      app_id: "app_66c83ab8c851fb1e54b1b1b62c6ce39d",
    },
    transactionId: transactionId!,
  });

  const dictionary = useTranslations(lang);

  const handleStake = async () => {
    if (!MiniKit.isInstalled()) {
      showToast(
        dictionary?.components?.toasts?.wallet?.connectInWorldApp,
        "error"
      );
      return;
    }
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
    setIsLoading(true);
    setTxType("deposit");
    try {
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
        setIsLoading(false);
        setTxType(null);
      } else {
        setTransactionId(finalPayload.transaction_id);
        setAmount("");
        localStorage.setItem("savingsRewardBase", "0");
        localStorage.setItem("savingsRewardStartTime", Date.now().toString());
      }
    } catch (error: any) {
      setIsLoading(false);
      setTxType(null);
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
        setIsLoading(false);
        setTxType(null);
      } else {
        setTransactionId(finalPayload.transaction_id);
        setAmount("");
        localStorage.setItem("savingsRewardBase", "0");
        localStorage.setItem("savingsRewardStartTime", Date.now().toString());
      }
    } catch (error: any) {
      setIsLoading(false);
      setTxType(null);
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
        setIsLoading(false);
        setTxType(null);
      } else {
        setTransactionId(finalPayload.transaction_id);
      }
    } catch (error: any) {
      setIsLoading(false);
      setTxType(null);
    }
  };

  // Unified post-transaction effect
  useEffect(() => {
    if (isSuccess && txType) {
      let poll: Promise<any> = Promise.resolve();
      fetchStakedBalance();
      fetchAvailableReward();
      fetchBalance();
      poll = pollForBalanceUpdate(
        fetchStakedBalance,
        fetchAvailableReward,
        fetchBalance
      );
      poll.finally(() => {
        setIsLoading(false);
        setTxType(null);
        setTransactionId(null);
      });
    }
  }, [
    isSuccess,
    txType,
    fetchStakedBalance,
    fetchAvailableReward,
    fetchBalance,
  ]);

  useEffect(() => {
    if (!walletAddress) return;

    const unwatchStakedWithPermit = viemClient.watchContractEvent({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: parseAbi([
        "event StakedWithPermit(address indexed user, uint256 amount)",
      ]),
      eventName: "StakedWithPermit",
      args: { user: walletAddress },
      onLogs: (logs: unknown) => {
        console.log("StakedWithPermit event captured:", logs);
        fetchStakedBalance();
        fetchBalance();
        setIsLoading(false);
      },
    });

    const unwatchWithdrawn = viemClient.watchContractEvent({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: parseAbi(["event Withdrawn(address indexed user, uint256 amount)"]),
      eventName: "Withdrawn",
      args: { user: walletAddress },
      onLogs: (logs: unknown) => {
        console.log("Withdrawn event captured:", logs);
        fetchAvailableReward();
        fetchStakedBalance();
        fetchBalance();
        setIsLoading(false);
      },
    });

    const unwatchRedeemed = viemClient.watchContractEvent({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: parseAbi([
        "event Redeemed(address indexed user, uint256 rewardAmount)",
      ]),
      eventName: "Redeemed",
      args: { user: walletAddress },
      onLogs: async (logs: unknown) => {
        console.log("Redeemed event captured:", logs);

        // First fetch the new reward value
        await fetchAvailableReward();

        // Then update localStorage with the new values
        const currentReward = await viemClient.readContract({
          address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
          abi: parseAbi([
            "function available(address account) external view returns (uint256)",
          ]),
          functionName: "available",
          args: [walletAddress],
        });

        const newRewardValue = Number(currentReward) / 1e18;
        localStorage.setItem("savingsRewardBase", newRewardValue.toString());
        localStorage.setItem("savingsRewardStartTime", Date.now().toString());

        fetchBalance();
        setIsLoading(false);
      },
    });

    return () => {
      unwatchStakedWithPermit();
      unwatchWithdrawn();
      unwatchRedeemed();
    };
  }, [walletAddress, fetchAvailableReward, fetchStakedBalance, fetchBalance]);

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
