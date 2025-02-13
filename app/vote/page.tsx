"use client";

import { Typography } from "@/components/ui/Typography";
import { useState } from "react";
import { DrawerItem } from "@/components/DrawerItem";
import { SectionHeader } from "@/components/SectionHeader";
import { TabSwiper } from "@/components/TabSwiper";
import { ListItem } from "@/components/ui/ListItem/ListItem";
import { IoIosArrowForward } from "react-icons/io";

export default function VotePage() {
  const [activeTab, setActiveTab] = useState("Polls");

  const renderContent = () => {
    switch (activeTab) {
      case "Polls":
        return (
          <>
            <SectionHeader
              title="Polls"
              description="Quick votes on current topics"
            />
            <a href="https://vote.one/lFJN9p06">
              <ListItem variant="outline">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <Typography
                      as="h3"
                      variant={{ variant: "subtitle", level: 2 }}
                    >
                      Test poll
                    </Typography>
                    <Typography
                      as="p"
                      variant={{ variant: "body", level: 2 }}
                      className="text-gray-500"
                    >
                      Test poll description
                    </Typography>
                  </div>
                  <IoIosArrowForward className="text-gray-500 flex-shrink-0" />
                </div>
              </ListItem>
            </a>
            <DrawerItem title="Add your poll" isAddNew />
          </>
        );
      case "Open letters":
        return (
          <>
            <SectionHeader
              title="Open Letters"
              description="Public statements to decision makers"
            />
            <a href="https://vote.one/1YuxWznL">
              <ListItem variant="outline">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <Typography
                      as="h3"
                      variant={{ variant: "subtitle", level: 2 }}
                    >
                      Test open letter
                    </Typography>
                    <Typography
                      as="p"
                      variant={{ variant: "body", level: 2 }}
                      className="text-gray-500"
                    >
                      Test open letter description
                    </Typography>
                  </div>
                  <IoIosArrowForward className="text-gray-500 flex-shrink-0" />
                </div>
              </ListItem>
            </a>
            <DrawerItem title="Add your open letter" isAddNew />
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
        tabs={["Polls", "Open letters", "Referendums", "Elections"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div>{renderContent()}</div>
    </div>
  );
}
