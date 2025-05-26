"use client";

import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { PiTrophy } from "react-icons/pi";
import { BiChevronLeft } from "react-icons/bi";
import { FaVoteYea } from "react-icons/fa";
import { useTranslations } from "@/hooks/useTranslations";
import type { WeeklyWinners } from "@/lib/types";

// Example data - replace with your actual data
const WINNERS_DATA: WeeklyWinners[] = [
  {
    weekOf: "March 31, 2025",
    winners: [
      {
        handle: "Ben Re",
        engagement: 27,
        postLink: "https://vote.one/aGqns9rP",
        place: 1,
      },
      {
        handle: "Ghi",
        engagement: 26,
        postLink: "https://vote.one/kz3JCEjQ",
        place: 2,
      },
      {
        handle: "Xhx Xhx",
        engagement: 25,
        postLink: "https://vote.one/zHdIEOxW",
        place: 3,
      },
    ],
  },
  {
    weekOf: "March 24, 2025",
    winners: [
      {
        handle: "@umaysage4554",
        engagement: 26,
        postLink: "https://vote.one/fgSgntbh",
        place: 1,
      },
      {
        handle: "@bredska",
        engagement: 25,
        postLink: "https://vote.one/HGveO4vk",
        place: 2,
      },
      {
        handle: "Ghi",
        engagement: 16,
        postLink: "https://vote.one/UrSXA4Bu",
        place: 3,
      },
      {
        handle: "@bredska",
        engagement: 16,
        postLink: "https://vote.one/EiZ4plkY",
        place: 3,
      },
    ],
  },

  {
    weekOf: "March 17, 2025",
    winners: [
      {
        handle: "@Marig18",
        engagement: 12,
        postLink: "https://vote.one/bP7R2nGS",
        place: 1,
      },
      {
        handle: "The Law Is Clear",
        engagement: 9,
        postLink: "https://vote.one/M7NXVRt3",
        place: 2,
      },
      {
        handle: "@umesh_kalal6",
        engagement: 6,
        postLink: "https://vote.one/24Chi1Uj",
        place: 3,
      },
    ],
  },
];

export default function PollContestWinnersPage({
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
            href={`/${lang}/earn/contribute/poll-contest`}
            className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
          >
            <BiChevronLeft className="size-6 text-gray-500" />
          </Link>
          <Typography as="h2" variant={{ variant: "heading", level: 3 }}>
            {
              dictionary?.pages?.earn?.tabs?.contribute?.contests?.pollContest
                ?.winners?.title
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
                  dictionary?.pages?.earn?.tabs?.contribute?.contests
                    ?.pollContest?.winners?.weekOf
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
                          dictionary?.pages?.earn?.tabs?.contribute?.contests
                            ?.pollContest?.winners?.votes
                        }
                      </Typography>
                    </div>
                    <FaVoteYea className="h-5 w-5 text-gray-400" />
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
