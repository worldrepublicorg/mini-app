"use client";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { PiTrophy, PiClipboardTextFill } from "react-icons/pi";
import { BiChevronLeft } from "react-icons/bi";

export default function PetitionContestPage() {
  return (
    <div className="pb-safe flex min-h-dvh flex-col px-6">
      <div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6">
        <div className="relative flex items-center justify-center py-6">
          <Link
            href="/earn?tab=Contribute"
            className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
          >
            <BiChevronLeft className="size-6 text-gray-500" />
          </Link>
          <Typography as="h2" variant={{ variant: "heading", level: 2 }}>
            Petition Contest
          </Typography>
        </div>
      </div>

      <div className="mt-24 flex flex-1 flex-col pb-6">
        {/* Hero section */}
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <PiClipboardTextFill className="h-10 w-10 text-gray-400" />
          </div>
          <Typography
            variant={{ variant: "subtitle", level: 1 }}
            className="mx-auto mb-2 text-center text-gray-900"
          >
            Weekly Petition Contest
          </Typography>
          <Typography
            variant={{ variant: "body", level: 2 }}
            className="text-center text-gray-500"
          >
            Get rewarded for driving collective action
          </Typography>
        </div>

        {/* Prize info */}
        <div className="mb-10 w-full rounded-xl border border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <Typography
              variant={{ variant: "subtitle", level: 2 }}
              className="text-gray-900"
            >
              Prizes
            </Typography>
            <Link
              href="/earn/contribute/petition-contest/winners"
              className="relative before:absolute before:inset-[-16px] before:content-['']"
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-600 h-[19px] px-0"
              >
                View past winners
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
                1500
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
                900
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
                300
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

        {/* How it works */}
        <div className="mb-10">
          <Typography
            variant={{ variant: "subtitle", level: 2 }}
            className="mb-4 text-gray-900"
          >
            How it works
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
                Create a petition and add &quot;World Republic Petition
                Contest&quot; to its title
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
                Set it up so only verified humans can sign it
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
                Share your petition in our{" "}
                <a
                  href="https://t.me/worldrepubliccommunity/32368"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Petition Contest Telegram channel
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
            Contest rules
          </Typography>
          <ul className="text-gray-600 list-disc space-y-2 pl-5">
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Only petitions started in the current week are eligible
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Winners are selected based on total signatures
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Contest ends every Sunday at 11:59 PM UTC
              </Typography>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="mt-auto space-y-3">
          <a href="https://vote.one" target="_blank" rel="noopener noreferrer">
            <Button fullWidth>Start Your Petition</Button>
          </a>
          <a
            href="https://t.me/worldrepubliccommunity/32368"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" fullWidth className="mt-4">
              Submit Your Petition
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
