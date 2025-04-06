"use client";

import { useState, useEffect } from "react";
import { parseAbi } from "viem";
import { viemClient } from "@/lib/viemClient";
import { useWallet } from "@/components/contexts/WalletContext";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { MiniKit } from "@worldcoin/minikit-js";
import { useToast } from "@/components/ui/Toast";
import { PiLinkSimpleBold, PiUsersBold } from "react-icons/pi";

const POLITICAL_PARTY_REGISTRY_ADDRESS: string =
  "0x5Da7559B80873f8a2C84e846fE64dCE332F8C526";

interface Party {
  id: number;
  name: string;
  description: string;
  officialLink: string;
  founder: string;
  leader: string;
  memberCount: number;
  creationTime: number;
  active: boolean;
  isUserMember?: boolean;
}

interface PoliticalPartyListProps {
  lang: string;
}

export function PoliticalPartyList({ lang }: PoliticalPartyListProps) {
  const [parties, setParties] = useState<Party[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userPartyIds, setUserPartyIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"discover" | "yourParties">(
    "discover"
  );
  const { walletAddress } = useWallet();
  const { showToast } = useToast();

  const shortenUrl = (url: string, maxLength = 20) => {
    if (!url) return "";

    try {
      // Remove protocol (http://, https://)
      let cleanUrl = url.replace(/^https?:\/\//, "");
      // Remove www. if present
      cleanUrl = cleanUrl.replace(/^www\./, "");
      // Remove trailing slash
      cleanUrl = cleanUrl.replace(/\/$/, "");

      if (cleanUrl.length <= maxLength) return cleanUrl;

      // For longer URLs, truncate the middle
      const start = Math.ceil(maxLength / 2);
      const end = cleanUrl.length - start + 3; // +3 for the "..."

      return cleanUrl.substring(0, start) + "..." + cleanUrl.substring(end);
    } catch (e) {
      return url;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (Math.round(num / 10000) / 100).toFixed(2) + "M";
    } else if (num >= 1000) {
      return (Math.round(num / 10) / 100).toFixed(2) + "K";
    }
    return num.toString();
  };

  const fetchParties = async () => {
    if (
      !POLITICAL_PARTY_REGISTRY_ADDRESS ||
      POLITICAL_PARTY_REGISTRY_ADDRESS ===
        "0x0000000000000000000000000000000000000000"
    ) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get party count
      const partyCount = await viemClient.readContract({
        address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
        abi: parseAbi(["function partyCount() view returns (uint256)"]),
        functionName: "partyCount",
      });

      const partyIds = Array.from({ length: Number(partyCount) }, (_, i) => i);

      // Get user's parties
      let userParties: number[] = [];
      if (walletAddress) {
        const userPartiesResult = await viemClient.readContract({
          address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
          abi: parseAbi([
            "function getUserParties(address _user) view returns (uint256[] memory)",
          ]),
          functionName: "getUserParties",
          args: [walletAddress as `0x${string}`],
        });

        userParties = Array.isArray(userPartiesResult)
          ? userPartiesResult.map(Number)
          : [];
        setUserPartyIds(userParties);
      }

      // Fetch details for each party
      const partyPromises = partyIds.map(async (id) => {
        const partyDetails = await viemClient.readContract({
          address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
          abi: parseAbi([
            "function getPartyDetails(uint256 _partyId) view returns (string memory name, string memory description, string memory officialLink, address founder, address currentLeader, uint256 creationTime, bool active, uint256 memberCount)",
          ]),
          functionName: "getPartyDetails",
          args: [BigInt(id)],
        });

        return {
          id,
          name: partyDetails[0],
          description: partyDetails[1],
          officialLink: partyDetails[2],
          founder: partyDetails[3],
          leader: partyDetails[4],
          creationTime: Number(partyDetails[5]),
          active: partyDetails[6],
          memberCount: Number(partyDetails[7]),
          isUserMember: userParties.includes(id),
        };
      });

      const fetchedParties = await Promise.all(partyPromises);

      // Filter active parties
      const activeParties = fetchedParties.filter((party) => party.active);

      setParties(activeParties);
    } catch (error) {
      console.error("Error fetching political parties:", error);
      showToast("Failed to load political parties", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, [walletAddress]);

  const joinParty = async (partyId: number) => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }

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

      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          showToast("Failed to join party", "error");
        }
      } else {
        showToast("Successfully joined party", "success");
        fetchParties();
      }
    } catch (error) {
      console.error("Error joining party:", error);
      showToast("Error joining party", "error");
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

      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          showToast("Failed to leave party", "error");
        }
      } else {
        showToast("Successfully left party", "success");
        fetchParties();
      }
    } catch (error) {
      console.error("Error leaving party:", error);
      showToast("Error leaving party", "error");
    }
  };

  const PartySkeletonCard = () => (
    <div className="mb-4 animate-pulse rounded-xl border border-gray-200 p-4">
      {/* Party name skeleton */}
      <div className="mb-4 h-6 w-48 rounded bg-gray-100"></div>

      {/* Member count and foundation date skeletons */}
      <div className="mt-2 flex flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <div className="h-4 w-16 rounded bg-gray-100"></div>
          <div className="h-4 w-8 rounded bg-gray-100"></div>
        </div>

        <div className="flex items-center gap-1">
          <div className="h-4 w-16 rounded bg-gray-100"></div>
          <div className="h-4 w-24 rounded bg-gray-100"></div>
        </div>
      </div>

      {/* Description skeleton - 3 lines */}
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-gray-100"></div>
        <div className="h-4 w-11/12 rounded bg-gray-100"></div>
        <div className="h-4 w-4/5 rounded bg-gray-100"></div>
      </div>

      {/* Link skeleton */}
      <div className="mt-4 h-4 w-3/5 rounded bg-gray-100"></div>

      {/* Button skeleton */}
      <div className="mt-4 h-12 w-28 rounded bg-gray-100"></div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="w-full">
      {/* Generate 5 skeleton party cards */}
      {Array.from({ length: 5 }).map((_, index) => (
        <PartySkeletonCard key={index} />
      ))}
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Filter parties based on active tab
  const filteredParties = parties.filter((party) =>
    activeTab === "discover" ? !party.isUserMember : party.isUserMember
  );

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="mb-2 flex gap-1">
        <button
          className={`h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200 ${
            activeTab === "discover" ? "bg-gray-100" : ""
          }`}
          onClick={() => setActiveTab("discover")}
        >
          Discover
        </button>
        <button
          className={`h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200 ${
            activeTab === "yourParties" ? "bg-gray-100" : ""
          }`}
          onClick={() => setActiveTab("yourParties")}
        >
          Your parties
        </button>
      </div>

      {filteredParties.length === 0 && (
        <div className="my-8 text-center text-gray-500">
          {activeTab === "discover"
            ? "No parties to discover. You've joined all available parties."
            : "You haven't joined any political parties yet."}
        </div>
      )}

      {filteredParties.map((party) => (
        <div
          key={party.id}
          className={`${
            filteredParties.indexOf(party) !== filteredParties.length - 1
              ? "mb-4"
              : ""
          } rounded-xl border border-gray-200 p-4`}
        >
          <Typography
            as="h3"
            variant={{ variant: "subtitle", level: 1 }}
            className="text-[19px] font-semibold"
          >
            {party.name}
          </Typography>

          <Typography
            as="p"
            variant={{ variant: "body", level: 2 }}
            className="mt-3 line-clamp-3 text-[15px]"
          >
            {party.description}
          </Typography>
          <div className="mt-2 flex justify-between gap-1">
            <div className="flex items-center gap-1">
              <PiLinkSimpleBold className="text-gray-500" size={15} />
              <a
                href={party.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="-m-1 flex rounded-md px-1 py-1 transition-colors hover:bg-gray-50"
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
                members
              </Typography>
            </div>
          </div>

          <div className="mt-4">
            {activeTab === "yourParties" ? (
              <Button
                className="px-6"
                variant="tertiary"
                size="sm"
                fullWidth
                onClick={() => leaveParty(party.id)}
              >
                Leave Party
              </Button>
            ) : (
              <Button
                className="px-6"
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => joinParty(party.id)}
              >
                Join Party
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
