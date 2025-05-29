import { useState, useEffect, useCallback } from "react";
import { useMiniKit } from "@/components/providers/minikit-provider";
import { MiniKit } from "@worldcoin/minikit-js";

export function useInviteTab({
  lang,
  dictionary,
  walletContext,
  showToast,
}: any) {
  const { isInstalled } = useMiniKit();
  // State
  const [recipientUsername, setRecipientUsername] = useState("");
  const [lookupResult, setLookupResult] = useState<{
    username: string;
    address: string;
    profile_picture_url: string | null;
  } | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [rewardStatus, setRewardStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSendingReward, setIsSendingReward] = useState(false);
  const [isPassportBadgeVisible, setIsPassportBadgeVisible] = useState(true);
  const [isAirdropBannerVisible, setIsAirdropBannerVisible] = useState(true);

  // Username lookup
  const lookupUsername = async () => {
    if (!recipientUsername || !recipientUsername.trim()) {
      setLookupError("Please enter a username");
      return;
    }
    setIsLookingUp(true);
    setLookupError("");
    setLookupResult(null);
    try {
      const windowKit =
        typeof window !== "undefined" &&
        (window as any).MiniKit &&
        (window as any).MiniKit.isInstalled?.();
      if (isInstalled || MiniKit.isInstalled() || windowKit) {
        try {
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
          setLookupError("Failed to look up username. Please try again.");
        }
      } else {
        setLookupError("Please install MiniKit to look up usernames");
      }
    } catch (error) {
      setLookupError("Failed to look up username. Please try again.");
    } finally {
      setIsLookingUp(false);
    }
  };

  // Reward sending
  const sendReward = useCallback(
    async (recipientAddress: string) => {
      if (!(window as any).MiniKit || !walletContext.walletAddress) {
        setRewardStatus({
          success: false,
          message: "Please connect your wallet first",
        });
        return;
      }
      setIsSendingReward(true);
      setRewardStatus(null);
      try {
        const { finalPayload } = await (
          window as any
        ).MiniKit.commandsAsync.sendTransaction({
          transaction: [
            {
              address: "0x372dCA057682994568be074E75a03Ced3dD9E60d",
              abi: [
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "recipient",
                      type: "address",
                    },
                  ],
                  name: "rewardUser",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ],
              functionName: "rewardUser",
              args: [recipientAddress],
            },
          ],
        });
        if (finalPayload.status === "error") {
          if (finalPayload.error_code !== "user_rejected") {
            const errorMessage =
              (finalPayload as any).description || "Error sending reward";
            showToast(errorMessage, "error");
            setRewardStatus({ success: false, message: errorMessage });
          } else {
            setRewardStatus({
              success: false,
              message: "Transaction was canceled",
            });
          }
        } else {
          setRewardStatus({
            success: true,
            message: `Successfully sent reward to ${recipientUsername}!`,
          });
          walletContext.fetchCanReward();
          walletContext.fetchHasRewarded();
        }
      } catch (error: any) {
        showToast(
          error.message || "An unexpected error occurred with the reward",
          "error"
        );
        setRewardStatus({
          success: false,
          message: error.message || "Failed to send reward. Please try again.",
        });
      } finally {
        setIsSendingReward(false);
      }
    },
    [
      walletContext.walletAddress,
      recipientUsername,
      showToast,
      walletContext.fetchCanReward,
      walletContext.fetchHasRewarded,
    ]
  );

  // Badge and banner
  useEffect(() => {
    const badgeState = localStorage.getItem("passportBadgeClosed");
    if (badgeState === "true") setIsPassportBadgeVisible(false);
    const airdropState = localStorage.getItem("airdropBannerClosed");
    if (airdropState === "true") setIsAirdropBannerVisible(false);
  }, []);

  const handleCloseBadge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPassportBadgeVisible(false);
    localStorage.setItem("passportBadgeClosed", "true");
  };
  const handleCloseAirdropBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAirdropBannerVisible(false);
    localStorage.setItem("airdropBannerClosed", "true");
  };

  // Referral code and username from localStorage
  useEffect(() => {
    const storedReferrer = localStorage.getItem("referredBy");
    if (storedReferrer) setRecipientUsername(storedReferrer);
  }, []);

  return {
    recipientUsername,
    setRecipientUsername,
    lookupResult,
    setLookupResult,
    isLookingUp,
    lookupError,
    isVerifying,
    rewardStatus,
    isSendingReward,
    isPassportBadgeVisible,
    isAirdropBannerVisible,
    lookupUsername,
    sendReward,
    handleCloseBadge,
    handleCloseAirdropBanner,
    setRewardStatus,
    setIsVerifying,
    // ...add more as needed
  };
}
