"use client";

import { Typography } from "@/components/ui/Typography";
import { useTranslations } from "@/hooks/useTranslations";
import { BiChevronLeft } from "react-icons/bi";
import { FiExternalLink } from "react-icons/fi";
import {
  PiCoins,
  PiHandHeart,
  PiHandshake,
  PiMoneyFill,
  PiUser,
  PiUsersThree,
} from "react-icons/pi";
import { Button } from "@/components/ui/Button";
import { useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { useWallet } from "@/components/contexts/WalletContext";
import { MiniKit } from "@worldcoin/minikit-js";
import { useRouter } from "next/navigation";

export default function BuybackProgramPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = useTranslations(lang);
  const { showToast } = useToast();
  const { username, walletAddress, setUsername } = useWallet();
  const router = useRouter();

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("newBuybackVisited", "true");
    }
  }, []);

  return (
    <div className="pb-safe flex min-h-dvh flex-col px-6">
      <div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6">
        <div className="relative flex items-center justify-center py-6">
          <button
            onClick={() => router.back()}
            className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
            aria-label="Back"
          >
            <BiChevronLeft className="size-6 text-gray-500" />
          </button>
          <Typography
            as="h2"
            variant={{ variant: "heading", level: 3 }}
            className="mx-12 text-center"
          >
            {dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram?.topnav}
          </Typography>
        </div>
      </div>

      <div className="mt-24 flex flex-1 flex-col pb-6">
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <PiMoneyFill className="h-10 w-10 text-gray-400" />
          </div>
          <Typography
            variant={{ variant: "heading", level: 2 }}
            className="mx-auto mb-2 text-center text-gray-900"
          >
            {dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram?.title}
          </Typography>
          <Typography
            variant={{ variant: "body", level: 2 }}
            className="text-center text-gray-500"
          >
            {
              dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                ?.subtitle
            }
          </Typography>
        </div>

        <div className="space-y-8">
          {/* Funding Sources Card */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-0 shadow-sm">
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-0 p-4">
              <div className="flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <PiCoins className="h-4 w-4 text-gray-500" />
                </div>
                <Typography
                  as="h3"
                  variant={{ variant: "subtitle", level: 2 }}
                  className="text-gray-900"
                >
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                      ?.sections?.fundingSources?.title
                  }
                </Typography>
              </div>
            </div>
            <div className="space-y-3 p-4">
              {/* Developer Rewards */}
              <a
                href="https://world.org/blog/announcements/world-launches-mini-apps-300k-dev-rewards-pilot-inspire-human-first-apps"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg bg-gray-50 p-3"
              >
                <div className="my-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="text-[16px] font-medium text-gray-900">
                      {(() => {
                        const title =
                          dictionary?.pages?.earn?.tabs?.contribute
                            ?.buybackProgram?.sections?.fundingSources
                            ?.devRewards?.title || "";
                        const words = title.split(" ");
                        const lastWord = words.pop();
                        return (
                          <>
                            {words.join(" ")}
                            {lastWord && (
                              <>
                                {" "}
                                <span className="inline-flex items-center">
                                  {lastWord}
                                  <FiExternalLink className="mb-[1px] ml-1.5 inline-block h-3.5 w-3.5 align-baseline" />
                                </span>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end whitespace-nowrap">
                    <span className="bg-green-100 text-green-800 rounded-full py-0.5 pl-2.5 text-sm font-medium">
                      30,290 WLD
                    </span>
                  </div>
                </div>
              </a>

              {/* Optimism Funding */}
              <a
                href="https://atlas.optimism.io/project/0x5831a5bc2b6e683bcb8e392453a85c5e7f755aa700e827ed9c3e1c6d67fb2a96"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg bg-gray-50 p-3 transition-all hover:bg-gray-100"
              >
                <div className="my-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="text-[16px] font-medium text-gray-900">
                      {(() => {
                        const title =
                          dictionary?.pages?.earn?.tabs?.contribute
                            ?.buybackProgram?.sections?.fundingSources?.optimism
                            ?.title || "";
                        const words = title.split(" ");
                        const lastWord = words.pop();
                        return (
                          <>
                            {words.join(" ")}
                            {lastWord && (
                              <>
                                {" "}
                                <span className="inline-flex items-center">
                                  {lastWord}
                                  <FiExternalLink className="mb-[1px] ml-1.5 inline-block h-3.5 w-3.5 align-baseline" />
                                </span>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end whitespace-nowrap">
                    <span className="bg-yellow-100 text-yellow-800 rounded-full py-0.5 pl-2.5 text-sm font-medium">
                      62,786 OP
                    </span>
                  </div>
                </div>
              </a>

              {/* World Retro Funding */}
              <a
                href="https://world.org/retro"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg bg-gray-50 p-3 transition-all hover:bg-gray-100"
              >
                <div className="my-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="text-[16px] font-medium text-gray-900">
                      {(() => {
                        const title =
                          dictionary?.pages?.earn?.tabs?.contribute
                            ?.buybackProgram?.sections?.fundingSources
                            ?.worldRetro?.title || "";
                        const words = title.split(" ");
                        const lastWord = words.pop();
                        return (
                          <>
                            {words.join(" ")}
                            {lastWord && (
                              <>
                                {" "}
                                <span className="inline-flex items-center">
                                  {lastWord}
                                  <FiExternalLink className="mb-[1px] ml-1.5 inline-block h-3.5 w-3.5 align-baseline" />
                                </span>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end whitespace-nowrap">
                    <span className="bg-green-100 text-green-800 rounded-full py-0.5 pl-2.5 text-sm font-medium">
                      9,885 WLD
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Commitment Card */}
          <div className="rounded-xl bg-gray-100 p-4 shadow-sm">
            <div className="mb-2 flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 shadow-sm">
                <PiHandshake className="h-4 w-4 text-gray-500" />
              </div>
              <Typography
                as="h3"
                variant={{ variant: "subtitle", level: 2 }}
                className="text-gray-900"
              >
                {
                  dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                    ?.sections?.commitment?.title
                }
              </Typography>
            </div>
            <Typography
              variant="body"
              level={3}
              className="text-gray-600 mb-3 text-[16px]"
            >
              {
                dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                  ?.sections?.commitment?.description
              }
            </Typography>
            <a
              href="https://worldscan.org/address/0x02cf076385b8161822c376bd1bfd09aed17787cd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 inline-flex items-center"
            >
              <Typography variant="subtitle" level={3}>
                View buyback account
              </Typography>
              <FiExternalLink className="ml-[5px] h-3 w-3" />
            </a>
          </div>

          {/* Value Cycle Visualization */}
          <div className="bg-white mb-6 overflow-hidden rounded-xl border border-gray-200 p-4 shadow-sm">
            <Typography
              as="h3"
              variant={{ variant: "subtitle", level: 1 }}
              className="mb-4 text-center text-gray-900"
            >
              {
                dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                  ?.sections?.valueCycle?.title
              }
            </Typography>

            <div className="relative mx-auto flex flex-col items-center">
              {/* Step 1 */}
              <div className="z-5 mb-4 flex w-full items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
                  1
                </span>
                <Typography
                  variant="body"
                  level={3}
                  className="mx-2 flex-1 text-[16px]"
                >
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                      ?.sections?.valueCycle?.steps?.step1
                  }
                </Typography>
                <PiUsersThree className="h-5 w-5 text-gray-500" />
              </div>

              {/* Step 2 */}
              <div className="z-5 mb-4 flex w-full items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
                  2
                </span>
                <Typography
                  variant="body"
                  level={3}
                  className="mx-2 flex-1 text-[16px]"
                >
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                      ?.sections?.valueCycle?.steps?.step2
                  }
                </Typography>
                <PiHandHeart className="h-5 w-5 text-gray-500" />
              </div>

              {/* Step 3 */}
              <div className="z-5 flex w-full items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
                  3
                </span>
                <Typography
                  variant="body"
                  level={3}
                  className="mx-2 flex-1 text-[16px]"
                >
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                      ?.sections?.valueCycle?.steps?.step3
                  }
                </Typography>
                <PiCoins className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* How You Can Help Section */}
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-0 p-4 shadow-sm">
            <div className="mb-4 flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <PiUser className="h-4 w-4 text-gray-500" />
              </div>
              <Typography
                as="h3"
                variant={{ variant: "subtitle", level: 2 }}
                className="text-gray-900"
              >
                {
                  dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                    ?.sections?.helpSection?.title
                }
              </Typography>
            </div>
            <Typography
              variant="body"
              level={3}
              className="text-gray-600 mb-4 text-[16px]"
            >
              {
                dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                  ?.sections?.helpSection?.intro
              }
            </Typography>

            <div className="space-y-3">
              <div className="flex items-start rounded-lg border border-gray-100 p-3 shadow-sm">
                <div className="mr-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-gray-0">
                  <span className="text-sm">1</span>
                </div>
                <div>
                  <Typography
                    variant="subtitle"
                    level={2}
                    className="mb-1 text-[16px] text-gray-900"
                  >
                    {
                      dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                        ?.sections?.helpSection?.steps?.invite?.title
                    }
                  </Typography>
                  <Typography
                    variant="body"
                    level={3}
                    className="text-gray-500"
                  >
                    {
                      dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                        ?.sections?.helpSection?.steps?.invite?.description
                    }
                  </Typography>
                </div>
              </div>

              <div className="flex items-start rounded-lg border border-gray-100 p-3 shadow-sm">
                <div className="mr-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-gray-0">
                  <span className="text-sm">2</span>
                </div>
                <div>
                  <Typography
                    variant="subtitle"
                    level={2}
                    className="mb-1 text-[16px] text-gray-900"
                  >
                    {
                      dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                        ?.sections?.helpSection?.steps?.useApp?.title
                    }
                  </Typography>
                  <Typography
                    variant="body"
                    level={3}
                    className="text-gray-500"
                  >
                    {
                      dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                        ?.sections?.helpSection?.steps?.useApp?.description
                    }
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-10 w-full">
          <Button
            onClick={async () => {
              if (!username) {
                showToast(
                  dictionary?.pages?.earn?.tabs?.invite?.actions?.connectWallet,
                  "error"
                );
                loadCurrentUsernameCallback();
                return;
              }

              const shareUrl = `https://worldcoin.org/mini-app?app_id=app_66c83ab8c851fb1e54b1b1b62c6ce39d&path=%2F%3Fcode%3D${username}`;

              // Check if Web Share API is supported
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: dictionary?.pages?.earn?.tabs?.invite?.share?.title,
                    text: dictionary?.pages?.earn?.tabs?.invite?.share?.text,
                    url: shareUrl,
                  });
                } catch (error) {
                  // User cancelled or share failed - fallback to clipboard
                  if (error instanceof Error && error.name !== "AbortError") {
                    await navigator.clipboard.writeText(shareUrl);
                    showToast(
                      dictionary?.pages?.earn?.tabs?.invite?.actions?.copied,
                      "success"
                    );
                  }
                }
              } else {
                // Fallback for browsers that don't support Web Share API
                await navigator.clipboard.writeText(shareUrl);
                showToast(
                  dictionary?.pages?.earn?.tabs?.invite?.actions?.copied,
                  "success"
                );
              }
            }}
            fullWidth
          >
            {
              dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram?.actions
                ?.share
            }
          </Button>
        </div>

        {/* Call to action button */}
        <div className="mt-4">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() =>
              window.open("https://www.miniapps.world/rewards", "_blank")
            }
          >
            {dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram?.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
