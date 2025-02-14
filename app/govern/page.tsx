"use client";

import { Typography } from "@/components/ui/Typography";
import { useState } from "react";
import { DrawerItem } from "@/components/DrawerItem";
import { SectionHeader } from "@/components/SectionHeader";
import { TabSwiper } from "@/components/TabSwiper";
import { OpenLetterCard } from "@/components/OpenLetterCard";
import { PollCard } from "@/components/PollCard";

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
            <PollCard
              title="Trade Balance"
              description="Do you believe reciprocal tariffs are an effective tool for balancing international trade?"
              url="https://vote.one/1BQZ2v3a"
            />
            <PollCard
              title="Climate Indicators"
              description="Do you think recent severe weather events indicate a significant change in our climate?"
              url="https://vote.one/GVnbTAbR"
            />
            <PollCard
              title="Migration Standards"
              description="Should international agreements set binding standards for the treatment of migrants and refugees?"
              url="https://vote.one/vLoWhqjh"
            />
            <PollCard
              title="Global Representation"
              description="Would expanding the representation of emerging economies and civil society in global decision-making improve international outcomes?"
              url="https://vote.one/I6gUFLJa"
            />
            <PollCard
              title="Conflict Resolution"
              description="Are diplomatic solutions generally more effective than military approaches for resolving international conflicts?"
              url="https://vote.one/f3Dm4GS6"
            />
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
              referenceTitle="Center for AI Safety"
              referenceUrl="https://www.safe.ai/work/statement-on-ai-risk"
              voteUrl="https://vote.one/kJc54AbK"
            />
            <OpenLetterCard
              title="UN Ban on Nuclear Weapons Open Letter"
              referenceTitle="Future of Life Institute"
              referenceUrl="https://futureoflife.org/open-letter/nuclear-open-letter/"
              voteUrl="https://vote.one/w1MDn0Dt"
            />
            <OpenLetterCard
              title="Lethal Autonomous Weapons Pledge"
              referenceTitle="Future of Life Institute"
              referenceUrl="https://futureoflife.org/open-letter/lethal-autonomous-weapons-pledge/"
              voteUrl="https://vote.one/eASgdeUE"
            />
            <OpenLetterCard
              title="Open letter calling on world leaders to show long-view leadership on existential threats"
              referenceTitle="Future of Life Institute"
              referenceUrl="https://futureoflife.org/open-letter/long-view-leadership-on-existential-threats/"
              voteUrl="https://vote.one/NtprLPWh"
            />
            <DrawerItem title="Add your open letter" isAddNew />
          </>
        );
      case "Elections":
        return (
          <>
            <SectionHeader
              title="Elections"
              description="Choose your representatives"
            />
            <DrawerItem title="World Constituent Assembly Election" />
          </>
        );
      case "Referendums":
        return (
          <>
            <SectionHeader
              title="Referendums"
              description="Direct votes on important issues"
            />
            <DrawerItem title="World Constitutional Referendum" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col px-6 pb-24">
      <div className="bg-white pt-6">
        <Typography
          as="h2"
          variant={{ variant: "heading", level: 2 }}
          className="h-8"
        >
          Govern
        </Typography>
      </div>

      <TabSwiper
        tabs={["Polls", "Open letters", "Elections", "Referendums"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div>{renderContent()}</div>
    </div>
  );
}
