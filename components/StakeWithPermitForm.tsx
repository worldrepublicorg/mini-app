"use client";

import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { parseAbi } from "viem";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWallet } from "@/components/contexts/WalletContext";
import { drpcClient, thirdwebClient, tenderlyClient } from "@/lib/viemClient";
import { drpcClient, thirdwebClient, tenderlyClient } from "@/lib/viemClient";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { useToast } from "@/components/ui/Toast";

interface StakeWithPermitFormProps {
  stakedBalance: string;
  displayAvailableReward: string | null;
  isRewardLoading: boolean;
  fetchStakedBalance: () => Promise<void>;
  fetchAvailableReward: () => Promise<void>;
  onCollectStart: () => void;
}

const STAKING_CONTRACT_ADDRESS = "0x234302Db10A54BDc11094A8Ef816B0Eaa5FCE3f7";
const MAIN_TOKEN_ADDRESS = "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B";

export function StakeWithPermitForm({
  stakedBalance,
  displayAvailableReward,
  isRewardLoading,
  fetchStakedBalance,
  fetchAvailableReward,
  onCollectStart,
}: StakeWithPermitFormProps) {
  const { walletAddress, tokenBalance, fetchBalance } = useWallet();
  const { showToast } = useToast();
  const [amount, setAmount] = useState("");
  const [selectedAction, setSelectedAction] = useState<"deposit" | "withdraw">(
    "deposit"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [collectTx, setCollectTx] = useState<string | null>(null);
  const [isRewardUpdating, setIsRewardUpdating] = useState(false);

  const { isSuccess } = useWaitForTransactionReceipt({
    client: drpcClient,
    appConfig: {
      app_id: "app_66c83ab8c851fb1e54b1b1b62c6ce39d",
    },
    transactionId: transactionId!,
  });

  const { isSuccess: isCollectSuccess } = useWaitForTransactionReceipt({
    client: thirdwebClient,
    appConfig: {
      app_id: "app_66c83ab8c851fb1e54b1b1b62c6ce39d",
    },
    transactionId: collectTx!,
  });

  const handleStake = async () => {
    if (!MiniKit.isInstalled()) {
      showToast(
        "Please open this app in the World App to connect your wallet.",
        "error"
      );
      return;
    }

    console.log("handleStake called with amount input:", amount);
    let stakeAmount: bigint;
    try {
      stakeAmount = BigInt(Number(amount) * 1e18 - 9999999);
      console.log("Converted stake amount to BigInt:", stakeAmount);
    } catch (error) {
      console.error("Error converting input to BigInt:", error);
      console.error("Please input a valid number (in token units).");
      return;
    }

    if (stakeAmount <= 0n) {
      console.error("Amount must be > 0");
      return;
    }

    const stakeAmountStr = stakeAmount.toString();
    const nonce = Date.now().toString();
    const currentTime = Math.floor(Date.now() / 1000);
    const deadline = currentTime + 3600; // 1 hour from now

    const permitArg = [
      [MAIN_TOKEN_ADDRESS, stakeAmountStr],
      nonce,
      deadline.toString(),
    ];

    const transferDetailsArg = [STAKING_CONTRACT_ADDRESS, stakeAmountStr];

    setIsSubmitting(true);
    try {
      console.log("Sending stakeWithPermit transaction via MiniKit...");
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

      console.log("Received stake transaction response:", finalPayload);
      if (finalPayload.status === "error") {
        console.error("Transaction error.");
        setIsSubmitting(false);
      } else {
        console.info("Staking transaction submitted successfully!");
        setTransactionId(finalPayload.transaction_id);
        setAmount("");
        localStorage.setItem("savingsRewardBase", "0");
        localStorage.setItem("savingsRewardStartTime", Date.now().toString());
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!MiniKit.isInstalled()) {
      showToast(
        "Please open this app in the World App to connect your wallet.",
        "error"
      );
      return;
    }

    console.log("handleWithdraw called with amount input:", amount);
    let withdrawAmount: bigint;
    try {
      withdrawAmount = BigInt(Number(amount) * 1e18 - 9999999);
      console.log("Converted withdraw amount to BigInt:", withdrawAmount);
    } catch (error) {
      console.error("Error converting input to BigInt:", error);
      return;
    }

    if (withdrawAmount <= 0n) {
      console.error("Amount must be > 0");
      return;
    }

    const withdrawAmountStr = withdrawAmount.toString();

    setIsSubmitting(true);
    try {
      console.log("Sending withdraw transaction via MiniKit...");
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

      console.log("Received withdraw transaction response:", finalPayload);
      if (finalPayload.status === "error") {
        console.error("Withdraw transaction error. See console for details.");
        setIsSubmitting(false);
      } else {
        console.info("Withdraw transaction submitted successfully!");
        setTransactionId(finalPayload.transaction_id);
        setAmount("");
        localStorage.setItem("savingsRewardBase", "0");
        localStorage.setItem("savingsRewardStartTime", Date.now().toString());
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      setIsSubmitting(false);
    }
  };

  const handleCollect = async () => {
    if (!MiniKit.isInstalled()) {
      showToast(
        "Please open this app in the World App to connect your wallet.",
        "error"
      );
      return;
    }

    onCollectStart();

    setIsCollecting(true);
    setIsRewardUpdating(true);

    localStorage.setItem("savingsRewardBase", "0");
    localStorage.setItem("savingsRewardStartTime", Date.now().toString());

    try {
      console.log("Sending redeem transaction via MiniKit...");
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

      console.log("Received redeem transaction response:", finalPayload);
      if (finalPayload.status === "error") {
        console.error("Redeem transaction error. See console for details.");
        setIsCollecting(false);
      } else {
        console.info("Rewards redeemed successfully!");
        setCollectTx(finalPayload.transaction_id);
        localStorage.setItem("savingsRewardBase", "0");
        localStorage.setItem("savingsRewardStartTime", Date.now().toString());
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      setIsCollecting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("Transaction successful");
      fetchStakedBalance();
      fetchBalance();
      setTransactionId(null);
    }
  }, [isSuccess, fetchStakedBalance, fetchBalance]);

  useEffect(() => {
    if (isCollectSuccess) {
      console.log("Transaction successful");
      fetchAvailableReward();
      fetchBalance();
      setCollectTx(null);
    }
  }, [isCollectSuccess, fetchAvailableReward, fetchBalance]);

  useEffect(() => {
    if (!walletAddress) return;

    const unwatchStakedWithPermit = tenderlyClient.watchContractEvent({
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
        setIsSubmitting(false);
      },
    });

    const unwatchWithdrawn = drpcClient.watchContractEvent({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: parseAbi(["event Withdrawn(address indexed user, uint256 amount)"]),
      eventName: "Withdrawn",
      args: { user: walletAddress },
      onLogs: (logs: unknown) => {
        console.log("Withdrawn event captured:", logs);
        fetchAvailableReward();
        fetchStakedBalance();
        fetchBalance();
        setIsSubmitting(false);
      },
    });

    const unwatchRedeemed = thirdwebClient.watchContractEvent({
      address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: parseAbi([
        "event Redeemed(address indexed user, uint256 rewardAmount)",
      ]),
      eventName: "Redeemed",
      args: { user: walletAddress },
      onLogs: (logs: unknown) => {
        console.log("Redeemed event captured:", logs);

        fetchAvailableReward().then(() => {
          localStorage.setItem("savingsRewardBase", "0");
          localStorage.setItem("savingsRewardStartTime", Date.now().toString());
          setIsRewardUpdating(false);
        });

        fetchBalance();
        setIsCollecting(false);
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
          Deposit
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
          Withdraw
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-4 font-medium text-gray-900"
          >
            Balance:
          </Typography>
          <Typography
            variant={{ variant: "number", level: 6 }}
            className="mb-4 text-base"
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
                ? "Amount to deposit"
                : "Amount to withdraw"
            }
            className="-ml-2 mr-2 h-9 w-full rounded-xl pl-2"
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
            className={`h-9 items-center rounded-full bg-gray-100 px-4 font-sans text-sm font-medium leading-narrow tracking-normal ${
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
            Max
          </button>
        </div>
      </div>

      <div className="mb-6 mt-4 flex items-center justify-between px-2">
        <Typography
          as="p"
          variant={{ variant: "body", level: 1 }}
          className="font-medium text-gray-900"
        >
          Interest:
        </Typography>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCollect}
            isLoading={isCollecting}
            variant="primary"
            size="sm"
            className="mr-2 h-9 w-20 rounded-full px-4 font-sans"
          >
            Collect
          </Button>

          {isRewardLoading ||
          isRewardUpdating ||
          displayAvailableReward === null ? (
            <div className="h-[21px] w-[104px] animate-pulse rounded-md bg-gray-100"></div>
          ) : (
            <Typography
              variant={{ variant: "number", level: 6 }}
              className="text-base"
              data-testid="reward-value"
            >
              {displayAvailableReward}
            </Typography>
          )}
        </div>
      </div>

      {selectedAction === "deposit" ? (
        <Button onClick={handleStake} isLoading={isSubmitting} fullWidth>
          Deposit Drachma
        </Button>
      ) : (
        <Button onClick={handleWithdraw} isLoading={isSubmitting} fullWidth>
          Withdraw Drachma
        </Button>
      )}
    </div>
  );
}
