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
  PiUsers,
  PiLinkSimpleBold,
  PiPlus,
  PiPlusBold,
  PiUsersBold,
  PiUsersFourFill,
  PiUsersFour,
  PiUsersFourBold,
  PiPlusCircleFill,
  PiPlusCircleBold,
  PiPencilSimpleBold,
  PiUserMinusBold,
  PiCrownBold,
} from "react-icons/pi";
import { Drawer, DrawerContent } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";

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
  status: number;
  isUserMember?: boolean;
  isUserLeader?: boolean;
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
  const [transactionId, setTransactionId] = useState<string>("");
  const [isUpdatePartyDrawerOpen, setIsUpdatePartyDrawerOpen] = useState(false);
  const [isTransferLeadershipDrawerOpen, setIsTransferLeadershipDrawerOpen] =
    useState(false);
  const [isRemoveMemberDrawerOpen, setIsRemoveMemberDrawerOpen] =
    useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [newLeaderAddress, setNewLeaderAddress] = useState("");
  const [memberToRemove, setMemberToRemove] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [updatePartyForm, setUpdatePartyForm] = useState<{
    name: string;
    shortName: string;
    description: string;
    officialLink: string;
  }>({
    name: "",
    shortName: "",
    description: "",
    officialLink: "",
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      client: viemClient,
      appConfig: {
        app_id: process.env.NEXT_PUBLIC_WORLD_APP_ID as string,
      },
      transactionId: transactionId,
    });

  const shortenUrl = (url: string, maxLength = 20) => {
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

      // For very long URLs, truncate at domain level or use ellipsis
      const parts = cleanUrl.split("/");
      const domain = parts[0];

      if (domain.length <= maxLength) {
        return domain;
      }

      // If domain itself is too long, truncate with ellipsis
      return domain.substring(0, maxLength - 3) + "...";
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
          status: partyDetails[7],
          active: partyDetails[7] === 1,
          memberCount: Number(partyDetails[8]),
          documentVerifiedMemberCount: Number(partyDetails[9]),
          verifiedMemberCount: Number(partyDetails[10]),
          isUserMember: userParties.includes(id),
          isUserLeader:
            walletAddress?.toLowerCase() === partyDetails[5].toLowerCase(),
        };
      });

      const fetchedParties = await Promise.all(partyPromises);
      setParties(fetchedParties);
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
        // Only update optimistically after user confirms transaction
        setParties((prevParties) =>
          prevParties.map((party) =>
            party.id === partyId ? { ...party, isUserMember: true } : party
          )
        );
        setTransactionId(finalPayload.transaction_id);
      }
    } catch (error) {
      console.error("Error joining party:", error);
      showToast("Error joining party", "error");
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      showToast("Successfully joined party", "success");
      fetchParties();
      setTransactionId(""); // Reset the transaction ID
    }
  }, [isConfirmed]);

  const isJoiningParty = isConfirming && transactionId !== "";

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
        // Only update optimistically after user confirms transaction
        setParties((prevParties) =>
          prevParties.map((party) =>
            party.id === partyId ? { ...party, isUserMember: false } : party
          )
        );
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
        // Only update optimistically after user confirms transaction
        const optimisticParty: Party = {
          id: parties.length, // Temporary ID
          name: createPartyForm.name,
          shortName: createPartyForm.shortName,
          description: createPartyForm.description,
          officialLink: createPartyForm.officialLink,
          founder: walletAddress || "",
          leader: walletAddress || "",
          memberCount: 1,
          documentVerifiedMemberCount: 0,
          verifiedMemberCount: 0,
          creationTime: Math.floor(Date.now() / 1000),
          active: true,
          status: 0, // Pending status
          isUserMember: true,
          isUserLeader:
            walletAddress?.toLowerCase() ===
            (walletAddress || "").toLowerCase(),
        };

        setParties((prevParties) => [...prevParties, optimisticParty]);
        setIsCreateDrawerOpen(false);
        setCreatePartyForm({
          name: "",
          shortName: "",
          description: "",
          officialLink: "",
        });
      }
    } catch (error) {
      console.error("Error creating party:", error);
      showToast("Error creating party", "error");
    } finally {
      setIsCreating(false);
    }
  };

  // Functions for party leaders
  const openUpdatePartyDrawer = (party: Party) => {
    setSelectedParty(party);
    setUpdatePartyForm({
      name: party.name,
      shortName: party.shortName,
      description: party.description,
      officialLink: party.officialLink,
    });
    setIsUpdatePartyDrawerOpen(true);
  };

  const updateParty = async () => {
    if (!selectedParty || !MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    try {
      setIsProcessing(true);

      // Update name if changed
      if (updatePartyForm.name !== selectedParty.name) {
        const { finalPayload: namePayload } =
          await MiniKit.commandsAsync.sendTransaction({
            transaction: [
              {
                address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
                abi: parseAbi([
                  "function updatePartyName(uint256 _partyId, string memory _name) external",
                ]),
                functionName: "updatePartyName",
                args: [BigInt(selectedParty.id), updatePartyForm.name],
              },
            ],
          });

        if (
          namePayload.status === "error" &&
          namePayload.error_code !== "user_rejected"
        ) {
          showToast("Failed to update party name", "error");
          return;
        }
      }

      // Update short name if changed
      if (updatePartyForm.shortName !== selectedParty.shortName) {
        const { finalPayload: shortNamePayload } =
          await MiniKit.commandsAsync.sendTransaction({
            transaction: [
              {
                address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
                abi: parseAbi([
                  "function updatePartyShortName(uint256 _partyId, string memory _shortName) external",
                ]),
                functionName: "updatePartyShortName",
                args: [BigInt(selectedParty.id), updatePartyForm.shortName],
              },
            ],
          });

        if (
          shortNamePayload.status === "error" &&
          shortNamePayload.error_code !== "user_rejected"
        ) {
          showToast("Failed to update party short name", "error");
          return;
        }
      }

      // Update description if changed
      if (updatePartyForm.description !== selectedParty.description) {
        const { finalPayload: descPayload } =
          await MiniKit.commandsAsync.sendTransaction({
            transaction: [
              {
                address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
                abi: parseAbi([
                  "function updatePartyDescription(uint256 _partyId, string memory _description) external",
                ]),
                functionName: "updatePartyDescription",
                args: [BigInt(selectedParty.id), updatePartyForm.description],
              },
            ],
          });

        if (
          descPayload.status === "error" &&
          descPayload.error_code !== "user_rejected"
        ) {
          showToast("Failed to update party description", "error");
          return;
        }
      }

      // Update official link if changed
      if (updatePartyForm.officialLink !== selectedParty.officialLink) {
        const { finalPayload: linkPayload } =
          await MiniKit.commandsAsync.sendTransaction({
            transaction: [
              {
                address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
                abi: parseAbi([
                  "function updateOfficialLink(uint256 _partyId, string memory _officialLink) external",
                ]),
                functionName: "updateOfficialLink",
                args: [BigInt(selectedParty.id), updatePartyForm.officialLink],
              },
            ],
          });

        if (
          linkPayload.status === "error" &&
          linkPayload.error_code !== "user_rejected"
        ) {
          showToast("Failed to update official link", "error");
          return;
        }
      }

      // Update party in the UI optimistically
      setParties((prevParties) =>
        prevParties.map((party) =>
          party.id === selectedParty.id
            ? {
                ...party,
                name: updatePartyForm.name,
                shortName: updatePartyForm.shortName,
                description: updatePartyForm.description,
                officialLink: updatePartyForm.officialLink,
              }
            : party
        )
      );

      setIsUpdatePartyDrawerOpen(false);
      showToast("Party details updated successfully", "success");
    } catch (error) {
      console.error("Error updating party:", error);
      showToast("Error updating party", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const transferLeadership = async () => {
    if (!selectedParty || !MiniKit.isInstalled() || !newLeaderAddress) {
      showToast("Please provide a valid address", "error");
      return;
    }

    try {
      setIsProcessing(true);
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
            abi: parseAbi([
              "function transferLeadership(uint256 _partyId, address _newLeader) external",
            ]),
            functionName: "transferLeadership",
            args: [BigInt(selectedParty.id), newLeaderAddress as `0x${string}`],
          },
        ],
      });

      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          showToast("Failed to transfer leadership", "error");
        }
      } else {
        // Update party in the UI optimistically
        setParties((prevParties) =>
          prevParties.map((party) =>
            party.id === selectedParty.id
              ? {
                  ...party,
                  leader: newLeaderAddress,
                  isUserLeader: false,
                }
              : party
          )
        );

        setIsTransferLeadershipDrawerOpen(false);
        showToast("Party leadership transferred successfully", "success");
      }
    } catch (error) {
      console.error("Error transferring leadership:", error);
      showToast("Error transferring leadership", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeMember = async () => {
    if (!selectedParty || !MiniKit.isInstalled() || !memberToRemove) {
      showToast("Please provide a valid address", "error");
      return;
    }

    try {
      setIsProcessing(true);
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
            abi: parseAbi([
              "function removeMember(uint256 _partyId, address _member) external",
            ]),
            functionName: "removeMember",
            args: [BigInt(selectedParty.id), memberToRemove as `0x${string}`],
          },
        ],
      });

      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          showToast("Failed to remove member", "error");
        }
      } else {
        // Update party in the UI optimistically
        setParties((prevParties) =>
          prevParties.map((party) =>
            party.id === selectedParty.id
              ? {
                  ...party,
                  memberCount:
                    party.memberCount > 0 ? party.memberCount - 1 : 0,
                }
              : party
          )
        );

        setIsRemoveMemberDrawerOpen(false);
        showToast("Member removed successfully", "success");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      showToast("Error removing member", "error");
    } finally {
      setIsProcessing(false);
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
  const filteredParties = parties.filter((party) => {
    if (activeTab === "discover") {
      // For discover tab: show non-member parties that are not pending (status !== 0)
      return !party.isUserMember && party.status !== 0;
    } else {
      // For your parties tab: show all member parties
      return party.isUserMember;
    }
  });

  // Check if user is a leader of any party
  const isLeaderOfAnyParty = () => {
    return parties.some((party) => party.isUserLeader);
  };

  // Get parties where user is the leader
  const getPartiesWhereUserIsLeader = () => {
    return parties.filter((party) => party.isUserLeader);
  };

  // Modify the party card rendering to include leader actions
  const renderPartyCard = (party: Party) => (
    <div
      key={party.id}
      className={`${
        filteredParties.indexOf(party) !== filteredParties.length - 1
          ? "mb-4"
          : ""
      } rounded-xl border border-gray-200 p-4`}
    >
      <div className="flex items-start justify-between">
        <Typography
          as="h3"
          variant={{ variant: "subtitle", level: 1 }}
          className="text-[19px] font-semibold"
        >
          {party.name}
        </Typography>
        <div className="flex items-center gap-2">
          {party.status === 0 && (
            <span className="text-gray-800 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
              Pending
            </span>
          )}
          {party.isUserLeader && (
            <button
              onClick={() => openUpdatePartyDrawer(party)}
              className="text-gray-500 transition-colors hover:text-gray-700"
              title="Edit Party Details"
            >
              <PiPencilSimpleBold size={16} />
            </button>
          )}
        </div>
      </div>

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

      <div className="mt-4 flex flex-col gap-2">
        {party.isUserLeader ? (
          <>
            <Button
              className="px-4"
              variant="tertiary"
              size="sm"
              fullWidth
              onClick={() => {
                setSelectedParty(party);
                setIsRemoveMemberDrawerOpen(true);
              }}
            >
              Remove Member
            </Button>
            <Button
              className="px-4"
              variant="tertiary"
              size="sm"
              fullWidth
              onClick={() => {
                setSelectedParty(party);
                setIsTransferLeadershipDrawerOpen(true);
              }}
            >
              Transfer Leadership
            </Button>
          </>
        ) : activeTab === "yourParties" ? (
          <Button
            className="px-6"
            variant="tertiary"
            size="sm"
            fullWidth
            onClick={() => leaveParty(party.id)}
            disabled={isJoiningParty}
          >
            {isJoiningParty ? "Processing..." : "Leave Party"}
          </Button>
        ) : (
          <Button
            className="px-6"
            variant={party.status === 1 ? "primary" : "secondary"}
            size="sm"
            fullWidth
            onClick={() => joinParty(party.id)}
            disabled={isJoiningParty}
          >
            {isJoiningParty
              ? "Joining..."
              : party.status === 0
                ? "Join Pending Party"
                : party.status === 2
                  ? "Join Inactive Party"
                  : "Join Party"}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-1">
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
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-900"
          onClick={() => setIsCreateDrawerOpen(true)}
          title="Create New Party"
        >
          <PiPlusBold className="text-gray-500" size={16} />
        </button>
      </div>

      {filteredParties.length === 0 && (
        <div className="my-8 text-center text-gray-500">
          {activeTab === "discover"
            ? "No parties to discover. You've joined all available parties."
            : "You haven't joined any political parties yet."}
        </div>
      )}

      {filteredParties.map((party) => renderPartyCard(party))}

      {/* Create Party Drawer */}
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

      {/* Update Party Drawer */}
      <Drawer
        open={isUpdatePartyDrawerOpen}
        onOpenChange={setIsUpdatePartyDrawerOpen}
      >
        <DrawerContent>
          <div className="flex flex-col gap-4 p-6">
            <Typography
              as="h2"
              variant={{ variant: "subtitle", level: 1 }}
              className="text-[19px] font-semibold"
            >
              Update Party Details
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
                value={updatePartyForm.name}
                onChange={(e) =>
                  setUpdatePartyForm((prev) => ({
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
                value={updatePartyForm.shortName}
                onChange={(e) =>
                  setUpdatePartyForm((prev) => ({
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
                value={updatePartyForm.description}
                onChange={(e) =>
                  setUpdatePartyForm((prev) => ({
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
                value={updatePartyForm.officialLink}
                onChange={(e) =>
                  setUpdatePartyForm((prev) => ({
                    ...prev,
                    officialLink: e.target.value,
                  }))
                }
              />
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={updateParty}
              disabled={
                isProcessing ||
                !updatePartyForm.name ||
                !updatePartyForm.shortName ||
                !updatePartyForm.description
              }
            >
              {isProcessing ? "Updating..." : "Update Party"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Transfer Leadership Drawer */}
      <Drawer
        open={isTransferLeadershipDrawerOpen}
        onOpenChange={setIsTransferLeadershipDrawerOpen}
      >
        <DrawerContent>
          <div className="flex flex-col gap-4 p-6">
            <Typography
              as="h2"
              variant={{ variant: "subtitle", level: 1 }}
              className="text-[19px] font-semibold"
            >
              Transfer Party Leadership
            </Typography>
            <Typography
              as="p"
              variant={{ variant: "body", level: 2 }}
              className="text-[15px]"
            >
              Enter the wallet address of the new leader. The address must
              belong to an existing party member.
            </Typography>
            <div>
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block text-[15px]"
              >
                New Leader Address
              </Typography>
              <Input
                placeholder="Enter wallet address (0x...)"
                value={newLeaderAddress}
                onChange={(e) => setNewLeaderAddress(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              fullWidth
              onClick={transferLeadership}
              disabled={isProcessing || !newLeaderAddress}
            >
              {isProcessing ? "Processing..." : "Transfer Leadership"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Remove Member Drawer */}
      <Drawer
        open={isRemoveMemberDrawerOpen}
        onOpenChange={setIsRemoveMemberDrawerOpen}
      >
        <DrawerContent>
          <div className="flex flex-col gap-4 p-6">
            <Typography
              as="h2"
              variant={{ variant: "subtitle", level: 1 }}
              className="text-[19px] font-semibold"
            >
              Remove Member
            </Typography>
            <Typography
              as="p"
              variant={{ variant: "body", level: 2 }}
              className="text-[15px]"
            >
              Enter the wallet address of the member you want to remove from the
              party.
            </Typography>
            <div>
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block text-[15px]"
              >
                Member Address
              </Typography>
              <Input
                placeholder="Enter wallet address (0x...)"
                value={memberToRemove}
                onChange={(e) => setMemberToRemove(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              fullWidth
              onClick={removeMember}
              disabled={isProcessing || !memberToRemove}
            >
              {isProcessing ? "Processing..." : "Remove Member"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
