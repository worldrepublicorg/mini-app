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
import { Drawer, DrawerContent } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const POLITICAL_PARTY_REGISTRY_ADDRESS: string =
  "0x960f5F39442C215C1F29CC7dd309b8b705f36bC1";

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
  isUserMember?: boolean;
}

interface CreatePartyForm {
  name: string;
  shortName: string;
  description: string;
  officialLink: string;
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
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [createPartyForm, setCreatePartyForm] = useState<CreatePartyForm>({
    name: "",
    shortName: "",
    description: "",
    officialLink: "",
  });
  const [isCreating, setIsCreating] = useState(false);

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
            "function getPartyDetails(uint256 _partyId) view returns (string memory name, string memory shortName, string memory description, string memory officialLink, address founder, address currentLeader, uint256 creationTime, uint8 status, uint256 memberCount, uint256 documentVerifiedMemberCount, uint256 verifiedMemberCount)",
          ]),
          functionName: "getPartyDetails",
          args: [BigInt(id)],
        });

        return {
          id,
          name: partyDetails[0],
          shortName: partyDetails[1],
          description: partyDetails[2],
          officialLink: partyDetails[3],
          founder: partyDetails[4],
          leader: partyDetails[5],
          creationTime: Number(partyDetails[6]),
          active: partyDetails[7] === 1,
          memberCount: Number(partyDetails[8]),
          documentVerifiedMemberCount: Number(partyDetails[9]),
          verifiedMemberCount: Number(partyDetails[10]),
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

  const createParty = async () => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    try {
      setIsCreating(true);
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
            abi: parseAbi([
              "function createParty(string memory _name, string memory _shortName, string memory _description, string memory _officialLink) external returns (uint256)",
            ]),
            functionName: "createParty",
            args: [
              createPartyForm.name,
              createPartyForm.shortName,
              createPartyForm.description,
              createPartyForm.officialLink,
            ],
          },
        ],
      });

      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          showToast("Failed to create party", "error");
        }
      } else {
        showToast("Successfully created party", "success");
        setIsCreateDrawerOpen(false);
        setCreatePartyForm({
          name: "",
          shortName: "",
          description: "",
          officialLink: "",
        });
        fetchParties();
      }
    } catch (error) {
      console.error("Error creating party:", error);
      showToast("Error creating party", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const PartySkeletonCard = () => (
    <div className="mb-4 animate-pulse rounded-xl border border-gray-200 p-4">
      {/* Party name skeleton */}
      <div className="h-[19px] w-48 rounded bg-gray-100"></div>

      {/* Description skeleton - 3 lines */}
      <div className="mt-3 space-y-2">
        <div className="h-[15px] w-full rounded bg-gray-100"></div>
        <div className="h-[15px] w-11/12 rounded bg-gray-100"></div>
        <div className="h-[15px] w-4/5 rounded bg-gray-100"></div>
      </div>

      {/* Links and members count skeletons */}
      <div className="mt-2 flex justify-between gap-1">
        <div className="flex items-center gap-1">
          <div className="h-[15px] w-[15px] rounded-full bg-gray-100"></div>
          <div className="h-[15px] w-24 rounded bg-gray-100"></div>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-[15px] w-[15px] rounded-full bg-gray-100"></div>
          <div className="h-[15px] w-8 rounded bg-gray-100"></div>
          <div className="h-[15px] w-16 rounded bg-gray-100"></div>
        </div>
      </div>

      {/* Button skeleton */}
      <div className="mt-4 h-9 w-full rounded bg-gray-100"></div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="w-full">
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

      {activeTab === "yourParties" && (
        <div className="my-4">
          <Button
            variant="primary"
            fullWidth
            onClick={() => setIsCreateDrawerOpen(true)}
          >
            Create New Party
          </Button>
        </div>
      )}

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

      <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
        <DrawerContent>
          <div className="flex flex-col gap-4 p-6">
            <Typography
              as="h2"
              variant={{ variant: "subtitle", level: 1 }}
              className="text-[19px] font-semibold"
            >
              Create New Party
            </Typography>
            <div>
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block text-[15px]"
              >
                Party Name
              </Typography>
              <Input
                placeholder="Enter party name"
                value={createPartyForm.name}
                onChange={(e) =>
                  setCreatePartyForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block text-[15px]"
              >
                Short Name
              </Typography>
              <Input
                placeholder="Enter short name or abbreviation"
                value={createPartyForm.shortName}
                onChange={(e) =>
                  setCreatePartyForm((prev) => ({
                    ...prev,
                    shortName: e.target.value,
                  }))
                }
                maxLength={16}
              />
            </div>

            <div>
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block text-[15px]"
              >
                Description
              </Typography>
              <Textarea
                placeholder="Enter party description"
                value={createPartyForm.description}
                onChange={(e) =>
                  setCreatePartyForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>

            <div>
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block text-[15px]"
              >
                Official Link
              </Typography>
              <Input
                placeholder="Enter official website or community link"
                value={createPartyForm.officialLink}
                onChange={(e) =>
                  setCreatePartyForm((prev) => ({
                    ...prev,
                    officialLink: e.target.value,
                  }))
                }
              />
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={createParty}
              disabled={
                isCreating ||
                !createPartyForm.name ||
                !createPartyForm.shortName ||
                !createPartyForm.description
              }
            >
              {isCreating ? "Creating..." : "Create Party"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
