"use client";

import { Typography } from "@/components/ui/Typography";
import { useState } from "react";
import {
  PiHandCoinsFill,
  PiPiggyBankFill,
  PiUserPlusFill,
  PiPlantFill,
} from "react-icons/pi";
import { Drawer, DrawerTrigger } from "@/components/ui/Drawer";
import { WalletAuth } from "@/components/WalletAuth";
import { useWallet } from "@/contexts/WalletContext";
import { viemClient } from "@/lib/viemClient";
import { parseAbi } from "viem";
import { MiniKit } from "@worldcoin/minikit-js";
import { TabSwiper } from "@/components/TabSwiper";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { Button } from "@/components/ui/Button";
import { ComingSoonDrawer } from "@/components/ComingSoonDrawer";

export default function EarnPage() {
  const [activeTab, setActiveTab] = useState("Basic income");
  const { isLoggedIn, stakeInfo, tokenBalance } = useWallet();
  const [transactionId, setTransactionId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    client: viemClient,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_APP_ID as string,
    },
    transactionId: transactionId,
  });

  const sendSetup = async () => {
    if (!MiniKit.isInstalled()) return;

    setIsSubmitting(true);
    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: "0x2f08c17B30e6622F8B780fb58835Fc0927E2dc8e",
            abi: parseAbi(["function stake() external"]),
            functionName: "stake",
            args: [],
          },
        ],
      });

      if (finalPayload.status === "error") {
        console.error("Error sending transaction", finalPayload);
      } else {
        setTransactionId(finalPayload.transaction_id);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
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
            address: "0x2f08c17B30e6622F8B780fb58835Fc0927E2dc8e",
            abi: parseAbi(["function claimRewards() external"]),
            functionName: "claimRewards",
            args: [],
          },
        ],
      });

      if (finalPayload.status === "error") {
        console.error("Error sending transaction", finalPayload);
      } else {
        setTransactionId(finalPayload.transaction_id);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Basic income":
        return (
          <div className="w-full py-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-10">
              <PiHandCoinsFill className="w-10 h-10 text-gray-400" />
            </div>
            <Typography as="h2" variant="heading" level={1}>
              Basic Income
            </Typography>

            {!isLoggedIn ? (
              <>
                <Typography
                  variant="subtitle"
                  level={1}
                  className="mt-4 mb-10 text-gray-500 mx-auto text-center"
                >
                  Sign in to claim your basic income
                </Typography>

                <WalletAuth onError={(error) => console.error(error)} />
              </>
            ) : stakeInfo ? (
              <>
                <Typography
                  variant="subtitle"
                  level={1}
                  className="mt-4 mb-10 text-gray-500 mx-auto text-center"
                >
                  Claimable drachma
                </Typography>

                <Typography variant="number" level={1} className="mb-12">
                  {Number(stakeInfo.rewards).toFixed(4)}
                </Typography>

                <Button
                  onClick={sendClaim}
                  isLoading={isSubmitting || isConfirming}
                  fullWidth
                >
                  Claim
                </Button>
              </>
            ) : (
              <>
                <Typography
                  variant="subtitle"
                  level={1}
                  className="mt-4 mb-10 text-gray-500 mx-auto text-center"
                >
                  Set up your basic income stream
                </Typography>

                <Button
                  onClick={sendSetup}
                  isLoading={isSubmitting || isConfirming}
                  fullWidth
                >
                  Activate basic income
                </Button>
              </>
            )}
          </div>
        );
      case "Savings":
        return (
          <div className="w-full py-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-10">
              <PiPiggyBankFill className="w-10 h-10 text-gray-400" />
            </div>
            <Typography as="h2" variant={{ variant: "heading", level: 1 }}>
              Savings Account
            </Typography>
            <Typography
              variant={{ variant: "subtitle", level: 1 }}
              className="mt-4 mb-10 text-gray-500 mx-auto text-center"
            >
              Earn interest every second
            </Typography>
            <Drawer>
              <DrawerTrigger asChild>
                <div className="w-full flex items-center justify-between h-14 bg-gray-100 rounded-xl cursor-pointer">
                  <div className="w-full flex items-center justify-center">
                    <Typography
                      as="h3"
                      variant={{ variant: "subtitle", level: 2 }}
                      className="line-clamp-2 text-gray-300 font-display font-semibold tracking-normal"
                    >
                      Deposit drachma
                    </Typography>
                  </div>
                </div>
              </DrawerTrigger>
              <ComingSoonDrawer />
            </Drawer>
          </div>
        );
      case "Contribute":
        return (
          <div className="w-full py-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-10">
              <PiPlantFill className="w-10 h-10 text-gray-400" />
            </div>
            <Typography as="h2" variant={{ variant: "heading", level: 1 }}>
              Contribute
            </Typography>
            <Typography
              variant={{ variant: "subtitle", level: 1 }}
              className="mt-4 mb-10 text-gray-500 mx-auto text-center"
            >
              Get involved, get rewarded
            </Typography>
            <Drawer>
              <DrawerTrigger asChild>
                <div className="w-full flex items-center justify-between h-14 bg-gray-100 rounded-xl cursor-pointer">
                  <div className="w-full flex items-center justify-center">
                    <Typography
                      as="h3"
                      variant={{ variant: "subtitle", level: 2 }}
                      className="line-clamp-2 text-gray-300 font-display font-semibold tracking-normal"
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
          <div className="w-full py-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-10">
              <PiUserPlusFill className="w-10 h-10 text-gray-400" />
            </div>
            <Typography as="h2" variant={{ variant: "heading", level: 1 }}>
              Invite
            </Typography>
            <Typography
              variant={{ variant: "subtitle", level: 1 }}
              className="mt-4 mb-10 text-gray-500 mx-auto text-center"
            >
              Spread the word
            </Typography>
            <Drawer>
              <DrawerTrigger asChild>
                <div className="w-full flex items-center justify-between h-14 bg-gray-100 rounded-xl cursor-pointer">
                  <div className="w-full flex items-center justify-center">
                    <Typography
                      as="h3"
                      variant={{ variant: "subtitle", level: 2 }}
                      className="line-clamp-2 text-gray-300 font-display font-semibold tracking-normal"
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
    <div className="flex flex-col px-6 pb-24 min-h-screen">
      <div className="mt-6 bg-white flex justify-between items-center">
        <Typography as="h2" variant={{ variant: "heading", level: 2 }}>
          Earn
        </Typography>
        <a
          href="https://worldcoin.org/mini-app?app_id=app_a4f7f3e62c1de0b9490a5260cb390b56&path=%3Ftab%3Dswap%26fromToken%3D0x4200000000000000000000000000000000000006%26amount%3D1000000000000000000%26toToken%3D0xAAC7d5E9011Fc0fC80bF707DDcC3D56DdfDa9084%26referrerAppId%3Dapp_66c83ab8c851fb1e54b1b1b62c6ce39d"
          className="flex items-baseline gap-2 pt-0.5"
        >
          <p className="font-medium text-sm">Balance</p>
          <Typography variant={{ variant: "number", level: 6 }}>
            {tokenBalance
              ? `${Number(tokenBalance).toFixed(2)} WDD`
              : "0.00 WDD"}
          </Typography>
        </a>
      </div>

      <TabSwiper
        tabs={["Basic income", "Savings", "Contribute", "Invite"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 flex items-center">{renderContent()}</div>
    </div>
  );
}
