"use client";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { PiTrophy } from "react-icons/pi";
import { FaXTwitter } from "react-icons/fa6";
import { BiChevronLeft } from "react-icons/bi";

export default function XContestPage() {
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
            X Post Contest
          </Typography>
        </div>
      </div>

      <div className="mt-24 flex flex-1 flex-col pb-6">
        {/* Hero section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <FaXTwitter className="h-10 w-10 text-gray-400" />
          </div>
          <Typography
            variant={{ variant: "subtitle", level: 1 }}
            className="mx-auto mb-2 text-center text-gray-900"
          >
            Weekly X Post Contest
          </Typography>
          <Typography
            variant={{ variant: "body", level: 2 }}
            className="text-center text-gray-500"
          >
            Share your ideas about World Republic and win rewards
          </Typography>
        </div>

        {/* Prize info */}
        <div className="mb-6 w-full rounded-xl border border-gray-200 p-4">
          <Typography
            variant={{ variant: "subtitle", level: 2 }}
            className="mb-4 text-center text-gray-900"
          >
            Prizes
          </Typography>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3">
              <div className="bg-yellow-100 mb-1 flex h-8 w-8 items-center justify-center rounded-full">
                <PiTrophy className="text-yellow-600 h-5 w-5" />
              </div>
              <Typography
                variant={{ variant: "heading", level: 3 }}
                className="text-gray-900"
              >
                500
              </Typography>
              <Typography
                variant={{ variant: "body", level: 3 }}
                className="text-gray-500"
              >
                WDD
              </Typography>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3">
              <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
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
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3">
              <div className="bg-amber-100 mb-1 flex h-8 w-8 items-center justify-center rounded-full">
                <PiTrophy className="text-amber-600 h-5 w-5" />
              </div>
              <Typography
                variant={{ variant: "heading", level: 3 }}
                className="text-gray-900"
              >
                100
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
        <div className="mb-6">
          <Typography
            variant={{ variant: "subtitle", level: 2 }}
            className="mb-4 text-gray-900"
          >
            How it works
          </Typography>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="text-white flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900">
                1
              </div>
              <Typography
                variant={{ variant: "body", level: 2 }}
                className="text-gray-600"
              >
                Write X posts about World Republic, your ideas for society, or
                how digital democracy can work.
              </Typography>
            </div>
            <div className="flex gap-3">
              <div className="text-white flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900">
                2
              </div>
              <Typography
                variant={{ variant: "body", level: 2 }}
                className="text-gray-600"
              >
                Tag <span className="font-medium">@WorldRepublicEN</span> and
                include the hashtag{" "}
                <span className="font-medium">#WorldRepublicContest</span> in
                your posts.
              </Typography>
            </div>
            <div className="flex gap-3">
              <div className="text-white flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900">
                3
              </div>
              <Typography
                variant={{ variant: "body", level: 2 }}
                className="text-gray-600"
              >
                Post at least 3 times during the contest week to qualify.
                Contests run Monday through Sunday.
              </Typography>
            </div>
            <div className="flex gap-3">
              <div className="text-white flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900">
                4
              </div>
              <Typography
                variant={{ variant: "body", level: 2 }}
                className="text-gray-600"
              >
                Winners are selected based on engagement (likes, reposts,
                replies) and quality of content.
              </Typography>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="mb-6">
          <Typography
            variant={{ variant: "subtitle", level: 2 }}
            className="mb-4 text-gray-900"
          >
            Contest rules
          </Typography>
          <ul className="text-gray-600 list-disc space-y-2 pl-5">
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Must have a verified World ID account to participate
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Posts must be original content, not reposts
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Each participant can submit up to 7 posts per week
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Submissions close every Sunday at 11:59 PM UTC
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Winners announced every Tuesday on our X account
              </Typography>
            </li>
          </ul>
        </div>

        {/* Current theme */}
        <div className="mb-8 rounded-xl bg-gray-50 p-4">
          <Typography
            variant={{ variant: "subtitle", level: 2 }}
            className="mb-2 text-gray-900"
          >
            Current theme
          </Typography>
          <Typography
            variant={{ variant: "body", level: 2 }}
            className="text-gray-600 mb-3"
          >
            <span className="font-medium">"Digital Democracy in Action"</span> -
            Share your vision for how digital tools can improve democracy and
            governance.
          </Typography>
          <Typography
            variant={{ variant: "body", level: 3 }}
            className="text-gray-500"
          >
            Contest period: May 13 - May 19, 2024
          </Typography>
        </div>

        {/* CTA Buttons */}
        <div className="mt-auto space-y-3">
          <a
            href="https://x.com/intent/tweet?text=My%20ideas%20for%20the%20World%20Republic%3A%20%0A%0A%40WorldRepublic%20%23WorldRepublicContest"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button fullWidth>
              <FaXTwitter className="mr-2 h-4 w-4" />
              Start posting now
            </Button>
          </a>
          <a
            href="https://x.com/WorldRepublicEN"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" fullWidth>
              Follow @WorldRepublicEN
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
