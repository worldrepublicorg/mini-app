// components/StakeWithPermitForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { parseAbi } from "viem";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWallet } from "@/components/contexts/WalletContext";
import { viemClient } from "@/lib/viemClient";
import { Pill } from "@worldcoin/mini-apps-ui-kit-react";

// Replace these with your actual addresses.
const STAKING_CONTRACT_ADDRESS = "0xdc9A2c97EAB6354f1e6d658768E7D770D3DdCfA0";
const MAIN_TOKEN_ADDRESS = "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B"; // The token you want users to stake

export function StakeWithPermitForm() {
  // For simplicity we assume the input is in the token's smallest unit (e.g. wei for an 18‑decimal token).
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [availableReward, setAvailableReward] = useState<string>("0");
  const [stakedBalance, setStakedBalance] = useState<string>("0");

  // Transaction ID states for stake and collect actions.
  const [stakeTx, setStakeTx] = useState<string | null>(null);
  const [collectTx, setCollectTx] = useState<string | null>(null);

  // Get the wallet address and token balance from the wallet context.
  const { walletAddress, tokenBalance, fetchBalance } = useWallet();

  // Helper function: converts a bigint value (in wei) to a human-readable string.
  const fromWei = (value: bigint) => (Number(value) / 1e18).toString();

  // ------------------------------
  // Refactored functions for refreshing data
  // ------------------------------
  const fetchAvailableReward = async () => {
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
      console.log("Fetched available reward:", result);
      setAvailableReward(fromWei(result));
    } catch (error) {
      console.error("Error fetching available reward", error);
    }
  };

  const fetchStakedBalance = async () => {
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
      console.log("Fetched staked balance:", result);
      setStakedBalance(fromWei(result));
    } catch (error) {
      console.error("Error fetching staked balance", error);
    }
  };

  // Refresh data when walletAddress is set.
  useEffect(() => {
    if (!walletAddress) return;
    fetchAvailableReward();
    fetchStakedBalance();
  }, [walletAddress]);

  // ------------------------------
  // Transaction handlers
  // ------------------------------
  const handleStake = async () => {
    if (!MiniKit.isInstalled()) {
      alert("Please open this app in the World App to connect your wallet.");
      return;
    }

    console.log("handleStake called with amount input:", amount);
    let stakeAmount: bigint;
    try {
      stakeAmount = BigInt(Number(amount) * 1e18 - 420);
      console.log("Converted stake amount to BigInt:", stakeAmount);
    } catch (error) {
      console.error("Error converting input to BigInt:", error);
      alert("Please input a valid number (in token units).");
      return;
    }

    if (stakeAmount <= 0n) {
      alert("Amount must be > 0");
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
        alert("Transaction error. See console for details.");
      } else {
        alert("Staking transaction submitted successfully!");
        // Instead of waiting a fixed delay, set the transaction id and let the hook detect confirmation.
        setStakeTx(finalPayload.transaction_id);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCollect = async () => {
    if (!MiniKit.isInstalled()) {
      alert("Please open this app in the World App to connect your wallet.");
      return;
    }

    setIsCollecting(true);
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
        alert("Redeem transaction error. See console for details.");
      } else {
        alert("Rewards redeemed successfully!");
        setCollectTx(finalPayload.transaction_id);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsCollecting(false);
    }
  };

  useEffect(() => {
    if (!stakeTx) return;

    const interval = setInterval(() => {
      fetchAvailableReward();
      fetchStakedBalance();
      fetchBalance();
    }, 3000);

    return () => clearInterval(interval);
  }, [stakeTx]);

  useEffect(() => {
    if (!collectTx) return;

    const interval = setInterval(() => {
      fetchAvailableReward();
      fetchStakedBalance();
      fetchBalance();
    }, 3000);

    return () => clearInterval(interval);
  }, [collectTx]);

  return (
    <div className="w-full">
      <div className="mb-4 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-3 text-gray-900"
          >
            Savings balance:
          </Typography>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-3 text-gray-900"
          >
            {stakedBalance}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            placeholder="Deposit amount"
            className="h-9 w-full rounded-xl bg-gray-50"
          />
          <button
            type="button"
            onClick={() => setAmount(tokenBalance || "0")}
            className="h-9 items-center rounded-full bg-gray-900 px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-0"
          >
            Max
          </button>
        </div>
      </div>
      <div className="my-4 flex items-center justify-between px-2">
        <Typography
          as="p"
          variant={{ variant: "body", level: 1 }}
          className="text-gray-900"
        >
          Interest:
        </Typography>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCollect}
            disabled={isCollecting}
            className="mr-2 h-9 items-center rounded-full bg-gray-900 px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-0"
          >
            Collect
          </button>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="text-gray-900"
          >
            {availableReward}
          </Typography>
        </div>
      </div>
      <Button onClick={handleStake} isLoading={isSubmitting} fullWidth>
        Deposit drachma
      </Button>
    </div>
  );
}
