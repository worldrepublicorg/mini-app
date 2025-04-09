"use client";

import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import { BiChevronLeft } from "react-icons/bi";
import { FiExternalLink } from "react-icons/fi";
import { PiChartLine, PiHandshakeFill, PiMoneyFill } from "react-icons/pi";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";

export default function BuybackProgramPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = useTranslations(lang);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("newBuybackProgramVisited", "true");
    }
  }, []);

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
            <PiMoneyFill className="h-10 w-10 text-gray-400" />
          </div>
          <Typography
            variant={{ variant: "heading", level: 2 }}
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

        <div className="space-y-8">
          {/* Action Section with gradient background */}
          <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
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
            <ul className="text-gray-600 my-3 space-y-2 pl-4">
              <li className="flex items-center">
                <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900">
                  <span className="text-sm text-gray-0">1</span>
                </div>
                <Typography variant="body" level={2}>
                  {
                    dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
                      ?.sections?.role?.steps?.appUsage
                  }
                </Typography>
              </li>
              <li className="flex items-center">
                <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-900">
                  <span className="text-sm text-gray-0">2</span>
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
