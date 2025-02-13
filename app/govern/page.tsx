"use client";

import { Typography } from "@/components/ui/Typography";
import { useState } from "react";
import { DrawerItem } from "@/components/DrawerItem";
import { SectionHeader } from "@/components/SectionHeader";
import { TabSwiper } from "@/components/TabSwiper";
import { ListItem } from "@/components/ui/ListItem/ListItem";
import { IoIosArrowForward } from "react-icons/io";
import { OpenLetterCard } from "@/components/OpenLetterCard";

export default function GovernPage() {
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
                  <div className="rounded-full bg-gray-100 p-1.5">
                    <IoIosArrowForward className="size-[14px] text-gray-400 flex-shrink-0" />
                  </div>
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
            <OpenLetterCard
              title="Statement on AI Risk"
              referenceUrl="https://www.safe.ai/work/statement-on-ai-risk"
              voteUrl="https://vote.one/1YuxWznL"
            />
            <OpenLetterCard
              title="Open Letter Against Reckless Nuclear Escalation and Use"
              referenceUrl="https://futureoflife.org/open-letter/open-letter-against-reckless-nuclear-escalation-and-use/"
              voteUrl="https://vote.one/1YuxWznL"
            />
            <OpenLetterCard
              title="Lethal Autonomous Weapons Pledge"
              referenceUrl="https://futureoflife.org/open-letter/lethal-autonomous-weapons-pledge/"
              voteUrl="https://vote.one/1YuxWznL"
            />
            <OpenLetterCard
              title="Open letter calling on world leaders to show long-view leadership on existential threats"
              referenceUrl="https://futureoflife.org/open-letter/long-view-leadership-on-existential-threats/"
              voteUrl="https://vote.one/1YuxWznL"
            />
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
          Govern
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
