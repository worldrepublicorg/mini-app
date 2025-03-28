"use client";

import ListItem from "@/components/ui/ListItem/ListItem";
import { Typography } from "@/components/ui/Typography";
import { BiLinkExternal } from "react-icons/bi";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { useTranslations } from "@/hooks/useTranslations";
import { usePathname } from "next/navigation";

export default function MenuPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const pathname = usePathname();
  const dictionary = useTranslations(lang);

  const menuSections = [
    {
      title:
        dictionary?.pages?.menu?.sections?.experimental?.title ??
        "EXPERIMENTAL",
      links: [
        {
          label:
            dictionary?.pages?.menu?.sections?.experimental?.links
              ?.verification ?? "Verification tests",
          url: "/verification",
          isExternal: false,
        },
        {
          label:
            dictionary?.pages?.menu?.sections?.experimental?.links?.language ??
            "Language",
          url: "/language",
          isExternal: false,
        },
      ],
    },
    {
      title: dictionary?.pages?.menu?.sections?.connect?.title ?? "CONNECT",
      links: [
        {
          label:
            dictionary?.pages?.menu?.sections?.connect?.links?.community ??
            "Community",
          url: "https://t.me/worldrepubliccommunity",
          isExternal: true,
        },
        {
          label:
            dictionary?.pages?.menu?.sections?.connect?.links?.announcements ??
            "Announcements",
          url: "https://t.me/worldrepublicannouncements",
          isExternal: true,
        },
        {
          label: dictionary?.pages?.menu?.sections?.connect?.links?.x ?? "X",
          url: "https://x.com/WorldRepublicEN",
          isExternal: true,
        },
      ],
    },
    {
      title: dictionary?.pages?.menu?.sections?.help?.title ?? "HELP",
      links: [
        {
          label: dictionary?.pages?.menu?.sections?.help?.links?.faq ?? "FAQ",
          url: "/faq",
          isExternal: false,
        },
      ],
    },
    // {
    //   title: "DOCS",
    //   links: [
    //     {
    //       label: "Community docs",
    //       url: "https://github.com/worldrepublicorg/docs",
    //       isExternal: true,
    //     },
    //     {
    //       label: "Operating manual",
    //       url: "https://github.com/worldrepublicorg/governing-documents/blob/main/manual.md",
    //       isExternal: true,
    //     },
    //   ],
    // },
    {
      title: dictionary?.pages?.menu?.sections?.code?.title ?? "CODE",
      links: [
        {
          label: dictionary?.pages?.menu?.sections?.code?.links?.app ?? "App",
          url: "https://github.com/worldrepublicorg/mini-app",
          isExternal: true,
        },
        {
          label:
            dictionary?.pages?.menu?.sections?.code?.links?.contracts ??
            "Smart contracts",
          url: "https://github.com/worldrepublicorg/smart-contracts",
          isExternal: true,
        },
      ],
    },
  ] as const;

  return (
    <div className="flex flex-col px-6 pb-20">
      <div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6 py-6">
        <Typography as="h2" variant={{ variant: "heading", level: 2 }}>
          {dictionary?.pages?.menu?.title ?? "Menu"}
        </Typography>
      </div>

      <div className="mt-[95px] flex flex-col gap-10">
        {menuSections.map((section) => (
          <div key={section.title}>
            <div className="mb-4 flex">
              <Typography
                as="h3"
                variant={{ variant: "heading", level: 3 }}
                className="text-base text-gray-500"
              >
                {section.title}
              </Typography>
            </div>

            {section.links.map((link) => (
              <div key={link.label} className="flex">
                {link.isExternal ? (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <ListItem>
                      <div className="flex h-8 w-full items-center justify-between">
                        <Typography
                          as="span"
                          variant={{ variant: "subtitle", level: 2 }}
                          className="text-gray-900"
                        >
                          {link.label}
                        </Typography>
                        <BiLinkExternal className="size-5 text-gray-400" />
                      </div>
                    </ListItem>
                  </a>
                ) : (
                  <Link href={`/${lang}${link.url}`} className="w-full">
                    <ListItem>
                      <div className="flex h-8 w-full items-center justify-between">
                        <Typography
                          as="span"
                          variant={{ variant: "subtitle", level: 2 }}
                          className="text-gray-900"
                        >
                          {link.label}
                        </Typography>
                        <IoIosArrowForward className="size-5 text-gray-400" />
                      </div>
                    </ListItem>
                  </Link>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
