import { useInviteTab } from "@/hooks/earn/useInviteTab";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer";
import {
  PiUserPlusFill,
  PiInfoFill,
  PiNotePencilFill,
  PiIdentificationCardFill,
  PiGlobeFill,
  PiCoinFill,
  PiTrendUpFill,
} from "react-icons/pi";
import Link from "next/link";
import React from "react";

export function InviteTab({ lang, dictionary, walletContext, showToast }: any) {
  const invite = useInviteTab({ lang, dictionary, walletContext, showToast });
  const {
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
    lookupUsername,
    sendReward,
    handleCloseBadge,
    setRewardStatus,
  } = invite;

  // Calculate totalRewardCount and other derived values from walletContext
  const totalRewardCount =
    (walletContext.rewardCount || 0) +
    (walletContext.secureDocumentRewardCount || 0);
  const hasRewarded = walletContext.hasRewarded;
  const canReward = walletContext.canReward;
  const secureDocumentCanReward = walletContext.secureDocumentCanReward;
  const username = walletContext.username;

  return (
    <div className="flex w-full flex-col items-center py-8">
      <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <PiUserPlusFill className="h-10 w-10 text-gray-400" />
      </div>
      <Typography
        as="h2"
        variant={{ variant: "heading", level: 1 }}
        className="text-center"
      >
        {dictionary?.pages?.earn?.tabs?.invite?.title}
      </Typography>
      <Typography
        variant={{ variant: "subtitle", level: 1 }}
        className="mx-auto mb-5 mt-4 text-center text-gray-500"
      >
        {dictionary?.pages?.earn?.tabs?.invite?.subtitle}
        <span className="group relative inline-flex items-center align-baseline">
          <PiInfoFill className="ml-1 h-4 w-4 translate-y-[2px] cursor-help text-gray-400" />
          <div className="absolute -right-4 bottom-full mb-2 hidden w-[calc(100dvw/2+24px)] max-w-sm transform rounded-lg border border-gray-200 bg-gray-0 p-3 text-xs shadow-lg group-hover:block">
            <p className="text-left text-gray-700">
              {dictionary?.pages?.earn?.tabs?.invite?.tooltip}{" "}
              <Link
                href={`/${lang}/faq?q=referral-codes`}
                className="text-gray-900 underline"
              >
                {dictionary?.pages?.earn?.tabs?.invite?.learnMore}
              </Link>
            </p>
          </div>
        </span>
      </Typography>

      <div className="mb-10 w-full rounded-xl border border-gray-200 p-4">
        <Typography
          variant={{ variant: "subtitle", level: 2 }}
          className="mb-4 text-center text-gray-900"
        >
          {dictionary?.pages?.earn?.tabs?.invite?.stats?.title}
        </Typography>
        <div className="flex justify-around">
          <div className="text-center">
            <Typography
              variant={{ variant: "heading", level: 3 }}
              className="text-gray-900"
            >
              {totalRewardCount}
            </Typography>
            <Typography
              variant={{ variant: "body", level: 3 }}
              className="text-gray-500"
            >
              {dictionary?.pages?.earn?.tabs?.invite?.stats?.invites}
            </Typography>
          </div>
          <div className="text-center">
            <Typography
              variant={{ variant: "heading", level: 3 }}
              className="text-gray-900"
            >
              {totalRewardCount > 0 ? `${totalRewardCount * 50} WDD` : "0 WDD"}
            </Typography>
            <Typography
              variant={{ variant: "body", level: 3 }}
              className="text-gray-500"
            >
              {dictionary?.pages?.earn?.tabs?.invite?.stats?.rewards}
            </Typography>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <Button
          onClick={async () => {
            if (!username) {
              showToast(
                dictionary?.pages?.earn?.tabs?.invite?.actions?.connectWallet,
                "error"
              );
              // Optionally: loadCurrentUsernameCallback();
              return;
            }
            const shareUrl = `https://worldcoin.org/mini-app?app_id=app_66c83ab8c851fb1e54b1b1b62c6ce39d&path=%2F%3Fcode%3D${username}`;
            if (navigator.share) {
              try {
                await navigator.share({
                  title: dictionary?.pages?.earn?.tabs?.invite?.share?.title,
                  text: dictionary?.pages?.earn?.tabs?.invite?.share?.text,
                  url: shareUrl,
                });
              } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                  await navigator.clipboard.writeText(shareUrl);
                  showToast(
                    dictionary?.pages?.earn?.tabs?.invite?.actions?.copied,
                    "success"
                  );
                }
              }
            } else {
              await navigator.clipboard.writeText(shareUrl);
              showToast(
                dictionary?.pages?.earn?.tabs?.invite?.actions?.copied,
                "success"
              );
            }
          }}
          fullWidth
        >
          {dictionary?.pages?.earn?.tabs?.invite?.actions?.share}
        </Button>
      </div>

      {canReward && (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary" fullWidth className="mt-4">
              {dictionary?.pages?.earn?.tabs?.invite?.actions?.rewardReferrer}
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
                className="text-center"
              >
                {dictionary?.pages?.earn?.tabs?.invite?.drawer?.title}
              </Typography>
              <Typography
                variant={{ variant: "subtitle", level: 1 }}
                className="mx-auto mt-4 text-center text-gray-500"
              >
                {dictionary?.pages?.earn?.tabs?.invite?.drawer?.subtitle}
              </Typography>
              {typeof window !== "undefined" &&
                localStorage.getItem("referredBy") && (
                  <div className="bg-success-50 mt-4 w-full rounded-xl border border-success-200 p-4">
                    <Typography
                      variant={{ variant: "subtitle", level: 3 }}
                      className="text-center text-success-700"
                    >
                      {dictionary?.pages?.earn?.tabs?.invite?.drawer?.invitedBy?.replace(
                        "{{username}}",
                        localStorage.getItem("referredBy") || ""
                      )}
                    </Typography>
                  </div>
                )}
              <div className="w-full">
                {!lookupResult ? (
                  <>
                    <input
                      type="text"
                      placeholder={
                        dictionary?.pages?.earn?.tabs?.invite?.drawer?.input
                          ?.placeholder
                      }
                      className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 font-sans text-base"
                      value={recipientUsername}
                      onChange={(e) => setRecipientUsername(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && lookupUsername()}
                      onFocus={(e) => {
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
                      {
                        dictionary?.pages?.earn?.tabs?.invite?.drawer?.input
                          ?.lookupButton
                      }
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                      <Typography
                        variant={{ variant: "body", level: 3 }}
                        className="mb-1 text-gray-500"
                      >
                        {
                          dictionary?.pages?.earn?.tabs?.invite?.drawer?.input
                            ?.sendingTo
                        }
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
                          className="text-gray-400"
                          aria-label={
                            dictionary?.pages?.earn?.tabs?.invite?.drawer?.input
                              ?.editButton
                          }
                        >
                          <PiNotePencilFill className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {rewardStatus && (
                      <div
                        className={`mt-3 rounded-xl border p-3 ${rewardStatus.success ? "border-success-300 bg-success-100 text-success-700" : "border-error-300 bg-error-100 text-error-700"}`}
                      >
                        {rewardStatus.message}
                      </div>
                    )}
                    <div className="my-4">
                      <Button
                        onClick={() => sendReward(lookupResult.address)}
                        isLoading={isSendingReward}
                        fullWidth
                      >
                        {
                          dictionary?.pages?.earn?.tabs?.invite?.drawer?.input
                            ?.sendButton
                        }
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {!canReward && !hasRewarded && secureDocumentCanReward && (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary" fullWidth className="mt-4">
              {dictionary?.pages?.earn?.tabs?.invite?.actions?.rewardReferrer}
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
                className="text-center"
              >
                {dictionary?.pages?.earn?.tabs?.invite?.drawer?.title}
              </Typography>
              <Typography
                variant={{ variant: "subtitle", level: 1 }}
                className="mx-auto mt-4 text-center text-gray-500"
              >
                {
                  dictionary?.pages?.earn?.tabs?.invite?.drawer
                    ?.passportSubtitle
                }
              </Typography>
              {typeof window !== "undefined" &&
                localStorage.getItem("referredBy") && (
                  <div className="bg-success-50 mt-4 w-full rounded-xl border border-success-200 p-4">
                    <Typography
                      variant={{ variant: "subtitle", level: 3 }}
                      className="text-center text-success-700"
                    >
                      {dictionary?.pages?.earn?.tabs?.invite?.drawer?.invitedBy?.replace(
                        "{{username}}",
                        localStorage.getItem("referredBy") || ""
                      )}
                    </Typography>
                  </div>
                )}
              <div className="w-full">
                {!lookupResult ? (
                  <>
                    <input
                      type="text"
                      placeholder={
                        dictionary?.pages?.earn?.tabs?.invite?.drawer?.input
                          ?.placeholder
                      }
                      className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 font-sans text-base"
                      value={recipientUsername}
                      onChange={(e) => setRecipientUsername(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && lookupUsername()}
                      onFocus={(e) => {
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
                      {
                        dictionary?.pages?.earn?.tabs?.invite?.drawer?.input
                          ?.lookupButton
                      }
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                      <Typography
                        variant={{ variant: "body", level: 3 }}
                        className="mb-1 text-gray-500"
                      >
                        {
                          dictionary?.pages?.earn?.tabs?.invite?.drawer?.input
                            ?.sendingTo
                        }
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
                          className="text-gray-400"
                          aria-label={
                            dictionary?.pages?.earn?.tabs?.invite?.drawer?.input
                              ?.editButton
                          }
                        >
                          <PiNotePencilFill className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {rewardStatus && (
                      <div
                        className={`mt-3 rounded-xl border p-3 ${rewardStatus.success ? "border-success-300 bg-success-100 text-success-700" : "border-error-300 bg-error-100 text-error-700"}`}
                      >
                        {rewardStatus.message}
                      </div>
                    )}
                    {/* World ID Widget (button only, logic handled in hook) */}
                    <div className="my-4">
                      <Button
                        onClick={() => {
                          /* World ID logic handled in hook or parent */
                        }}
                        fullWidth
                        disabled={isVerifying}
                        isLoading={isVerifying}
                      >
                        {
                          dictionary?.pages?.earn?.tabs?.invite?.drawer?.input
                            ?.proveReward
                        }
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {isPassportBadgeVisible && (
        <Drawer>
          <DrawerTrigger className="fixed left-0 right-0 top-28 z-50 mx-auto w-full max-w-md px-6">
            <div className="mt-2 flex w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-0 py-3 pr-4">
              <div className="flex w-full items-center overflow-hidden">
                <div className="mx-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                  <PiInfoFill className="h-5 w-5 text-gray-900" />
                </div>
                <Typography
                  as="h3"
                  variant={{ variant: "subtitle", level: 2 }}
                  className="font-display text-left text-[15px] font-medium tracking-tight text-gray-900"
                >
                  {
                    dictionary?.pages?.earn?.tabs?.invite?.passportDrawer
                      ?.trigger?.titleText
                  }{" "}
                  <span className="underline">
                    {
                      dictionary?.pages?.earn?.tabs?.invite?.passportDrawer
                        ?.trigger?.titleDetails
                    }
                  </span>
                </Typography>
                <div className="ml-2 flex items-center">
                  <div className="flex items-center rounded-full">
                    <button
                      onClick={handleCloseBadge}
                      className="text-gray-400 focus:outline-none"
                      aria-label="Close badge"
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
          </DrawerTrigger>
          <DrawerContent>
            <div className="flex flex-col items-center p-6 pt-10">
              <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <PiIdentificationCardFill className="h-10 w-10 text-gray-400" />
              </div>
              <Typography
                as="h2"
                variant={{ variant: "heading", level: 1 }}
                className="text-center"
              >
                {dictionary?.pages?.earn?.tabs?.invite?.passportDrawer?.title}
              </Typography>
              <Typography
                variant={{ variant: "subtitle", level: 1 }}
                className="mx-auto mt-4 text-center text-gray-500"
              >
                {
                  dictionary?.pages?.earn?.tabs?.invite?.passportDrawer
                    ?.subtitle
                }
              </Typography>
              <div className="mt-4 w-full px-3 py-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <PiGlobeFill className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <Typography
                      variant={{ variant: "body", level: 3 }}
                      className="text-gray-600 mt-[3px]"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.invite?.passportDrawer
                          ?.features?.countries?.title
                      }
                    </Typography>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <PiCoinFill className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <Typography
                      variant={{ variant: "body", level: 3 }}
                      className="text-gray-600 mt-[3px]"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.invite?.passportDrawer
                          ?.features?.rewards?.title
                      }
                    </Typography>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <PiTrendUpFill className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <Typography
                      variant={{ variant: "body", level: 3 }}
                      className="text-gray-600 mt-[3px]"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.invite?.passportDrawer
                          ?.features?.basicIncome?.title
                      }
                    </Typography>
                  </li>
                </ul>
              </div>
              <div className="relative w-full">
                <Button
                  onClick={async () => {
                    if (!username) {
                      showToast(
                        dictionary?.pages?.earn?.tabs?.invite?.actions
                          ?.connectWallet,
                        "error"
                      );
                      return;
                    }
                    const shareUrl = `https://worldcoin.org/mini-app?app_id=app_66c83ab8c851fb1e54b1b1b62c6ce39d&path=%2F%3Fcode%3D${username}`;
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title:
                            dictionary?.pages?.earn?.tabs?.invite?.share?.title,
                          text: dictionary?.pages?.earn?.tabs?.invite?.share
                            ?.text,
                          url: shareUrl,
                        });
                      } catch (error) {
                        if (
                          error instanceof Error &&
                          error.name !== "AbortError"
                        ) {
                          await navigator.clipboard.writeText(shareUrl);
                          showToast(
                            dictionary?.pages?.earn?.tabs?.invite?.actions
                              ?.copied,
                            "success"
                          );
                        }
                      }
                    } else {
                      await navigator.clipboard.writeText(shareUrl);
                      showToast(
                        dictionary?.pages?.earn?.tabs?.invite?.actions?.copied,
                        "success"
                      );
                    }
                  }}
                  fullWidth
                  className="mt-6"
                >
                  {dictionary?.pages?.earn?.tabs?.invite?.actions?.share}
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
