"use client";

import { useState, useEffect, useCallback } from "react";
import type { FocusEvent as ReactFocusEvent } from "react";
import { parseAbi } from "viem";
import { viemClient } from "@/lib/viemClient";
import { useWallet } from "@/components/contexts/WalletContext";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { MiniKit } from "@worldcoin/minikit-js";
import { useToast } from "@/components/ui/Toast";
import { PiLinkSimpleBold, PiUsersBold, PiGearBold } from "react-icons/pi";
import { Drawer, DrawerContent } from "@/components/ui/Drawer";
import { Form, Input } from "@worldcoin/mini-apps-ui-kit-react";
import { Textarea } from "@/components/ui/Textarea";
import { FaPlus } from "react-icons/fa";
import { Dropdown } from "@/components/ui/Dropdown";
import { DrawerTitle } from "@/components/ui/Drawer";
import { LoadingSkeleton } from "./PartySkeletons";

const POLITICAL_PARTY_REGISTRY_ADDRESS: string =
  "0xCDf53d307bf828350944d21A54B6318Ed5a5d34f";

const MAX_STRING_LENGTH = 256;
const MAX_SHORT_NAME_LENGTH = 16;

const GOLDSKY_SUBGRAPH_URL =
  "https://api.goldsky.com/api/public/project_cm9oeq0bhalzw01y0hwth80bk/subgraphs/political-party-registry/0.1.0/gn";

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
  const [activeTab, setActiveTab] = useState<
    "top" | "trending" | "new" | "pending"
  >("top");
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
  const [isUpdatePartyDrawerOpen, setIsUpdatePartyDrawerOpen] = useState(false);
  const [isTransferLeadershipDrawerOpen, setIsTransferLeadershipDrawerOpen] =
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
  const [isLeaveConfirmDrawerOpen, setIsLeaveConfirmDrawerOpen] =
    useState(false);
  const [partyToLeaveFrom, setPartyToLeaveFrom] = useState<Party | null>(null);
  const [isCreateConfirmDrawerOpen, setIsCreateConfirmDrawerOpen] =
    useState(false);
  const [isDeactivateDrawerOpen, setIsDeactivateDrawerOpen] = useState(false);
  const [bannedMemberToUnban, setBannedMemberToUnban] = useState("");
  const [bannedMemberUsername, setBannedMemberUsername] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [memberToBan, setMemberToBan] = useState("");
  const [memberToBanUsername, setMemberToBanUsername] = useState("");
  const [banLookupError, setBanLookupError] = useState("");
  const [banLookupResult, setBanLookupResult] = useState<any>(null);
  const [isBanLookingUp, setIsBanLookingUp] = useState(false);
  const [isMemberManagementDrawerOpen, setIsMemberManagementDrawerOpen] =
    useState(false);
  const [activeMemberTab, setActiveMemberTab] = useState<
    "remove" | "ban" | "unban"
  >("remove");
  const [leaderUsername, setLeaderUsername] = useState("");
  const [memberUsername, setMemberUsername] = useState("");
  const [leaderLookupError, setLeaderLookupError] = useState("");
  const [leaderLookupResult, setLeaderLookupResult] = useState<any>(null);
  const [memberLookupError, setMemberLookupError] = useState("");
  const [memberLookupResult, setMemberLookupResult] = useState<any>(null);
  const [isLeaderLookingUp, setIsLeaderLookingUp] = useState(false);
  const [isMemberLookingUp, setIsMemberLookingUp] = useState(false);
  const [userPartyId, setUserPartyId] = useState<number>(0);

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

  const fetchParties = useCallback(async () => {
    if (!GOLDSKY_SUBGRAPH_URL) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Query to get all parties from subgraph
      const query = `
        query {
          parties {
            id
            name
            shortName
            description
            officialLink
            founder
            currentLeader
            creationTime
            status
            memberCount
            documentVerifiedMemberCount
            verifiedMemberCount
            active
          }
        }
      `;

      // Fetch data from the Goldsky subgraph
      const response = await fetch(GOLDSKY_SUBGRAPH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      // Get user's party if wallet is connected
      let userParty = 0;
      let userPartyMapping = null;

      if (walletAddress) {
        const userQuery = `
          query {
            userPartyMapping(id: "${walletAddress.toLowerCase()}") {
              party {
                id
              }
            }
          }
        `;

        const userResponse = await fetch(GOLDSKY_SUBGRAPH_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: userQuery }),
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          userPartyMapping = userData.data?.userPartyMapping;

          if (userPartyMapping && userPartyMapping.party) {
            userParty = Number(userPartyMapping.party.id);
          }
        }
      }

      setUserPartyId(userParty > 0 ? userParty : 0);

      // Transform the data to match your Party interface
      const fetchedParties = result.data.parties.map((party: any) => ({
        id: Number(party.id),
        name: party.name,
        shortName: party.shortName,
        description: party.description,
        officialLink: party.officialLink,
        founder: party.founder,
        leader: party.currentLeader, // Map currentLeader to leader in your interface
        creationTime: Number(party.creationTime),
        status: Number(party.status),
        active: party.active,
        memberCount: Number(party.memberCount),
        documentVerifiedMemberCount: Number(party.documentVerifiedMemberCount),
        verifiedMemberCount: Number(party.verifiedMemberCount),
        isUserMember: userParty === Number(party.id),
        isUserLeader:
          walletAddress?.toLowerCase() === party.currentLeader?.toLowerCase(),
      }));

      setParties(fetchedParties);
    } catch (error) {
      console.error("Error fetching political parties from subgraph:", error);
      showToast("Failed to load political parties", "error");

      // Fallback to direct blockchain polling
      fallbackFetchParties();
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, showToast]);

  // Keep the original function as a fallback
  const fallbackFetchParties = useCallback(async () => {
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

      // Original implementation for fetching from blockchain
      const partyCount = await viemClient.readContract({
        address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
        abi: parseAbi(["function totalPartyCount() view returns (uint256)"]),
        functionName: "totalPartyCount",
      });

      // Party IDs start from 1 in the new contract, not 0
      const partyIds = Array.from(
        { length: Number(partyCount) },
        (_, i) => i + 1
      );

      // Check user's party
      let userParty = 0;
      if (walletAddress) {
        const userPartyResult = await viemClient.readContract({
          address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
          abi: parseAbi(["function userParty(address) view returns (uint256)"]),
          functionName: "userParty",
          args: [walletAddress as `0x${string}`],
        });

        userParty = Number(userPartyResult);
        setUserPartyId(userParty > 0 ? userParty : 0);
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
          leader: partyDetails[5], // currentLeader from contract
          creationTime: Number(partyDetails[6]),
          status: partyDetails[7],
          active: partyDetails[7] === 1, // 1 = ACTIVE in the enum
          memberCount: Number(partyDetails[8]),
          documentVerifiedMemberCount: Number(partyDetails[9]),
          verifiedMemberCount: Number(partyDetails[10]),
          isUserMember: userParty === id,
          isUserLeader:
            walletAddress?.toLowerCase() === partyDetails[5].toLowerCase(),
        };
      });

      const fetchedParties = await Promise.all(partyPromises);
      setParties(fetchedParties);
    } catch (error) {
      console.error("Error fetching political parties from blockchain:", error);
      showToast("Failed to load political parties", "error");
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, showToast]);

  useEffect(() => {
    fetchParties();
  }, [fetchParties]);

  // Filter parties based on tab selection
  const filteredParties = parties
    .filter((party) => {
      // First filter for parties the user is not a member of - use userPartyId
      if (party.id === userPartyId) return false;

      // Then filter based on tab
      if (activeTab === "pending") {
        return party.status === 0; // Show only pending parties
      } else {
        return party.status !== 0; // Hide pending parties for other tabs
      }
    })
    .sort((a, b) => {
      if (activeTab === "top") {
        // Sort by member count (highest first) for Top tab
        return b.memberCount - a.memberCount;
      } else if (activeTab === "trending") {
        // For trending tab: mix of recency and member count
        // This simple formula weights both factors
        const trendingScoreA =
          a.memberCount * (1 + (Date.now() / 1000 - a.creationTime) / 86400);
        const trendingScoreB =
          b.memberCount * (1 + (Date.now() / 1000 - b.creationTime) / 86400);
        return trendingScoreB - trendingScoreA;
      } else {
        // Default to reverse chronological order (newest first) for New tab
        return b.creationTime - a.creationTime;
      }
    });

  const performUsernameLookup = async (
    username: string,
    setAddress: (address: string) => void,
    setError: (error: string) => void,
    setIsLoading: (loading: boolean) => void,
    setResult: (result: any) => void
  ) => {
    if (!username || !username.trim()) {
      setError("Please enter a username");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      // Use MiniKit API to look up username (if available)
      if (MiniKit.isInstalled()) {
        try {
          // Try to get address by username first
          const response = await fetch(
            `https://usernames.worldcoin.org/api/v1/${encodeURIComponent(username.trim())}`
          );

          if (!response.ok) {
            if (response.status === 404) {
              setError("Username not found");
            } else {
              setError(`Error: ${response.status} ${response.statusText}`);
            }
            setIsLoading(false);
            return;
          }

          const data = await response.json();
          setResult(data);

          // Set the address for the transaction if we found a result
          if (data.address) {
            setAddress(data.address);
          }
        } catch (error) {
          console.error("[Username] Error looking up username via API:", error);
          setError("Failed to look up username. Please try again.");
        }
      } else {
        setError("Please install MiniKit to look up usernames");
      }
    } catch (error) {
      setError("Failed to look up username. Please try again.");
      console.error("[Username] Username lookup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const lookupLeaderUsername = async () => {
    await performUsernameLookup(
      leaderUsername,
      setNewLeaderAddress,
      setLeaderLookupError,
      setIsLeaderLookingUp,
      setLeaderLookupResult
    );
  };

  const lookupMemberUsername = async () => {
    await performUsernameLookup(
      memberUsername,
      setMemberToRemove,
      setMemberLookupError,
      setIsMemberLookingUp,
      setMemberLookupResult
    );
  };

  const lookupUsername = async () => {
    await performUsernameLookup(
      bannedMemberUsername,
      setBannedMemberToUnban,
      setLookupError,
      setIsLookingUp,
      setLookupResult
    );
  };

  const lookupBanUsername = async () => {
    await performUsernameLookup(
      memberToBanUsername,
      setMemberToBan,
      setBanLookupError,
      setIsBanLookingUp,
      setBanLookupResult
    );
  };

  const joinParty = async (partyId: number) => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    // Use userPartyId directly instead of finding in the array
    if (userPartyId > 0) {
      // Get party details from parties array for the drawer
      const userCurrentParty = parties.find(
        (party) => party.id === userPartyId
      );
      if (userCurrentParty) {
        setPartyToLeaveFrom(userCurrentParty);
        setIsLeaveConfirmDrawerOpen(true);
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

      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          showToast("Failed to join party", "error");
        }
      } else {
        // Only update optimistically after user confirms transaction
        setParties((prevParties) =>
          prevParties.map((party) =>
            party.id === partyId
              ? {
                  ...party,
                  isUserMember: true,
                  memberCount: party.memberCount + 1,
                }
              : party
          )
        );
        setUserPartyId(partyId);
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
        // Only update optimistically after user confirms transaction
        setParties((prevParties) =>
          prevParties.map((party) =>
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

    // Additional validation before submitting to the contract
    if (!createPartyForm.name.trim()) {
      showToast("Party name cannot be empty", "error");
      return;
    }

    if (!createPartyForm.shortName.trim()) {
      showToast("Short name cannot be empty", "error");
      return;
    }

    if (!createPartyForm.description.trim()) {
      showToast("Description cannot be empty", "error");
      return;
    }

    // Official link is optional, but if provided, it cannot be empty
    if (
      createPartyForm.officialLink.trim() === "" &&
      createPartyForm.officialLink !== ""
    ) {
      showToast("Official link cannot contain only whitespace", "error");
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
              createPartyForm.name.trim(),
              createPartyForm.shortName.trim(),
              createPartyForm.description.trim(),
              createPartyForm.officialLink.trim(),
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
        const optimisticPartyId = parties.length + 1; // Temporary ID that's different from existing ones

        const optimisticParty: Party = {
          id: optimisticPartyId, // Use the optimistic ID
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
          isUserLeader: true,
        };

        setParties((prevParties) => [...prevParties, optimisticParty]);
        // Also update userPartyId so it shows in "My party" section
        setUserPartyId(optimisticPartyId);
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
      // Update name if changed
      if (updatePartyForm.name.trim() !== selectedParty.name) {
        const { finalPayload: namePayload } =
          await MiniKit.commandsAsync.sendTransaction({
            transaction: [
              {
                address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
                abi: parseAbi([
                  "function updatePartyName(uint256 _partyId, string memory _name) external",
                ]),
                functionName: "updatePartyName",
                args: [BigInt(selectedParty.id), updatePartyForm.name.trim()],
              },
            ],
          });

        if (namePayload.status === "success") {
          // Update optimistically right after this specific transaction succeeds
          setParties((prevParties) =>
            prevParties.map((party) =>
              party.id === selectedParty.id
                ? { ...party, name: updatePartyForm.name.trim() }
                : party
            )
          );
          // Also update selectedParty to reflect changes
          setSelectedParty((prev) =>
            prev ? { ...prev, name: updatePartyForm.name.trim() } : null
          );
          showToast("Party name updated successfully", "success");
        } else if (namePayload.error_code !== "user_rejected") {
          showToast("Failed to update party name", "error");
        }
      }

      // Update short name if changed
      if (updatePartyForm.shortName.trim() !== selectedParty.shortName) {
        const { finalPayload: shortNamePayload } =
          await MiniKit.commandsAsync.sendTransaction({
            transaction: [
              {
                address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
                abi: parseAbi([
                  "function updatePartyShortName(uint256 _partyId, string memory _shortName) external",
                ]),
                functionName: "updatePartyShortName",
                args: [
                  BigInt(selectedParty.id),
                  updatePartyForm.shortName.trim(),
                ],
              },
            ],
          });

        if (shortNamePayload.status === "success") {
          // Update optimistically right after this specific transaction succeeds
          setParties((prevParties) =>
            prevParties.map((party) =>
              party.id === selectedParty.id
                ? { ...party, shortName: updatePartyForm.shortName.trim() }
                : party
            )
          );
          // Also update selectedParty to reflect changes
          setSelectedParty((prev) =>
            prev
              ? { ...prev, shortName: updatePartyForm.shortName.trim() }
              : null
          );
          showToast("Party short name updated successfully", "success");
        } else if (shortNamePayload.error_code !== "user_rejected") {
          showToast("Failed to update party short name", "error");
        }
      }

      // Update description if changed
      if (updatePartyForm.description.trim() !== selectedParty.description) {
        const { finalPayload: descPayload } =
          await MiniKit.commandsAsync.sendTransaction({
            transaction: [
              {
                address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
                abi: parseAbi([
                  "function updatePartyDescription(uint256 _partyId, string memory _description) external",
                ]),
                functionName: "updatePartyDescription",
                args: [
                  BigInt(selectedParty.id),
                  updatePartyForm.description.trim(),
                ],
              },
            ],
          });

        if (descPayload.status === "success") {
          // Update optimistically right after this specific transaction succeeds
          setParties((prevParties) =>
            prevParties.map((party) =>
              party.id === selectedParty.id
                ? { ...party, description: updatePartyForm.description.trim() }
                : party
            )
          );
          // Also update selectedParty to reflect changes
          setSelectedParty((prev) =>
            prev
              ? { ...prev, description: updatePartyForm.description.trim() }
              : null
          );
          showToast("Party description updated successfully", "success");
        } else if (descPayload.error_code !== "user_rejected") {
          showToast("Failed to update party description", "error");
        }
      }

      // Update official link if changed
      if (updatePartyForm.officialLink.trim() !== selectedParty.officialLink) {
        // If officialLink is empty, use a placeholder to satisfy the non-empty validation
        const linkToUse =
          updatePartyForm.officialLink.trim() === ""
            ? "https://placeholder.com"
            : updatePartyForm.officialLink.trim();

        const { finalPayload: linkPayload } =
          await MiniKit.commandsAsync.sendTransaction({
            transaction: [
              {
                address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
                abi: parseAbi([
                  "function updateOfficialLink(uint256 _partyId, string memory _officialLink) external",
                ]),
                functionName: "updateOfficialLink",
                args: [BigInt(selectedParty.id), linkToUse],
              },
            ],
          });

        if (linkPayload.status === "success") {
          // Update optimistically right after this specific transaction succeeds
          setParties((prevParties) =>
            prevParties.map((party) =>
              party.id === selectedParty.id
                ? { ...party, officialLink: linkToUse }
                : party
            )
          );
          // Also update selectedParty to reflect changes
          setSelectedParty((prev) =>
            prev ? { ...prev, officialLink: linkToUse } : null
          );
          showToast("Party official link updated successfully", "success");
        } else if (linkPayload.error_code !== "user_rejected") {
          showToast("Failed to update official link", "error");
        }
      }
    } catch (error) {
      console.error("Error updating party:", error);
      showToast("Error updating party", "error");
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

        showToast("Member removed successfully", "success");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      showToast("Error removing member", "error");
    } finally {
      setIsProcessing(false);
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

  const handleLeaveAndCreate = async () => {
    if (partyToLeaveFrom) {
      try {
        setIsProcessing(true);
        await leaveParty(partyToLeaveFrom.id);

        // Close the confirmation drawer and open create drawer
        setIsCreateConfirmDrawerOpen(false);
        setTimeout(() => {
          setIsCreateDrawerOpen(true);
        }, 300);
      } catch (error) {
        console.error("Error in leave-and-create flow:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCreatePartyClick = () => {
    // Check if user is already in a party using userPartyId
    if (userPartyId > 0) {
      // Get party details from parties array for the drawer
      const userCurrentParty = parties.find(
        (party) => party.id === userPartyId
      );
      if (userCurrentParty) {
        setPartyToLeaveFrom(userCurrentParty);
        setIsCreateConfirmDrawerOpen(true);
        return;
      }
    }

    // If not in a party, directly open the create drawer
    setIsCreateDrawerOpen(true);
  };

  const deactivateParty = async () => {
    if (!selectedParty || !MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    try {
      setIsProcessing(true);

      // Choose function based on current party status
      const functionName =
        selectedParty.status === 1 || selectedParty.status === 0
          ? "deactivateParty"
          : "reactivateParty";
      const functionAbi = `function ${functionName}(uint256 _partyId) external`;

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
            abi: parseAbi([functionAbi]),
            functionName: functionName,
            args: [BigInt(selectedParty.id)],
          },
        ],
      });

      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          showToast(
            `Failed to ${selectedParty.status !== 2 ? "deactivate" : "reactivate"} party`,
            "error"
          );
        }
      } else {
        // Update party in the UI optimistically - based on the contract behavior
        setParties((prevParties) =>
          prevParties.map((party) =>
            party.id === selectedParty.id
              ? {
                  ...party,
                  active: party.status === 2, // If currently INACTIVE, set active to true
                  // When deactivating: status becomes 2 (INACTIVE)
                  // When reactivating: status becomes 0 (PENDING), not 1 (ACTIVE)
                  status: party.status !== 2 ? 2 : 0,
                }
              : party
          )
        );

        setIsDeactivateDrawerOpen(false);
        showToast(
          `Party ${selectedParty.status !== 2 ? "deactivated" : "reactivated"} successfully`,
          "success"
        );
      }
    } catch (error) {
      console.error(
        `Error ${selectedParty.status !== 2 ? "deactivating" : "reactivating"} party:`,
        error
      );
      showToast(
        `Error ${selectedParty.status !== 2 ? "deactivating" : "reactivating"} party`,
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const unbanMember = async () => {
    if (!selectedParty || !MiniKit.isInstalled() || !bannedMemberToUnban) {
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
              "function unbanMember(uint256 _partyId, address _member) external",
            ]),
            functionName: "unbanMember",
            args: [
              BigInt(selectedParty.id),
              bannedMemberToUnban as `0x${string}`,
            ],
          },
        ],
      });

      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          showToast("Failed to unban member", "error");
        }
      } else {
        showToast("Member unbanned successfully", "success");
      }
    } catch (error) {
      console.error("Error unbanning member:", error);
      showToast("Error unbanning member", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const banMember = async () => {
    if (!selectedParty || !MiniKit.isInstalled() || !memberToBan) {
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
              "function banMember(uint256 _partyId, address _member) external",
            ]),
            functionName: "banMember",
            args: [BigInt(selectedParty.id), memberToBan as `0x${string}`],
          },
        ],
      });

      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          showToast("Failed to ban member", "error");
        }
      } else {
        showToast("Member banned successfully", "success");
      }
    } catch (error) {
      console.error("Error banning member:", error);
      showToast("Error banning member", "error");
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

  const DrawerHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-4">{children}</div>
  );

  const renderPartyCard = (party: Party) => (
    <div
      key={party.id}
      className={`${
        filteredParties.indexOf(party) !== filteredParties.length - 1
          ? "mb-4"
          : ""
      } rounded-xl border border-gray-200 p-4`}
    >
      <div className="flex items-center justify-between">
        <Typography
          as="h3"
          variant={{ variant: "subtitle", level: 1 }}
          className="text-[19px] font-semibold"
        >
          {party.name}
        </Typography>
        <div className="flex items-center gap-2">
          {party.status === 0 && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
              Pending
            </span>
          )}
          {party.status === 2 && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
              Inactive
            </span>
          )}
          {party.isUserLeader && (
            <Dropdown
              trigger={
                <button
                  className="text-gray-600 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                  title="Party Management"
                >
                  <PiGearBold size={16} />
                </button>
              }
              menuItems={[
                {
                  label: "Manage members",
                  onClick: () => {
                    setSelectedParty(party);
                    setIsMemberManagementDrawerOpen(true);
                  },
                },
                {
                  label: "Update party info",
                  onClick: () => openUpdatePartyDrawer(party),
                },
                {
                  label: "Transfer leadership",
                  onClick: () => {
                    setSelectedParty(party);
                    setIsTransferLeadershipDrawerOpen(true);
                  },
                },
                {
                  label:
                    party.status === 2
                      ? "Reactivate party"
                      : "Deactivate party",
                  onClick: () => {
                    setSelectedParty(party);
                    setIsDeactivateDrawerOpen(true);
                  },
                },
              ]}
              align="right"
            />
          )}
        </div>
      </div>

      <Typography
        as="p"
        variant={{ variant: "body", level: 2 }}
        className="mt-3 text-[15px]"
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
        {party.isUserMember ? (
          <Button
            className="px-6"
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => leaveParty(party.id)}
          >
            Leave Party
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
              ? "Join Pending Party"
              : party.status === 2
                ? "Join Inactive Party"
                : "Join Party"}
          </Button>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full">
      {/* My Party Section */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <Typography
            as="h2"
            variant={{ variant: "subtitle", level: 1 }}
            className="text-[19px] font-semibold"
          >
            My party
          </Typography>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-900"
            onClick={handleCreatePartyClick}
            title="Create New Party"
          >
            <FaPlus className="text-gray-500" size={12} />
          </button>
        </div>

        {userPartyId > 0 ? (
          // Display the user's party
          <>
            {parties
              .filter((party) => party.id === userPartyId)
              .map((party) => renderPartyCard(party))}
          </>
        ) : (
          // Message when user hasn't joined or created a political party yet.
          <div className="p-4 text-center text-gray-500">
            You haven&apos;t created or joined a party yet.
          </div>
        )}
      </div>

      <Typography
        as="h2"
        variant={{ variant: "subtitle", level: 1 }}
        className="mb-3 text-[19px] font-semibold"
      >
        Discover
      </Typography>
      {/* Tabs */}
      <div className="mb-2 flex items-center gap-1">
        <button
          className={`h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200 ${
            activeTab === "top" && "bg-gray-100"
          }`}
          onClick={() => setActiveTab("top")}
        >
          Top
        </button>
        <button
          className={`h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200 ${
            activeTab === "trending" && "bg-gray-100"
          }`}
          onClick={() => setActiveTab("trending")}
        >
          Trending
        </button>
        <button
          className={`h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200 ${
            activeTab === "new" && "bg-gray-100"
          }`}
          onClick={() => setActiveTab("new")}
        >
          New
        </button>
        <button
          className={`h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200 ${
            activeTab === "pending" && "bg-gray-100"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
      </div>

      {filteredParties.length === 0 && (
        <div className="my-8 text-center text-gray-500">
          {activeTab === "pending"
            ? "No pending parties available."
            : "No parties available to join."}
        </div>
      )}

      {filteredParties.map((party) => renderPartyCard(party))}

      {/* Create Party Drawer */}
      <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
        <DrawerContent>
          <div className="p-6">
            <DrawerHeader>
              <DrawerTitle>Create New Party</DrawerTitle>
            </DrawerHeader>
            <Form.Root
              onSubmit={(e) => {
                e.preventDefault();
                createParty();
              }}
            >
              <Form.Field name="name" className="mt-4">
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  Party name
                </Typography>
                <Form.Control asChild>
                  <Input
                    label="Enter party name"
                    value={createPartyForm.name}
                    onChange={(e) =>
                      setCreatePartyForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    required
                    maxLength={MAX_STRING_LENGTH}
                  />
                </Form.Control>
                <Form.Message match="valueMissing" error>
                  Please enter a party name
                </Form.Message>
                {createPartyForm.name.length >= MAX_STRING_LENGTH * 0.9 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${createPartyForm.name.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {createPartyForm.name.length >= MAX_STRING_LENGTH
                      ? "Maximum character limit reached"
                      : `Approaching character limit: ${createPartyForm.name.length}/${MAX_STRING_LENGTH}`}
                  </Typography>
                )}
              </Form.Field>

              <Form.Field name="shortName" className="mt-4">
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  Short name
                </Typography>
                <Form.Control asChild>
                  <Input
                    label="Enter short name or abbreviation"
                    value={createPartyForm.shortName}
                    onChange={(e) =>
                      setCreatePartyForm((prev) => ({
                        ...prev,
                        shortName: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    maxLength={MAX_SHORT_NAME_LENGTH}
                    required
                  />
                </Form.Control>
                <Form.Message match="valueMissing" error>
                  Please enter a short name
                </Form.Message>
                {createPartyForm.shortName.length >=
                  MAX_SHORT_NAME_LENGTH * 0.8 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${createPartyForm.shortName.length >= MAX_SHORT_NAME_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {createPartyForm.shortName.length >= MAX_SHORT_NAME_LENGTH
                      ? "Maximum character limit reached"
                      : `Approaching character limit: ${createPartyForm.shortName.length}/${MAX_SHORT_NAME_LENGTH}`}
                  </Typography>
                )}
              </Form.Field>

              <Form.Field name="description" className="mt-4">
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  Description
                </Typography>
                <Form.Control asChild>
                  <Textarea
                    placeholder="Enter party description"
                    value={createPartyForm.description}
                    onChange={(e) =>
                      setCreatePartyForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    rows={4}
                    required
                    maxLength={MAX_STRING_LENGTH}
                  />
                </Form.Control>
                <Form.Message match="valueMissing" error>
                  Please enter a description
                </Form.Message>
                {createPartyForm.description.length >=
                  MAX_STRING_LENGTH * 0.9 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${createPartyForm.description.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {createPartyForm.description.length >= MAX_STRING_LENGTH
                      ? "Maximum character limit reached"
                      : `Approaching character limit: ${createPartyForm.description.length}/${MAX_STRING_LENGTH}`}
                  </Typography>
                )}
              </Form.Field>

              <Form.Field name="officialLink" className="mt-4">
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  Official link
                </Typography>
                <Form.Control asChild>
                  <Input
                    label="Enter official website or community link (optional)"
                    value={createPartyForm.officialLink}
                    onChange={(e) =>
                      setCreatePartyForm((prev) => ({
                        ...prev,
                        officialLink: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    maxLength={MAX_STRING_LENGTH}
                  />
                </Form.Control>
                {createPartyForm.officialLink.length >=
                  MAX_STRING_LENGTH * 0.9 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${createPartyForm.officialLink.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {createPartyForm.officialLink.length >= MAX_STRING_LENGTH
                      ? "Maximum character limit reached"
                      : `Approaching character limit: ${createPartyForm.officialLink.length}/${MAX_STRING_LENGTH}`}
                  </Typography>
                )}
              </Form.Field>

              <Form.Submit asChild className="mt-4">
                <Button variant="primary" fullWidth disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Party"}
                </Button>
              </Form.Submit>
            </Form.Root>
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
            <DrawerHeader>
              <DrawerTitle>Update Party Details</DrawerTitle>
            </DrawerHeader>
            <Form.Root
              onSubmit={(e) => {
                e.preventDefault();
                updateParty();
              }}
            >
              <Form.Field name="name" className="mt-4">
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  Party name
                </Typography>
                <Form.Control asChild>
                  <Input
                    label="Enter party name"
                    value={updatePartyForm.name}
                    onChange={(e) =>
                      setUpdatePartyForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    required
                    maxLength={MAX_STRING_LENGTH}
                  />
                </Form.Control>
                <Form.Message match="valueMissing" error>
                  Please enter a party name
                </Form.Message>
                {updatePartyForm.name.length >= MAX_STRING_LENGTH * 0.9 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${updatePartyForm.name.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {updatePartyForm.name.length >= MAX_STRING_LENGTH
                      ? "Maximum character limit reached"
                      : `Approaching character limit: ${updatePartyForm.name.length}/${MAX_STRING_LENGTH}`}
                  </Typography>
                )}
              </Form.Field>

              <Form.Field name="shortName" className="mt-4">
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  Short name
                </Typography>
                <Form.Control asChild>
                  <Input
                    label="Enter short name or abbreviation"
                    value={updatePartyForm.shortName}
                    onChange={(e) =>
                      setUpdatePartyForm((prev) => ({
                        ...prev,
                        shortName: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    maxLength={MAX_SHORT_NAME_LENGTH}
                    required
                  />
                </Form.Control>
                <Form.Message match="valueMissing" error>
                  Please enter a short name
                </Form.Message>
                {updatePartyForm.shortName.length >=
                  MAX_SHORT_NAME_LENGTH * 0.8 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${updatePartyForm.shortName.length >= MAX_SHORT_NAME_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {updatePartyForm.shortName.length >= MAX_SHORT_NAME_LENGTH
                      ? "Maximum character limit reached"
                      : `Approaching character limit: ${updatePartyForm.shortName.length}/${MAX_SHORT_NAME_LENGTH}`}
                  </Typography>
                )}
              </Form.Field>

              <Form.Field name="description" className="mt-4">
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  Description
                </Typography>
                <Form.Control asChild>
                  <Textarea
                    placeholder="Enter party description"
                    value={updatePartyForm.description}
                    onChange={(e) =>
                      setUpdatePartyForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    rows={4}
                    required
                    maxLength={MAX_STRING_LENGTH}
                  />
                </Form.Control>
                <Form.Message match="valueMissing" error>
                  Please enter a description
                </Form.Message>
                {updatePartyForm.description.length >=
                  MAX_STRING_LENGTH * 0.9 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${updatePartyForm.description.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {updatePartyForm.description.length >= MAX_STRING_LENGTH
                      ? "Maximum character limit reached"
                      : `Approaching character limit: ${updatePartyForm.description.length}/${MAX_STRING_LENGTH}`}
                  </Typography>
                )}
              </Form.Field>

              <Form.Field name="officialLink" className="mt-4">
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  Official link
                </Typography>
                <Form.Control asChild>
                  <Input
                    label="Enter official website or community link (optional)"
                    value={updatePartyForm.officialLink}
                    onChange={(e) =>
                      setUpdatePartyForm((prev) => ({
                        ...prev,
                        officialLink: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    maxLength={MAX_STRING_LENGTH}
                  />
                </Form.Control>
                {updatePartyForm.officialLink.length >=
                  MAX_STRING_LENGTH * 0.9 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${updatePartyForm.officialLink.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {updatePartyForm.officialLink.length >= MAX_STRING_LENGTH
                      ? "Maximum character limit reached"
                      : `Approaching character limit: ${updatePartyForm.officialLink.length}/${MAX_STRING_LENGTH}`}
                  </Typography>
                )}
              </Form.Field>

              <Form.Submit asChild className="mt-4">
                <Button variant="primary" fullWidth disabled={isProcessing}>
                  {isProcessing ? "Updating..." : "Update Party"}
                </Button>
              </Form.Submit>
            </Form.Root>
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
            <DrawerHeader>
              <DrawerTitle>Transfer Leadership</DrawerTitle>
            </DrawerHeader>
            <Typography
              as="p"
              variant={{ variant: "body", level: 2 }}
              className="text-[15px]"
            >
              Enter the wallet address of the new leader or look up by username.
              The address must belong to an existing party member.
            </Typography>

            {/* Username lookup section */}
            <div className="mb-4">
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block"
              >
                Look up by username
              </Typography>
              <div className="flex gap-2">
                <Input
                  label="Enter World App username"
                  value={leaderUsername}
                  onChange={(e) => setLeaderUsername(e.target.value)}
                  onFocus={handleInputFocus}
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  onClick={lookupLeaderUsername}
                  disabled={isLeaderLookingUp || !leaderUsername.trim()}
                >
                  {isLeaderLookingUp ? "Looking up..." : "Lookup"}
                </Button>
              </div>

              {leaderLookupError && (
                <Typography as="p" className="text-red-500 mt-2 text-sm">
                  {leaderLookupError}
                </Typography>
              )}

              {/* Show lookup result if available */}
              {leaderLookupResult && (
                <div className="mt-2 rounded-lg bg-gray-50 p-3">
                  <Typography
                    as="p"
                    variant={{ variant: "caption", level: 1 }}
                    className="text-gray-700"
                  >
                    Found user:{" "}
                    <span className="font-semibold">{leaderUsername}</span>
                  </Typography>
                  <Typography
                    as="p"
                    variant={{ variant: "caption", level: 1 }}
                    className="truncate text-gray-500"
                  >
                    Address: {leaderLookupResult.address}
                  </Typography>
                </div>
              )}
            </div>

            <Form.Root
              onSubmit={(e) => {
                e.preventDefault();
                transferLeadership();
              }}
            >
              <Form.Field name="leaderAddress">
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  New leader address
                </Typography>
                <Form.Control asChild>
                  <Input
                    label="Enter wallet address (0x...)"
                    value={newLeaderAddress}
                    onChange={(e) => setNewLeaderAddress(e.target.value)}
                    onFocus={handleInputFocus}
                    required
                    pattern="^0x[a-fA-F0-9]{40}$"
                  />
                </Form.Control>
                <Form.Message match="valueMissing" error>
                  Please enter an address
                </Form.Message>
                <Form.Message match="patternMismatch" error>
                  Please enter a valid Ethereum address (0x...)
                </Form.Message>
              </Form.Field>
              <Form.Submit asChild className="mt-4">
                <Button variant="primary" fullWidth disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Transfer Leadership"}
                </Button>
              </Form.Submit>
            </Form.Root>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Leave Confirmation Drawer */}
      <Drawer
        open={isLeaveConfirmDrawerOpen}
        onOpenChange={setIsLeaveConfirmDrawerOpen}
      >
        <DrawerContent>
          <div className="flex flex-col p-6">
            <DrawerHeader>
              <DrawerTitle>Leave Current Party</DrawerTitle>
            </DrawerHeader>
            <Typography
              as="p"
              variant={{ variant: "subtitle", level: 1 }}
              className="mx-auto mt-4 text-center text-gray-500"
            >
              You are already a member of {partyToLeaveFrom?.name}. You must
              leave your current party before joining a new one.
              {partyToLeaveFrom?.isUserLeader &&
                " Note: You are currently the leader of this party. If you leave, leadership will be lost or reassigned by the system."}
            </Typography>
            <Button
              variant="primary"
              fullWidth
              onClick={handleLeave}
              disabled={isProcessing}
              className="mt-10"
            >
              {isProcessing
                ? "Leaving..."
                : `Leave ${partyToLeaveFrom?.shortName}`}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Create Confirmation Drawer */}
      <Drawer
        open={isCreateConfirmDrawerOpen}
        onOpenChange={setIsCreateConfirmDrawerOpen}
      >
        <DrawerContent>
          <div className="flex flex-col p-6">
            <DrawerHeader>
              <DrawerTitle>Leave Current Party</DrawerTitle>
            </DrawerHeader>
            <Typography
              as="p"
              variant={{ variant: "subtitle", level: 1 }}
              className="mx-auto mt-4 text-center text-gray-500"
            >
              You are already a member of {partyToLeaveFrom?.name}. You must
              leave your current party before creating a new one.
              {partyToLeaveFrom?.isUserLeader &&
                " Note: You are currently the leader of this party. If you leave, leadership will be lost or reassigned by the system."}
            </Typography>
            <Button
              variant="primary"
              fullWidth
              onClick={handleLeaveAndCreate}
              disabled={isProcessing}
              className="mt-10"
            >
              {isProcessing
                ? "Processing..."
                : `Leave ${partyToLeaveFrom?.shortName} and create`}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Deactivate Party Drawer */}
      <Drawer
        open={isDeactivateDrawerOpen}
        onOpenChange={setIsDeactivateDrawerOpen}
      >
        <DrawerContent>
          <div className="flex flex-col p-6">
            <DrawerHeader>
              <DrawerTitle>
                {selectedParty?.status === 2
                  ? "Reactivate Party"
                  : "Deactivate Party"}
              </DrawerTitle>
            </DrawerHeader>
            <Typography
              as="p"
              variant={{ variant: "subtitle", level: 1 }}
              className="mx-auto mt-4 text-center text-gray-500"
            >
              {selectedParty?.status === 0
                ? "Are you sure you want to deactivate this pending party? Inactive parties won't appear in the main listings."
                : selectedParty?.status === 1
                  ? "Are you sure you want to deactivate this party? Inactive parties won't appear in the main listings."
                  : "Do you want to reactivate this party?"}
            </Typography>
            <Button
              variant="primary"
              fullWidth
              onClick={deactivateParty}
              disabled={isProcessing}
              className="mt-10"
            >
              {isProcessing
                ? "Processing..."
                : selectedParty?.status === 0
                  ? "Deactivate Pending Party"
                  : selectedParty?.status === 1
                    ? "Deactivate Party"
                    : "Reactivate Party"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Member Management Drawer */}
      <Drawer
        open={isMemberManagementDrawerOpen}
        onOpenChange={setIsMemberManagementDrawerOpen}
      >
        <DrawerContent>
          <div className="flex flex-col gap-4 p-6">
            <DrawerHeader>
              <DrawerTitle>Member Management</DrawerTitle>
            </DrawerHeader>

            <div className="mb-4 flex items-center gap-1 border-b">
              <button
                className={`h-9 items-center px-4 font-sans text-sm font-medium ${
                  activeMemberTab === "remove" ? "border-black border-b-2" : ""
                }`}
                onClick={() => setActiveMemberTab("remove")}
              >
                Remove
              </button>
              <button
                className={`h-9 items-center px-4 font-sans text-sm font-medium ${
                  activeMemberTab === "ban" ? "border-black border-b-2" : ""
                }`}
                onClick={() => setActiveMemberTab("ban")}
              >
                Ban
              </button>
              <button
                className={`h-9 items-center px-4 font-sans text-sm font-medium ${
                  activeMemberTab === "unban" ? "border-black border-b-2" : ""
                }`}
                onClick={() => setActiveMemberTab("unban")}
              >
                Unban
              </button>
            </div>

            {/* Remove Member Panel */}
            {activeMemberTab === "remove" && (
              <>
                <Typography
                  as="p"
                  variant={{ variant: "body", level: 2 }}
                  className="text-[15px]"
                >
                  Enter the wallet address of the member you want to remove or
                  look up by username.
                </Typography>

                {/* Username lookup section for member removal in the tab */}
                <div className="mb-4">
                  <Typography
                    as="label"
                    variant={{ variant: "caption", level: 1 }}
                    className="mb-1.5 block"
                  >
                    Look up by username
                  </Typography>
                  <div className="flex gap-2">
                    <Input
                      label="Enter World App username"
                      value={memberUsername}
                      onChange={(e) => setMemberUsername(e.target.value)}
                      onFocus={handleInputFocus}
                      className="flex-1"
                    />
                    <Button
                      variant="secondary"
                      onClick={lookupMemberUsername}
                      disabled={isMemberLookingUp || !memberUsername.trim()}
                    >
                      {isMemberLookingUp ? "Looking up..." : "Lookup"}
                    </Button>
                  </div>

                  {memberLookupError && (
                    <Typography as="p" className="text-red-500 mt-2 text-sm">
                      {memberLookupError}
                    </Typography>
                  )}

                  {/* Show lookup result if available */}
                  {memberLookupResult && (
                    <div className="mt-2 rounded-lg bg-gray-50 p-3">
                      <Typography
                        as="p"
                        variant={{ variant: "caption", level: 1 }}
                        className="text-gray-700"
                      >
                        Found user:{" "}
                        <span className="font-semibold">{memberUsername}</span>
                      </Typography>
                      <Typography
                        as="p"
                        variant={{ variant: "caption", level: 1 }}
                        className="truncate text-gray-500"
                      >
                        Address: {memberLookupResult.address}
                      </Typography>
                    </div>
                  )}
                </div>

                <Form.Root
                  onSubmit={(e) => {
                    e.preventDefault();
                    removeMember();
                  }}
                >
                  <Form.Field name="memberAddress">
                    <Typography
                      as="label"
                      variant={{ variant: "caption", level: 1 }}
                      className="mb-1.5 block font-medium"
                    >
                      Member address
                    </Typography>
                    <Form.Control asChild>
                      <Input
                        label="Enter wallet address (0x...)"
                        value={memberToRemove}
                        onChange={(e) => setMemberToRemove(e.target.value)}
                        onFocus={handleInputFocus}
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                      />
                    </Form.Control>
                    <Form.Message match="valueMissing" error>
                      Please enter an address
                    </Form.Message>
                    <Form.Message match="patternMismatch" error>
                      Please enter a valid Ethereum address (0x...)
                    </Form.Message>
                  </Form.Field>
                  <Form.Submit asChild className="mt-4">
                    <Button variant="primary" fullWidth disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Remove Member"}
                    </Button>
                  </Form.Submit>
                </Form.Root>
              </>
            )}

            {/* Ban Member Panel */}
            {activeMemberTab === "ban" && (
              <>
                <Typography
                  as="p"
                  variant={{ variant: "body", level: 2 }}
                  className="text-[15px]"
                >
                  Enter the username or wallet address of the member you want to
                  ban from the party.
                </Typography>

                {/* Username lookup section */}
                <div className="mb-4">
                  <Typography
                    as="label"
                    variant={{ variant: "caption", level: 1 }}
                    className="mb-1.5 block"
                  >
                    Look up by username
                  </Typography>
                  <div className="flex gap-2">
                    <Input
                      label="Enter World App username"
                      value={memberToBanUsername}
                      onChange={(e) => setMemberToBanUsername(e.target.value)}
                      onFocus={handleInputFocus}
                      className="flex-1"
                    />
                    <Button
                      variant="secondary"
                      onClick={lookupBanUsername}
                      disabled={isBanLookingUp || !memberToBanUsername.trim()}
                    >
                      {isBanLookingUp ? "Looking up..." : "Lookup"}
                    </Button>
                  </div>

                  {banLookupError && (
                    <Typography as="p" className="text-red-500 mt-2 text-sm">
                      {banLookupError}
                    </Typography>
                  )}

                  {/* Show lookup result if available */}
                  {banLookupResult && (
                    <div className="mt-2 rounded-lg bg-gray-50 p-3">
                      <Typography
                        as="p"
                        variant={{ variant: "caption", level: 1 }}
                        className="text-gray-700"
                      >
                        Found user:{" "}
                        <span className="font-semibold">
                          {memberToBanUsername}
                        </span>
                      </Typography>
                      <Typography
                        as="p"
                        variant={{ variant: "caption", level: 1 }}
                        className="truncate text-gray-500"
                      >
                        Address: {banLookupResult.address}
                      </Typography>
                    </div>
                  )}
                </div>

                <Form.Root
                  onSubmit={(e) => {
                    e.preventDefault();
                    banMember();
                  }}
                >
                  <Form.Field name="memberAddress">
                    <Typography
                      as="label"
                      variant={{ variant: "caption", level: 1 }}
                      className="mb-1.5 block font-medium"
                    >
                      Member address
                    </Typography>
                    <Form.Control asChild>
                      <Input
                        label="Enter wallet address (0x...)"
                        value={memberToBan}
                        onChange={(e) => setMemberToBan(e.target.value)}
                        onFocus={handleInputFocus}
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                      />
                    </Form.Control>
                    <Form.Message match="valueMissing" error>
                      Please enter an address
                    </Form.Message>
                    <Form.Message match="patternMismatch" error>
                      Please enter a valid Ethereum address (0x...)
                    </Form.Message>
                  </Form.Field>
                  <Form.Submit asChild className="mt-4">
                    <Button variant="primary" fullWidth disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Ban Member"}
                    </Button>
                  </Form.Submit>
                </Form.Root>
              </>
            )}

            {/* Unban Member Panel */}
            {activeMemberTab === "unban" && (
              <>
                <Typography
                  as="p"
                  variant={{ variant: "body", level: 2 }}
                  className="text-[15px]"
                >
                  Enter the username or wallet address of the banned member you
                  want to allow back to the party.
                </Typography>

                {/* Username lookup section */}
                <div className="mb-4">
                  <Typography
                    as="label"
                    variant={{ variant: "caption", level: 1 }}
                    className="mb-1.5 block"
                  >
                    Look up by username
                  </Typography>
                  <div className="flex gap-2">
                    <Input
                      label="Enter World App username"
                      value={bannedMemberUsername}
                      onChange={(e) => setBannedMemberUsername(e.target.value)}
                      onFocus={handleInputFocus}
                      className="flex-1"
                    />
                    <Button
                      variant="secondary"
                      onClick={lookupUsername}
                      disabled={isLookingUp || !bannedMemberUsername.trim()}
                    >
                      {isLookingUp ? "Looking up..." : "Lookup"}
                    </Button>
                  </div>

                  {lookupError && (
                    <Typography as="p" className="text-red-500 mt-2 text-sm">
                      {lookupError}
                    </Typography>
                  )}

                  {/* Show lookup result if available */}
                  {lookupResult && (
                    <div className="mt-2 rounded-lg bg-gray-50 p-3">
                      <Typography
                        as="p"
                        variant={{ variant: "caption", level: 1 }}
                        className="text-gray-700"
                      >
                        Found user:{" "}
                        <span className="font-semibold">
                          {bannedMemberUsername}
                        </span>
                      </Typography>
                      <Typography
                        as="p"
                        variant={{ variant: "caption", level: 1 }}
                        className="truncate text-gray-500"
                      >
                        Address: {lookupResult.address}
                      </Typography>
                    </div>
                  )}
                </div>

                <Form.Root
                  onSubmit={(e) => {
                    e.preventDefault();
                    unbanMember();
                  }}
                >
                  <Form.Field name="bannedMemberAddress">
                    <Typography
                      as="label"
                      variant={{ variant: "caption", level: 1 }}
                      className="mb-1.5 block font-medium"
                    >
                      Member address
                    </Typography>
                    <Form.Control asChild>
                      <Input
                        label="Enter wallet address (0x...)"
                        value={bannedMemberToUnban}
                        onChange={(e) => setBannedMemberToUnban(e.target.value)}
                        onFocus={handleInputFocus}
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                      />
                    </Form.Control>
                    <Form.Message match="valueMissing" error>
                      Please enter an address
                    </Form.Message>
                    <Form.Message match="patternMismatch" error>
                      Please enter a valid Ethereum address (0x...)
                    </Form.Message>
                  </Form.Field>
                  <Form.Submit asChild className="mt-4">
                    <Button variant="primary" fullWidth disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Unban Member"}
                    </Button>
                  </Form.Submit>
                </Form.Root>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
