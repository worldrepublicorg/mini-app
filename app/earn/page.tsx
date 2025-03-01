"use client";

import { Typography } from "@/components/ui/Typography";
import { useState, useEffect } from "react";
import {
  PiHandCoinsFill,
  PiUserPlusFill,
  PiPlantFill,
  PiWalletFill,
  PiCoinsFill,
} from "react-icons/pi";
import { Drawer, DrawerTrigger } from "@/components/ui/Drawer";
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

export default function EarnPage() {
  const {
    walletAddress,
    claimableAmount,
    tokenBalance,
    fetchBasicIncomeInfo,
    fetchBalance,
    basicIncomeActivated,
    setBasicIncomeActivated,
  } = useWallet();

  const [displayClaimable, setDisplayClaimable] = useState<number>(
    Number(claimableAmount) || 0
  );
  
  const [activeTab, setActiveTab] = useState("Basic income");
  const [hasSeenSavings, setHasSeenSavings] = useState(() => {
    return localStorage.getItem("hasSeenSavings") === "true";
  });

  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
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
    if (claimableAmount === undefined || claimableAmount === null) return;

    const rate = 1 / 8640; // Increment rate (tokens per second)
    const currentClaimable = Number(claimableAmount);

    let baseValue: number;
    let startTime: number;

    const storedBase = localStorage.getItem("basicIncomeBase");
    const storedStartTime = localStorage.getItem("basicIncomeStartTime");

    if (storedBase && storedStartTime) {
      baseValue = parseFloat(storedBase);
      startTime = parseInt(storedStartTime, 10);

      // If the on-chain claimable has increased (due to accumulation)
      if (currentClaimable > baseValue) {
        baseValue = currentClaimable;
        startTime = Date.now();
        localStorage.setItem("basicIncomeBase", baseValue.toString());
        localStorage.setItem("basicIncomeStartTime", startTime.toString());
      }

      // If the on-chain claimable has decreased (i.e. a claim was made externally)
      if (currentClaimable < baseValue) {
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

    const updateDisplay = () => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const newValue = baseValue + elapsedSeconds * rate;
      setDisplayClaimable(newValue);
    };

    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);

    return () => clearInterval(interval);
  }, [claimableAmount]);

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
        fetchBalance();
        setIsSubmitting(false);
      },
    });

    // Listener for the claim event (RewardsClaimed)
    const unwatchRewardsClaimed = viemClient.watchContractEvent({
      address: "0x02c3B99D986ef1612bAC63d4004fa79714D00012" as `0x${string}`,
      abi: parseAbi([
        "event RewardsClaimed(address indexed staker, uint256 rewardAmount)",
      ]),
      eventName: "RewardsClaimed",
      args: { staker: walletAddress },
      onLogs: (logs: unknown) => {
        console.log("RewardsClaimed event captured:", logs);
        // Update your on-chain data here after claiming rewards.
        fetchBasicIncomeInfo();
        fetchBalance();
        setIsSubmitting(false);
      },
    });

    return () => {
      unwatchTokensStaked();
      unwatchRewardsClaimed();
    };
  }, [walletAddress]);

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

  const sendClaim = async () => {
    if (!MiniKit.isInstalled()) return;
    setIsSubmitting(true);
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
        setIsSubmitting(false);
      } else {
        setTransactionId(finalPayload.transaction_id);
        setDisplayClaimable(0);
        await fetchBasicIncomeInfo();
        await fetchBalance();

        localStorage.setItem("basicIncomeBase", "0");
        localStorage.setItem("basicIncomeStartTime", Date.now().toString());
      }
    } catch (error) {
      console.error("Error during claim:", error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("Transaction successful");
      fetchBasicIncomeInfo();
      fetchBalance();
      setTransactionId(null);
    }
  }, [isSuccess]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Savings") {
      setHasSeenSavings(true);
      localStorage.setItem("hasSeenSavings", "true");
    }
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
                  <p className="mx-auto mb-14 font-sans text-[56px] font-semibold leading-narrow tracking-normal">
                    {displayClaimable.toFixed(5)}
                  </p>
                </div>
                <Button onClick={sendClaim} isLoading={isSubmitting} fullWidth>
                  Claim
                </Button>
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
            <Drawer>
              <DrawerTrigger asChild>
                <div className="flex h-14 w-full cursor-pointer items-center justify-between rounded-xl bg-gray-100">
                  <div className="flex w-full items-center justify-center">
                    <Typography
                      as="h3"
                      variant={{ variant: "subtitle", level: 2 }}
                      className="line-clamp-2 font-display font-semibold tracking-normal text-gray-300"
                    >
                      Learn more
                    </Typography>
                  </div>
                </div>
              </DrawerTrigger>
              <ComingSoonDrawer />
            </Drawer>
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
        showSavingsIndicator={!hasSeenSavings && activeTab !== "Savings"}
      />

      <div className="flex flex-1 items-center">{renderContent()}</div>
    </div>
  );
}
