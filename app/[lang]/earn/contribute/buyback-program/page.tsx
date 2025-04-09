"use client";

import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import { BiChevronLeft } from "react-icons/bi";
import { FiExternalLink } from "react-icons/fi";
import {
  PiCoinsFill,
  PiCurrencyCircleDollar,
  PiChartLine,
  PiTrendUpFill,
  PiHandshakeFill,
} from "react-icons/pi";
import { Button } from "@/components/ui/Button";

export default function BuybackProgramPage({
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
            aria-label="Back to Earn"
          >
            <BiChevronLeft className="size-6 text-gray-500" />
          </Link>
          <Typography as="h2" variant={{ variant: "heading", level: 3 }}>
            {dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram?.topnav}
          </Typography>
        </div>
      </div>

      <div className="mt-24 flex flex-1 flex-col pb-6">
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <PiCoinsFill className="h-10 w-10 text-gray-400" />
          </div>
          <Typography
            variant={{ variant: "subtitle", level: 1 }}
            className="mx-auto mb-2 text-center text-gray-900"
          >
            {dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram?.title}
          </Typography>
          <Typography
            variant={{ variant: "body", level: 2 }}
            className="text-center text-gray-500"
          >
            {
              dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                ?.subtitle
            }
          </Typography>
        </div>

        {/* Stats cards grid */}
        <div className="mb-8 grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center rounded-xl bg-gray-50 p-4 shadow-sm">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#D5DCE4]">
              <PiCurrencyCircleDollar className="h-5 w-5 text-gray-500" />
            </div>
            <Typography
              variant={{ variant: "heading", level: 3 }}
              className="text-gray-900"
            >
              {
                dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                  ?.sections?.stats?.rewardPercentage
              }
            </Typography>
            <Typography
              variant={{ variant: "body", level: 3 }}
              className="mt-1 text-center text-gray-500"
            >
              {
                dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                  ?.sections?.stats?.rewardDescription
              }
            </Typography>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-gray-50 p-4 shadow-sm">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#D5DCE4]">
              <PiTrendUpFill className="h-5 w-5 text-gray-500" />
            </div>
            <Typography
              variant={{ variant: "heading", level: 3 }}
              className="text-gray-900"
            >
              {
                dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                  ?.sections?.stats?.valueBoost
              }
            </Typography>
            <Typography
              variant={{ variant: "body", level: 3 }}
              className="mt-1 text-center text-gray-500"
            >
              {
                dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                  ?.sections?.stats?.valueDescription
              }
            </Typography>
          </div>
        </div>

        <div className="space-y-8">
          {/* Source Section with card */}
          <Typography variant="body" level={2} className="text-gray-600">
            {
              dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                ?.sections?.source?.prefix
            }{" "}
            <a
              href="https://world.org/blog/announcements/world-launches-mini-apps-300k-dev-rewards-pilot-inspire-human-first-apps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 underline"
            >
              {
                dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                  ?.sections?.source?.link
              }
              <FiExternalLink className="ml-1 inline h-3 w-3 align-baseline" />
            </a>{" "}
            {
              dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                ?.sections?.source?.suffix
            }
          </Typography>

          {/* Action Section with gradient background */}
          <div className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-4">
            <div className="mb-2 flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 shadow-sm">
                <PiHandshakeFill className="h-4 w-4 text-gray-500" />
              </div>
              <Typography
                as="h3"
                variant={{ variant: "subtitle", level: 2 }}
                className="text-gray-900"
              >
                {
                  dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                    ?.sections?.commitment?.title
                }
              </Typography>
            </div>
            <Typography variant="body" level={2} className="text-gray-600">
              {
                dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                  ?.sections?.commitment?.body
              }
            </Typography>
          </div>

          {/* How It Works Section with improved card and icons */}
          <div>
            <Typography
              as="h3"
              variant={{ variant: "subtitle", level: 2 }}
              className="mb-3 text-gray-900"
            >
              {
                dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                  ?.sections?.role?.title
              }
            </Typography>
            <Typography variant="body" level={2} className="text-gray-600 mb-2">
              {
                dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                  ?.sections?.role?.intro
              }
            </Typography>
            <ul className="text-gray-600 my-4 space-y-2 pl-5">
              <li className="flex items-center">
                <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-sm text-gray-500">1</span>
                </div>
                <Typography variant="body" level={2}>
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                      ?.sections?.role?.steps?.appUsage
                  }
                </Typography>
              </li>
              <li className="flex items-center">
                <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-sm text-gray-500">2</span>
                </div>
                <Typography variant="body" level={2}>
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                      ?.sections?.role?.steps?.inviting
                  }
                </Typography>
              </li>
            </ul>
          </div>

          {/* Impact Section with shadow */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="mb-2 flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <PiChartLine className="h-4 w-4 text-gray-500" />
              </div>
              <Typography
                as="h3"
                variant={{ variant: "subtitle", level: 2 }}
                className="text-gray-900"
              >
                {
                  dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                    ?.sections?.impact?.title
                }
              </Typography>
            </div>
            <Typography variant="body" level={2} className="text-gray-600">
              {
                dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                  ?.sections?.impact?.body
              }
            </Typography>
          </div>
        </div>

        {/* Call to action button */}
        <div className="mt-8">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => window.open("https://www.miniapps.world/", "_blank")}
          >
            {dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram?.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
