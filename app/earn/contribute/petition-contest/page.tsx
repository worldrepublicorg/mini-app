"use client";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { PiUserCheckFill, PiTrophy, PiNotePencilFill } from "react-icons/pi";
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
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <PiNotePencilFill className="h-10 w-10 text-gray-400" />
          </div>
          <Typography
            variant={{ variant: "subtitle", level: 1 }}
            className="mx-auto mb-2 text-center text-gray-900"
          >
            World Republic Petition Contest
          </Typography>
          <Typography
            variant={{ variant: "body", level: 2 }}
            className="text-center text-gray-500"
          >
            Create petitions that matter and earn rewards
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
                750
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
                400
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
                200
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
                Create a petition on Change.org with a title that starts with{" "}
                <span className="font-medium">
                  "World Republic Petition Contest:"
                </span>
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
                Focus on issues that promote human dignity, democracy, and
                positive change in society.
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
                Submit your petition link through our form before the weekly
                deadline (Sunday 11:59 PM UTC).
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
                Only signatures from Orb-verified humans will count toward your
                petition's score.
              </Typography>
            </div>
          </div>
        </div>

        {/* Unique feature */}
        <div className="bg-blue-50 mb-6 rounded-xl p-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-blue-100 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
              <PiUserCheckFill className="text-blue-600 h-4 w-4" />
            </div>
            <Typography
              variant={{ variant: "subtitle", level: 2 }}
              className="text-blue-800"
            >
              Verified-only voting
            </Typography>
          </div>
          <Typography
            variant={{ variant: "body", level: 2 }}
            className="text-blue-700"
          >
            Only signatures from Orb-verified humans will count in our contest
            ranking. This ensures true democratic representation without bot or
            duplicate signatures.
          </Typography>
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
                Must be Orb-verified to create petitions for the contest
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Petitions must start with "World Republic Petition Contest:" in
                the title
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Content must comply with Change.org community guidelines
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Each participant can submit up to 2 petitions per week
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                Winners announced every Tuesday on our Discord channel
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
            <span className="font-medium">"Environmental Policy Reform"</span> -
            Create petitions addressing climate change policies and
            environmental protection.
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
            href="https://www.change.org/start-a-petition"
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
            <Button variant="secondary" fullWidth>
              Submit your petition
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
