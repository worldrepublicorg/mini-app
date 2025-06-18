"use client";

import { useState, useEffect, useRef } from "react";
import { useParties } from "@/components/contexts/PartiesContext";
import { useTranslations } from "@/hooks/useTranslations";
import { PartyCard } from "./PartyCard";
import { PartySkeletonCard } from "@/components/PartySkeletons";
import { Typography } from "@/components/ui/Typography";
import { FaPlus } from "react-icons/fa";
import type { Party } from "@/lib/types";

type UserPartySectionProps = {
  lang: string;
  onJoin: (partyId: number) => Promise<void>;
  onLeave: (partyId: number) => Promise<void>;
  onManage: (party: Party) => void;
  onDelete: (party: Party) => void;
  onCreate: () => void;
};

export function UserPartySection({
  lang,
  onJoin,
  onLeave,
  onManage,
  onDelete,
  onCreate,
}: UserPartySectionProps) {
  const dictionary = useTranslations(lang);
  const { userPartyId, userPartyData, fetchPartyById, storeUserParty } =
    useParties();
  const [party, setParty] = useState<Party | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const prevPartyIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (
      containerRef.current &&
      containerRef.current.offsetHeight &&
      !containerHeight
    ) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
  }, [party, loading, containerHeight]);

  useEffect(() => {
    if (prevPartyIdRef.current === -1 && userPartyId > 0 && party) {
      setParty({ ...party, id: userPartyId });
      return;
    }
    prevPartyIdRef.current = userPartyId;
  }, [userPartyId, party]);

  useEffect(() => {
    const partyId = userPartyId;
    if (partyId <= 0) {
      setParty(null);
      setLoading(false);
      return;
    }

    if (partyId === -1 && userPartyData) {
      setParty(userPartyData);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const loadParty = async () => {
      let hasDisplayedData = false;
      try {
        const cachedPartyJson = localStorage.getItem(
          `user_party_details_${partyId}`
        );
        if (cachedPartyJson && !isCancelled) {
          const cachedParty = JSON.parse(cachedPartyJson);
          setParty(cachedParty);
          setLoading(false);
          hasDisplayedData = true;
        } else if (!isCancelled) {
          setLoading(true);
        }
      } catch (e) {
        console.error("Failed to parse cached party data", e);
        if (!isCancelled) setLoading(true);
      }

      try {
        const freshPartyData = await fetchPartyById(partyId);
        if (!isCancelled && freshPartyData) {
          const partyWithMemberFlag = { ...freshPartyData, isUserMember: true };
          setParty((currentParty) => {
            if (
              JSON.stringify(currentParty) !==
              JSON.stringify(partyWithMemberFlag)
            ) {
              localStorage.setItem(
                `user_party_details_${partyId}`,
                JSON.stringify(partyWithMemberFlag)
              );
              storeUserParty(partyWithMemberFlag);
              return partyWithMemberFlag;
            }
            return currentParty;
          });
        }
      } catch (error) {
        console.error("Error fetching user party:", error);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadParty();

    return () => {
      isCancelled = true;
    };
  }, [userPartyId, userPartyData, fetchPartyById, storeUserParty]);

  const handleLeave = async (partyId: number) => {
    setIsProcessing(true);
    try {
      await onLeave(partyId);
    } finally {
      setIsProcessing(false);
    }
  };

  const t = dictionary?.components?.politicalPartyList;

  if (!userPartyId && loading) {
    return <PartySkeletonCard showPendingNote={true} />;
  }

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <Typography
          as="h2"
          variant={{ variant: "subtitle", level: 1 }}
          className="text-[19px] font-semibold"
        >
          {t?.myParty}
        </Typography>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-900"
          onClick={onCreate}
          title={t?.createParty}
        >
          <FaPlus className="text-gray-500" size={12} />
        </button>
      </div>

      <div
        ref={containerRef}
        style={
          containerHeight ? { minHeight: `${containerHeight}px` } : undefined
        }
      >
        {loading && <PartySkeletonCard showPendingNote={true} />}
        {!loading && party && (
          <PartyCard
            party={party}
            lang={lang}
            userPartyId={userPartyId}
            isMyParty={true}
            onJoin={onJoin}
            onLeave={handleLeave}
            onManage={onManage}
            onDelete={onDelete}
            isProcessing={isProcessing}
          />
        )}
        {!loading && !party && (
          <div className="p-4 text-center text-gray-500">{t?.noParty}</div>
        )}
      </div>
    </div>
  );
}
