import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { PiTrophy, PiClipboardTextFill } from "react-icons/pi";
import { BiChevronLeft } from "react-icons/bi";
import { useTranslations } from "@/hooks/useTranslations";

export default function PollContestPage({
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
            {dictionary?.pages?.earn?.tabs?.contribute?.contests?.pollContest
              ?.title ?? "Poll Contest"}
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
            {dictionary?.pages?.earn?.tabs?.contribute?.contests?.pollContest
              ?.weeklyTitle ?? "Weekly Poll Contest"}
          </Typography>
          <Typography
            variant={{ variant: "body", level: 2 }}
            className="text-center text-gray-500"
          >
            {dictionary?.pages?.earn?.tabs?.contribute?.contests?.pollContest
              ?.description ?? "Gather community feedback and earn"}
          </Typography>
        </div>

        {/* Prize info */}
        <div className="mb-10 w-full rounded-xl border border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <Typography
              variant={{ variant: "subtitle", level: 2 }}
              className="text-gray-900"
            >
              {dictionary?.pages?.earn?.tabs?.contribute?.contests?.pollContest
                ?.prizes?.title ?? "Prizes"}
            </Typography>
            <Link
              href={`/${lang}/earn/contribute/poll-contest/winners`}
              className="relative before:absolute before:inset-[-16px] before:content-['']"
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-600 h-[19px] px-0"
              >
                {dictionary?.pages?.earn?.tabs?.contribute?.contests
                  ?.pollContest?.prizes?.viewWinners ?? "View past winners"}
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

        {/* How it works */}
        <div className="mb-10">
          <Typography
            variant={{ variant: "subtitle", level: 2 }}
            className="mb-4 text-gray-900"
          >
            {dictionary?.pages?.earn?.tabs?.contribute?.contests?.pollContest
              ?.howTo?.title ?? "How it works"}
          </Typography>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm text-gray-0">
                {
                  dictionary.pages.earn.tabs.contribute.contests.pollContest
                    .howTo.steps.step1.number
                }
              </div>
              <Typography
                variant={{ variant: "body", level: 2 }}
                className="text-gray-600"
              >
                {
                  dictionary.pages.earn.tabs.contribute.contests.pollContest
                    .howTo.steps.step1.text
                }
              </Typography>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm text-gray-0">
                {
                  dictionary.pages.earn.tabs.contribute.contests.pollContest
                    .howTo.steps.step2.number
                }
              </div>
              <Typography
                variant={{ variant: "body", level: 2 }}
                className="text-gray-600"
              >
                {
                  dictionary.pages.earn.tabs.contribute.contests.pollContest
                    .howTo.steps.step2.text
                }
              </Typography>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm text-gray-0">
                {
                  dictionary.pages.earn.tabs.contribute.contests.pollContest
                    .howTo.steps.step3.number
                }
              </div>
              <Typography
                variant={{ variant: "body", level: 2 }}
                className="text-gray-600"
              >
                {
                  dictionary.pages.earn.tabs.contribute.contests.pollContest
                    .howTo.steps.step3.text
                }{" "}
                <a
                  href={
                    dictionary.pages.earn.tabs.contribute.contests.pollContest
                      .howTo.steps.step3.link.url
                  }
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {
                    dictionary.pages.earn.tabs.contribute.contests.pollContest
                      .howTo.steps.step3.link.text
                  }
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
            {dictionary?.pages?.earn?.tabs?.contribute?.contests?.pollContest
              ?.rules?.title ?? "Contest rules"}
          </Typography>
          <ul className="text-gray-600 list-disc space-y-2 pl-5">
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                {
                  dictionary.pages.earn.tabs.contribute.contests.pollContest
                    .rules.list.rule1
                }
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                {
                  dictionary.pages.earn.tabs.contribute.contests.pollContest
                    .rules.list.rule2
                }
              </Typography>
            </li>
            <li>
              <Typography variant={{ variant: "body", level: 2 }}>
                {
                  dictionary.pages.earn.tabs.contribute.contests.pollContest
                    .rules.list.rule3
                }
              </Typography>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="mt-auto space-y-3">
          <a href="https://vote.one" target="_blank" rel="noopener noreferrer">
            <Button fullWidth>
              {dictionary?.pages?.earn?.tabs?.contribute?.contests?.pollContest
                ?.cta?.create ?? "Create Your Poll"}
            </Button>
          </a>
          <a
            href="https://t.me/worldrepubliccommunity/32368"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" fullWidth className="mt-4">
              {dictionary?.pages?.earn?.tabs?.contribute?.contests?.pollContest
                ?.cta?.submit ?? "Submit Your Poll"}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
