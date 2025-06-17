"use client";

import { useState, useEffect } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import { useWallet } from "@/components/contexts/WalletContext";
import { useParties } from "@/components/contexts/PartiesContext";
import { useToast } from "@/components/ui/Toast";
import { BiChevronLeft, BiShareAlt, BiChevronUp } from "react-icons/bi";
import {
  PiUserFocusBold,
  PiLinkSimpleBold,
  PiInfoFill,
  PiCheckCircleBold,
  PiClockClockwiseBold,
  PiProhibitBold,
} from "react-icons/pi";
import { MiniKit } from "@worldcoin/minikit-js";
import { parseAbi } from "viem";
import { useRouter } from "next/navigation";
import type { PartyDetail } from "@/lib/types";
import { PartyStatus } from "@/lib/types";

// Contract address
const POLITICAL_PARTY_REGISTRY_ADDRESS =
  "0x70a993E1D1102F018365F966B5Fc009e8FA9b7dC";

export default function PartyDetailPage({
  params: { lang, id },
}: {
  params: { lang: string; id: string };
}) {
  const dictionary = useTranslations(lang);
  const { walletAddress } = useWallet();
  const { showToast } = useToast();
  const router = useRouter();
  const {
    fetchPartyById,
    activeParties,
    pendingParties,
    setUserPartyId,
    setParties,
    userPartyId,
  } = useParties();

  const [party, setParty] = useState<PartyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUserMember, setIsUserMember] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [leaderUsername, setLeaderUsername] = useState<string | null>(null);
  const [partyMembers, setPartyMembers] = useState<{ address: string }[]>([]);
  const [bannedMembers, setBannedMembers] = useState<{ address: string }[]>([]);

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get status text
  const getStatusText = (status: number) => {
    switch (status) {
      case PartyStatus.PENDING:
        return dictionary?.components?.politicalPartyList?.status?.pending;
      case PartyStatus.ACTIVE:
        return dictionary?.components?.politicalPartyList?.status?.active;
      case PartyStatus.INACTIVE:
        return dictionary?.components?.politicalPartyList?.status?.inactive;
      default:
        return "Unknown";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <PiClockClockwiseBold className="text-gray-700" />;
      case "Active":
        return <PiCheckCircleBold className="text-gray-700" />;
      case "Inactive":
        return <PiProhibitBold className="text-gray-700" />;
      default:
        return <PiInfoFill className="text-gray-700" />;
    }
  };

  // Fetch leader username from address
  const fetchLeaderUsername = async (
    address: string
  ): Promise<string | null> => {
    if (!address) return null;

    try {
      // First try MiniKit if available
      if (MiniKit.isInstalled()) {
        try {
          const userInfo = await MiniKit.getUserByAddress(address);
          if (userInfo && userInfo.username) {
            console.log(
              "[Leader] Found username via MiniKit:",
              userInfo.username
            );
            return userInfo.username;
          }
        } catch (miniKitError) {
          console.error(
            "[Leader] Error with MiniKit getUserByAddress:",
            miniKitError
          );
        }
      }

      // Fall back to the API
      try {
        const response = await fetch(
          `https://usernames.worldcoin.org/api/v1/${address}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("[Leader] Username response:", data);
          if (data.username) {
            return data.username;
          }
        } else {
          console.log("[Leader] No username found for address:", address);
        }
      } catch (error) {
        console.error("[Leader] Error fetching username from API:", error);
      }
    } catch (error) {
      console.error("[Leader] Error in fetchLeaderUsername:", error);
    }

    return null;
  };

  // Fetch party data and leader username
  useEffect(() => {
    // Move fetchPartyMembers here
    const fetchPartyMembers = async (partyId: number) => {
      try {
        // GraphQL endpoint
        const GOLDSKY_SUBGRAPH_URL =
          "https://api.goldsky.com/api/public/project_cm9oeq0bhalzw01y0hwth80bk/subgraphs/political-party-registry/1.0.0/gn";

        // GraphQL query for members
        const query = `
          {
            parties(where: {id: ${partyId}}) {
              members(first: 1000, where: {isActive: true}) {
                address
              }
              bannedMembers(first: 1000) {
                address
              }
            }
          }
        `;

        // Fetch data
        const response = await fetch(GOLDSKY_SUBGRAPH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`Subgraph request failed: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.errors) {
          throw new Error(
            `GraphQL errors: ${result.errors.map((e: any) => e.message).join(", ")}`
          );
        }

        if (!result.data.parties || result.data.parties.length === 0) {
          throw new Error("Party members not found");
        }

        const partyData = result.data.parties[0];
        setPartyMembers(partyData.members || []);
        setBannedMembers(partyData.bannedMembers || []);

        // Check if user is a member based on the member list
        if (walletAddress) {
          const isMember = partyData.members.some(
            (member: { address: string }) =>
              member.address.toLowerCase() === walletAddress.toLowerCase()
          );
          setIsUserMember(isMember);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    const fetchData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);

        // First try to find the party in the context cache
        const partyId = parseInt(id);
        const cachedParty = [...activeParties, ...pendingParties].find(
          (p) => p.id === partyId
        );

        let currentParty: PartyDetail | null = null;

        // If found in cache, use it
        if (cachedParty) {
          console.log("Found party in context cache:", cachedParty);
          currentParty = {
            ...cachedParty,
            currentLeader: cachedParty.leader || "",
            members: [],
            bannedMembers: [],
          };
          setParty(currentParty);
          setIsUserMember(cachedParty.isUserMember || false);

          // For cache hits, we still need to fetch members via GraphQL
          fetchPartyMembers(partyId);
        } else {
          // If not in cache, fetch from blockchain
          console.log("Fetching party from blockchain");
          const fetchedParty = await fetchPartyById(partyId);

          if (!fetchedParty) {
            throw new Error("Party not found");
          }

          currentParty = {
            ...fetchedParty,
            currentLeader: fetchedParty.leader || "",
            members: [],
            bannedMembers: [],
          };
          setParty(currentParty);
          setIsUserMember(fetchedParty.isUserMember || false);

          // For non-cache hits, we need to fetch members
          fetchPartyMembers(partyId);
        }

        // Fetch username for the leader
        if (
          currentParty &&
          (currentParty.currentLeader || currentParty.leader)
        ) {
          const leaderAddress =
            currentParty.currentLeader || currentParty.leader;
          if (leaderAddress) {
            const username = await fetchLeaderUsername(leaderAddress);
            setLeaderUsername(username);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load party data"
        );
        showToast("Failed to load party data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    id,
    walletAddress,
    showToast,
    fetchPartyById,
    activeParties,
    pendingParties,
  ]);

  // Join party function
  const joinParty = async () => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    if (!party) {
      showToast("Party not found", "error");
      return;
    }

    if (userPartyId > 0) {
      showToast(
        "Please leave your current party before joining another one",
        "error"
      );
      return;
    }

    try {
      setIsJoining(true);

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
            abi: parseAbi(["function joinParty(uint256 _partyId) external"]),
            functionName: "joinParty",
            args: [BigInt(party.id)],
          },
        ],
      });

      if (finalPayload.status !== "error") {
        // Update local state
        setIsUserMember(true);

        // Update the context
        setUserPartyId(party.id);

        // Update the parties array in context
        setParties((prevParties: any) =>
          prevParties.map((p: any) =>
            p.id === party.id
              ? {
                  ...p,
                  isUserMember: true,
                  memberCount: p.memberCount + 1,
                }
              : p
          )
        );

        // Update user party cache in localStorage
        localStorage.setItem(
          "userPartyCache",
          JSON.stringify({
            partyId: party.id,
            isLeader: false,
            partyStatus: party.status,
            timestamp: Date.now(),
          })
        );

        showToast("Successfully joined the party", "success");
      } else if (finalPayload.error_code !== "user_rejected") {
        showToast("Failed to join party", "error");
      }
    } catch (error) {
      console.error("Error joining party:", error);
      showToast("Error joining party", "error");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="pb-safe flex min-h-dvh flex-col px-6">
      <div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6">
        <div className="relative flex items-center justify-center py-6">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push(`/${lang}/govern`);
              }
            }}
            className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
            aria-label="Back"
          >
            <BiChevronLeft className="size-6 text-gray-500" />
          </button>
          <Typography
            as="h2"
            variant={{ variant: "heading", level: 3 }}
            className="mx-12 text-center"
          >
            {dictionary?.components?.politicalPartyList?.partyDetails}
          </Typography>
          {party && (
            <button
              onClick={async () => {
                const shareUrl = `https://world.org/mini-app?app_id=app_66c83ab8c851fb1e54b1b1b62c6ce39d&path=%2Fgovern%2Fparty%2F${party.id}`;
                const shareTitle = party.name;

                // Check if Web Share API is supported
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: shareTitle,
                      url: shareUrl,
                    });
                  } catch (error) {
                    // User cancelled or share failed - fallback to clipboard
                    if (error instanceof Error && error.name !== "AbortError") {
                      await navigator.clipboard.writeText(shareUrl);
                      showToast(
                        dictionary?.components?.politicalPartyList?.copied,
                        "success"
                      );
                    }
                  }
                } else {
                  // Fallback for browsers that don't support Web Share API
                  await navigator.clipboard.writeText(shareUrl);
                  showToast(
                    dictionary?.components?.politicalPartyList?.copied,
                    "success"
                  );
                }
              }}
              className="absolute right-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
              aria-label={
                dictionary?.components?.politicalPartyList?.shareParty
              }
            >
              <BiShareAlt className="size-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-24 flex flex-1 flex-col pb-6">
        {isLoading ? (
          // Loading state
          <div className="flex flex-1 flex-col">
            {/* Hero section skeleton */}
            <div className="mb-10 flex flex-col items-center">
              <div className="mb-3 h-8 w-3/4 animate-pulse rounded-lg bg-gray-100"></div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100"></div>
                <div className="h-6 w-24 animate-pulse rounded-full bg-gray-100"></div>
              </div>
            </div>

            {/* Description skeleton */}
            <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-0 p-4">
                <div className="h-6 w-5/12 animate-pulse rounded bg-gray-100"></div>
              </div>
              <div className="p-4">
                <div className="h-20 w-full animate-pulse rounded bg-gray-100"></div>
              </div>
            </div>

            {/* Party Info skeleton */}
            <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-0 p-4">
                <div className="h-6 w-1/4 animate-pulse rounded bg-gray-100"></div>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between gap-6 p-4">
                  <div className="h-5 w-1/3 animate-pulse rounded bg-gray-100"></div>
                  <div className="h-5 w-1/3 animate-pulse rounded bg-gray-100"></div>
                </div>
                <div className="flex items-center justify-between gap-6 p-4">
                  <div className="h-5 w-1/4 animate-pulse rounded bg-gray-100"></div>
                  <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100"></div>
                </div>
              </div>
            </div>

            {/* Members skeleton */}
            <div className="mb-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-0 p-4">
                <div className="h-6 w-1/3 animate-pulse rounded bg-gray-100"></div>
              </div>
              <div>
                <div className="border-b border-gray-100 p-4">
                  <div className="h-5 w-full animate-pulse rounded bg-gray-100"></div>
                </div>
                <div className="border-b border-gray-100 p-4">
                  <div className="h-5 w-full animate-pulse rounded bg-gray-100"></div>
                </div>
                <div className="p-4">
                  <div className="h-5 w-full animate-pulse rounded bg-gray-100"></div>
                </div>
              </div>
            </div>

            {/* CTA Button skeleton */}
            <div className="mt-auto">
              <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100"></div>
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="flex flex-1 flex-col items-center justify-center">
            <PiInfoFill className="h-16 w-16 text-gray-300" />
            <Typography
              variant={{ variant: "heading", level: 3 }}
              className="mt-4 text-center text-gray-900"
            >
              {dictionary?.components?.politicalPartyList?.errorLoading}
            </Typography>
            <Typography
              variant={{ variant: "body", level: 2 }}
              className="mt-2 text-center text-gray-500"
            >
              {error}
            </Typography>
            <Link href={`/${lang}/govern`}>
              <Button variant="secondary" className="mt-8">
                {dictionary?.components?.politicalPartyList?.backToParties}
              </Button>
            </Link>
          </div>
        ) : party ? (
          // Party details
          <>
            {/* Hero section */}
            <div className="mb-10 flex flex-col items-center">
              <Typography
                variant={{ variant: "heading", level: 2 }}
                className="mb-3 text-center text-gray-900"
              >
                {party?.name}
              </Typography>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {party?.shortName}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {getStatusIcon(getStatusText(party?.status || 0))}
                  {getStatusText(party?.status || 0)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-0 p-4">
                <Typography
                  as="h3"
                  variant={{ variant: "subtitle", level: 2 }}
                  className="text-gray-900"
                >
                  {dictionary?.components?.politicalPartyList?.description}
                </Typography>
              </div>
              <Typography
                variant={{ variant: "body", level: 3 }}
                className="p-4 text-gray-700"
              >
                {party?.description}
              </Typography>
            </div>

            {/* Party Info */}
            <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-0 p-4">
                <Typography
                  as="h3"
                  variant={{ variant: "subtitle", level: 2 }}
                  className="text-gray-900"
                >
                  {dictionary?.components?.politicalPartyList?.partyInfo}
                </Typography>
              </div>

              <div className="divide-y divide-gray-100">
                {/* Leader */}
                <div className="flex items-center justify-between gap-6 p-4">
                  <div className="flex items-center">
                    <PiUserFocusBold className="mr-3 h-5 w-5 text-gray-400" />
                    <Typography
                      variant={{ variant: "body", level: 3 }}
                      className="text-gray-700"
                    >
                      {dictionary?.components?.politicalPartyList?.leader}
                    </Typography>
                  </div>
                  <a
                    href={`https://worldchain-mainnet.explorer.alchemy.com/address/${party?.currentLeader}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography
                      variant={{ variant: "body", level: 3 }}
                      className="font-medium text-gray-900"
                    >
                      {leaderUsername ||
                        `${party?.currentLeader?.slice(0, 6)}...${party?.currentLeader?.slice(-4)}`}
                    </Typography>
                  </a>
                </div>

                {/* Website */}
                {party?.officialLink && (
                  <div className="flex items-center justify-between gap-6 p-4">
                    <div className="flex items-center">
                      <PiLinkSimpleBold className="mr-3 h-5 w-5 text-gray-400" />
                      <Typography
                        variant={{ variant: "body", level: 3 }}
                        className="text-gray-700"
                      >
                        {dictionary?.components?.politicalPartyList?.website}
                      </Typography>
                    </div>
                    <a
                      href={
                        party.officialLink.startsWith("http")
                          ? party.officialLink
                          : `https://${party.officialLink}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography
                        variant={{ variant: "body", level: 3 }}
                        className="line-clamp-1 break-all font-medium"
                        title={party?.officialLink}
                      >
                        {party?.officialLink}
                      </Typography>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Members count */}
            <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setShowAllMembers(!showAllMembers)}
                className="w-full"
              >
                <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-0 p-4">
                  <Typography
                    variant={{ variant: "subtitle", level: 2 }}
                    className="text-gray-900"
                  >
                    {dictionary?.components?.politicalPartyList?.members} (
                    {formatNumber(party?.memberCount || 0)})
                  </Typography>

                  {partyMembers.length > 3 && showAllMembers && (
                    <BiChevronUp className="size-[20px] text-gray-500 transition-transform duration-200" />
                  )}
                </div>
              </button>

              {partyMembers.length > 0 ? (
                <div>
                  {/* First 3 members always visible */}
                  {partyMembers.slice(0, 3).map((member, index, array) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between ${
                        showAllMembers
                          ? "border-b border-gray-100"
                          : index === array.length - 1
                            ? ""
                            : "border-b border-gray-100"
                      } p-4`}
                    >
                      <a
                        href={`https://worldchain-mainnet.explorer.alchemy.com/address/${member.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Typography
                          variant={{ variant: "body", level: 3 }}
                          className="line-clamp-1 break-all text-gray-900"
                        >
                          {member.address}
                        </Typography>
                      </a>
                    </div>
                  ))}

                  {/* Additional members shown conditionally */}
                  {showAllMembers &&
                    partyMembers.length > 3 &&
                    partyMembers.slice(3).map((member, index, array) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between ${
                          index === array.length - 1
                            ? ""
                            : "border-b border-gray-100"
                        } p-4`}
                      >
                        <a
                          href={`https://worldchain-mainnet.explorer.alchemy.com/address/${member.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Typography
                            variant={{ variant: "body", level: 3 }}
                            className="line-clamp-1 break-all text-gray-900"
                          >
                            {member.address}
                          </Typography>
                        </a>
                      </div>
                    ))}

                  {/* Show All button */}
                  {!showAllMembers && partyMembers.length > 3 && (
                    <div className="border-t border-gray-100 px-4">
                      <Button
                        variant="ghost"
                        fullWidth
                        onClick={() => setShowAllMembers(true)}
                        className="h-12 text-sm font-medium"
                      >
                        {
                          dictionary?.pages?.earn?.tabs?.contribute
                            ?.partySubsidy?.payouts?.showAll
                        }
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Typography
                  variant={{ variant: "body", level: 3 }}
                  className="text-center text-gray-500"
                >
                  {dictionary?.components?.politicalPartyList?.noMembers}
                </Typography>
              )}
            </div>

            {/* Banned Members */}
            {bannedMembers.length > 0 && (
              <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-0 p-4">
                  <Typography
                    as="h3"
                    variant={{ variant: "subtitle", level: 2 }}
                    className="text-gray-900"
                  >
                    {dictionary?.components?.politicalPartyList?.bannedMembers}
                  </Typography>
                </div>
                <div className="max-h-56 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {bannedMembers.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                      >
                        <a
                          href={`https://worldchain-mainnet.explorer.alchemy.com/address/${member.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Typography
                            variant={{ variant: "body", level: 3 }}
                            className="line-clamp-1 break-all font-medium text-gray-900"
                          >
                            {member.address}
                          </Typography>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="mt-auto space-y-4">
              {isUserMember ? (
                <Button
                  fullWidth
                  onClick={async () => {
                    const shareUrl = `https://world.org/mini-app?app_id=app_66c83ab8c851fb1e54b1b1b62c6ce39d&path=%2Fgovern%2Fparty%2F${party?.id}`;
                    const shareTitle = party?.name;

                    // Check if Web Share API is supported
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: shareTitle,
                          url: shareUrl,
                        });
                      } catch (error) {
                        // User cancelled or share failed - fallback to clipboard
                        if (
                          error instanceof Error &&
                          error.name !== "AbortError"
                        ) {
                          await navigator.clipboard.writeText(shareUrl);
                          showToast(
                            dictionary?.components?.politicalPartyList?.copied,
                            "success"
                          );
                        }
                      }
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      await navigator.clipboard.writeText(shareUrl);
                      showToast(
                        dictionary?.components?.politicalPartyList?.copied,
                        "success"
                      );
                    }
                  }}
                >
                  {dictionary?.components?.politicalPartyList?.shareParty}
                </Button>
              ) : party?.status === PartyStatus.INACTIVE ? (
                <Link href={`/${lang}/govern`}>
                  <Button variant="secondary" fullWidth>
                    {dictionary?.components?.politicalPartyList?.backToParties}
                  </Button>
                </Link>
              ) : (
                <Button fullWidth onClick={joinParty} disabled={isJoining}>
                  {isJoining
                    ? dictionary?.components?.politicalPartyList?.joining
                    : dictionary?.components?.politicalPartyList?.joinParty}
                </Button>
              )}
            </div>
          </>
        ) : (
          // Not found state
          <div className="flex flex-1 flex-col items-center justify-center">
            <PiInfoFill className="h-16 w-16 text-gray-300" />
            <Typography
              variant={{ variant: "heading", level: 3 }}
              className="mt-4 text-center text-gray-900"
            >
              {dictionary?.components?.politicalPartyList?.partyNotFound}
            </Typography>
            <Typography
              variant={{ variant: "body", level: 2 }}
              className="mt-2 text-center text-gray-500"
            >
              {
                dictionary?.components?.politicalPartyList
                  ?.partyNotFoundDescription
              }
            </Typography>
            <Link href={`/${lang}/govern`}>
              <Button variant="secondary" className="mt-8">
                {dictionary?.components?.politicalPartyList?.backToParties}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
