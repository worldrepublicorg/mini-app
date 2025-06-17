"use client";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import {
  PiUsersThreeFill,
  PiCoins,
  PiCurrencyCircleDollar,
  PiInfoFill,
} from "react-icons/pi";
import { BiChevronLeft, BiChevronUp, BiLinkExternal } from "react-icons/bi";
import { useTranslations } from "@/hooks/useTranslations";
import { useState } from "react";
import { latestPayouts } from "@/data/payouts/payouts";
import { useRouter } from "next/navigation";
import { FaFlask } from "react-icons/fa";

export default function PartySubsidyPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = useTranslations(lang);
  const [expandedParties, setExpandedParties] = useState<number[]>([]);
  const [showAllParties, setShowAllParties] = useState(false);
  const router = useRouter();

  // Sort payouts by total WDD in descending order
  const sortedPayouts = [...latestPayouts].sort(
    (a, b) => parseFloat(b.totalWdd) - parseFloat(a.totalWdd)
  );

  const toggleParty = (partyId: number) => {
    setExpandedParties((prev) =>
      prev.includes(partyId)
        ? prev.filter((id) => id !== partyId)
        : [...prev, partyId]
    );
  };

  const renderPayoutsList = () => (
    <div className="divide-y divide-gray-100">
      {/* Party rows */}
      {(showAllParties ? sortedPayouts : sortedPayouts.slice(0, 3)).map(
        (party) => (
          <div key={party.id}>
            {/* Party Header - Always visible */}
            <button
              onClick={() => toggleParty(party.id)}
              className={`w-full px-4 py-2 ${expandedParties.includes(party.id) ? "bg-gray-50" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1">
                  <a
                    href={`https://worldchain-mainnet.explorer.alchemy.com/address/${party.leaderAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Typography
                      variant={{ variant: "subtitle", level: 2 }}
                      className="text-sm text-gray-900"
                    >
                      {party.leaderUsername}
                    </Typography>
                  </a>
                  <Link
                    href={`/${lang}/govern/party/${party.id}`}
                    className="min-w-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Typography
                      variant={{ variant: "subtitle", level: 2 }}
                      className="truncate text-sm font-normal text-gray-500"
                    >
                      ({party.name})
                    </Typography>
                  </Link>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block text-sm text-gray-900">
                    {party.totalWdd} WDD
                  </span>
                  <span className="block text-sm text-gray-500">
                    {party.totalWld} WLD
                  </span>
                </div>
              </div>
            </button>

            {/* Weekly Breakdown - Shown when expanded */}
            {expandedParties.includes(party.id) && (
              <div className="divide-y divide-gray-100 bg-gray-50">
                {party.weeklyPayouts
                  .filter((week) => week.wdd.amount !== "") // Only show weeks with WDD amounts
                  .sort((a, b) => a.weekNumber - b.weekNumber)
                  .map((weekPayout) => (
                    <div
                      key={`${party.id}-week-${weekPayout.weekNumber}`}
                      className="px-6 py-2"
                    >
                      <div className="flex items-center justify-between">
                        <Typography
                          variant={{ variant: "subtitle", level: 2 }}
                          className="text-sm font-normal text-gray-500"
                        >
                          {
                            dictionary?.pages?.earn?.tabs?.contribute
                              ?.partySubsidy?.payouts?.week
                          }{" "}
                          {weekPayout.weekNumber}
                        </Typography>
                        <div className="text-right">
                          <a
                            href={`https://worldchain-mainnet.explorer.alchemy.com/tx/${weekPayout.wdd.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-end gap-1 text-sm text-gray-900"
                          >
                            {weekPayout.wdd.amount} WDD
                            {weekPayout.wdd.transactionHash && (
                              <BiLinkExternal className="size-[15px] text-gray-500" />
                            )}
                          </a>
                          {weekPayout.wld.amount && (
                            <a
                              href={`https://worldchain-mainnet.explorer.alchemy.com/tx/${weekPayout.wld.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-end gap-1 text-sm text-gray-500"
                            >
                              {weekPayout.wld.amount} WLD
                              {weekPayout.wld.transactionHash && (
                                <BiLinkExternal className="size-[15px] text-gray-500" />
                              )}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )
      )}
      {!showAllParties && sortedPayouts.length > 3 && (
        <div className="px-4">
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setShowAllParties(true)}
            className="h-12 text-sm font-medium"
          >
            {
              dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy?.payouts
                ?.showAll
            }
          </Button>
        </div>
      )}
    </div>
  );

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
            {dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy?.topnav}
          </Typography>
        </div>
      </div>

      <div className="mt-24 flex flex-1 flex-col pb-6">
        {/* Hero section */}
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <PiUsersThreeFill className="h-10 w-10 text-gray-400" />
          </div>
          <div className="mx-auto mb-2 flex items-center justify-center">
            <Typography
              variant={{ variant: "heading", level: 2 }}
              className="text-center text-gray-900"
            >
              {dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy?.title}
            </Typography>
            <FaFlask
              className="ml-1.5 h-5 w-5 text-gray-400"
              title="Experimental"
            />
          </div>
          <Typography
            variant={{ variant: "body", level: 2 }}
            className="text-center text-gray-500"
          >
            {dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy?.subtitle}
          </Typography>
        </div>

        <div className="space-y-8">
          {/* Feature cards */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  <PiCoins className="h-6 w-6 text-gray-500" />
                </div>
                <Typography
                  variant={{ variant: "subtitle", level: 2 }}
                  className="mb-2 text-center text-gray-900"
                >
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                      ?.weeklyPool?.new
                  }
                </Typography>
                <Typography
                  variant={{ variant: "body", level: 3 }}
                  className="text-center text-gray-500"
                >
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                      ?.weeklyPool?.subtitle
                  }
                </Typography>
              </div>

              <div className="flex flex-col items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  <PiCurrencyCircleDollar className="h-6 w-6 text-gray-500" />
                </div>
                <Typography
                  variant={{ variant: "subtitle", level: 2 }}
                  className="mb-2 text-center text-gray-900"
                >
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                      ?.devRewards?.title
                  }
                  <span className="group relative inline-flex items-center align-baseline">
                    <PiInfoFill className="ml-1 h-4 w-4 translate-y-[3px] cursor-help text-gray-400" />
                    <div className="absolute -right-4 bottom-full mb-2 hidden w-[calc(100dvw/2+24px)] max-w-sm transform rounded-lg border border-gray-200 bg-gray-0 p-3 text-xs shadow-lg group-hover:block">
                      <p className="text-left text-gray-700">
                        {
                          dictionary?.pages?.earn?.tabs?.contribute
                            ?.partySubsidy?.devRewards?.tooltip
                        }{" "}
                        <Link
                          href="https://www.miniapps.world/rewards"
                          className="text-gray-900 underline"
                        >
                          {
                            dictionary?.pages?.earn?.tabs?.contribute
                              ?.partySubsidy?.devRewards?.checkOutRewards
                          }
                        </Link>
                      </p>
                    </div>
                  </span>
                </Typography>
                <Typography
                  variant={{ variant: "body", level: 3 }}
                  className="text-center text-gray-500"
                >
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                      ?.devRewards?.subtitle
                  }
                </Typography>
              </div>
            </div>
          </div>
          {/* How it works - modern steps */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-0 shadow-sm">
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-0 p-4">
              <div className="flex items-center">
                <Typography
                  as="h3"
                  variant={{ variant: "subtitle", level: 2 }}
                  className="text-gray-900"
                >
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                      ?.howItWorks?.title
                  }
                </Typography>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-start rounded-lg border border-gray-100 p-3 shadow-sm">
                  <div className="mr-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-[15px] text-gray-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <Typography
                      variant={{ variant: "subtitle", level: 2 }}
                      className="text-gray-900"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                          ?.howItWorks?.steps?.createParty?.title
                      }
                    </Typography>
                    <Typography
                      variant={{ variant: "body", level: 3 }}
                      className="text-gray-500"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                          ?.howItWorks?.steps?.createParty?.description
                      }
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start rounded-lg border border-gray-100 p-3 shadow-sm">
                  <div className="mr-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-[15px] text-gray-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <Typography
                      variant={{ variant: "subtitle", level: 2 }}
                      className="text-gray-900"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                          ?.howItWorks?.steps?.growMembership?.title
                      }
                    </Typography>
                    <Typography
                      variant={{ variant: "body", level: 3 }}
                      className="text-gray-500"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                          ?.howItWorks?.steps?.growMembership?.description
                      }
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start rounded-lg border border-gray-100 p-3 shadow-sm">
                  <div className="mr-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-[15px] text-gray-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <Typography
                      variant={{ variant: "subtitle", level: 2 }}
                      className="text-gray-900"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                          ?.howItWorks?.steps?.earnRewards?.title
                      }
                    </Typography>
                    <Typography
                      variant={{ variant: "body", level: 3 }}
                      className="text-gray-500"
                    >
                      {
                        dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                          ?.howItWorks?.steps?.earnRewards?.description
                      }
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Weekly Payout Results Section */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-0 shadow-sm">
            <button
              onClick={() => setShowAllParties(!showAllParties)}
              className="w-full"
            >
              <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-0 p-4">
                <Typography
                  as="h3"
                  variant={{ variant: "subtitle", level: 2 }}
                  className="text-gray-900"
                >
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
                      ?.payouts?.title
                  }
                </Typography>
                {showAllParties && (
                  <BiChevronUp className="size-[20px] text-gray-500 transition-transform duration-200" />
                )}
              </div>
            </button>
            <div className="divide-y divide-gray-100">
              {renderPayoutsList()}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 space-y-4">
          <Link href={`/${lang}/govern`}>
            <Button fullWidth>
              {
                dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy?.cta
                  ?.createJoin
              }
            </Button>
          </Link>

          <a
            href="https://t.me/worldrepublicpartyleaders"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" fullWidth className="mt-4">
              {
                dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy?.cta
                  ?.leaderGroup
              }
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
