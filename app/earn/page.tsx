"use client";

import { Typography } from "@/components/ui/Typography";
import { useState, useEffect } from "react";
import {
  PiHandCoinsFill,
  PiUserPlusFill,
  PiPlantFill,
  PiWalletFill,
  PiCoinsFill,
  PiUserCircleFill,
  PiChartLineFill,
  PiTrendUpFill,
  PiUserCheckFill,
} from "react-icons/pi";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer";
import { WalletAuth } from "@/components/WalletAuth";
import { useWallet } from "@/components/contexts/WalletContext";
import { viemClient } from "@/lib/viemClient";
import { parseAbi } from "viem";
import { MiniKit } from "@worldcoin/minikit-js";
import { TabSwiper } from "@/components/TabSwiper";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { Button } from "@/components/ui/Button";
import { ComingSoonDrawer } from "@/components/ComingSoonDrawer";
import { StakeWithPermitForm } from "@/components/StakeWithPermitForm";
import { OpenLetterCard } from "@/components/OpenLetterCard";

export default function EarnPage() {
  const {
    walletAddress,
    tokenBalance,
    basicIncomeActivated,
    basicIncomePlusActivated,
    claimableAmount,
    claimableAmountPlus,
    fetchBalance,
    fetchBasicIncomeInfo,
    fetchBasicIncomePlusInfo,
    setBasicIncomeActivated,
    setBasicIncomePlusActivated,
  } = useWallet();

  // Add a new loading state for claimable amount
  const [isClaimableLoading, setIsClaimableLoading] = useState<boolean>(true);

  const [displayClaimable, setDisplayClaimable] = useState<number>(
    (Number(claimableAmount) || 0) + (Number(claimableAmountPlus) || 0)
  );

  // Add console logs to track when values change
  useEffect(() => {
    console.log("[DisplayTracking] Initial claimableAmount:", claimableAmount);
    console.log(
      "[DisplayTracking] Initial claimableAmountPlus:",
      claimableAmountPlus
    );
    console.log(
      "[DisplayTracking] Initial displayClaimable:",
      displayClaimable
    );
  }, []);

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

    const rate = 2 / 86400; // Increment rate (tokens per second)
    const ratePlus = 9 / 86400; // Increment rate (tokens per second)
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
    client: viemClient,
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
    const unwatchTokensStaked = viemClient.watchContractEvent({
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
    const unwatchTokensStakedPlus = viemClient.watchContractEvent({
      address: "0x52dfee61180a0bcebe007e5a9cfd466948acca46" as `0x${string}`,
      abi: parseAbi([
        "event TokensStaked(address indexed staker, uint256 amount)",
      ]),
      eventName: "TokensStaked",
      args: { staker: walletAddress },
      onLogs: (logs: unknown) => {
        console.log("TokensStaked event captured:", logs);
        // Update your on-chain data here after setup.
        fetchBasicIncomePlusInfo();
        setIsSubmitting(false);
      },
    });

    // Listener for the basic income claim event (RewardsClaimed)
    const unwatchRewardsClaimed = viemClient.watchContractEvent({
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
    const unwatchRewardsClaimedPlus = viemClient.watchContractEvent({
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

        console.log(
          "[ClaimProcess] Before fetchBasicIncomeInfo, claimableAmount:",
          claimableAmount
        );
        await fetchBasicIncomeInfo();
        console.log(
          "[ClaimProcess] After fetchBasicIncomeInfo, claimableAmount:",
          claimableAmount
        );
        await fetchBalance();

        console.log("[ClaimProcess] Resetting localStorage values");
        console.log(
          "[ClaimProcess] Old basicIncomeBase:",
          localStorage.getItem("basicIncomeBase")
        );
        localStorage.setItem("basicIncomeBase", "0");
        localStorage.setItem("basicIncomeStartTime", Date.now().toString());
        console.log(
          "[ClaimProcess] New basicIncomeBase:",
          localStorage.getItem("basicIncomeBase")
        );
        console.log(
          "[ClaimProcess] New basicIncomeStartTime:",
          localStorage.getItem("basicIncomeStartTime")
        );
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
        console.log(
          "[BasicIncomePlus] Fetching updated Basic Income Plus info"
        );
        console.log(
          "[ClaimProcess] Before fetchBasicIncomePlusInfo, claimableAmountPlus:",
          claimableAmountPlus
        );
        await fetchBasicIncomePlusInfo();
        console.log(
          "[ClaimProcess] After fetchBasicIncomePlusInfo, claimableAmountPlus:",
          claimableAmountPlus
        );
        await fetchBalance();

        console.log("[ClaimProcess] Resetting localStorage values for Plus");
        console.log(
          "[ClaimProcess] Old basicIncomePlusBase:",
          localStorage.getItem("basicIncomePlusBase")
        );
        localStorage.setItem("basicIncomePlusBase", "0");
        localStorage.setItem("basicIncomePlusStartTime", Date.now().toString());
        console.log(
          "[ClaimProcess] New basicIncomePlusBase:",
          localStorage.getItem("basicIncomePlusBase")
        );
        console.log(
          "[ClaimProcess] New basicIncomePlusStartTime:",
          localStorage.getItem("basicIncomePlusStartTime")
        );
        console.log("[BasicIncomePlus] Claim completed successfully");
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
      fetchBasicIncomeInfo();
      fetchBasicIncomePlusInfo();
      fetchBalance();
      setTransactionId(null);
      setIsSubmitting(false);
      setIsClaimingBasic(false);
      setIsClaimingPlus(false);
    }
  }, [isSuccess, fetchBalance, fetchBasicIncomeInfo, fetchBasicIncomePlusInfo]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

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
                                An additional 9 WDD per day
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
              className="mx-auto mb-10 mt-4 text-center text-gray-500"
            >
              Earn interest every second
            </Typography>
            <StakeWithPermitForm />
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
              className="mx-auto mb-10 mt-4 text-center text-gray-500"
            >
              Spread the word
            </Typography>
            <Drawer>
              <DrawerTrigger asChild>
                <div className="flex h-14 w-full cursor-pointer items-center justify-between rounded-xl bg-gray-100">
                  <div className="flex w-full items-center justify-center">
                    <Typography
                      as="h3"
                      variant={{ variant: "subtitle", level: 2 }}
                      className="line-clamp-2 font-display font-semibold tracking-normal text-gray-300"
                    >
                      Copy referral link
                    </Typography>
                  </div>
                </div>
              </DrawerTrigger>
              <ComingSoonDrawer />
            </Drawer>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-20">
      <div className="mt-5 flex items-center justify-between">
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
        tabs={["Basic income", "Savings", "Contribute", "Invite"]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="flex flex-1 items-center">{renderContent()}</div>
    </div>
  );
}
