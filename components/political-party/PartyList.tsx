"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import type { FocusEvent as ReactFocusEvent } from "react";
import { useParties } from "@/components/contexts/PartiesContext";
import { useTranslations } from "@/hooks/useTranslations";
import { TabSwiper } from "@/components/TabSwiper";
import { Input } from "@worldcoin/mini-apps-ui-kit-react";
import { PartyCard } from "./PartyCard";
import { PartySkeletonCard } from "@/components/PartySkeletons";
import type { Party } from "@/lib/types";

type PartyListProps = {
  lang: string;
  onJoin: (partyId: number) => Promise<void>;
  onLeave: (partyId: number) => Promise<void>;
  onManage: (party: Party) => void;
  onDelete: (party: Party) => void;
};

export function PartyList({
  lang,
  onJoin,
  onLeave,
  onManage,
  onDelete,
}: PartyListProps) {
  const dictionary = useTranslations(lang);
  const {
    activeParties,
    pendingParties,
    pendingLoading,
    userPartyId,
    shuffledActiveParties,
    fetchPendingParties,
  } = useParties();

  const [activeTab, setActiveTab] = useState<
    "top" | "trending" | "new" | "pending"
  >("new");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      activeTab === "pending" &&
      pendingParties.length === 0 &&
      !pendingLoading
    ) {
      fetchPendingParties();
    }
  }, [activeTab, pendingParties.length, pendingLoading, fetchPendingParties]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setDisplayCount((prevCount) => prevCount + 20);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    setDisplayCount(20);
  }, [activeTab, searchTerm]);

  const sortedPartiesByTab = useMemo(() => {
    const partyLists: Record<string, Party[]> = {
      new: shuffledActiveParties,
      trending: [],
      top: [],
      pending: pendingParties,
    };
    partyLists.top = [...activeParties].sort(
      (a, b) => b.memberCount - a.memberCount
    );
    partyLists.trending = [...activeParties]
      .filter((party) => party.memberCount >= 10)
      .sort((a, b) => {
        const trendingScoreA = a.id / 10 + Math.sqrt(a.memberCount);
        const trendingScoreB = b.id / 10 + Math.sqrt(b.memberCount);
        return trendingScoreB - trendingScoreA;
      });
    return partyLists;
  }, [activeParties, pendingParties, shuffledActiveParties]);

  const filteredParties = useMemo(() => {
    const baseParties = sortedPartiesByTab[activeTab] || [];
    if (searchTerm.trim() === "") return baseParties;
    const searchLower = searchTerm.toLowerCase();
    return baseParties.filter(
      (party) =>
        party.name.toLowerCase().includes(searchLower) ||
        party.shortName.toLowerCase().includes(searchLower) ||
        party.description.toLowerCase().includes(searchLower)
    );
  }, [activeTab, searchTerm, sortedPartiesByTab]);

  const partiesToDisplay = useMemo(() => {
    return filteredParties.slice(0, displayCount);
  }, [filteredParties, displayCount]);

  useEffect(() => {
    if (loadMoreRef.current && observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [partiesToDisplay.length]);

  const handleAction = async (action: Promise<void>) => {
    setIsProcessing(true);
    try {
      await action;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputFocus = (e: ReactFocusEvent) => {
    e.preventDefault();
    if (
      e.target &&
      (e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement)
    ) {
      setTimeout(() => {
        (e.target as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  };

  const t = dictionary?.components?.politicalPartyList;

  return (
    <>
      <div className="mb-3">
        <div className="relative h-[3.125rem]">
          <Input
            type="text"
            startAdornment={
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            }
            label="Search parties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
          />
        </div>
      </div>

      <TabSwiper
        tabs={[
          { key: "new", label: t?.tabs?.new },
          { key: "trending", label: t?.tabs?.trending },
          { key: "top", label: t?.tabs?.top },
          { key: "pending", label: t?.tabs?.pending },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="min-h-[50vh]">
        {activeTab === "pending" && pendingLoading ? (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <PartySkeletonCard key={i} />
            ))}
          </>
        ) : filteredParties.length === 0 ? (
          <div className="my-8 text-center text-gray-500">
            {activeTab === "pending"
              ? t?.emptyState?.pending
              : t?.emptyState?.noParties}
          </div>
        ) : (
          <>
            {partiesToDisplay.map((party) => (
              <PartyCard
                key={party.id}
                party={party}
                lang={lang}
                userPartyId={userPartyId}
                onJoin={(id) => handleAction(onJoin(id))}
                onLeave={(id) => handleAction(onLeave(id))}
                onManage={onManage}
                onDelete={onDelete}
                isProcessing={isProcessing}
              />
            ))}
            {filteredParties.length > displayCount && (
              <div ref={loadMoreRef} className="h-14 py-4 text-center">
                <div className="border-t-primary inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300"></div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
