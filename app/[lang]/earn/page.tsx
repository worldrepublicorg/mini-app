"use client";

import { Typography } from "@/components/ui/Typography";
import { useState, useEffect } from "react";
import { PiWalletFill, PiInfoFill } from "react-icons/pi";
import { useWallet } from "@/components/contexts/WalletContext";
import { TabSwiper } from "@/components/TabSwiper";
import { useToast } from "@/components/ui/Toast";
import { BiLinkExternal } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import type { EarnTabKey } from "@/lib/types";
import { InviteTab } from "./tabs/InviteTab";
import { BasicIncomeTab } from "./tabs/BasicIncomeTab";
import { useBasicIncomeTab } from "@/hooks/earn/useBasicIncomeTab";
import { SavingsTab } from "./tabs/SavingsTab";
import { useSavingsTab } from "@/hooks/earn/useSavingsTab";

export default function EarnPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const {
    walletAddress,
    tokenBalance,
    canReward,
    rewardCount,
    secureDocumentRewardCount,
    hasRewarded,
    secureDocumentCanReward,
    fetchCanReward,
    fetchRewardCount,
    fetchSecureDocumentRewardCount,
    fetchHasRewarded,
    username,
    setUsername,
  } = useWallet();

  // Replace the dictionary state and effect with useTranslations hook
  const dictionary = useTranslations(lang);

  const [activeTab, setActiveTab] = useState<EarnTabKey>("Basic income");

  const { showToast } = useToast();

  // Add a new effect to handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (
        tabParam &&
        ["Basic income", "Savings", "Invite", "Contribute"].includes(tabParam)
      ) {
        setActiveTab(tabParam as EarnTabKey);
      } else {
        // Default to "Basic income" if no valid tab is in the URL
        setActiveTab("Basic income");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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

  const [hasSeenNewBuybackProgram, setHasSeenNewBuybackProgram] =
    useState(false);

  // Update the localStorage key for the Invite feature
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeenNewBuyback =
        localStorage.getItem("hasSeenNewBuybackProgram") === "true";
      setHasSeenNewBuybackProgram(hasSeenNewBuyback);
    }
  }, []);

  // Update localStorage when the Invite tab is active
  useEffect(() => {
    if (activeTab === "Contribute" && typeof window !== "undefined") {
      localStorage.setItem("hasSeenNewBuybackProgram", "true");
      setHasSeenNewBuybackProgram(true);
    }
  }, [activeTab]);

  // Add state to track whether buyback program has been visited
  const [hasNewBuybackBeenVisited, setHasNewBuybackBeenVisited] =
    useState(true); // Default to true to prevent flash

  // Check if buyback program has been visited
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasVisited = localStorage.getItem("newBuybackVisited") === "true";
      setHasNewBuybackBeenVisited(hasVisited);
    }
  }, []);

  // Add this to run fetchRewardCount when the component mounts or wallet changes
  useEffect(() => {
    if (walletAddress) {
      fetchCanReward();
      fetchRewardCount();
      fetchSecureDocumentRewardCount();
      fetchHasRewarded();
    }
  }, [
    walletAddress,
    fetchCanReward,
    fetchRewardCount,
    fetchSecureDocumentRewardCount,
    fetchHasRewarded,
  ]);

  const [isAirdropBannerVisible, setIsAirdropBannerVisible] = useState(true);

  // Add useEffect to load badge state from localStorage
  useEffect(() => {
    const badgeState = localStorage.getItem("airdropBannerClosed");
    if (badgeState === "true") {
      setIsAirdropBannerVisible(false);
    }
  }, []);

  // Function to handle closing the badge
  const handleCloseAirdropBanner = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the drawer
    setIsAirdropBannerVisible(false);
    localStorage.setItem("airdropBannerClosed", "true");
  };

  // Use the new hook for Basic Income tab
  const basicIncomeTabProps = useBasicIncomeTab({ lang, showToast });

  // Use the new hook for Savings tab
  const savingsTabProps = useSavingsTab({ lang, dictionary });

  const renderContent = () => {
    switch (activeTab) {
      case "Basic income":
        return (
          <>
            {isAirdropBannerVisible && (
              <div className="fixed left-0 right-0 top-28 z-50 mx-auto w-full max-w-md px-6">
                <div className="mt-2 flex w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-0 py-3 pr-4">
                  <div className="flex w-full items-center overflow-hidden">
                    <div className="mx-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                      <PiInfoFill className="h-5 w-5 text-gray-900" />
                    </div>
                    <a
                      href="https://world.org/mini-app?app_id=app_0d4b759921490adc1f2bd569fda9b53a&path=/ref/a7DgwV"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography
                        as="h3"
                        variant={{ variant: "subtitle", level: 2 }}
                        className="font-display text-left text-[15px] font-medium tracking-tight text-gray-900"
                      >
                        {dictionary?.components?.banners?.holdstation?.message}{" "}
                        <span className="underline">
                          {
                            dictionary?.components?.banners?.holdstation
                              ?.collect
                          }
                        </span>
                      </Typography>
                    </a>
                    <div className="ml-2 flex items-center">
                      <div className="flex items-center rounded-full">
                        <button
                          onClick={handleCloseAirdropBanner}
                          className="text-gray-400 focus:outline-none"
                          aria-label="Close banner"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <BasicIncomeTab
              lang={lang}
              dictionary={dictionary}
              {...basicIncomeTabProps}
            />
          </>
        );
      case "Savings":
        return (
          <SavingsTab
            lang={lang}
            dictionary={dictionary}
            {...savingsTabProps}
          />
        );
      case "Contribute":
        return (
          <div className="flex w-full flex-col items-center py-8">
            <Typography
              as="h2"
              variant={{ variant: "heading", level: 1 }}
              className="text-center"
            >
              {dictionary?.pages?.earn?.tabs?.contribute?.title}
            </Typography>
            <Typography
              variant={{ variant: "subtitle", level: 1 }}
              className="mx-auto mb-8 mt-4 text-center text-gray-500"
            >
              {dictionary?.pages?.earn?.tabs?.contribute?.subtitle}
            </Typography>

            {/* Buyback Program Card */}
            <Link
              href={`/${lang}/earn/contribute/buyback-program`}
              className="group mb-4 flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="mb-1.5 flex items-center">
                    <Typography
                      as="h3"
                      variant={{ variant: "subtitle", level: 2 }}
                      className="line-clamp-1"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.contribute
                          ?.buybackProgram?.title
                      }
                    </Typography>
                    {!hasNewBuybackBeenVisited && (
                      <span className="ml-1.5 h-[7px] w-[7px] rounded-full bg-error-600" />
                    )}
                  </div>
                  <Typography
                    as="p"
                    variant={{ variant: "body", level: 3 }}
                    className="text-gray-500"
                  >
                    {
                      dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                        ?.subtitle
                    }
                  </Typography>
                </div>
              </div>
              <div className="flex items-center justify-center rounded-full bg-gray-100 p-1.5">
                <IoIosArrowForward className="size-[14px] text-gray-400" />
              </div>
            </Link>

            {/* Party Subsidy Program Card */}
            <Link
              href={`/${lang}/earn/contribute/party-subsidy`}
              className="group mb-4 flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="mb-1.5 flex items-center">
                    <Typography
                      as="h3"
                      variant={{ variant: "subtitle", level: 2 }}
                      className="line-clamp-1"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                          ?.title
                      }
                    </Typography>
                  </div>
                  <Typography
                    as="p"
                    variant={{ variant: "body", level: 3 }}
                    className="text-gray-500"
                  >
                    {
                      dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                        ?.subtitle
                    }
                  </Typography>
                </div>
              </div>
              <div className="flex items-center justify-center rounded-full bg-gray-100 p-1.5">
                <IoIosArrowForward className="size-[14px] text-gray-400" />
              </div>
            </Link>

            <div className="mb-6 w-full">
              <a
                href="https://t.me/worldrepubliccommunity"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <Typography
                      as="h3"
                      variant={{ variant: "subtitle", level: 2 }}
                      className="mb-1.5 line-clamp-1"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.contribute?.earlyAccess
                          ?.title
                      }
                    </Typography>
                    <Typography
                      as="p"
                      variant={{ variant: "body", level: 3 }}
                      className="text-gray-500"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.contribute?.earlyAccess
                          ?.description
                      }
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center justify-center rounded-full bg-gray-100 p-1.5">
                  <BiLinkExternal className="size-[14px] text-gray-400" />
                </div>
              </a>
            </div>
          </div>
        );
      case "Invite":
        return (
          <InviteTab
            lang={lang}
            dictionary={dictionary}
            walletContext={{
              walletAddress,
              canReward,
              rewardCount,
              secureDocumentRewardCount,
              hasRewarded,
              secureDocumentCanReward,
              fetchCanReward,
              fetchRewardCount,
              fetchSecureDocumentRewardCount,
              fetchHasRewarded,
              username,
              setUsername,
            }}
            showToast={showToast}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-safe flex min-h-dvh flex-col px-6">
      <div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex h-10 items-center">
            <Typography as="h2" variant={{ variant: "heading", level: 2 }}>
              {dictionary?.pages?.earn?.title}
            </Typography>
          </div>
          {walletAddress && (
            <a
              href="https://world.org/mini-app?app_id=app_0d4b759921490adc1f2bd569fda9b53a&path=/ref/a7DgwV"
              className="flex h-10 items-center gap-2 rounded-full bg-gray-100 px-4"
            >
              <PiWalletFill className="h-5 w-5" />
              <Typography
                variant={{ variant: "number", level: 6 }}
                className="font-['Rubik'] text-base"
              >
                {tokenBalance
                  ? `${Number(tokenBalance).toFixed(2)} WDD`
                  : "0.00 WDD"}
              </Typography>
            </a>
          )}
        </div>

        <TabSwiper<EarnTabKey>
          tabs={[
            {
              key: "Basic income",
              label: dictionary?.pages?.earn?.tabs?.basicIncome?.tabTitle,
            },
            {
              key: "Savings",
              label: dictionary?.pages?.earn?.tabs?.savings?.tabTitle,
            },
            {
              key: "Contribute",
              label: dictionary?.pages?.earn?.tabs?.contribute?.title,
            },
            {
              key: "Invite",
              label: dictionary?.pages?.earn?.tabs?.invite?.title,
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabIndicators={{
            "Basic income": false,
            Savings: false,
            Contribute: !hasSeenNewBuybackProgram,
            Invite: false,
          }}
        />
      </div>

      <div className="mt-[112px] flex flex-1 items-center">
        {renderContent()}
      </div>
    </div>
  );
}
