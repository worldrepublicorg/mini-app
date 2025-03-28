"use client";

import { Typography } from "@/components/ui/Typography";
import { useState } from "react";
import { DrawerItem } from "@/components/DrawerItem";
import { SectionHeader } from "@/components/SectionHeader";
import { TabSwiper } from "@/components/TabSwiper";
import { OpenLetterCard } from "@/components/OpenLetterCard";
import { PollOfTheDay } from "@/components/PollOfTheDay";
import { useTranslations } from "@/hooks/useTranslations";

export default function GovernPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = useTranslations(lang);
  const [activeTab, setActiveTab] = useState("Polls");

  const renderContent = () => {
    switch (activeTab) {
      case "Polls":
        return (
          <>
            <SectionHeader
              title={
                dictionary?.pages?.govern?.sections?.polls?.title ||
                "Poll of the Day"
              }
              description={
                dictionary?.pages?.govern?.sections?.polls?.description ||
                "Quick votes on current topics"
              }
            />
            <PollOfTheDay lang={lang} />
          </>
        );
      case "Open letters":
        return (
          <>
            <SectionHeader
              title={
                dictionary?.pages?.govern?.sections?.openLetters?.title ||
                "Open Letters"
              }
              description={
                dictionary?.pages?.govern?.sections?.openLetters?.description ||
                "Public statements to decision makers"
              }
            />
            <OpenLetterCard
              title={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.aiRisk?.title || "Statement on AI Risk"
              }
              referenceTitle={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.aiRisk?.referenceTitle || "Center for AI Safety"
              }
              referenceUrl="https://www.safe.ai/work/statement-on-ai-risk"
              voteUrl="https://vote.one/kJc54AbK"
            />
            <OpenLetterCard
              title={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.nuclear?.title || "UN Ban on Nuclear Weapons Open Letter"
              }
              referenceTitle={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.nuclear?.referenceTitle || "Future of Life Institute"
              }
              referenceUrl="https://futureoflife.org/open-letter/nuclear-open-letter/"
              voteUrl="https://vote.one/w1MDn0Dt"
            />
            <OpenLetterCard
              title={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.autonomousWeapons?.title ||
                "Lethal Autonomous Weapons Pledge"
              }
              referenceTitle={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.autonomousWeapons?.referenceTitle ||
                "Future of Life Institute"
              }
              referenceUrl="https://futureoflife.org/open-letter/lethal-autonomous-weapons-pledge/"
              voteUrl="https://vote.one/eASgdeUE"
            />
            <OpenLetterCard
              title={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.longView?.title ||
                "Open letter calling on world leaders to show long-view leadership on existential threats"
              }
              referenceTitle={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.longView?.referenceTitle || "Future of Life Institute"
              }
              referenceUrl="https://futureoflife.org/open-letter/long-view-leadership-on-existential-threats/"
              voteUrl="https://vote.one/NtprLPWh"
            />
            <DrawerItem
              title={
                dictionary?.pages?.govern?.sections?.openLetters?.addNew ||
                "Add your open letter"
              }
              isAddNew
              lang={lang}
            />
          </>
        );
      case "Elections":
        return (
          <>
            <SectionHeader
              title={
                dictionary?.pages?.govern?.sections?.elections?.title ||
                "Elections"
              }
              description={
                dictionary?.pages?.govern?.sections?.elections?.description ||
                "Choose your representatives"
              }
            />
            <DrawerItem
              title={
                dictionary?.pages?.govern?.sections?.elections?.worldConstituent
                  ?.title || "World Constituent Assembly Election"
              }
              lang={lang}
            />
          </>
        );
      case "Referendums":
        return (
          <>
            <SectionHeader
              title={
                dictionary?.pages?.govern?.sections?.referendums?.title ||
                "Referendums"
              }
              description={
                dictionary?.pages?.govern?.sections?.referendums?.description ||
                "Direct votes on important issues"
              }
            />
            <DrawerItem
              title={
                dictionary?.pages?.govern?.sections?.referendums
                  ?.worldConstitutional?.title ||
                "World Constitutional Referendum"
              }
              lang={lang}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-safe flex min-h-dvh flex-col px-6">
      <div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6 pt-6">
        <Typography
          as="h2"
          variant={{ variant: "heading", level: 2 }}
          className="h-9 items-center"
        >
          {dictionary?.pages?.govern?.title || "Govern"}
        </Typography>

        <TabSwiper
          tabs={["Polls", "Open letters", "Elections", "Referendums"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="mt-[112px] flex flex-1 flex-col items-center justify-center pb-8">
        {renderContent()}
      </div>
    </div>
  );
}
