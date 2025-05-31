"use client";

import { Input } from "@worldcoin/mini-apps-ui-kit-react";
import { TabSwiper } from "@/components/TabSwiper";
import { Typography } from "@/components/ui/Typography";
import { LoadingSkeleton, PartySkeletonCard } from "./PartySkeletons";
import { useTranslations } from "@/hooks/useTranslations";
import { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { Party } from "@/lib/types";
import { parseAbi } from "viem";
import { useParties } from "@/components/contexts/PartiesContext";
import { useToast } from "@/components/ui/Toast";
import { viemClient } from "@/lib/viemClient";
import { useWallet } from "@/components/contexts/WalletContext";
import { PiInfoFill, PiLinkSimpleBold } from "react-icons/pi";
import { PiUsersBold } from "react-icons/pi";
import Link from "next/link";
import { Button } from "./ui/Button";
import { Drawer, DrawerContent, DrawerTitle } from "./ui/Drawer";
import { DrawerHeader } from "@worldcoin/mini-apps-ui-kit-react";

const POLITICAL_PARTY_REGISTRY_ADDRESS: string =
  "0x70a993E1D1102F018365F966B5Fc009e8FA9b7dC";

export function PartyDiscoveryList({ lang }: { lang: string }) {
  const dictionary = useTranslations(lang);
  const { walletAddress } = useWallet();
  const {
    activeParties,
    pendingParties,
    activeLoading,
    pendingLoading,
    fetchActiveParties,
    fetchPendingParties,
    shuffledActiveParties,
    userPartyId,
    setUserPartyId,
    setParties,
    storeUserParty,
  } = useParties();
  const [activeTab, setActiveTab] = useState<
    "top" | "trending" | "new" | "pending"
  >("new");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayCount, setDisplayCount] = useState<number>(20);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [partyToLeaveFrom, setPartyToLeaveFrom] = useState<Party | null>(null);
  const [isLeaveConfirmDrawerOpen, setIsLeaveConfirmDrawerOpen] =
    useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPartyFromBlockchain = async (
    partyId: number
  ): Promise<Party | null> => {
    try {
      const partyDetails = await viemClient.readContract({
        address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
        abi: parseAbi([
          "function getPartyDetails(uint256 _partyId) view returns (string memory name, string memory shortName, string memory description, string memory officialLink, address founder, address currentLeader, uint256 creationTime, uint8 status, uint256 memberCount, uint256 documentVerifiedMemberCount, uint256 verifiedMemberCount)",
        ]),
        functionName: "getPartyDetails",
        args: [BigInt(partyId)],
      });

      // Create a Party object from the blockchain data
      return {
        id: partyId,
        name: partyDetails[0],
        shortName: partyDetails[1],
        description: partyDetails[2],
        officialLink: partyDetails[3],
        founder: partyDetails[4],
        leader: partyDetails[5],
        creationTime: Number(partyDetails[6]),
        status: partyDetails[7],
        active: partyDetails[7] === 1,
        memberCount: Number(partyDetails[8]),
        documentVerifiedMemberCount: Number(partyDetails[9]),
        verifiedMemberCount: Number(partyDetails[10]),
        isUserMember: true, // Assuming this is the user's party
        isUserLeader:
          walletAddress?.toLowerCase() === partyDetails[5].toLowerCase(),
      };
    } catch (error) {
      console.error(`Error fetching party ${partyId} details:`, error);
      return null;
    }
  };

  useEffect(() => {
    console.log(
      "Component mounted, parties from context:",
      activeParties.length
    );

    // If no active parties loaded yet, fetch them
    if (activeParties.length === 0 && !activeLoading) {
      console.log("Fetching active parties on-demand");
      fetchActiveParties();
    }
  }, [activeParties.length, activeLoading, fetchActiveParties]);

  // Fetch pending parties when tab changes to "pending"
  useEffect(() => {
    if (
      activeTab === "pending" &&
      pendingParties.length === 0 &&
      !pendingLoading
    ) {
      console.log("Fetching pending parties on-demand");
      fetchPendingParties();
    }
  }, [activeTab, pendingParties.length, pendingLoading, fetchPendingParties]);

  useEffect(() => {
    // Initialize the intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Load more items when the load more element comes into view
          setDisplayCount((prevCount) => prevCount + 20);
        }
      },
      { threshold: 0.1 }
    );

    // Start observing the load more element
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    // Cleanup the observer when component unmounts
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Reset display count when changing tabs or search
  useEffect(() => {
    setDisplayCount(20);
  }, [activeTab, searchTerm]);

  // Add a debounced show/hide function to prevent flickering during scroll
  const [isButtonReady, setIsButtonReady] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      // Show button when user has scrolled down 300px from the top
      const shouldShow = window.scrollY > 300;
      setShowScrollToTop(shouldShow);

      // If we're hiding the button, mark it as ready immediately
      // If showing, delay the "ready" state to avoid touch conflicts
      if (!shouldShow) {
        setIsButtonReady(true);
      } else if (shouldShow && !isButtonReady) {
        // Small delay to ensure the button is fully rendered and ready for touch
        const readyTimer = setTimeout(() => {
          setIsButtonReady(true);
        }, 300);
        return () => clearTimeout(readyTimer);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isButtonReady]);

  // Function to scroll back to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const shortenUrl = (url: string, maxLength = 64) => {
    if (!url) return "";

    try {
      // Remove protocol (http://, https://)
      let cleanUrl = url.replace(/^https?:\/\//, "");
      // Remove www. if present
      cleanUrl = cleanUrl.replace(/^www\./, "");
      // Remove trailing slash
      cleanUrl = cleanUrl.replace(/\/$/, "");

      // If the URL is already shorter than maxLength, return it as is
      if (cleanUrl.length <= maxLength) return cleanUrl;

      if (cleanUrl.length <= maxLength) {
        return cleanUrl;
      }

      // If domain itself is too long, truncate with ellipsis
      return cleanUrl.substring(0, maxLength - 3) + "...";
    } catch (e) {
      return url;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (Math.round(num / 10000) / 100).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (Math.round(num / 10) / 100).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Calculate sorted parties for each tab type
  const sortedPartiesByTab = useMemo(() => {
    console.log("Recalculating sortedPartiesByTab with context data");
    const partyLists: Record<string, Party[]> = {
      new: shuffledActiveParties, // Use pre-shuffled parties from context
      trending: [],
      top: [],
      pending: pendingParties,
    };

    // Sort active parties for "top" tab (highest member count first)
    partyLists.top = [...activeParties].sort(
      (a, b) => b.memberCount - a.memberCount
    );

    // Sort active parties for "trending" tab (custom formula + minimum 10 members)
    partyLists.trending = [...activeParties]
      .filter((party) => party.memberCount >= 10)
      .sort((a, b) => {
        const trendingScoreA = a.id / 10 + Math.sqrt(a.memberCount);
        const trendingScoreB = b.id / 10 + Math.sqrt(b.memberCount);
        return trendingScoreB - trendingScoreA;
      });

    return partyLists;
  }, [activeParties, pendingParties, shuffledActiveParties]);

  // Filter parties based on search term when needed
  const filteredParties = useMemo(() => {
    const baseParties = sortedPartiesByTab[activeTab] || [];

    // If no search term, return the pre-sorted list
    if (searchTerm.trim() === "") {
      return baseParties;
    }

    // Otherwise, filter by search term
    const searchLower = searchTerm.toLowerCase();
    return baseParties.filter(
      (party) =>
        party.name.toLowerCase().includes(searchLower) ||
        party.shortName.toLowerCase().includes(searchLower) ||
        party.description.toLowerCase().includes(searchLower)
    );
  }, [activeTab, searchTerm, sortedPartiesByTab]);

  // Get only the parties to display based on the current display count
  const partiesToDisplay = useMemo(() => {
    return filteredParties.slice(0, displayCount);
  }, [filteredParties, displayCount]);

  // When filteredParties or displayCount changes, make sure intersection observer updates
  useEffect(() => {
    // Reset the observer when the displayed items change
    if (loadMoreRef.current && observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [partiesToDisplay.length]);

  const joinParty = async (partyId: number) => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    // Use userPartyId directly instead of finding in the array
    if (userPartyId > 0) {
      // Get party details from parties array for the drawer
      const userCurrentParty = activeParties.find(
        (party) => party.id === userPartyId
      );

      if (userCurrentParty) {
        setPartyToLeaveFrom(userCurrentParty);
        setIsLeaveConfirmDrawerOpen(true);
        return;
      } else {
        // If party not in parties array, fetch it directly from blockchain
        const fetchedParty = await fetchPartyFromBlockchain(userPartyId);

        if (fetchedParty) {
          setPartyToLeaveFrom(fetchedParty);
          setIsLeaveConfirmDrawerOpen(true);
        } else {
          // If fetch fails, proceed with joining new party
          joinNewParty(partyId);
        }
        return;
      }
    }

    // If not in a party, directly join the new party
    joinNewParty(partyId);
  };

  // Helper function to handle the actual joining logic
  const joinNewParty = async (partyId: number) => {
    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
            abi: parseAbi(["function joinParty(uint256 _partyId) external"]),
            functionName: "joinParty",
            args: [BigInt(partyId)],
          },
        ],
      });

      if (finalPayload.status !== "error") {
        // Find the party in the current parties list
        const partyToJoin = [...activeParties, ...pendingParties].find(
          (party) => party.id === partyId
        );

        // Only update optimistically after user confirms transaction
        setParties((prevParties: Party[]) =>
          prevParties.map((party: Party) =>
            party.id === partyId
              ? {
                  ...party,
                  isUserMember: true,
                  memberCount: party.memberCount + 1,
                }
              : party
          )
        );

        // If we have the party data, store it directly in context
        if (partyToJoin) {
          const partyWithMemberFlag = {
            ...partyToJoin,
            isUserMember: true,
            memberCount: partyToJoin.memberCount + 1,
          };
          storeUserParty(partyWithMemberFlag);
        }

        setUserPartyId(partyId);

        // Update user party cache
        localStorage.setItem(
          "userPartyCache",
          JSON.stringify({
            partyId: partyId,
            isLeader: false,
            partyStatus: 1, // ACTIVE
            timestamp: Date.now(),
          })
        );
      }
    } catch (error) {
      console.error("Error joining party:", error);
      showToast("Error joining party", "error");
      // Reset context and localStorage to avoid stale state
      setUserPartyId(0);
      storeUserParty(null);
      localStorage.removeItem("userPartyCache");
      localStorage.removeItem("optimisticParty");
    }
  };
  const leaveParty = async (partyId: number) => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
            abi: parseAbi(["function leaveParty(uint256 _partyId) external"]),
            functionName: "leaveParty",
            args: [BigInt(partyId)],
          },
        ],
      });

      if (finalPayload.status !== "error") {
        // Only update optimistically after user confirms transaction
        setParties((prevParties: Party[]) =>
          prevParties.map((party: Party) =>
            party.id === partyId
              ? {
                  ...party,
                  isUserMember: false,
                  memberCount:
                    party.memberCount > 0 ? party.memberCount - 1 : 0,
                }
              : party
          )
        );
        setUserPartyId(0);

        // Clear user party cache
        localStorage.removeItem("userPartyCache");
      }
    } catch (error) {
      console.error("Error leaving party:", error);
      showToast("Error leaving party", "error");
    }
  };

  const handleLeave = async () => {
    if (partyToLeaveFrom) {
      try {
        setIsProcessing(true);

        // First call leaveParty function which includes its own UI updates
        await leaveParty(partyToLeaveFrom.id);

        // Close drawer after transaction is sent
        setIsLeaveConfirmDrawerOpen(false);
      } catch (error) {
        console.error("Error leaving party:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const renderPartyCard = (party: Party) => (
    <>
      {party.isUserLeader && party.status === 0 && (
        <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-700">
          <div className="flex items-start gap-2">
            <PiInfoFill className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
            <Typography
              variant={{ variant: "body", level: 3 }}
              className="text-gray-600"
            >
              {dictionary?.components?.politicalPartyList?.approvalNote}
            </Typography>
          </div>
        </div>
      )}

      <div
        key={party.id}
        className={`${
          filteredParties.indexOf(party) !== filteredParties.length - 1
            ? "mb-4"
            : ""
        } rounded-xl border border-gray-200 p-4`}
      >
        <div className="flex items-center justify-between">
          <Link href={`/${lang}/govern/party/${party.id}`} className="flex-1">
            <Typography
              as="h3"
              variant={{ variant: "subtitle", level: 1 }}
              className="text-[19px] font-semibold"
            >
              {party.name}
            </Typography>
          </Link>
          <div className="flex items-center gap-2">
            {party.status === 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                {dictionary?.components?.politicalPartyList?.partyCard?.pending}
              </span>
            )}
            {party.status === 2 && (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                {dictionary?.components?.politicalPartyList?.partyCard?.deleted}
              </span>
            )}
          </div>
        </div>

        <Link href={`/${lang}/govern/party/${party.id}`}>
          <Typography
            as="p"
            variant={{ variant: "body", level: 2 }}
            className="mt-3 text-[15px] text-gray-700"
          >
            {party.description}
          </Typography>
        </Link>

        <div className="mt-2 flex justify-between gap-1">
          <div className="flex items-center gap-1">
            <PiLinkSimpleBold className="text-gray-500" size={15} />
            <a
              href={
                party.officialLink.startsWith("http")
                  ? party.officialLink
                  : `https://${party.officialLink}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="-m-1 flex rounded-md px-1 py-1 transition-colors"
              title={party.officialLink}
            >
              <Typography
                variant={{ variant: "caption", level: 1 }}
                className="max-w-[calc(100dvw/2-56px)] truncate text-[15px] text-[#0A66C2]"
              >
                {shortenUrl(party.officialLink)}
              </Typography>
            </a>
          </div>
          <div className="flex items-center gap-1">
            <PiUsersBold className="text-gray-500" size={15} />
            <Typography
              as="span"
              variant={{ variant: "caption", level: 1 }}
              className="text-[15px] font-semibold"
              title={party.memberCount.toString()}
            >
              {formatNumber(party.memberCount)}
            </Typography>
            <Typography
              as="span"
              variant={{ variant: "caption", level: 1 }}
              className="text-[15px] text-gray-500"
            >
              {dictionary?.components?.politicalPartyList?.partyCard?.members}
            </Typography>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {party.id === userPartyId ? (
            <Button
              className="px-6"
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => leaveParty(party.id)}
            >
              {
                dictionary?.components?.politicalPartyList?.partyCard?.actions
                  ?.leaveParty
              }
            </Button>
          ) : (
            <Button
              className="px-6"
              variant={party.status === 1 ? "primary" : "secondary"}
              size="sm"
              fullWidth
              onClick={() => joinParty(party.id)}
            >
              {party.status === 0
                ? dictionary?.components?.politicalPartyList?.partyCard?.actions
                    ?.joinPendingParty
                : dictionary?.components?.politicalPartyList?.partyCard?.actions
                    ?.joinParty}
            </Button>
          )}
        </div>
      </div>
    </>
  );

  if (activeLoading && activeTab !== "pending") {
    return <LoadingSkeleton dictionary={dictionary} />;
  }

  return (
    <div className="w-full overflow-x-hidden">
      <Typography
        as="h2"
        variant={{ variant: "subtitle", level: 1 }}
        className="mb-3 text-[19px] font-semibold"
      >
        {dictionary?.components?.politicalPartyList?.discover}
      </Typography>

      {/* Search bar */}
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
          />
        </div>
      </div>

      {/* Tabs */}
      <TabSwiper
        tabs={[
          {
            key: "new",
            label: dictionary?.components?.politicalPartyList?.tabs?.new,
          },
          {
            key: "trending",
            label: dictionary?.components?.politicalPartyList?.tabs?.trending,
          },
          {
            key: "top",
            label: dictionary?.components?.politicalPartyList?.tabs?.top,
          },
          {
            key: "pending",
            label: dictionary?.components?.politicalPartyList?.tabs?.pending,
          },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* This div will contain the filtered parties with a minimum height */}
      <div className="min-h-[50vh]">
        {activeTab === "pending" && pendingLoading ? (
          // Show skeletons matching the initial display count
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <PartySkeletonCard key={i} />
            ))}
          </>
        ) : filteredParties.length === 0 ? (
          <div className="my-8 text-center text-gray-500">
            {activeTab === "pending"
              ? dictionary?.components?.politicalPartyList?.emptyState?.pending
              : dictionary?.components?.politicalPartyList?.emptyState
                  ?.noParties}
          </div>
        ) : (
          <>
            {/* Only render the parties that should be displayed */}
            {partiesToDisplay.map((party) => renderPartyCard(party))}

            {/* Loading footer - becomes visible when user scrolls down */}
            {filteredParties.length > displayCount && (
              <div ref={loadMoreRef} className="h-14 py-4 text-center">
                <div className="border-t-primary inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300"></div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Leave Confirmation Drawer */}
      <Drawer
        open={isLeaveConfirmDrawerOpen}
        onOpenChange={setIsLeaveConfirmDrawerOpen}
      >
        <DrawerContent>
          <div className="flex flex-col p-6">
            <DrawerHeader>
              <DrawerTitle>
                {
                  dictionary?.components?.politicalPartyList?.drawers?.leave
                    ?.title
                }
              </DrawerTitle>
            </DrawerHeader>
            <Typography
              as="p"
              variant={{ variant: "body", level: 2 }}
              className="mx-auto mt-4 text-center"
            >
              {dictionary?.components?.politicalPartyList?.drawers?.leave?.description.replace(
                "{{partyName}}",
                partyToLeaveFrom?.name || ""
              )}
              {partyToLeaveFrom?.isUserLeader && (
                <>
                  <br />
                  <br />
                  <div className="text-error-600">
                    {
                      dictionary?.components?.politicalPartyList?.drawers?.leave
                        ?.leaderWarning
                    }
                  </div>
                </>
              )}
            </Typography>
            <Button
              variant="primary"
              fullWidth
              onClick={handleLeave}
              disabled={isProcessing}
              className="mt-10"
            >
              {isProcessing
                ? dictionary?.components?.politicalPartyList?.drawers?.leave
                    ?.button?.leaving
                : dictionary?.components?.politicalPartyList?.drawers?.leave?.button?.leave.replace(
                    "{{partyShortName}}",
                    partyToLeaveFrom?.shortName || ""
                  )}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Scroll to top button container - always present */}
      <div
        className="mb-safe fixed right-4 z-50 h-12 w-12"
        style={{ bottom: "16px" }}
      >
        {/* Button with transition */}
        <button
          onClick={scrollToTop}
          onTouchStart={() => {
            // Ensure button is fully interactive
            if (isButtonReady) {
              // Trigger scroll on touchstart for more responsive feel
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }}
          className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 shadow-lg transition-opacity duration-300 ${
            showScrollToTop && isButtonReady
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-label={
            dictionary?.components?.politicalPartyList?.scrollToTop ||
            "Scroll to top"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
