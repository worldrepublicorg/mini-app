"use client";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { PiUserCheckFill, PiTrophy, PiClipboardFill } from "react-icons/pi";
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
          <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <PiClipboardFill className="h-10 w-10 text-gray-400" />
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
            Start global petitions and gather support from verified humans
          </Typography>
        </div>

        {/* Prize info */}
        <div className="mb-10 w-full rounded-xl border border-gray-200 p-4">
          <Typography
            variant={{ variant: "subtitle", level: 2 }}
            className="mb-4 text-center text-gray-900"
          >
            Prizes
          </Typography>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
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
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
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
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
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
                Create a petition with a title that starts with{" "}
                <span className="font-medium">
                  &quot;[World Republic Petition Contest]&quot;
                </span>
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
                Set it up so that only verified humans can sign it
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
                Submit your petition to our{" "}
                <a
                  href="https://t.me/worldrepubliccommunity/32368"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                <li>
                  <Typography variant={{ variant: "body", level: 2 }}>
                    Winners are selected based on the number of signatures
                  </Typography>
                </li>
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Each participant can submit up to 2 petitions per week
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Contest closes every Sunday at 11:59 PM UTC
              </Typography>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="mt-auto space-y-3">
          <a
            href="https://vote.one/polls/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button fullWidth>Create petition</Button>
          </a>
          <a
            href="https://forms.gle/3ZY25q1c6nkXY8427"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" fullWidth className="mt-4">
              Submit your petition
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
