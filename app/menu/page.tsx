"use client";

import ListItem from "@/components/ui/ListItem/ListItem";
import { Typography } from "@/components/ui/Typography";
import { BiLinkExternal } from "react-icons/bi";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { useState, useEffect } from "react";

const menuSections = [
  {
    title: "CONNECT",
    links: [
      {
        label: "Community",
        url: "https://t.me/worldrepublictesters",
        isExternal: true,
      },
      {
        label: "Announcements",
        url: "https://t.me/worldrepublicannouncements",
        isExternal: true,
      },
      { label: "X", url: "https://x.com/WorldRepublicEN", isExternal: true },
    ],
  },
  {
    title: "HELP",
    links: [{ label: "FAQ", url: "/faq", isExternal: false }],
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
    title: "CODE",
    links: [
      {
        label: "App",
        url: "https://github.com/worldrepublicorg/mini-app",
        isExternal: true,
      },
      {
        label: "Smart contracts",
        url: "https://github.com/worldrepublicorg/smart-contracts",
        isExternal: true,
      },
    ],
  },
] as const;

export default function MenuPage() {
  const [hasFaqBeenVisited, setHasFaqBeenVisited] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const visited = localStorage.getItem("faqVisited") === "true";
      setHasFaqBeenVisited(visited);
    }
  }, []);

  return (
    <div className="flex flex-col px-6 pb-20">
      <div className="py-6">
        <Typography as="h2" variant={{ variant: "heading", level: 2 }}>
          Menu
        </Typography>
      </div>

      <div>
        {menuSections.map((section) => (
          <div key={section.title} className="mt-4">
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
                  <Link href={link.url} className="w-full">
                    <ListItem>
                      <div className="flex h-8 w-full items-center justify-between">
                        <div className="flex items-center">
                          <Typography
                            as="span"
                            variant={{ variant: "subtitle", level: 2 }}
                            className="text-gray-900"
                          >
                            {link.label}
                          </Typography>
                          {link.label === "FAQ" && !hasFaqBeenVisited && (
                            <div className="ml-2 h-2 w-2 rounded-full bg-error-800 opacity-65"></div>
                          )}
                        </div>
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
