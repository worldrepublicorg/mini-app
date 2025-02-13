"use client";

import { Typography } from "@/components/ui/Typography";
import { useState } from "react";
import { DrawerItem } from "@/components/DrawerItem";
import { SectionHeader } from "@/components/SectionHeader";
import { TabSwiper } from "@/components/TabSwiper";
import { BiLinkExternal } from "react-icons/bi";

const POLLS_APP_ID = "app_86794ef02e4fdd6579a937e4a0d858fb";

// Function to generate deep links with the identifier as the full path
function getPollsDeepLink_IdentifierOnly(identifier: string) {
  const encodedPath = encodeURIComponent(`/${identifier}`);
  return `https://worldcoin.org/mini-app?app_id=${POLLS_APP_ID}&path=${encodedPath}`;
}

// Function to generate deep links with a descriptive segment and the identifier
function getPollsDeepLink_WithType(
  type: "open-letter" | "poll",
  identifier: string
) {
  const encodedPath = encodeURIComponent(`/${type}/${identifier}`);
  return `https://worldcoin.org/mini-app?app_id=${POLLS_APP_ID}&path=${encodedPath}`;
}

export default function VotePage() {
  const [activeTab, setActiveTab] = useState("Open letters");

  const renderContent = () => {
    switch (activeTab) {
      case "Open letters":
        const openLetterIdentifier = "1YuxWznL";
        const openLetterLink1 =
          getPollsDeepLink_IdentifierOnly(openLetterIdentifier);
        const openLetterLink2 = getPollsDeepLink_WithType(
          "open-letter",
          openLetterIdentifier
        );

        return (
          <>
            <SectionHeader
              title="Open Letters"
              description="Public statements to decision makers"
            />
            {/* Existing vote.one link */}
            <a
              href="https://vote.one/1YuxWznL"
              onClick={(e) => {
                e.preventDefault(); //prevent default
                window.location.href = "https://vote.one/1YuxWznL"; //use to fix redirect
              }}
            >
              <div className="flex items-center justify-between p-6 mt-4 border-2 rounded-xl cursor-pointer">
                <Typography as="h3" variant={{ variant: "subtitle", level: 2 }}>
                  Test open letter (window.location.href + prevent default
                  vote.one)
                </Typography>
                <BiLinkExternal className="text-xl text-gray-500" />
              </div>
            </a>
            <a href="https://vote.one/1YuxWznL">
              <div className="flex items-center justify-between p-6 mt-4 border-2 rounded-xl cursor-pointer">
                <Typography as="h3" variant={{ variant: "subtitle", level: 2 }}>
                  Test open letter (normal href vote.one)
                </Typography>
                <BiLinkExternal className="text-xl text-gray-500" />
              </div>
            </a>
            {/* Deep link with identifier-only path */}
            <a
              href={openLetterLink1}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = openLetterLink1;
              }}
            >
              <div className="flex items-center justify-between p-6 mt-4 border-2 rounded-xl cursor-pointer">
                <Typography as="h3" variant={{ variant: "subtitle", level: 2 }}>
                  Test open letter (identifier-only)
                </Typography>
                <BiLinkExternal className="text-xl text-gray-500" />
              </div>
            </a>
            {/* Deep link with type and identifier */}
            <a
              href={openLetterLink2}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = openLetterLink2;
              }}
            >
              <div className="flex items-center justify-between p-6 mt-4 border-2 rounded-xl cursor-pointer">
                <Typography as="h3" variant={{ variant: "subtitle", level: 2 }}>
                  Test open letter (type/identifier)
                </Typography>
                <BiLinkExternal className="text-xl text-gray-500" />
              </div>
            </a>
            <DrawerItem title="Add your open letter" isAddNew />
          </>
        );
      case "Polls":
        const pollIdentifier = "lFJN9p06";
        const pollLink1 = getPollsDeepLink_IdentifierOnly(pollIdentifier);
        const pollLink2 = getPollsDeepLink_WithType("poll", pollIdentifier);

        return (
          <>
            <SectionHeader
              title="Polls"
              description="Quick votes on current topics"
            />
            {/* Existing vote.one link */}
            <a
              href="https://vote.one/lFJN9p06"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "https://vote.one/lFJN9p06";
              }}
            >
              <div className="flex items-center justify-between p-6 mt-4 border-2 rounded-xl cursor-pointer">
                <Typography as="h3" variant={{ variant: "subtitle", level: 2 }}>
                  Test poll (window.location.href + prevent default vote.one)
                </Typography>
                <BiLinkExternal className="text-xl text-gray-500" />
              </div>
            </a>
            <a href="https://vote.one/lFJN9p06">
              <div className="flex items-center justify-between p-6 mt-4 border-2 rounded-xl cursor-pointer">
                <Typography as="h3" variant={{ variant: "subtitle", level: 2 }}>
                  Test poll (normal href vote.one)
                </Typography>
                <BiLinkExternal className="text-xl text-gray-500" />
              </div>
            </a>
            {/* Deep link with identifier-only path */}
            <a
              href={pollLink1}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = pollLink1;
              }}
            >
              <div className="flex items-center justify-between p-6 mt-4 border-2 rounded-xl cursor-pointer">
                <Typography as="h3" variant={{ variant: "subtitle", level: 2 }}>
                  Test poll (identifier-only)
                </Typography>
                <BiLinkExternal className="text-xl text-gray-500" />
              </div>
            </a>
            {/* Deep link with type and identifier */}
            <a
              href={pollLink2}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = pollLink2;
              }}
            >
              <div className="flex items-center justify-between p-6 mt-4 border-2 rounded-xl cursor-pointer">
                <Typography as="h3" variant={{ variant: "subtitle", level: 2 }}>
                  Test poll (type/identifier)
                </Typography>
                <BiLinkExternal className="text-xl text-gray-500" />
              </div>
            </a>
            <DrawerItem title="Add your poll" isAddNew />
          </>
        );
      case "Referendums":
        return (
          <>
            <SectionHeader
              title="Referendums"
              description="Direct votes on important issues"
            />
            <DrawerItem title="Test referendum" />
          </>
        );
      case "Elections":
        return (
          <>
            <SectionHeader
              title="Elections"
              description="Choose your representatives"
            />
            <DrawerItem title="Test election" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col px-6 pb-24">
      <div className="pt-6 bg-white">
        <Typography as="h2" variant={{ variant: "heading", level: 2 }}>
          Vote
        </Typography>
      </div>

      <TabSwiper
        tabs={["Open letters", "Polls", "Referendums", "Elections"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div>{renderContent()}</div>
    </div>
  );
}
