"use client";

import { useState, useEffect } from "react";
import { parseAbi } from "viem";
import { viemClient } from "@/lib/viemClient";
import { useWallet } from "@/components/contexts/WalletContext";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { MiniKit } from "@worldcoin/minikit-js";
import { useToast } from "@/components/ui/Toast";
import {
  PiCalendar,
  PiCalendarBlankFill,
  PiLinkSimple,
  PiCalendarDot,
  PiLinkSimpleBold,
  PiCalendarDotFill,
  PiCalendarXBold,
  PiCalendarSlashBold,
  PiCalendarFill,
  PiCalendarBold,
  PiCalendarCheckFill,
  PiCalendarBlank,
  PiCalendarBlankBold,
} from "react-icons/pi";

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
}

interface PoliticalPartyListProps {
  lang: string;
}

export function PoliticalPartyList({ lang }: PoliticalPartyListProps) {
  const [parties, setParties] = useState<Party[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userPartyId, setUserPartyId] = useState<number | null>(null);
  const { walletAddress } = useWallet();
  const { showToast } = useToast();

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
        };
      });

      const fetchedParties = await Promise.all(partyPromises);
      setParties(fetchedParties.filter((party) => party.active));

      // Check if user is a member of any party
      if (walletAddress) {
        const userParties = await viemClient.readContract({
          address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
          abi: parseAbi([
            "function getUserParties(address _user) view returns (uint256[] memory)",
          ]),
          functionName: "getUserParties",
          args: [walletAddress as `0x${string}`],
        });

        setUserPartyId(userParties.length > 0 ? Number(userParties[0]) : null);
      }
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

  const leaveParty = async () => {
    if (!MiniKit.isInstalled() || userPartyId === null) {
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
            args: [BigInt(userPartyId)],
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

  return (
    <div className="w-full">
      {userPartyId !== null && (
        <div className="border-green-100 bg-green-50 mb-4 rounded-xl border p-4">
          <Typography
            as="p"
            variant={{ variant: "body", level: 2 }}
            className="text-green-800"
          >
            You are a member of{" "}
            {parties.find((p) => p.id === userPartyId)?.name || "a party"}
          </Typography>
          <Button variant="tertiary" className="mt-2" onClick={leaveParty}>
            Leave current party
          </Button>
        </div>
      )}

      {parties.map((party) => (
        <div
          key={party.id}
          className="mb-4 rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <Typography
              as="h3"
              variant={{ variant: "subtitle", level: 1 }}
              className="font-semibold"
            >
              {party.name}
            </Typography>

            <div className="flex items-center gap-1">
              <Typography
                as="span"
                variant={{ variant: "caption", level: 1 }}
                className="text-gray-500"
              >
                Members:
              </Typography>
              <Typography
                as="span"
                variant={{ variant: "caption", level: 1 }}
                className="font-medium"
              >
                {party.memberCount}
              </Typography>
            </div>
          </div>

          <Typography
            as="p"
            variant={{ variant: "body", level: 2 }}
            className="mt-3 line-clamp-3"
          >
            {party.description}
          </Typography>

          <div className="mt-2 flex items-center gap-1">
            <PiLinkSimpleBold className="text-gray-500" size={14} />
            <Typography
              variant={{ variant: "caption", level: 1 }}
              className="text-[15px] text-[#0A66C2]"
            >
              {party.officialLink}
            </Typography>
          </div>

          {userPartyId === null && (
            <Button
              className="mt-4 px-6"
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => joinParty(party.id)}
            >
              Join Party
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
