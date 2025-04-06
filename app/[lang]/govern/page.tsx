"use client";

import { Typography } from "@/components/ui/Typography";
import { useState } from "react";
import { DrawerItem } from "@/components/DrawerItem";
import { SectionHeader } from "@/components/SectionHeader";
import { TabSwiper } from "@/components/TabSwiper";
import { OpenLetterCard } from "@/components/OpenLetterCard";
import { PollOfTheDay } from "@/components/PollOfTheDay";
import { useTranslations } from "@/hooks/useTranslations";
import { PoliticalPartyList } from "@/components/PoliticalPartyList";

const TAB_KEYS = {
  POLLS: "polls",
  OPEN_LETTERS: "openLetters",
  ELECTIONS: "elections",
  REFERENDUMS: "referendums",
  POLITICAL_PARTIES: "politicalParties",
} as const;

type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS];

export default function GovernPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = useTranslations(lang);
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.POLITICAL_PARTIES);

  if (!dictionary) {
    return null;
  }

  const tabs = [
    {
      key: TAB_KEYS.POLITICAL_PARTIES,
      label: "Parties",
    },
    {
      key: TAB_KEYS.POLLS,
      label: dictionary?.components?.tabSwiper?.tabs?.polls,
    },
    {
      key: TAB_KEYS.OPEN_LETTERS,
      label: dictionary?.components?.tabSwiper?.tabs?.openLetters,
    },
    {
      key: TAB_KEYS.ELECTIONS,
      label: dictionary?.components?.tabSwiper?.tabs?.elections,
    },
    {
      key: TAB_KEYS.REFERENDUMS,
      label: dictionary?.components?.tabSwiper?.tabs?.referendums,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case TAB_KEYS.POLITICAL_PARTIES:
        return (
          <>
            <SectionHeader
              title="Global Political Parties"
              description="Global political parties and movements"
            />
            <PoliticalPartyList lang={lang} />
            <DrawerItem title="Create a new party" isAddNew lang={lang} />
          </>
        );
      case TAB_KEYS.POLLS:
        return (
          <>
            <SectionHeader
              title={dictionary?.pages?.govern?.sections?.polls?.title}
              description={
                dictionary?.pages?.govern?.sections?.polls?.description
              }
            />
            <PollOfTheDay lang={lang} />
          </>
        );
      case TAB_KEYS.OPEN_LETTERS:
        return (
          <>
            <SectionHeader
              title={dictionary?.pages?.govern?.sections?.openLetters?.title}
              description={
                dictionary?.pages?.govern?.sections?.openLetters?.description
              }
            />
            <OpenLetterCard
              title={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.aiRisk?.title
              }
              referenceTitle={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.aiRisk?.referenceTitle
              }
              referenceUrl="https://www.safe.ai/work/statement-on-ai-risk"
              voteUrl="https://vote.one/kJc54AbK"
            />
            <OpenLetterCard
              title={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.nuclear?.title
              }
              referenceTitle={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.nuclear?.referenceTitle
              }
              referenceUrl="https://futureoflife.org/open-letter/nuclear-open-letter/"
              voteUrl="https://vote.one/w1MDn0Dt"
            />
            <OpenLetterCard
              title={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.autonomousWeapons?.title
              }
              referenceTitle={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.autonomousWeapons?.referenceTitle
              }
              referenceUrl="https://futureoflife.org/open-letter/lethal-autonomous-weapons-pledge/"
              voteUrl="https://vote.one/eASgdeUE"
            />
            <OpenLetterCard
              title={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.longView?.title
              }
              referenceTitle={
                dictionary?.pages?.govern?.sections?.openLetters?.statements
                  ?.longView?.referenceTitle
              }
              referenceUrl="https://futureoflife.org/open-letter/long-view-leadership-on-existential-threats/"
              voteUrl="https://vote.one/NtprLPWh"
            />
            <DrawerItem
              title={dictionary?.pages?.govern?.sections?.openLetters?.addNew}
              isAddNew
              lang={lang}
            />
          </>
        );
      case TAB_KEYS.ELECTIONS:
        return (
          <>
            <SectionHeader
              title={dictionary?.pages?.govern?.sections?.elections?.title}
              description={
                dictionary?.pages?.govern?.sections?.elections?.description
              }
            />
            <DrawerItem
              title={
                dictionary?.pages?.govern?.sections?.elections?.worldConstituent
                  ?.title
              }
              lang={lang}
            />
          </>
        );
      case TAB_KEYS.REFERENDUMS:
        return (
          <>
            <SectionHeader
              title={dictionary?.pages?.govern?.sections?.referendums?.title}
              description={
                dictionary?.pages?.govern?.sections?.referendums?.description
              }
            />
            <DrawerItem
              title={
                dictionary?.pages?.govern?.sections?.referendums
                  ?.worldConstitutional?.title
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
          {dictionary?.pages?.govern?.title}
        </Typography>

        <TabSwiper<TabKey>
          tabs={tabs}
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
