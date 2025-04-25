"use client";

import { useState, useEffect } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import { useWallet } from "@/components/contexts/WalletContext";
import { useToast } from "@/components/ui/Toast";
import { BiChevronLeft, BiChevronDown, BiShareAlt } from "react-icons/bi";
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

// GraphQL endpoint
const GOLDSKY_SUBGRAPH_URL =
  "https://api.goldsky.com/api/public/project_cm9oeq0bhalzw01y0hwth80bk/subgraphs/political-party-registry/1.0.0/gn";

// Contract address
const POLITICAL_PARTY_REGISTRY_ADDRESS =
  "0x70a993E1D1102F018365F966B5Fc009e8FA9b7dC";

// Party Status
enum PartyStatus {
  PENDING = 0,
  ACTIVE = 1,
  INACTIVE = 2,
}

// Party interface
interface Party {
  id: number;
  name: string;
  shortName: string;
  description: string;
  officialLink: string;
  founder: string;
  currentLeader: string;
  status: number;
  memberCount: number;
  verifiedMemberCount: number;
  members: { address: string }[];
  bannedMembers: { address: string }[];
}

export default function PartyDetailPage({
  params: { lang, id },
}: {
  params: { lang: string; id: string };
}) {
  const dictionary = useTranslations(lang);
  const { walletAddress } = useWallet();
  const { showToast } = useToast();

  const [party, setParty] = useState<Party | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUserMember, setIsUserMember] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get status text
  const getStatusText = (status: number) => {
    switch (status) {
      case PartyStatus.PENDING:
        return (
          dictionary?.components?.politicalPartyList?.status?.pending ||
          "Pending"
        );
      case PartyStatus.ACTIVE:
        return (
          dictionary?.components?.politicalPartyList?.status?.active || "Active"
        );
      case PartyStatus.INACTIVE:
        return (
          dictionary?.components?.politicalPartyList?.status?.inactive ||
          "Inactive"
        );
      default:
        return "Unknown";
    }
  };

  // Get status icon
  const getStatusIcon = (status: number) => {
    switch (status) {
      case PartyStatus.PENDING:
        return <PiClockClockwiseBold className="text-gray-700" />;
      case PartyStatus.ACTIVE:
        return <PiCheckCircleBold className="text-gray-700" />;
      case PartyStatus.INACTIVE:
        return <PiProhibitBold className="text-gray-700" />;
      default:
        return <PiInfoFill className="text-gray-700" />;
    }
  };

  // Join party function
  const joinParty = async () => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
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
            args: [BigInt(parseInt(id))],
          },
        ],
      });

      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          showToast("Failed to join party", "error");
        }
      } else {
        showToast("Successfully joined party!", "success");
        setIsUserMember(true);
        // Update the party data to reflect membership
        if (party) {
          setParty({
            ...party,
            memberCount: party.memberCount + 1,
            members: [...party.members, { address: walletAddress || "" }],
          });
        }
      }
    } catch (error) {
      console.error("Error joining party:", error);
      showToast("Error joining party", "error");
    } finally {
      setIsJoining(false);
    }
  };

  // Fetch party data
  useEffect(() => {
    const fetchPartyData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);

        // GraphQL query
        const query = `
          {
            parties(where: {id: ${id}}) {
              name
              shortName
              description
              officialLink
              founder
              currentLeader
              status
              memberCount
              verifiedMemberCount
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
          throw new Error("Party not found");
        }

        const partyData = result.data.parties[0];

        // Transform data to match interface
        const fetchedParty: Party = {
          id: parseInt(id),
          name: partyData.name,
          shortName: partyData.shortName,
          description: partyData.description,
          officialLink: partyData.officialLink,
          founder: partyData.founder,
          currentLeader: partyData.currentLeader,
          status: parseInt(partyData.status),
          memberCount: parseInt(partyData.memberCount),
          verifiedMemberCount: parseInt(partyData.verifiedMemberCount),
          members: partyData.members,
          bannedMembers: partyData.bannedMembers,
        };

        setParty(fetchedParty);

        // Check if user is a member
        if (walletAddress) {
          const isMember = partyData.members.some(
            (member: { address: string }) =>
              member.address.toLowerCase() === walletAddress.toLowerCase()
          );
          setIsUserMember(isMember);
        }
      } catch (error) {
        console.error("Error fetching party data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load party data"
        );
        showToast("Failed to load party data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartyData();
  }, [id, walletAddress, showToast]);

  return (
    <div className="pb-safe flex min-h-dvh flex-col px-6">
      <div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6">
        <div className="relative flex items-center justify-center py-6">
          <Link
            href={`/${lang}/govern`}
            className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
            aria-label="Back to Govern"
          >
            <BiChevronLeft className="size-6 text-gray-500" />
          </Link>
          <Typography as="h2" variant={{ variant: "heading", level: 3 }}>
            {dictionary?.components?.politicalPartyList?.partyDetails ||
              "Party Details"}
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
                        dictionary?.components?.politicalPartyList?.copied ||
                          "Link copied to clipboard",
                        "success"
                      );
                    }
                  }
                } else {
                  // Fallback for browsers that don't support Web Share API
                  await navigator.clipboard.writeText(shareUrl);
                  showToast(
                    dictionary?.components?.politicalPartyList?.copied ||
                      "Link copied to clipboard",
                    "success"
                  );
                }
              }}
              className="absolute right-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
              aria-label={
                dictionary?.components?.politicalPartyList?.shareParty ||
                "Share Party"
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
              {dictionary?.components?.politicalPartyList?.errorLoading ||
                "Error Loading Party"}
            </Typography>
            <Typography
              variant={{ variant: "body", level: 2 }}
              className="mt-2 text-center text-gray-500"
            >
              {error}
            </Typography>
            <Link href={`/${lang}/govern`}>
              <Button variant="secondary" className="mt-8">
                {dictionary?.components?.politicalPartyList?.backToParties ||
                  "Back to Parties"}
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
                {party.name}
              </Typography>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {party.shortName}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {getStatusIcon(party.status)}
                  {getStatusText(party.status)}
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
                  {dictionary?.components?.politicalPartyList?.description ||
                    "Description"}
                </Typography>
              </div>
              <Typography
                variant={{ variant: "body", level: 3 }}
                className="p-4 text-gray-700"
              >
                {party.description}
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
                  {dictionary?.components?.politicalPartyList?.partyInfo ||
                    "Party Info"}
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
                      {dictionary?.components?.politicalPartyList?.leader ||
                        "Leader"}
                    </Typography>
                  </div>
                  <a
                    href={`https://worldchain-mainnet.explorer.alchemy.com/address/${party.currentLeader}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography
                      variant={{ variant: "body", level: 3 }}
                      className="font-medium text-gray-900"
                    >
                      {party.currentLeader.slice(0, 6)}...
                      {party.currentLeader.slice(-4)}
                    </Typography>
                  </a>
                </div>

                {/* Website */}
                {party.officialLink && (
                  <div className="flex items-center justify-between gap-6 p-4">
                    <div className="flex items-center">
                      <PiLinkSimpleBold className="mr-3 h-5 w-5 text-gray-400" />
                      <Typography
                        variant={{ variant: "body", level: 3 }}
                        className="text-gray-700"
                      >
                        {dictionary?.components?.politicalPartyList?.website ||
                          "Website"}
                      </Typography>
                    </div>
                    <a
                      href={party.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography
                        variant={{ variant: "body", level: 3 }}
                        className="line-clamp-1 break-all font-medium"
                        title={party.officialLink}
                      >
                        {party.officialLink}
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
                    {dictionary?.components?.politicalPartyList?.members ||
                      "Members"}{" "}
                    ({formatNumber(party.memberCount)})
                  </Typography>

                  {party.members.length > 3 &&
                    (showAllMembers ? (
                      <BiChevronDown className="size-[22px] text-gray-500 transition-transform duration-200" />
                    ) : (
                      <BiChevronLeft className="size-[22px] text-gray-500 transition-transform duration-200" />
                    ))}
                </div>
              </button>

              {party.members.length > 0 ? (
                <div>
                  {/* First 3 members always visible */}
                  {party.members.slice(0, 3).map((member, index, array) => (
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
                    party.members.length > 3 &&
                    party.members.slice(3).map((member, index, array) => (
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
                </div>
              ) : (
                <Typography
                  variant={{ variant: "body", level: 3 }}
                  className="text-center text-gray-500"
                >
                  {dictionary?.components?.politicalPartyList?.noMembers ||
                    "No members yet"}
                </Typography>
              )}
            </div>

            {/* Banned Members */}
            {party.bannedMembers.length > 0 && (
              <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-0 p-4">
                  <Typography
                    as="h3"
                    variant={{ variant: "subtitle", level: 2 }}
                    className="text-gray-900"
                  >
                    {dictionary?.components?.politicalPartyList
                      ?.bannedMembers || "Banned Members"}
                  </Typography>
                </div>
                <div className="max-h-56 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {party.bannedMembers.map((member, index) => (
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
                        if (
                          error instanceof Error &&
                          error.name !== "AbortError"
                        ) {
                          await navigator.clipboard.writeText(shareUrl);
                          showToast(
                            dictionary?.components?.politicalPartyList
                              ?.copied || "Link copied to clipboard",
                            "success"
                          );
                        }
                      }
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      await navigator.clipboard.writeText(shareUrl);
                      showToast(
                        dictionary?.components?.politicalPartyList?.copied ||
                          "Link copied to clipboard",
                        "success"
                      );
                    }
                  }}
                >
                  {dictionary?.components?.politicalPartyList?.shareParty ||
                    "Share Party"}
                </Button>
              ) : party.status === PartyStatus.INACTIVE ? (
                <Link href={`/${lang}/govern`}>
                  <Button variant="secondary" fullWidth>
                    {dictionary?.components?.politicalPartyList
                      ?.backToParties || "Back to Parties"}
                  </Button>
                </Link>
              ) : (
                <Button fullWidth onClick={joinParty} disabled={isJoining}>
                  {isJoining
                    ? dictionary?.components?.politicalPartyList?.joining ||
                      "Joining..."
                    : dictionary?.components?.politicalPartyList?.joinParty ||
                      "Join Party"}
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
              {dictionary?.components?.politicalPartyList?.partyNotFound ||
                "Party Not Found"}
            </Typography>
            <Typography
              variant={{ variant: "body", level: 2 }}
              className="mt-2 text-center text-gray-500"
            >
              {dictionary?.components?.politicalPartyList
                ?.partyNotFoundDescription ||
                "The party you're looking for doesn't exist or has been removed."}
            </Typography>
            <Link href={`/${lang}/govern`}>
              <Button variant="secondary" className="mt-8">
                {dictionary?.components?.politicalPartyList?.backToParties ||
                  "Back to Parties"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
