"use client";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { PiMegaphoneFill, PiTrophy } from "react-icons/pi";
import { FaXTwitter } from "react-icons/fa6";
import { BiChevronLeft } from "react-icons/bi";
import { useTranslations } from "@/hooks/useTranslations";

export default function XContestPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = useTranslations(lang);

  return (
    <div className="pb-safe flex min-h-dvh flex-col px-6">
      <div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6">
        <div className="relative flex items-center justify-center py-6">
          <Link
            href={`/${lang}/earn?tab=Contribute`}
            className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
          >
            <BiChevronLeft className="size-6 text-gray-500" />
          </Link>
          <Typography as="h2" variant={{ variant: "heading", level: 3 }}>
            {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.title ??
              "X Post Contest"}
          </Typography>
        </div>
      </div>

      <div className="mt-24 flex flex-1 flex-col pb-6">
        {/* Hero section */}
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <PiMegaphoneFill className="h-10 w-10 text-gray-400" />
          </div>
          <Typography
            variant={{ variant: "subtitle", level: 1 }}
            className="mx-auto mb-2 text-center text-gray-900"
          >
            {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.weeklyTitle ??
              "Weekly X Post Contest"}
          </Typography>
          <Typography
            variant={{ variant: "body", level: 2 }}
            className="text-center text-gray-500"
          >
            {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.description ??
              "Write engaging posts, win prizes"}
          </Typography>
        </div>

        {/* Prize info */}
        <div className="mb-10 w-full rounded-xl border border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <Typography
              variant={{ variant: "subtitle", level: 2 }}
              className="text-gray-900"
            >
              {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.prizes
                ?.title ?? "Prizes"}
            </Typography>
            <Link
              href={`/${lang}/earn/contribute/x-contest/winners`}
              className="relative before:absolute before:inset-[-16px] before:content-['']"
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-600 h-[19px] px-0"
              >
                {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.prizes
                  ?.viewWinners ?? "View past winners"}
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3 shadow-sm">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#C5CED8]">
                <PiTrophy className="text-gray-600 h-5 w-5" />
              </div>
              <Typography
                variant={{ variant: "heading", level: 3 }}
                className="text-gray-900"
              >
                2000
              </Typography>
              <Typography
                variant={{ variant: "body", level: 3 }}
                className="text-gray-500"
              >
                WDD
              </Typography>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3 shadow-sm">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#D5DCE4]">
                <PiTrophy className="text-gray-600 h-5 w-5" />
              </div>
              <Typography
                variant={{ variant: "heading", level: 3 }}
                className="text-gray-900"
              >
                1200
              </Typography>
              <Typography
                variant={{ variant: "body", level: 3 }}
                className="text-gray-500"
              >
                WDD
              </Typography>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3 shadow-sm">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E5EAF0]">
                <PiTrophy className="text-gray-600 h-5 w-5" />
              </div>
              <Typography
                variant={{ variant: "heading", level: 3 }}
                className="text-gray-900"
              >
                400
              </Typography>
              <Typography
                variant={{ variant: "body", level: 3 }}
                className="text-gray-500"
              >
                WDD
              </Typography>
            </div>
          </div>
        </div>

        {/* How to participate */}
        <div className="mb-10">
          <Typography
            variant={{ variant: "subtitle", level: 2 }}
            className="mb-4 text-gray-900"
          >
            {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.howTo
              ?.title ?? "How to participate"}
          </Typography>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm text-gray-0">
                1
              </div>
              <Typography
                variant={{ variant: "body", level: 2 }}
                className="text-gray-600"
              >
                {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.howTo
                  ?.step1 ?? "Write an X post about the World Republic"}
              </Typography>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm text-gray-0">
                2
              </div>
              <Typography
                variant={{ variant: "body", level: 2 }}
                className="text-gray-600"
              >
                {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.howTo
                  ?.step2 ?? "Tag @WorldRepublicEN"}
              </Typography>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm text-gray-0">
                3
              </div>
              <Typography
                variant={{ variant: "body", level: 2 }}
                className="text-gray-600"
              >
                {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.howTo
                  ?.step3?.prefix ?? "Share the link to your post in our"}{" "}
                <a
                  href="https://t.me/worldrepubliccommunity/32365"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.howTo
                    ?.step3?.link ?? "X Post Contest Telegram channel"}
                </a>
              </Typography>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="mb-10">
          <Typography
            variant={{ variant: "subtitle", level: 2 }}
            className="mb-4 text-gray-900"
          >
            {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.rules
              ?.title ?? "Contest rules"}
          </Typography>
          <ul className="text-gray-600 list-disc space-y-2 pl-5">
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.rules
                  ?.rule1 ??
                  "Only posts published in the current week are eligible"}
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.rules
                  ?.rule2 ??
                  "Winners are selected based on total engagement (likes + reposts + comments)"}
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.rules
                  ?.rule3 ?? "Contest ends every Sunday at 11:59 PM UTC"}
              </Typography>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="mt-auto space-y-3">
          <a
            href="https://x.com/intent/tweet?text=%40WorldRepublicEN"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              fullWidth
              className="flex flex-row items-center justify-center"
            >
              <div className="flex w-full items-center justify-center">
                <FaXTwitter className="mr-2 h-4 w-4" />
                <span>
                  {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.cta
                    ?.post ?? "Start Posting Now"}
                </span>
              </div>
            </Button>
          </a>
          <a
            href="https://t.me/worldrepubliccommunity/32365"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" fullWidth className="mt-4">
              {dictionary?.pages?.earn?.tabs?.contribute?.xContest?.cta
                ?.submit ?? "Submit Your Post"}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
