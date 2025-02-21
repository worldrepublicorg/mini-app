// components/StakeWithPermitForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { parseAbi } from "viem";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWallet } from "@/components/contexts/WalletContext";
import { viemClient } from "@/lib/viemClient";

// Replace these with your actual addresses.
const STAKING_CONTRACT_ADDRESS = "0xdc9A2c97EAB6354f1e6d658768E7D770D3DdCfA0";
const MAIN_TOKEN_ADDRESS = "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B"; // The token you want users to stake

export function StakeWithPermitForm() {
  // For simplicity we assume the input is in the token's smallest unit (e.g. wei for an 18‑decimal token).
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableReward, setAvailableReward] = useState<string>("0");

  // Get the wallet address and token balance from the wallet context.
  const { walletAddress, tokenBalance } = useWallet();

  // Helper function: converts a bigint value (in wei) to a human-readable string.
  const fromWei = (value: bigint) => (Number(value) / 1e18).toString();

  // Fetch the available reward (stakable amount) by calling the staking contract's "available" function.
  useEffect(() => {
    if (!walletAddress) return;

    const fetchAvailableReward = async () => {
      try {
        // Define the ABI for the "available" view function.
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

    fetchAvailableReward();
  }, [walletAddress]);

  const handleStake = async () => {
    // Check if MiniKit is installed, just like in WalletAuth.tsx
    if (!MiniKit.isInstalled()) {
      console.warn("handleStake: MiniKit is not installed");
      alert("Please open this app in the World App to connect your wallet.");
      return;
    }

    console.log("handleStake called with amount input:", amount);
    let stakeAmount: bigint;
    try {
      stakeAmount = BigInt(amount);
      console.log("Converted stake amount to BigInt:", stakeAmount);
    } catch (error) {
      console.error("Error converting input to BigInt:", error);
      alert("Please input a valid number (in token units).");
      return;
    }

    if (stakeAmount <= 0n) {
      console.warn("stakeAmount is <= 0:", stakeAmount);
      alert("Amount must be > 0");
      return;
    }

    // Convert stakeAmount to string to align with MiniKit SDK (wrapping all arguments as strings)
    const stakeAmountStr = stakeAmount.toString();
    const currentTime = Math.floor(Date.now() / 1000);
    const deadline = currentTime + 3600; // 1 hour from now

    console.log(
      "Current timestamp:",
      currentTime,
      "Deadline timestamp:",
      deadline
    );

    // Prepare permit argument as per docs: [ [token, amount], nonce, deadline ]
    const permitArg = [
      [MAIN_TOKEN_ADDRESS, stakeAmountStr],
      "0", // nonce as string
      deadline.toString(),
    ];
    console.log("Permit argument:", permitArg);

    // Prepare transfer details argument as per docs: [to, requestedAmount]
    const transferDetailsArg = [STAKING_CONTRACT_ADDRESS, stakeAmountStr];
    console.log("Transfer details argument:", transferDetailsArg);

    setIsSubmitting(true);
    try {
      console.log("Sending transaction with stakeWithPermit using MiniKit...");

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
              "PERMIT2_SIGNATURE_PLACEHOLDER_0", // Use placeholder so MiniKit automatically creates the Permit2 signature.
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
            nonce: "0",
            deadline: deadline.toString(),
          },
        ],
      });

      console.log("Received transaction response:", finalPayload);

      if (finalPayload.status === "error") {
        console.error("Error sending transaction.", finalPayload);
        alert("Transaction error. See console for details.");
      } else {
        console.log(
          "Transaction sent successfully. Transaction ID:",
          finalPayload.transaction_id
        );
        alert("Staking transaction submitted successfully!");
      }
    } catch (error: any) {
      console.error("Error in stakeWithPermit:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      console.log("handleStake completed.");
    }
  };

  return (
    <div className="w-full">
      <Typography
        as="p"
        variant={{ variant: "body", level: 1 }}
        className="mb-4"
      >
        Token Balance: {tokenBalance || "0"} tokens
      </Typography>
      <Typography
        as="p"
        variant={{ variant: "body", level: 1 }}
        className="mb-4"
      >
        Available Reward: {availableReward} tokens
      </Typography>
      <input
        type="number"
        value={amount}
        onChange={(e) => {
          console.log("Amount input changed:", e.target.value);
          setAmount(e.target.value);
        }}
        placeholder="Enter amount (in token units)"
        className="mb-4 w-full border p-2"
      />
      <Button onClick={handleStake} isLoading={isSubmitting} fullWidth>
        Deposit drachma
      </Button>
    </div>
  );
}
