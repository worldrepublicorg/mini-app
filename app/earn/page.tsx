"use client";

import { Typography } from "@/components/ui/Typography";
import { useState, useEffect, useCallback } from "react";
import {
  PiHandCoinsFill,
  PiUserPlusFill,
  PiPlantFill,
  PiWalletFill,
  PiCoinsFill,
  PiChartLineFill,
  PiTrendUpFill,
  PiUserCheckFill,
  PiNotePencilFill,
} from "react-icons/pi";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer";
import { WalletAuth } from "@/components/WalletAuth";
import { useWallet } from "@/components/contexts/WalletContext";
import {
  drpcClient,
  thirdwebClient,
  quiknodeClient,
  alchemyClient,
  tenderlyClient,
} from "@/lib/viemClient";
import { parseAbi } from "viem";
import { MiniKit, getIsUserVerified } from "@worldcoin/minikit-js";
import { TabSwiper } from "@/components/TabSwiper";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { Button } from "@/components/ui/Button";
import { StakeWithPermitForm } from "@/components/StakeWithPermitForm";
import { OpenLetterCard } from "@/components/OpenLetterCard";
import { useToast } from "@/components/ui/Toast";

export default function EarnPage() {
  const {
    walletAddress,
    tokenBalance,
    basicIncomeActivated,
    basicIncomePlusActivated,
    claimableAmount,
    claimableAmountPlus,
    canReward,
    rewardCount,
    fetchBalance,
    fetchBasicIncomeInfo,
    fetchBasicIncomePlusInfo,
    fetchCanReward,
    fetchRewardCount,
    setBasicIncomeActivated,
    setBasicIncomePlusActivated,
    username,
    setUsername,
  } = useWallet();

  // Add a new loading state for claimable amount
  const [isClaimableLoading, setIsClaimableLoading] = useState<boolean>(true);

  const [displayClaimable, setDisplayClaimable] = useState<number>(
    (Number(claimableAmount) || 0) + (Number(claimableAmountPlus) || 0)
  );

  const { showToast } = useToast();

  useEffect(() => {
    // Only log on the initial render
    console.log("[DisplayTracking] Initial claimableAmount:", claimableAmount);
    console.log(
      "[DisplayTracking] Initial claimableAmountPlus:",
      claimableAmountPlus
    );
    console.log(
      "[DisplayTracking] Initial displayClaimable:",
      displayClaimable
    );
  }, []); // Empty dependency array means it only runs once on mount

  useEffect(() => {
    console.log(
      "[DisplayTracking] claimableAmount changed to:",
      claimableAmount
    );
    console.log(
      "[DisplayTracking] claimableAmountPlus changed to:",
      claimableAmountPlus
    );
  }, [claimableAmount, claimableAmountPlus]);

  useEffect(() => {
    if (
      claimableAmount === undefined ||
      claimableAmount === null ||
      claimableAmountPlus === undefined ||
      claimableAmountPlus === null
    )
      return;

    // Set loading to false once we have the data
    setIsClaimableLoading(false);

    const rate = 1 / 86400; // Increment rate (tokens per second)
    const ratePlus = 10 / 86400; // Increment rate (tokens per second)
    const currentClaimable = Number(claimableAmount);
    const currentClaimablePlus = Number(claimableAmountPlus);

    console.log("[DisplayTracking] Starting real-time display update with:");
    console.log("[DisplayTracking] currentClaimable:", currentClaimable);
    console.log(
      "[DisplayTracking] currentClaimablePlus:",
      currentClaimablePlus
    );

    let baseValue: number;
    let startTime: number;

    const storedBase = localStorage.getItem("basicIncomeBase");
    const storedStartTime = localStorage.getItem("basicIncomeStartTime");

    console.log("[DisplayTracking] Stored base value:", storedBase);
    console.log("[DisplayTracking] Stored start time:", storedStartTime);

    if (storedBase && storedStartTime) {
      baseValue = parseFloat(storedBase);
      startTime = parseInt(storedStartTime, 10);

      console.log(
        "[DisplayTracking] Using stored values - baseValue:",
        baseValue,
        "startTime:",
        startTime
      );

      // If the on-chain claimable has increased (due to accumulation)
      if (currentClaimable > baseValue) {
        console.log(
          "[DisplayTracking] On-chain value increased, updating baseValue from",
          baseValue,
          "to",
          currentClaimable
        );
        baseValue = currentClaimable;
        startTime = Date.now();
        localStorage.setItem("basicIncomeBase", baseValue.toString());
        localStorage.setItem("basicIncomeStartTime", startTime.toString());
      }

      // If the on-chain claimable has decreased (i.e. a claim was made externally)
      if (currentClaimable < baseValue) {
        console.log(
          "[DisplayTracking] On-chain value decreased (probably claimed), updating baseValue from",
          baseValue,
          "to",
          currentClaimable
        );
        baseValue = currentClaimable;
        startTime = Date.now();
        localStorage.setItem("basicIncomeBase", baseValue.toString());
        localStorage.setItem("basicIncomeStartTime", startTime.toString());
      }
    } else {
      console.log(
        "[DisplayTracking] No stored values, initializing with current values"
      );
      baseValue = currentClaimable;
      startTime = Date.now();
      localStorage.setItem("basicIncomeBase", baseValue.toString());
      localStorage.setItem("basicIncomeStartTime", startTime.toString());
    }

    // New code for Basic Income Plus
    let baseValuePlus: number;
    let startTimePlus: number;

    const storedBasePlus = localStorage.getItem("basicIncomePlusBase");
    const storedStartTimePlus = localStorage.getItem(
      "basicIncomePlusStartTime"
    );

    console.log("[DisplayTracking] Stored base value Plus:", storedBasePlus);
    console.log(
      "[DisplayTracking] Stored start time Plus:",
      storedStartTimePlus
    );

    if (storedBasePlus && storedStartTimePlus) {
      baseValuePlus = parseFloat(storedBasePlus);
      startTimePlus = parseInt(storedStartTimePlus, 10);

      console.log(
        "[DisplayTracking] Using stored Plus values - baseValuePlus:",
        baseValuePlus,
        "startTimePlus:",
        startTimePlus
      );

      // If the on-chain claimable has increased (due to accumulation)
      if (currentClaimablePlus > baseValuePlus) {
        console.log(
          "[DisplayTracking] On-chain Plus value increased, updating baseValuePlus from",
          baseValuePlus,
          "to",
          currentClaimablePlus
        );
        baseValuePlus = currentClaimablePlus;
        startTimePlus = Date.now();
        localStorage.setItem("basicIncomePlusBase", baseValuePlus.toString());
        localStorage.setItem(
          "basicIncomePlusStartTime",
          startTimePlus.toString()
        );
      }

      // If the on-chain claimable has decreased (i.e. a claim was made externally)
      if (currentClaimablePlus < baseValuePlus) {
        console.log(
          "[DisplayTracking] On-chain Plus value decreased (probably claimed), updating baseValuePlus from",
          baseValuePlus,
          "to",
          currentClaimablePlus
        );
        baseValuePlus = currentClaimablePlus;
        startTimePlus = Date.now();
        localStorage.setItem("basicIncomePlusBase", baseValuePlus.toString());
        localStorage.setItem(
          "basicIncomePlusStartTime",
          startTimePlus.toString()
        );
      }
    } else {
      console.log(
        "[DisplayTracking] No stored Plus values, initializing with current values"
      );
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

      // Only calculate Plus amount if it's activated
      let totalValue = newValue;

      if (basicIncomePlusActivated) {
        const elapsedSecondsPlus = (Date.now() - startTimePlus) / 1000;
        const newValuePlus = baseValuePlus + elapsedSecondsPlus * ratePlus;
        totalValue += newValuePlus;

        // Log both values when activated
        if (Math.round(elapsedSeconds) % 10 === 0) {
          console.log("[DisplayTracking] Current calculation:");
          console.log(
            "[DisplayTracking] baseValue:",
            baseValue,
            "+ elapsed:",
            elapsedSeconds,
            "* rate:",
            rate,
            "=",
            newValue
          );
          console.log(
            "[DisplayTracking] baseValuePlus:",
            baseValuePlus,
            "+ elapsedPlus:",
            elapsedSecondsPlus,
            "* ratePlus:",
            ratePlus,
            "=",
            newValuePlus
          );
          console.log(
            "[DisplayTracking] Setting displayClaimable to:",
            totalValue
          );
        }
      } else {
        // Log only basic income when Plus is not activated
        if (Math.round(elapsedSeconds) % 10 === 0) {
          console.log(
            "[DisplayTracking] Current calculation (Plus not activated):"
          );
          console.log(
            "[DisplayTracking] baseValue:",
            baseValue,
            "+ elapsed:",
            elapsedSeconds,
            "* rate:",
            rate,
            "=",
            newValue
          );
          console.log(
            "[DisplayTracking] Setting displayClaimable to:",
            totalValue
          );
        }
      }

      // Display the correct total based on activation status
      setDisplayClaimable(totalValue);
    };

    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);

    return () => clearInterval(interval);
  }, [claimableAmount, claimableAmountPlus]);

  const [activeTab, setActiveTab] = useState("Basic income");

  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClaimingBasic, setIsClaimingBasic] = useState(false);
  const [isClaimingPlus, setIsClaimingPlus] = useState(false);

  const { isSuccess } = useWaitForTransactionReceipt({
    client: drpcClient,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_APP_ID as `app_${string}`,
    },
    transactionId: transactionId!,
  });

  useEffect(() => {
    if (transactionId) {
      fetchBalance();
    }
  }, [transactionId, fetchBalance]);

  useEffect(() => {
    if (!walletAddress) return;

    // Listener for the basic income setup event (TokensStaked)
    const unwatchTokensStaked = thirdwebClient.watchContractEvent({
      address: "0x02c3B99D986ef1612bAC63d4004fa79714D00012" as `0x${string}`,
      abi: parseAbi([
        "event TokensStaked(address indexed staker, uint256 amount)",
      ]),
      eventName: "TokensStaked",
      args: { staker: walletAddress },
      onLogs: (logs: unknown) => {
        console.log("TokensStaked event captured:", logs);
        // Update your on-chain data here after setup.
        fetchBasicIncomeInfo();
        setIsSubmitting(false);
      },
    });

    // Listener for the basic income plus setup event (TokensStaked)
    const unwatchTokensStakedPlus = quiknodeClient.watchContractEvent({
      address: "0x52dfee61180a0bcebe007e5a9cfd466948acca46" as `0x${string}`,
      abi: parseAbi([
        "event TokensStaked(address indexed staker, uint256 amount)",
      ]),
      eventName: "TokensStaked",
      args: { staker: walletAddress },
      onLogs: async (logs: unknown) => {
        console.log("TokensStaked event captured:", logs);
        fetchBasicIncomePlusInfo();
        setIsSubmitting(false);

        // Process the automatic referral reward
        const storedReferrer = localStorage.getItem("referredBy");
        if (storedReferrer && canReward) {
          try {
            const response = await fetch(
              `https://usernames.worldcoin.org/api/v1/${encodeURIComponent(storedReferrer.trim())}`
            );

            if (response.ok) {
              const data = await response.json();
              showToast(
                `Sending 50 WDD reward to ${storedReferrer}...`,
                "info"
              );
              await sendReward(data.address);
              showToast(`Successfully rewarded ${storedReferrer}!`, "success");
            } else {
              // Store that we need to reward them later if username lookup fails
              localStorage.setItem("pendingReferrerReward", storedReferrer);
            }
          } catch (error) {
            console.error(
              "[AutoReward] Failed to process referral reward:",
              error
            );
            // Store that we need to retry later
            localStorage.setItem("pendingReferrerReward", storedReferrer);
          }
        }
      },
    });

    // Listener for the basic income claim event (RewardsClaimed)
    const unwatchRewardsClaimed = tenderlyClient.watchContractEvent({
      address: "0x02c3B99D986ef1612bAC63d4004fa79714D00012" as `0x${string}`,
      abi: parseAbi([
        "event RewardsClaimed(address indexed staker, uint256 rewardAmount)",
      ]),
      eventName: "RewardsClaimed",
      args: { staker: walletAddress },
      onLogs: (logs: unknown) => {
        console.log("RewardsClaimed event captured for Basic Income:", logs);
        // Update your on-chain data here after claiming rewards.
        fetchBasicIncomeInfo();
        fetchBalance();
        setIsSubmitting(false);
        setIsClaimingBasic(false);
      },
    });

    // Listener for the basic income plus claim event (RewardsClaimed)
    const unwatchRewardsClaimedPlus = alchemyClient.watchContractEvent({
      address: "0x52dfee61180a0bcebe007e5a9cfd466948acca46" as `0x${string}`,
      abi: parseAbi([
        "event RewardsClaimed(address indexed staker, uint256 rewardAmount)",
      ]),
      eventName: "RewardsClaimed",
      args: { staker: walletAddress },
      onLogs: (logs: unknown) => {
        console.log(
          "RewardsClaimed event captured for Basic Income Plus:",
          logs
        );
        // Update your on-chain data here after claiming rewards.
        fetchBasicIncomePlusInfo();
        fetchBalance();
        setIsSubmitting(false);
        setIsClaimingPlus(false);
      },
    });

    return () => {
      unwatchTokensStaked();
      unwatchTokensStakedPlus();
      unwatchRewardsClaimed();
      unwatchRewardsClaimedPlus();
    };
  }, [
    walletAddress,
    fetchBalance,
    fetchBasicIncomeInfo,
    fetchBasicIncomePlusInfo,
    basicIncomePlusActivated,
  ]);

  const sendSetup = async () => {
    if (!MiniKit.isInstalled()) return;
    setIsSubmitting(true);
    try {
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

      if (finalPayload.status === "error") {
        console.error("Error sending transaction", finalPayload);
        setIsSubmitting(false);
      } else {
        setTransactionId(finalPayload.transaction_id);
        await fetchBasicIncomeInfo();
        // Update the optimistic UI state if the fetch call works.
        setBasicIncomeActivated(true);
        localStorage.setItem("basicIncomeActivated", "true");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setIsSubmitting(false);
    }
  };

  const sendSetupPlus = async () => {
    if (!MiniKit.isInstalled()) return;
    setIsSubmitting(true);
    console.log("[BasicIncomePlus] Setup initiated");

    // Check if there's a stored referrer upfront
    const storedReferrer = localStorage.getItem("referredBy");
    const hasReferrer = !!storedReferrer;

    // If there's a referrer, let the user know their referrer will be rewarded
    if (hasReferrer) {
      showToast(
        `Setting up Basic Income Plus first, then we'll reward ${storedReferrer}`,
        "info"
      );
    }

    try {
      console.log(
        "[BasicIncomePlus] Sending transaction to contract: 0x52dfee61180a0bcebe007e5a9cfd466948acca46"
      );
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: "0x52dfee61180a0bcebe007e5a9cfd466948acca46", // New contract address
            abi: parseAbi(["function stake() external"]), // Assuming the same ABI as the original
            functionName: "stake",
            args: [],
          },
        ],
      });

      console.log("[BasicIncomePlus] Transaction response:", finalPayload);
      if (finalPayload.status === "error") {
        console.error(
          "[BasicIncomePlus] Error sending transaction",
          finalPayload
        );
        setIsSubmitting(false);
      } else {
        setTransactionId(finalPayload.transaction_id);
        if (storedReferrer) {
          showToast(
            `Basic Income Plus activated! Now preparing reward for ${storedReferrer}...`,
            "success"
          );
        }
        console.log(
          "[BasicIncomePlus] Transaction ID:",
          finalPayload.transaction_id
        );
        console.log(
          "[BasicIncomePlus] Fetching updated Basic Income Plus info"
        );
        await fetchBasicIncomePlusInfo();
        // Update the optimistic UI state if the fetch call works.
        setBasicIncomePlusActivated(true);
        localStorage.setItem("basicIncomePlusActivated", "true");
        console.log("[BasicIncomePlus] Setup completed successfully");

        // After successful setup, automatically process referral reward if applicable
        if (storedReferrer) {
          try {
            const response = await fetch(
              `https://usernames.worldcoin.org/api/v1/${encodeURIComponent(storedReferrer.trim())}`
            );

            if (response.ok) {
              const data = await response.json();
              showToast(
                `Sending 50 WDD reward to ${storedReferrer}...`,
                "info"
              );
              await sendReward(data.address);
              showToast(`Successfully rewarded ${storedReferrer}!`, "success");
            } else {
              // Store that we need to reward them later if username lookup fails
              localStorage.setItem("pendingReferrerReward", storedReferrer);
            }
          } catch (error) {
            console.error(
              "[AutoReward] Failed to process referral reward:",
              error
            );
            // Store that we need to retry later
            localStorage.setItem("pendingReferrerReward", storedReferrer);
          }
        }
      }
    } catch (error: any) {
      console.error("[BasicIncomePlus] Setup error:", error);
      console.error("[BasicIncomePlus] Error message:", error.message);
      console.error("[BasicIncomePlus] Error stack:", error.stack);
      setIsSubmitting(false);
    }
  };

  const sendClaim = async () => {
    if (!MiniKit.isInstalled()) return;
    setIsClaimingBasic(true);
    console.log("[ClaimProcess] Starting basic claim process");
    console.log("[ClaimProcess] Current claimableAmount:", claimableAmount);
    try {
      // Don't reset localStorage here - wait until transaction confirms

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address:
              "0x02c3B99D986ef1612bAC63d4004fa79714D00012" as `0x${string}`,
            abi: parseAbi(["function claimRewards() external"]),
            functionName: "claimRewards",
            args: [],
          },
        ],
      });

      if (finalPayload.status === "error") {
        console.error("Error sending transaction", finalPayload);
        setIsClaimingBasic(false);
      } else {
        setTransactionId(finalPayload.transaction_id);
        console.log(
          "[ClaimProcess] Claim transaction sent, ID:",
          finalPayload.transaction_id
        );

        // Only reset the display after successful transaction submission
        // This will prevent the flickering by just doing one reset
        console.log(
          "[ClaimProcess] Setting display to 0 while waiting for confirmation"
        );

        // We'll do the localStorage reset in the transaction confirmation handler
      }
    } catch (error) {
      console.error("Error during claim:", error);
      setIsClaimingBasic(false);
    }
  };

  const sendClaimPlus = async () => {
    if (!MiniKit.isInstalled()) return;
    setIsClaimingPlus(true);
    console.log("[ClaimProcess] Starting basic income plus claim");
    console.log(
      "[ClaimProcess] Current claimableAmountPlus:",
      claimableAmountPlus
    );
    try {
      // Don't reset localStorage here - wait until transaction confirms

      console.log(
        "[BasicIncomePlus] Sending claim transaction to contract: 0x52dfee61180a0bcebe007e5a9cfd466948acca46"
      );
      console.log(
        "[BasicIncomePlus] Current claimable amount:",
        claimableAmountPlus
      );
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address:
              "0x52dfee61180a0bcebe007e5a9cfd466948acca46" as `0x${string}`,
            abi: parseAbi(["function claimRewards() external"]),
            functionName: "claimRewards",
            args: [],
          },
        ],
      });

      console.log(
        "[BasicIncomePlus] Claim transaction response:",
        finalPayload
      );
      if (finalPayload.status === "error") {
        console.error(
          "[BasicIncomePlus] Error sending claim transaction",
          finalPayload
        );
        setIsClaimingPlus(false);
      } else {
        setTransactionId(finalPayload.transaction_id);
        console.log(
          "[BasicIncomePlus] Claim transaction ID:",
          finalPayload.transaction_id
        );

        // Only reset the display after successful transaction submission
        // This will prevent the flickering by just doing one reset
        console.log(
          "[ClaimProcess] Setting display to 0 while waiting for confirmation"
        );
        setDisplayClaimable(0);

        // We'll do the localStorage reset in the transaction confirmation handler
      }
    } catch (error) {
      console.error("[BasicIncomePlus] Claim error:", error);
      if (error instanceof Error) {
        console.error("[BasicIncomePlus] Error message:", error.message);
        console.error("[BasicIncomePlus] Error stack:", error.stack);
      }
      setIsClaimingPlus(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("[Transaction] Transaction successful");
      console.log("[Transaction] Transaction ID:", transactionId);

      // Reset localStorage values only after successful transaction
      if (isClaimingBasic) {
        console.log(
          "[ClaimProcess] Resetting basicIncome localStorage values after confirmation"
        );
        localStorage.setItem("basicIncomeBase", "0");
        localStorage.setItem("basicIncomeStartTime", Date.now().toString());
      }

      if (isClaimingPlus) {
        console.log(
          "[ClaimProcess] Resetting basicIncomePlus localStorage values after confirmation"
        );
        localStorage.setItem("basicIncomePlusBase", "0");
        localStorage.setItem("basicIncomePlusStartTime", Date.now().toString());
      }

      fetchBasicIncomeInfo();
      fetchBasicIncomePlusInfo();
      fetchBalance();
      setTransactionId(null);
      setIsSubmitting(false);
      setIsClaimingBasic(false);
      setIsClaimingPlus(false);
    }
  }, [
    isSuccess,
    fetchBalance,
    fetchBasicIncomeInfo,
    fetchBasicIncomePlusInfo,
    transactionId,
    isClaimingBasic,
    isClaimingPlus,
  ]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const [lookupResult, setLookupResult] = useState<{
    username: string;
    address: string;
    profile_picture_url: string | null;
  } | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState("");

  // Add state for recipient username (for rewards)
  const [recipientUsername, setRecipientUsername] = useState<string>("");

  // Add useEffect to set recipient username from localStorage when component mounts
  useEffect(() => {
    const storedReferrer = localStorage.getItem("referredBy");
    if (storedReferrer) {
      setRecipientUsername(storedReferrer);
    }
  }, []);

  const lookupUsername = async () => {
    if (!recipientUsername || !recipientUsername.trim()) {
      setLookupError("Please enter a username");
      return;
    }

    setIsLookingUp(true);
    setLookupError("");
    setLookupResult(null);

    try {
      // Use MiniKit API to look up username (if available)
      if (MiniKit.isInstalled()) {
        try {
          // Try to get address by username first
          const response = await fetch(
            `https://usernames.worldcoin.org/api/v1/${encodeURIComponent(recipientUsername.trim())}`
          );

          if (!response.ok) {
            if (response.status === 404) {
              setLookupError("Username not found");
            } else {
              setLookupError(
                `Error: ${response.status} ${response.statusText}`
              );
            }
            return;
          }

          const data = await response.json();
          setLookupResult(data);
        } catch (error) {
          console.error("[Username] Error looking up username via API:", error);
          setLookupError("Failed to look up username. Please try again.");
        }
      } else {
        setLookupError("Please install MiniKit to look up usernames");
      }
    } catch (error) {
      setLookupError("Failed to look up username. Please try again.");
      console.error("[Username] Username lookup error:", error);
    } finally {
      setIsLookingUp(false);
    }
  };

  const [isSendingReward, setIsSendingReward] = useState(false);
  const [rewardStatus, setRewardStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const sendReward = async (recipientAddress: string) => {
    if (!MiniKit.isInstalled() || !walletAddress) {
      setRewardStatus({
        success: false,
        message: "Please connect your wallet first",
      });
      return;
    }

    setIsSendingReward(true);
    setRewardStatus(null);

    // Check if this is the stored referrer
    const storedReferrer = localStorage.getItem("referredBy");
    const isStoredReferrer =
      storedReferrer && storedReferrer === recipientUsername;

    try {
      console.log(`[Reward] Sending reward to ${recipientAddress}`);
      if (isStoredReferrer) {
        console.log("[Reward] This is the user who referred you!");
      }

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: "0x372dCA057682994568be074E75a03Ced3dD9E60d",
            abi: parseAbi(["function rewardUser(address recipient) external"]),
            functionName: "rewardUser",
            args: [recipientAddress],
          },
        ],
      });

      console.log("[Reward] Transaction response:", finalPayload);

      if (finalPayload.status === "error") {
        console.error("[Reward] Error sending transaction", finalPayload);

        // Keep error handling simple to avoid TypeScript errors
        setRewardStatus({
          success: false,
          message: "Transaction failed. Please try again.",
        });
      } else {
        setRewardStatus({
          success: true,
          message: `Successfully sent reward to ${recipientUsername}!`,
        });

        // After successful reward transaction, update the canReward status
        fetchCanReward();
      }
    } catch (error) {
      console.error("[Reward] Error in reward transaction:", error);
      setRewardStatus({
        success: false,
        message: "Failed to send reward. Please try again.",
      });
    } finally {
      setIsSendingReward(false);
    }
  };

  // First, wrap loadCurrentUsername with useCallback to prevent infinite loop
  const loadCurrentUsernameCallback = useCallback(async () => {
    if (!MiniKit.isInstalled() || !walletAddress) return;

    try {
      // Check if username is already available via MiniKit.user
      if (MiniKit.user && MiniKit.user.username) {
        console.log(
          "[Username] Using MiniKit.user.username:",
          MiniKit.user.username
        );
        setUsername(MiniKit.user.username);
        return;
      }

      // If not available directly, try getting user information by address
      try {
        const userInfo = await MiniKit.getUserByAddress(walletAddress);
        if (userInfo && userInfo.username) {
          console.log(
            "[Username] Found username via getUserByAddress:",
            userInfo.username
          );
          setUsername(userInfo.username);
        } else {
          console.log(
            "[Username] No username found for address:",
            walletAddress
          );
        }
      } catch (error) {
        console.error("[Username] Error getting user by address:", error);
      }
    } catch (error) {
      console.error("[Username] Error loading username:", error);
    }
  }, [walletAddress, setUsername]);

  // Then update the effect to use the memoized callback
  useEffect(() => {
    if (walletAddress && !username) {
      loadCurrentUsernameCallback();
    }
  }, [walletAddress, username, loadCurrentUsernameCallback]);

  // Add this useEffect to check for stored referral information on component mount
  useEffect(() => {
    const storedReferrer = localStorage.getItem("referredBy");
    if (storedReferrer) {
      console.log(
        "[Referral] App loaded with stored referrer:",
        storedReferrer
      );
    } else {
      console.log("[Referral] No stored referrer found on app load");
    }
  }, []);

  // Add immediate check for referral code when the module loads
  useEffect(() => {
    console.log("====== INITIAL URL CHECK ======");
    console.log("[Referral] Initial URL:", window.location.href);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      console.log("[Referral] FOUND INITIAL CODE:", code);
      console.log("[Referral] Immediately saving code to sessionStorage");
      // Store in sessionStorage immediately as a backup
      sessionStorage.setItem("pendingReferralCode", code);
    }
    console.log("==============================");
  }, []);

  // Handle incoming referral codes
  useEffect(() => {
    console.log("[Referral] Checking for referral code in URL");
    console.log("[Referral] Current URL:", window.location.href);

    // Parse URL for referral code
    const parseReferralCode = () => {
      if (typeof window !== "undefined") {
        // First check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlCode = urlParams.get("code");

        // Then check sessionStorage for a pending code that might have been saved
        // before any redirects happened
        const pendingCode = sessionStorage.getItem("pendingReferralCode");

        // Use whichever code is available (URL takes precedence)
        const code = urlCode || pendingCode;

        if (code && code.length > 0) {
          console.log("====== INVITE LINK DETECTED ======");
          console.log(`[Referral] Inviter username: ${code}`);
          console.log(`[Referral] Found referral code: ${code}`);
          console.log(
            `[Referral] Source: ${urlCode ? "URL" : "sessionStorage"}`
          );
          console.log("==================================");

          // Only store the code if we haven't already been referred
          if (!localStorage.getItem("referredBy")) {
            console.log("[Referral] Storing referral code");
            localStorage.setItem("referredBy", code);
            // Clear the pending code from sessionStorage
            sessionStorage.removeItem("pendingReferralCode");

            // Validate the referrer username
            try {
              fetch(
                `https://usernames.worldcoin.org/api/v1/${encodeURIComponent(code.trim())}`
              )
                .then((response) => {
                  console.log(
                    "[Referral] Validation response status:",
                    response.status
                  );
                  if (response.ok) {
                    console.log(
                      "[Referral] Successfully validated referrer username"
                    );
                    console.log(
                      `[Referral] VALID INVITE: User was invited by ${code}`
                    );

                    // Show a toast notification about the successful referral
                    if (showToast) {
                      showToast(`You were invited by ${code}!`, "success");
                    }
                  } else if (response.status === 404) {
                    console.error("[Referral] Invalid referrer username");
                    console.error(
                      `[Referral] Username "${code}" not found in Worldcoin system`
                    );
                    localStorage.removeItem("referredBy");
                  }
                })
                .catch((error) => {
                  console.error(
                    "[Referral] Error validating referrer username:",
                    error
                  );
                });
            } catch (error) {
              console.error(
                "[Referral] Error validating referrer username:",
                error
              );
            }
          } else {
            console.log(
              "[Referral] User was already referred by:",
              localStorage.getItem("referredBy")
            );
          }
        } else {
          console.log(
            "[Referral] No referral code found in URL or sessionStorage"
          );
        }
      }
    };

    parseReferralCode();

    // Run this check again after a short delay to catch any late navigation
    const delayedCheck = setTimeout(() => {
      console.log("[Referral] Running delayed check for referral code");
      console.log("[Referral] Delayed check URL:", window.location.href);
      parseReferralCode();
    }, 2000);

    return () => clearTimeout(delayedCheck);
  }, [walletAddress, showToast]);

  // Add this useEffect near your other useEffects
  useEffect(() => {
    const handleInputFocus = (e: FocusEvent) => {
      // Check if the focused element is an input
      if (
        e.target &&
        (e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement)
      ) {
        // Wait a short moment for the keyboard to appear
        setTimeout(() => {
          // Scroll the input into view
          (e.target as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 300);
      }
    };

    // Add event listener for all input focus events
    document.addEventListener("focusin", handleInputFocus);

    // Clean up
    return () => {
      document.removeEventListener("focusin", handleInputFocus);
    };
  }, []);

  // Add a state to track if user is verified
  const [isAddressVerified, setIsAddressVerified] = useState<boolean>(false);

  // Check if address is verified when wallet address changes
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    const checkAddressVerification = async () => {
      if (!walletAddress) {
        setIsAddressVerified(false);
        return;
      }

      try {
        // Use the getIsUserVerified function from the Address Book
        const isVerified = await getIsUserVerified(walletAddress);
        console.log("[AddressVerification] User verified status:", isVerified);
        setIsAddressVerified(isVerified);
      } catch (error) {
        console.error(
          "[AddressVerification] Error checking verification:",
          error
        );
        setIsAddressVerified(false);

        // Retry after 1 second if there's an error
        console.log("[AddressVerification] Retrying in 1 second...");
        retryTimeout = setTimeout(checkAddressVerification, 1000);
      }
    };

    checkAddressVerification();

    // Clean up any pending timeouts when component unmounts
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [walletAddress]);

  // Add a new state to track if the Invite tab has been visited
  const [hasInviteBeenVisited, setHasInviteBeenVisited] = useState(false);

  // Load the invite visited state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const inviteVisited = localStorage.getItem("inviteTabVisited") === "true";
      setHasInviteBeenVisited(inviteVisited);
    }
  }, []);

  // Update localStorage when the Invite tab is active
  useEffect(() => {
    if (activeTab === "Invite" && typeof window !== "undefined") {
      localStorage.setItem("inviteTabVisited", "true");
      setHasInviteBeenVisited(true);
    }
  }, [activeTab]);

  // Add this to run fetchRewardCount when the component mounts or wallet changes
  useEffect(() => {
    if (walletAddress) {
      fetchCanReward();
      fetchRewardCount();
    }
  }, [walletAddress, fetchCanReward, fetchRewardCount]);

  // Add the state that we're lifting from StakeWithPermitForm
  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const [availableReward, setAvailableReward] = useState<string>("0");
  const [displayAvailableReward, setDisplayAvailableReward] = useState<
    string | null
  >(null);
  const [isRewardLoading, setIsRewardLoading] = useState<boolean>(true);

  // Add the utility function
  const fromWei = useCallback((value: bigint) => {
    return (Number(value) / 1e18).toString();
  }, []);

  // Add a state to track if collection is in progress
  const [isCollectingRewards, setIsCollectingRewards] = useState(false);

  // Add this handler function
  const handleCollectStart = () => {
    console.log("[RewardTracking] Collection started, forcing display to 0");
    setIsCollectingRewards(true);
    setDisplayAvailableReward("0.0");

    // Set localStorage values to 0
    localStorage.setItem("savingsRewardBase", "0");
    localStorage.setItem("savingsRewardStartTime", Date.now().toString());
    console.log("[RewardTracking] Reset localStorage values for collection");
  };

  // Modify fetchAvailableReward to handle post-collection state better
  const fetchAvailableReward = useCallback(async () => {
    if (!walletAddress) return;

    setIsRewardLoading(true);
    if (!isCollectingRewards) {
      setDisplayAvailableReward(null);
    }

    try {
      const availableAbi = parseAbi([
        "function available(address account) external view returns (uint256)",
      ]);
      const result: bigint = await quiknodeClient.readContract({
        address: "0x234302Db10A54BDc11094A8Ef816B0Eaa5FCE3f7" as `0x${string}`,
        abi: availableAbi,
        functionName: "available",
        args: [walletAddress],
      });
      console.log("Fetched available reward:", result);

      // Convert the result to a string value
      const resultAsString = fromWei(result);

      // Always update the base reward value
      setAvailableReward(resultAsString);

      // If we're in collection mode, keep showing 0
      if (isCollectingRewards) {
        console.log(
          "[RewardTracking] Maintaining zero display during collection"
        );
        setDisplayAvailableReward("0.0");
      }

      // Always update localStorage with the latest value from the chain
      localStorage.setItem("savingsRewardBase", resultAsString);
      localStorage.setItem("savingsRewardStartTime", Date.now().toString());
      console.log(
        "[RewardTracking] Updated localStorage with latest chain data:",
        resultAsString
      );
    } catch (error) {
      console.error("Error fetching available reward", error);
    } finally {
      setIsRewardLoading(false);
      // Reset collection state after fetch completes
      if (isCollectingRewards) {
        console.log(
          "[RewardTracking] Collection process complete, resetting collection flag"
        );
        setIsCollectingRewards(false);
      }
    }
  }, [walletAddress, fromWei, isCollectingRewards]);

  // Modify the reward tracking effect to be more robust
  useEffect(() => {
    // If we don't have the necessary data, or collection is in progress, don't start calculations
    if (!stakedBalance || !availableReward) {
      console.log("[RewardTracking] Missing data, skipping calculation");
      return;
    }

    if (isCollectingRewards) {
      console.log(
        "[RewardTracking] Collection in progress, skipping calculation"
      );
      return;
    }

    console.log("[RewardTracking] Setting up reward calculation effect");

    const interestRate = 1 / (86400 * 529);
    const stakedBalanceNum = Number(stakedBalance);
    const baseReward = Number(availableReward);

    console.log(
      "[RewardTracking] Starting real-time reward display update with:"
    );
    console.log("[RewardTracking] stakedBalance:", stakedBalanceNum);
    console.log("[RewardTracking] baseReward:", baseReward);

    let baseValue: number;
    let startTime: number;

    const storedBase = localStorage.getItem("savingsRewardBase");
    const storedStartTime = localStorage.getItem("savingsRewardStartTime");

    console.log("[RewardTracking] Stored base value:", storedBase);
    console.log("[RewardTracking] Stored start time:", storedStartTime);

    if (storedBase && storedStartTime) {
      baseValue = parseFloat(storedBase);
      startTime = parseInt(storedStartTime, 10);

      // Ensure we're not using stale localStorage values compared to latest chain data
      if (Math.abs(baseReward - baseValue) > 0.000001) {
        console.log(
          "[RewardTracking] Significant difference between chain data and local storage, updating to chain data"
        );
        baseValue = baseReward;
        startTime = Date.now();
        localStorage.setItem("savingsRewardBase", baseValue.toString());
        localStorage.setItem("savingsRewardStartTime", startTime.toString());
      }
    } else {
      // Initialize with current values
      baseValue = baseReward;
      startTime = Date.now();
      localStorage.setItem("savingsRewardBase", baseValue.toString());
      localStorage.setItem("savingsRewardStartTime", startTime.toString());
    }

    const updateDisplay = () => {
      // Double-check that we're not in collection mode before updating
      if (isCollectingRewards) {
        console.log(
          "[RewardTracking] Collection started during update, stopping calculations"
        );
        return;
      }

      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const interestEarned = stakedBalanceNum * interestRate * elapsedSeconds;
      const totalReward = baseValue + interestEarned;

      if (Math.round(elapsedSeconds) % 10 === 0) {
        console.log("[RewardTracking] Current calculation:");
        console.log(
          "[RewardTracking] baseValue:",
          baseValue,
          "+ (stakedBalance:",
          stakedBalanceNum,
          "* rate:",
          interestRate,
          "* elapsed:",
          elapsedSeconds,
          ") =",
          totalReward
        );
      }

      setDisplayAvailableReward(totalReward.toFixed(9));
      setIsRewardLoading(false);
    };

    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);

    return () => {
      console.log("[RewardTracking] Cleaning up calculation interval");
      clearInterval(interval);
    };
  }, [stakedBalance, availableReward, isCollectingRewards]);

  const fetchStakedBalance = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const balanceAbi = parseAbi([
        "function balanceOf(address account) external view returns (uint256)",
      ]);
      const result: bigint = await alchemyClient.readContract({
        address: "0x234302Db10A54BDc11094A8Ef816B0Eaa5FCE3f7" as `0x${string}`,
        abi: balanceAbi,
        functionName: "balanceOf",
        args: [walletAddress],
      });
      const balance = fromWei(result);
      console.log("Fetched staked balance:", balance);
      setStakedBalance(balance);
      localStorage.setItem("stakedBalance", balance);
    } catch (error) {
      console.error("Error fetching staked balance", error);
      setTimeout(fetchStakedBalance, 1000);
    }
  }, [walletAddress, fromWei]);

  // Add useEffect to fetch data when the wallet address changes
  useEffect(() => {
    if (!walletAddress) {
      setIsRewardLoading(true);
      setDisplayAvailableReward(null);
      return;
    }

    // Fetch immediately when component mounts or wallet changes
    fetchAvailableReward();
    fetchStakedBalance();

    // Then set up a much less frequent interval (every 5 minutes)
    const fetchInterval = setInterval(
      () => {
        console.log(
          "[RewardTracking] Running periodic refresh (5 min interval)"
        );
        fetchAvailableReward();
        fetchStakedBalance();
      },
      5 * 60 * 1000
    ); // 5 minutes in milliseconds

    return () => clearInterval(fetchInterval);
  }, [walletAddress, fetchAvailableReward, fetchStakedBalance]);

  const renderContent = () => {
    switch (activeTab) {
      case "Basic income":
        return (
          <div className="flex w-full flex-col items-center py-6">
            <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <PiHandCoinsFill className="h-10 w-10 text-gray-400" />
            </div>
            <Typography as="h2" variant="heading" level={1}>
              Basic Income
            </Typography>

            {walletAddress === null ? (
              <>
                <Typography
                  variant="subtitle"
                  level={1}
                  className="mx-auto mb-10 mt-4 text-center text-gray-500"
                >
                  Sign in to claim your basic income
                </Typography>
                <WalletAuth onError={(error) => console.error(error)} />
              </>
            ) : !basicIncomeActivated ? (
              <>
                <Typography
                  variant="subtitle"
                  level={1}
                  className="mx-auto mb-10 mt-4 text-center text-gray-500"
                >
                  Set up your basic income
                </Typography>
                <Button onClick={sendSetup} isLoading={isSubmitting} fullWidth>
                  Activate Basic Income
                </Button>
              </>
            ) : (
              <>
                <Typography
                  variant="subtitle"
                  level={1}
                  className="mx-auto mb-10 mt-4 text-center text-gray-500"
                >
                  Claimable drachma
                </Typography>
                <div className="text-center">
                  {isClaimableLoading ? (
                    <div className="mx-auto mb-[57px] mt-[6px] h-[56px] w-64 animate-pulse rounded-xl bg-gray-100"></div>
                  ) : (
                    <p className="mx-auto mb-[52px] font-sans text-[56px] font-semibold leading-narrow tracking-normal">
                      {displayClaimable.toFixed(5)}
                    </p>
                  )}
                </div>
                {basicIncomePlusActivated ? (
                  <div className="flex w-full flex-col gap-4">
                    <Button
                      onClick={sendClaim}
                      isLoading={isClaimingBasic}
                      fullWidth
                    >
                      Claim Basic Income
                    </Button>
                    <Button
                      onClick={sendClaimPlus}
                      isLoading={isClaimingPlus}
                      variant="secondary"
                      fullWidth
                    >
                      Claim Basic Income Plus
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={sendClaim}
                    isLoading={isClaimingBasic}
                    fullWidth
                  >
                    Claim
                  </Button>
                )}
                {!basicIncomePlusActivated && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div className="mt-4 flex w-full cursor-pointer rounded-xl border border-gray-200 bg-transparent py-2">
                        <div className="flex w-full items-center overflow-hidden">
                          <div className="-ml-[2px] mr-[10px] size-[30px] rounded-full border-[5px] border-gray-900"></div>
                          <Typography
                            as="h3"
                            variant={{ variant: "subtitle", level: 2 }}
                            className="line-clamp-2 font-display text-[15px] font-medium tracking-tight text-gray-900"
                          >
                            Introducing Basic Income Plus
                          </Typography>
                          <div className="ml-1 rounded-full bg-gray-200 px-1.5 py-0.5">
                            <p className="font-sans text-[12px] font-medium leading-narrow tracking-normal text-gray-900">
                              New
                            </p>
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="flex flex-col items-center p-6 pt-10">
                        <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                          <PiCoinsFill className="h-10 w-10 text-gray-400" />
                        </div>
                        <Typography
                          as="h2"
                          variant={{ variant: "heading", level: 1 }}
                          className="text-center"
                        >
                          Basic Income Plus
                        </Typography>
                        <Typography
                          variant={{ variant: "subtitle", level: 1 }}
                          className="mx-auto mt-4 text-center text-gray-500"
                        >
                          Extra income for verified users
                        </Typography>

                        <div className="mt-6 w-full px-3 py-4">
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                                <PiTrendUpFill className="h-3.5 w-3.5 text-gray-500" />
                              </div>
                              <Typography
                                variant={{ variant: "body", level: 3 }}
                                className="text-gray-600 mt-[3px]"
                              >
                                An additional 10 WDD per day
                              </Typography>
                            </li>
                            <li className="flex items-start">
                              <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                                <PiUserCheckFill className="h-3.5 w-3.5 text-gray-500" />
                              </div>
                              <Typography
                                variant={{ variant: "body", level: 3 }}
                                className="text-gray-600 mt-[3px]"
                              >
                                Exclusive to Orb-verified users to ensure fair
                                distribution
                              </Typography>
                            </li>
                            <li className="flex items-start">
                              <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                                <PiChartLineFill className="h-3.5 w-3.5 text-gray-500" />
                              </div>
                              <Typography
                                variant={{ variant: "body", level: 3 }}
                                className="text-gray-600 mt-[3px]"
                              >
                                Rewards shift to Plus over time while keeping
                                total at 11 WDD/day
                              </Typography>
                            </li>
                          </ul>
                        </div>

                        <Button
                          onClick={sendSetupPlus}
                          isLoading={isSubmitting}
                          fullWidth
                          className="mt-6"
                        >
                          Activate Basic Income Plus
                        </Button>
                      </div>
                    </DrawerContent>
                  </Drawer>
                )}
              </>
            )}
          </div>
        );
      case "Savings":
        return (
          <div className="flex w-full flex-col items-center py-6">
            <Typography as="h2" variant={{ variant: "heading", level: 1 }}>
              Savings Account
            </Typography>
            <Typography
              variant={{ variant: "subtitle", level: 1 }}
              className="mx-auto mb-4 mt-4 flex items-center justify-center text-center text-gray-500"
            >
              Earn interest every second
              <span className="group relative ml-1 inline-block">
                <span className="hover:text-gray-600 cursor-help text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <div className="absolute bottom-full right-0 mb-2 hidden w-[280px] transform rounded-lg border border-gray-200 bg-gray-0 p-3 text-xs shadow-lg group-hover:block">
                  <p className="text-left text-gray-700">
                    69% APY base rate. Collect and reinvest interest to achieve
                    close to 100% effective returns annually. Withdraw anytime.
                  </p>
                </div>
              </span>
            </Typography>
            <StakeWithPermitForm
              stakedBalance={stakedBalance}
              displayAvailableReward={displayAvailableReward}
              isRewardLoading={isRewardLoading}
              fetchStakedBalance={fetchStakedBalance}
              fetchAvailableReward={fetchAvailableReward}
              onCollectStart={handleCollectStart}
            />
          </div>
        );
      case "Contribute":
        return (
          <div className="flex w-full flex-col items-center py-6">
            <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <PiPlantFill className="h-10 w-10 text-gray-400" />
            </div>
            <Typography as="h2" variant={{ variant: "heading", level: 1 }}>
              Contribute
            </Typography>
            <Typography
              variant={{ variant: "subtitle", level: 1 }}
              className="mx-auto mb-10 mt-4 text-center text-gray-500"
            >
              Get involved, get rewarded
            </Typography>
            <OpenLetterCard
              title="Early Access Program"
              referenceTitle="Earn WDD by testing our upcoming features"
              voteUrl="https://t.me/worldrepublictesters"
              isExternal={true}
            />
          </div>
        );
      case "Invite":
        return (
          <div className="flex w-full flex-col items-center py-6">
            <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <PiUserPlusFill className="h-10 w-10 text-gray-400" />
            </div>
            <Typography as="h2" variant={{ variant: "heading", level: 1 }}>
              Invite
            </Typography>
            <Typography
              variant={{ variant: "subtitle", level: 1 }}
              className="mx-auto mb-4 mt-4 flex items-center justify-center text-center text-gray-500"
            >
              Get 50 WDD per friend who joins
              <span className="group relative ml-1 inline-block">
                <span className="hover:text-gray-600 cursor-help text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <div className="absolute bottom-full right-0 mb-2 hidden w-[280px] transform rounded-lg border border-gray-200 bg-gray-0 p-3 text-xs shadow-lg group-hover:block">
                  <p className="text-left text-gray-700">
                    You&apos;ll earn rewards when friends activate their Basic
                    Income Plus.
                  </p>
                </div>
              </span>
            </Typography>

            {/* Show the reward count statistics */}
            {/* {walletAddress && ( */}
            <div className="mb-10 w-full rounded-xl border border-gray-200 p-4">
              <Typography
                variant={{ variant: "subtitle", level: 2 }}
                className="mb-4 text-center text-gray-900"
              >
                Your Referral Stats
              </Typography>
              <div className="flex justify-around">
                <div className="text-center">
                  <Typography
                    variant={{ variant: "heading", level: 3 }}
                    className="text-gray-900"
                  >
                    {rewardCount}
                  </Typography>
                  <Typography
                    variant={{ variant: "body", level: 3 }}
                    className="text-gray-500"
                  >
                    Invites accepted
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography
                    variant={{ variant: "heading", level: 3 }}
                    className="text-gray-900"
                  >
                    {rewardCount > 0 ? `${rewardCount * 50} WDD` : "0 WDD"}
                  </Typography>
                  <Typography
                    variant={{ variant: "body", level: 3 }}
                    className="text-gray-500"
                  >
                    Total Rewards
                  </Typography>
                </div>
              </div>
            </div>
            {/* )} */}

            <>
              {/* Your Referral Link */}
              <div className="relative w-full">
                <Button
                  onClick={() => {
                    if (username) {
                      navigator.clipboard.writeText(
                        `https://worldcoin.org/mini-app?app_id=app_66c83ab8c851fb1e54b1b1b62c6ce39d&path=%2F%3Fcode%3D${username}`
                      );
                      showToast(
                        "Referral link copied to clipboard!",
                        "success"
                      );
                    } else {
                      showToast(
                        "Please connect your wallet to generate your referral link",
                        "error"
                      );
                      // Try to load the username if it's not set yet
                      loadCurrentUsernameCallback();
                    }
                  }}
                  fullWidth
                >
                  Copy Referral Link
                </Button>
              </div>

              {/* Only show this button if the user's address is verified AND canReward is true */}
              {canReward && (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="secondary" fullWidth className="mt-4">
                      Reward a Past Referrer
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="flex flex-col items-center p-6 pt-10">
                      <div className="mb-10 mt-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                        <PiUserPlusFill className="h-10 w-10 text-gray-400" />
                      </div>
                      <Typography
                        as="h2"
                        variant={{ variant: "heading", level: 1 }}
                      >
                        Reward a Referrer
                      </Typography>
                      <Typography
                        variant={{ variant: "subtitle", level: 1 }}
                        className="mx-auto mt-4 text-center text-gray-500"
                      >
                        Trigger a free 50 WDD reward for your referrer
                      </Typography>

                      {/* Referral Status */}
                      {localStorage.getItem("referredBy") && (
                        <div className="border-success-200 bg-success-50 mt-4 w-full rounded-xl border p-4">
                          <Typography
                            variant={{ variant: "subtitle", level: 3 }}
                            className="text-center text-success-700"
                          >
                            {(() => {
                              const referrer =
                                localStorage.getItem("referredBy");
                              console.log(
                                `[Referral] Displaying referrer information: ${referrer}`
                              );
                              return `You were invited by: ${referrer}`;
                            })()}
                          </Typography>
                        </div>
                      )}

                      <div className="w-full">
                        {!lookupResult ? (
                          <>
                            <input
                              type="text"
                              placeholder="Enter username (e.g. username.0000)"
                              className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 font-sans text-base"
                              value={recipientUsername}
                              onChange={(e) =>
                                setRecipientUsername(e.target.value)
                              }
                              onKeyPress={(e) =>
                                e.key === "Enter" && lookupUsername()
                              }
                              onFocus={(e) => {
                                // Ensure this input is visible when focused
                                setTimeout(() => {
                                  e.target.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                }, 300);
                              }}
                            />

                            {lookupError && (
                              <div className="mt-4 rounded-xl border border-error-300 bg-error-100 p-4 text-error-700">
                                {lookupError}
                              </div>
                            )}

                            <Button
                              onClick={lookupUsername}
                              isLoading={isLookingUp}
                              variant="secondary"
                              fullWidth
                              className="mt-4"
                            >
                              Lookup User
                            </Button>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                              <Typography
                                variant={{ variant: "body", level: 3 }}
                                className="mb-1 text-gray-500"
                              >
                                Sending reward to:
                              </Typography>
                              <div className="flex items-center justify-center gap-1">
                                <Typography
                                  variant={{ variant: "subtitle", level: 2 }}
                                  className="text-gray-700"
                                >
                                  {lookupResult.username}
                                </Typography>
                                <button
                                  onClick={() => {
                                    setLookupResult(null);
                                    setRewardStatus(null);
                                  }}
                                  className="hover:text-gray-600 text-gray-400"
                                >
                                  <PiNotePencilFill className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {rewardStatus && (
                              <div
                                className={`mt-3 rounded-xl border p-3 ${
                                  rewardStatus.success
                                    ? "border-success-300 bg-success-100 text-success-700"
                                    : "border-error-300 bg-error-100 text-error-700"
                                }`}
                              >
                                {rewardStatus.message}
                              </div>
                            )}

                            <Button
                              onClick={() => sendReward(lookupResult.address)}
                              isLoading={isSendingReward}
                              fullWidth
                            >
                              Send Reward
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              )}
            </>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-20">
      <div className="fixed left-0 right-0 top-0 z-10 px-6 pb-2 pt-5">
        <div className="flex items-center justify-between bg-gray-0">
          <div className="flex h-10 items-center">
            <Typography as="h2" variant={{ variant: "heading", level: 2 }}>
              Earn
            </Typography>
          </div>
          {walletAddress && (
            <a
              href="https://worldcoin.org/mini-app?app_id=app_a4f7f3e62c1de0b9490a5260cb390b56&path=%3Ftab%3Dswap%26fromToken%3D0x2cFc85d8E48F8EAB294be644d9E25C3030863003%26amount%3D1000000000000000000%26toToken%3D0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B%26referrerAppId%3Dapp_66c83ab8c851fb1e54b1b1b62c6ce39d"
              className="flex h-10 items-center gap-2 rounded-full bg-gray-100 px-4"
            >
              <PiWalletFill className="h-5 w-5" />
              <Typography
                variant={{ variant: "number", level: 6 }}
                className="text-base"
              >
                {tokenBalance
                  ? `${Number(tokenBalance).toFixed(2)} WDD`
                  : "0.00 WDD"}
              </Typography>
            </a>
          )}
        </div>

        <TabSwiper
          tabs={["Basic income", "Savings", "Invite", "Contribute"]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabIndicators={{ Invite: !hasInviteBeenVisited }}
        />
      </div>

      <div className="mt-[120px] flex flex-1 items-center">
        {renderContent()}
      </div>
    </div>
  );
}
