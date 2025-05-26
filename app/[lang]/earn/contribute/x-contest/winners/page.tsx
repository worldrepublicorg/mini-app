"use client";

import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { PiTrophy } from "react-icons/pi";
import { BiChevronLeft } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { useTranslations } from "@/hooks/useTranslations";
import type { WeeklyWinners } from "@/lib/types";

const WINNERS_DATA: WeeklyWinners[] = [
  {
    weekOf: "March 31, 2025",
    winners: [
      {
        handle: "@KINGkazu0924",
        engagement: 124,
        postLink: "https://x.com/KINGkazu0924/status/1908080811372671017",
        place: 1,
      },
      {
        handle: "@SofiaParad69554",
        engagement: 82,
        postLink: "https://x.com/SofiaParad69554/status/1907465790070067626",
        place: 2,
      },
      {
        handle: "@GahzZhz12258",
        engagement: 71,
        postLink: "https://x.com/GahzZhz12258/status/1907188931487055974",
        place: 3,
      },
    ],
  },
  {
    weekOf: "March 24, 2025",
    winners: [
      {
        handle: "@PierreBruynaud",
        engagement: 81,
        postLink: "https://x.com/PierreBruynaud/status/1906020284064284733",
        place: 1,
      },
      {
        handle: "@yngi1401",
        engagement: 48,
        postLink: "https://x.com/yngi1401/status/1905879528020529464",
        place: 2,
      },
      {
        handle: "@BennaJsjskdo",
        engagement: 47,
        postLink: "https://x.com/BennaJsjskdo/status/1905388130079015268",
        place: 3,
      },
    ],
  },
  {
    weekOf: "March 17, 2025",
    winners: [
      {
        handle: "@charleskioko_",
        engagement: 28,
        postLink: "https://x.com/charleskioko_/status/1903012963637678105",
        place: 1,
      },
      {
        handle: "@futahii_polis",
        engagement: 11,
        postLink: "https://x.com/futahii_polis/status/1902883491169366350",
        place: 2,
      },
      {
        handle: "@fern40557",
        engagement: 8,
        postLink: "https://x.com/fern40557/status/1902223336693719366",
        place: 3,
      },
    ],
  },
];

export default function XContestWinnersPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = useTranslations(lang);

  const getTrophyColor = (place: number) => {
    switch (place) {
      case 1:
        return "bg-[#C5CED8]";
      case 2:
        return "bg-[#D5DCE4]";
      case 3:
        return "bg-[#E5EAF0]";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="pb-safe flex min-h-dvh flex-col px-6">
      {/* Header */}
      <div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6">
        <div className="relative flex items-center justify-center py-6">
          <Link
            href={`/${lang}/earn/contribute/x-contest`}
            className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
          >
            <BiChevronLeft className="size-6 text-gray-500" />
          </Link>
          <Typography as="h2" variant={{ variant: "heading", level: 3 }}>
            {
              dictionary?.pages?.earn?.tabs?.contribute?.xContest?.winners
                ?.title
            }
          </Typography>
        </div>
      </div>

      {/* Content */}
      <div className="mt-24 flex flex-1 flex-col">
        {/* Winners List */}
        <div className="space-y-6">
          {WINNERS_DATA.map((week) => (
            <div
              key={week.weekOf}
              className="rounded-xl border border-gray-200 p-4"
            >
              <Typography
                variant={{ variant: "subtitle", level: 2 }}
                className="mb-4 text-gray-900"
              >
                {
                  dictionary?.pages?.earn?.tabs?.contribute?.xContest?.winners
                    ?.weekOf
                }{" "}
                {week.weekOf}
              </Typography>
              <div>
                {week.winners.map((winner) => (
                  <a
                    key={winner.handle}
                    href={winner.postLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${getTrophyColor(winner.place)}`}
                    >
                      <PiTrophy className="text-gray-600 h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <Typography
                        variant={{ variant: "body", level: 2 }}
                        className="text-gray-900"
                      >
                        {winner.handle}
                      </Typography>
                      <Typography
                        variant={{ variant: "body", level: 3 }}
                        className="text-gray-500"
                      >
                        {winner.engagement.toLocaleString()}{" "}
                        {
                          dictionary?.pages?.earn?.tabs?.contribute?.xContest
                            ?.winners?.engagements
                        }
                      </Typography>
                    </div>
                    <FaXTwitter className="h-4 w-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
