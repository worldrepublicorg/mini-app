"use client";

import { useState, useEffect, useRef } from "react";
import { Typography } from "@/components/ui/Typography";
import { FaPlus } from "react-icons/fa";
import { useParties } from "@/components/contexts/PartiesContext";
import { useWallet } from "@/components/contexts/WalletContext";
import { useToast } from "@/components/ui/Toast";
import { PartySkeletonCard } from "./PartySkeletons";

interface Party {
  id: number;
  name: string;
  shortName: string;
  description: string;
  officialLink: string;
  founder: string;
  leader: string;
  memberCount: number;
  documentVerifiedMemberCount: number;
  verifiedMemberCount: number;
  creationTime: number;
  active: boolean;
  status: number; // 0: PENDING, 1: ACTIVE, 2: INACTIVE
  isUserMember?: boolean;
  isUserLeader?: boolean;
}

interface MyPartySectionProps {
  dictionary: any;
  renderPartyCard: (party: Party) => JSX.Element;
  handleCreatePartyClick: () => void;
}

export function MyPartySection({
  dictionary,
  renderPartyCard,
  handleCreatePartyClick,
}: MyPartySectionProps) {
  const { userPartyId, userPartyData, fetchPartyById, storeUserParty } =
    useParties();
  const { walletAddress } = useWallet();
  const { showToast } = useToast();

  const FetchUserParty = ({
    partyId,
    renderPartyCard,
    walletAddress,
    showToast,
  }: {
    partyId: number;
    renderPartyCard: (party: Party) => JSX.Element;
    walletAddress: string | null;
    showToast: (message: string, type: "success" | "error" | "info") => void;
  }) => {
    const [party, setParty] = useState<Party | null>(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Remember the height to prevent layout shifts during transitions
    const [containerHeight, setContainerHeight] = useState<number | null>(null);

    // Create a flag to prevent refetching after the first fetch
    const hasLoadedRef = useRef(false);
    // Track the previous party ID for smoother transitions
    const prevPartyIdRef = useRef<number | null>(null);

    // Set container height when content renders to prevent layout shifts
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
      // Special handling for transition from optimistic ID (-1) to real ID
      if (prevPartyIdRef.current === -1 && partyId > 0 && party) {
        // Just update the ID in the existing party object without re-fetching
        setParty({
          ...party,
          id: partyId,
        });
        hasLoadedRef.current = true;
        return;
      }

      // Regular case: only reset loading state if not in transition
      if (partyId !== -1 && !(party && party.id === -1 && partyId > 0)) {
        hasLoadedRef.current = false;
      }

      // Update the ref to track transitions
      prevPartyIdRef.current = partyId;
    }, [partyId, party]);

    useEffect(() => {
      const loadParty = async () => {
        // Skip if we already have data in local state or if we already loaded once
        if (party || hasLoadedRef.current) {
          return;
        }

        // Check if this is a temporary optimistic update
        if (partyId === -1 && userPartyData) {
          setParty(userPartyData);
          setLoading(false);
          hasLoadedRef.current = true;
          return;
        }

        // Check if we have the data in context first
        if (userPartyData && userPartyData.id === partyId) {
          setParty(userPartyData);
          setLoading(false);
          hasLoadedRef.current = true;
          return;
        }

        setLoading(true);
        try {
          const partyData = await fetchPartyById(partyId);
          if (partyData) {
            const partyWithMemberFlag = { ...partyData, isUserMember: true };
            setParty(partyWithMemberFlag);
            // Store in context for future use
            storeUserParty(partyWithMemberFlag);
            // Mark as loaded
            hasLoadedRef.current = true;
          }
        } catch (error) {
          console.error("Error fetching user party:", error);
          showToast("Failed to load your party", "error");
        } finally {
          setLoading(false);
        }
      };

      if (partyId > 0 || partyId === -1) {
        loadParty();
      }
      // Only depend on partyId which should remain stable
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partyId]);

    // Stable height container to prevent layout shifts
    return (
      <div
        ref={containerRef}
        style={
          containerHeight ? { minHeight: `${containerHeight}px` } : undefined
        }
      >
        {loading ? (
          <PartySkeletonCard showPendingNote={true} />
        ) : party ? (
          renderPartyCard(party)
        ) : null}
      </div>
    );
  };

  // If we have optimistic data or real data, show it
  if (userPartyId === -1 || userPartyId > 0) {
    return (
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <Typography
            as="h2"
            variant={{ variant: "subtitle", level: 1 }}
            className="text-[19px] font-semibold"
          >
            {dictionary?.components?.politicalPartyList?.myParty}
          </Typography>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-900"
            onClick={handleCreatePartyClick}
            title={dictionary?.components?.politicalPartyList?.createParty}
          >
            <FaPlus className="text-gray-500" size={12} />
          </button>
        </div>

        {userPartyId > 0 || userPartyId === -1 ? (
          // Always show the party card - either with real ID or temporary (-1) ID
          <FetchUserParty
            partyId={userPartyId}
            renderPartyCard={renderPartyCard}
            walletAddress={walletAddress}
            showToast={showToast}
          />
        ) : (
          // Only show this when user truly has no party
          <div className="p-4 text-center text-gray-500">
            {dictionary?.components?.politicalPartyList?.noParty}
          </div>
        )}
      </div>
    );
  }

  // Only show "no party" message when we're sure user has no party
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <Typography
          as="h2"
          variant={{ variant: "subtitle", level: 1 }}
          className="text-[19px] font-semibold"
        >
          {dictionary?.components?.politicalPartyList?.myParty}
        </Typography>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-900"
          onClick={handleCreatePartyClick}
          title={dictionary?.components?.politicalPartyList?.createParty}
        >
          <FaPlus className="text-gray-500" size={12} />
        </button>
      </div>

      <div className="p-4 text-center text-gray-500">
        {dictionary?.components?.politicalPartyList?.noParty}
      </div>
    </div>
  );
}
