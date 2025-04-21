"use client";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { PiUsersThree, PiTrophy, PiBuildingsFill } from "react-icons/pi";
import { BiChevronLeft } from "react-icons/bi";
import { useTranslations } from "@/hooks/useTranslations";

export default function PartySubsidyPage({
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
            Party Subsidy Program
          </Typography>
        </div>
      </div>

      <div className="mt-24 flex flex-1 flex-col pb-6">
        {/* Hero section */}
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <PiBuildingsFill className="h-10 w-10 text-gray-400" />
          </div>
          <Typography
            variant={{ variant: "subtitle", level: 1 }}
            className="mx-auto mb-2 text-center text-gray-900"
          >
            Political Party Subsidy Program (Test)
          </Typography>
          <Typography
            variant={{ variant: "body", level: 2 }}
            className="text-center text-gray-500"
          >
            Earn rewards for building the largest political parties of the World
            Republic
          </Typography>
        </div>

        {/* Prize info */}
        <div className="mb-10 w-full rounded-xl border border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <Typography
              variant={{ variant: "subtitle", level: 2 }}
              className="text-gray-900"
            >
              Daily Rewards
            </Typography>
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
                1000
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
                600
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
        <div className="mb-10">
          <Typography
            variant={{ variant: "subtitle", level: 2 }}
            className="mb-4 text-gray-900"
          >
            How It Works
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
                Create a political party in the World Republic Labs app
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
                Grow your party membership
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
                At the end of each day, the top parties by membership size
                receive WDD rewards
              </Typography>
            </div>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mb-10">
          <Typography
            variant={{ variant: "subtitle", level: 2 }}
            className="mb-4 text-gray-900"
          >
            Additional Benefit
          </Typography>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start">
              <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
                <PiUsersThree className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <Typography
                  variant={{ variant: "subtitle", level: 3 }}
                  className="text-gray-900"
                >
                  Verification Bonus
                </Typography>
                <Typography
                  variant={{ variant: "body", level: 2 }}
                  className="text-gray-600"
                >
                  The party with the highest number of verified members receives
                  an additional 300 WDD
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-auto space-y-3">
          <Link href={`/${lang}/govern`}>
            <Button fullWidth>Create or Join a Party</Button>
          </Link>
          <a
            href="https://t.me/worldrepublicpartyleaders"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" fullWidth className="mt-4">
              Join Party Leader Group
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
