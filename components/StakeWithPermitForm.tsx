"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { parseAbi } from "viem";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWallet } from "@/components/contexts/WalletContext";
import { useToast } from "@/components/ui/Toast";
import { useTranslations } from "@/hooks/useTranslations";
import { viemClient } from "@/lib/viemClient";

interface StakeWithPermitFormProps {
  stakedBalance: string;
  displayAvailableReward: string | null;
  fetchStakedBalance: () => Promise<void>;
  fetchAvailableReward: () => Promise<void>;
  lang: string;
}

const STAKING_CONTRACT_ADDRESS = "0x234302Db10A54BDc11094A8Ef816B0Eaa5FCE3f7";
const MAIN_TOKEN_ADDRESS = "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B";

// Helper polling function
type FetchFn<T> = () => Promise<T>;
type CompareFn<T> = (a: T, b: T) => boolean;

async function pollForChange<T extends any[]>(
  fetchFns: { [K in keyof T]: FetchFn<T[K]> },
  prevValues: T,
  compareFns: { [K in keyof T]: CompareFn<T[K]> },
  maxAttempts = 20,
  delay = 1000
): Promise<T | null> {
  for (let i = 0; i < maxAttempts; i++) {
    const results = await Promise.all(fetchFns.map((fn) => fn()));
    if (results.some((val, idx) => compareFns[idx](val, prevValues[idx]))) {
      return results as T;
    }
    await new Promise((res) => setTimeout(res, delay));
  }
  return null;
}

// Helper to ensure UI state matches the new on-chain value
async function ensureStateMatches(
  fetchState: () => Promise<void>,
  getState: () => string | null,
  expectedValue: string,
  maxAttempts = 10,
  delay = 500
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    await fetchState();
    if (getState() === expectedValue) return true;
    await new Promise((res) => setTimeout(res, delay));
  }
  return false;
}

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
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [collectLoading, setCollectLoading] = useState(false);

  const dictionary = useTranslations(lang);

  // Local fetchers for polling
  const fetchTokenBalanceValue = async (): Promise<string> => {
    if (!walletAddress) return "0";
    const result: bigint = await viemClient.readContract({
      address: MAIN_TOKEN_ADDRESS as `0x${string}`,
      abi: parseAbi([
        "function balanceOf(address) external view returns (uint256)",
      ]),
      functionName: "balanceOf",
      args: [walletAddress],
    });
    return (Number(result) / 1e18).toString();
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
    return (Number(result) / 1e18).toString();
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
    return (Number(result) / 1e18).toString();
  };

  const handleStake = async () => {
    if (depositLoading) return;
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
    try {
      setDepositLoading(true);
      const prevTokenBalance = tokenBalance;
      const prevStakedBalance = stakedBalance;
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
      } else {
        setAmount("");
        localStorage.setItem("savingsRewardBase", "0");
        localStorage.setItem("savingsRewardStartTime", Date.now().toString());
        // Poll for both tokenBalance and stakedBalance to change
        const [newTokenBalance, newStakedBalance] = (await pollForChange(
          [fetchTokenBalanceValue, fetchStakedBalanceValue],
          [prevTokenBalance, prevStakedBalance],
          [(a, b) => String(a) !== String(b), (a, b) => String(a) !== String(b)]
        )) || [null, null];
        // Ensure UI state matches new values
        if (newTokenBalance)
          await ensureStateMatches(
            fetchBalance,
            () => tokenBalance,
            newTokenBalance
          );
        if (newStakedBalance)
          await ensureStateMatches(
            fetchStakedBalance,
            () => stakedBalance,
            newStakedBalance
          );
        await fetchAvailableReward();
      }
    } catch (error: any) {
      // Optionally show error
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (withdrawLoading) return;
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
    try {
      setWithdrawLoading(true);
      const prevTokenBalance = tokenBalance;
      const prevStakedBalance = stakedBalance;
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
      } else {
        setAmount("");
        localStorage.setItem("savingsRewardBase", "0");
        localStorage.setItem("savingsRewardStartTime", Date.now().toString());
        // Poll for both tokenBalance and stakedBalance to change
        const [newTokenBalance, newStakedBalance] = (await pollForChange(
          [fetchTokenBalanceValue, fetchStakedBalanceValue],
          [prevTokenBalance, prevStakedBalance],
          [(a, b) => String(a) !== String(b), (a, b) => String(a) !== String(b)]
        )) || [null, null];
        // Ensure UI state matches new values
        if (newTokenBalance)
          await ensureStateMatches(
            fetchBalance,
            () => tokenBalance,
            newTokenBalance
          );
        if (newStakedBalance)
          await ensureStateMatches(
            fetchStakedBalance,
            () => stakedBalance,
            newStakedBalance
          );
        await fetchAvailableReward();
      }
    } catch (error: any) {
      // Optionally show error
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleCollect = async () => {
    if (collectLoading) return;
    if (!MiniKit.isInstalled()) {
      showToast(
        dictionary?.components?.toasts?.wallet?.connectInWorldApp,
        "error"
      );
      return;
    }
    try {
      setCollectLoading(true);
      const prevTokenBalance = tokenBalance;
      const prevAvailableReward = displayAvailableReward;
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
      } else {
        localStorage.setItem("savingsRewardBase", "0");
        localStorage.setItem("savingsRewardStartTime", Date.now().toString());
        // Poll for both tokenBalance and displayAvailableReward to change
        const [newTokenBalance, newAvailableReward] = (await pollForChange(
          [fetchTokenBalanceValue, fetchAvailableRewardValue],
          [prevTokenBalance, prevAvailableReward],
          [(a, b) => String(a) !== String(b), (a, b) => String(a) !== String(b)]
        )) || [null, null];
        // Ensure UI state matches new values
        if (newTokenBalance)
          await ensureStateMatches(
            fetchBalance,
            () => tokenBalance,
            newTokenBalance
          );
        if (newAvailableReward)
          await ensureStateMatches(
            fetchAvailableReward,
            () => displayAvailableReward,
            newAvailableReward
          );
        await fetchStakedBalance();
      }
    } catch (error: any) {
      // Optionally show error
    } finally {
      setCollectLoading(false);
    }
  };

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
            isLoading={collectLoading}
            disabled={collectLoading}
            variant="primary"
            size="sm"
            className="mr-2 h-9 min-w-20 rounded-full px-4 font-sans"
          >
            {collectLoading
              ? dictionary?.components?.stakeForm?.collecting
              : dictionary?.components?.stakeForm?.collect}
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
        <Button
          onClick={handleStake}
          isLoading={depositLoading}
          disabled={depositLoading}
          fullWidth
        >
          {depositLoading
            ? dictionary?.components?.stakeForm?.depositing
            : dictionary?.components?.stakeForm?.depositButton}
        </Button>
      ) : (
        <Button
          onClick={handleWithdraw}
          isLoading={withdrawLoading}
          disabled={withdrawLoading}
          fullWidth
        >
          {withdrawLoading
            ? dictionary?.components?.stakeForm?.withdrawing
            : dictionary?.components?.stakeForm?.withdrawButton}
        </Button>
      )}
    </div>
  );
}
