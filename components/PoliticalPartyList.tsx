"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import type { FocusEvent as ReactFocusEvent } from "react";
import { parseAbi } from "viem";
import { viemClient } from "@/lib/viemClient";
import { useWallet } from "@/components/contexts/WalletContext";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { MiniKit } from "@worldcoin/minikit-js";
import { useToast } from "@/components/ui/Toast";
import {
  PiLinkSimpleBold,
  PiUsersBold,
  PiGearBold,
  PiInfoFill,
} from "react-icons/pi";
import { Drawer, DrawerContent } from "@/components/ui/Drawer";
import { Form, Input } from "@worldcoin/mini-apps-ui-kit-react";
import { Textarea } from "@/components/ui/Textarea";
import { FaPlus } from "react-icons/fa";
import { Dropdown } from "@/components/ui/Dropdown";
import { DrawerTitle } from "@/components/ui/Drawer";
import { LoadingSkeleton, PartySkeletonCard } from "./PartySkeletons";
import { useTranslations } from "@/hooks/useTranslations";
import { TabSwiper } from "@/components/TabSwiper";
import Link from "next/link";
import { useParties } from "@/components/contexts/PartiesContext";

const POLITICAL_PARTY_REGISTRY_ADDRESS: string =
  "0x70a993E1D1102F018365F966B5Fc009e8FA9b7dC";

const MAX_STRING_LENGTH = 256;
const MAX_SHORT_NAME_LENGTH = 16;

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
  const dictionary = useTranslations(lang);
  const [activeTab, setActiveTab] = useState<
    "top" | "trending" | "new" | "pending"
  >("new");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayCount, setDisplayCount] = useState<number>(20);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Get everything from context
  const {
    activeParties,
    pendingParties,
    activeLoading,
    pendingLoading,
    userPartyId,
    fetchActiveParties,
    fetchPendingParties,
    setUserPartyId,
    setParties,
    getOptimisticPartyId,
  } = useParties();

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
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
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

  // Keep your useEffect for pending parties but use the context version
  useEffect(() => {
    if (activeTab === "pending" && pendingParties.length === 0) {
      console.log("Fetching pending parties from context");
      fetchPendingParties();
    }
  }, [activeTab, pendingParties.length, fetchPendingParties]);

  useEffect(() => {
    // Mark govern section as visited when this component loads
    if (typeof window !== "undefined") {
      localStorage.setItem("governVisited", "true");
    }
  }, []);

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

  // Handle scroll events to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      // Show button when user has scrolled down 300px from the top
      setShowScrollToTop(window.scrollY > 300);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      new: [],
      trending: [],
      top: [],
      pending: pendingParties,
    };

    // Sort active parties for "new" tab (newest first)
    const sortedByCreation = [...activeParties].sort(
      (a, b) => b.creationTime - a.creationTime
    );

    // Shuffle the top 40
    const top40 = sortedByCreation.slice(0, 40);
    for (let i = top40.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [top40[i], top40[j]] = [top40[j], top40[i]];
    }
    partyLists.new = [...top40, ...sortedByCreation.slice(40)];

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
  }, [activeParties, pendingParties]);

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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      const loadParty = async () => {
        try {
          setIsLoading(true);
          const fetchedParty = await fetchPartyFromBlockchain(partyId);

          if (fetchedParty) {
            setParty(fetchedParty);
          } else {
            setError("Failed to load your party");
            showToast(
              "Failed to load your party information from blockchain",
              "error"
            );
          }
        } catch (err) {
          console.error("Error in FetchUserParty:", err);
          setError("Failed to load your party");
          showToast(
            "Failed to load your party information from blockchain",
            "error"
          );
        } finally {
          setIsLoading(false);
        }
      };

      loadParty();
    }, [partyId, walletAddress, showToast]);

    if (isLoading) {
      return <PartySkeletonCard />;
    }

    if (error) {
      return <div className="p-4 text-center text-gray-500">{error}</div>;
    }

    if (!party) {
      return (
        <div className="p-4 text-center text-gray-500">Party not found</div>
      );
    }

    return renderPartyCard(party);
  };

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
        // Get optimistic ID from context
        const optimisticPartyId = getOptimisticPartyId();

        const optimisticParty: Party = {
          id: optimisticPartyId,
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

        setParties((prevParties: Party[]) => [...prevParties, optimisticParty]);
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
      // Create an array to track which fields need updating
      const fieldsToUpdate = [];

      if (updatePartyForm.name.trim() !== selectedParty.name) {
        fieldsToUpdate.push("name");
      }
      if (updatePartyForm.shortName.trim() !== selectedParty.shortName) {
        fieldsToUpdate.push("shortName");
      }
      if (updatePartyForm.description.trim() !== selectedParty.description) {
        fieldsToUpdate.push("description");
      }
      if (updatePartyForm.officialLink.trim() !== selectedParty.officialLink) {
        fieldsToUpdate.push("officialLink");
      }

      // If no fields need updating, return early
      if (fieldsToUpdate.length === 0) {
        showToast("No changes to update", "info");
        return;
      }

      // Show which fields will be updated
      showToast(
        `Updates will require ${fieldsToUpdate.length} approval(s)`,
        "info"
      );

      let allSuccessful = true;

      // Update name if changed
      if (fieldsToUpdate.includes("name")) {
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
          setParties((prevParties: Party[]) =>
            prevParties.map((party: Party) =>
              party.id === selectedParty.id
                ? { ...party, name: updatePartyForm.name.trim() }
                : party
            )
          );
          showToast("Party name updated successfully", "success");
        } else if (namePayload.error_code !== "user_rejected") {
          showToast("Failed to update party name", "error");
          allSuccessful = false;
        } else {
          allSuccessful = false;
        }
      }

      // Only continue if previous update was successful or not rejected
      if (allSuccessful && fieldsToUpdate.includes("shortName")) {
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
          setParties((prevParties: Party[]) =>
            prevParties.map((party: Party) =>
              party.id === selectedParty.id
                ? { ...party, shortName: updatePartyForm.shortName.trim() }
                : party
            )
          );
          showToast("Party short name updated successfully", "success");
        } else if (shortNamePayload.error_code !== "user_rejected") {
          showToast("Failed to update party short name", "error");
          allSuccessful = false;
        } else {
          allSuccessful = false;
        }
      }

      // Only continue if previous update was successful or not rejected
      if (allSuccessful && fieldsToUpdate.includes("description")) {
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
          setParties((prevParties: Party[]) =>
            prevParties.map((party: Party) =>
              party.id === selectedParty.id
                ? { ...party, description: updatePartyForm.description.trim() }
                : party
            )
          );
          showToast("Party description updated successfully", "success");
        } else if (descPayload.error_code !== "user_rejected") {
          showToast("Failed to update party description", "error");
          allSuccessful = false;
        } else {
          allSuccessful = false;
        }
      }

      // Only continue if previous update was successful or not rejected
      if (allSuccessful && fieldsToUpdate.includes("officialLink")) {
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
          setParties((prevParties: Party[]) =>
            prevParties.map((party: Party) =>
              party.id === selectedParty.id
                ? { ...party, officialLink: linkToUse }
                : party
            )
          );
          showToast("Party official link updated successfully", "success");
        } else if (linkPayload.error_code !== "user_rejected") {
          showToast("Failed to update official link", "error");
        }
      }

      // Close the drawer if we completed all updates or user rejected
      setIsUpdatePartyDrawerOpen(false);
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

      if (finalPayload.status !== "error") {
        // Update party in the UI optimistically
        setParties((prevParties: Party[]) =>
          prevParties.map((party: Party) =>
            party.id === selectedParty.id
              ? {
                  ...party,
                  leader: newLeaderAddress,
                  isUserLeader: false,
                }
              : party
          )
        );

        // Check if user is transferring their own leadership
        if (
          walletAddress?.toLowerCase() === selectedParty.leader.toLowerCase()
        ) {
          // Update user's leadership status in cache if they were the leader
          const userPartyCache = localStorage.getItem("userPartyCache");
          if (userPartyCache) {
            const parsedCache = JSON.parse(userPartyCache);
            localStorage.setItem(
              "userPartyCache",
              JSON.stringify({
                ...parsedCache,
                isLeader: false,
                timestamp: Date.now(),
              })
            );
          }
        }

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

      if (finalPayload.status !== "error") {
        // Update party in the UI optimistically
        setParties((prevParties: Party[]) =>
          prevParties.map((party: Party) =>
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

  const handleCreatePartyClick = async () => {
    // Check if user is already in a party using userPartyId
    if (userPartyId > 0) {
      // Get party details from parties array for the drawer
      const userCurrentParty = activeParties.find(
        (party) => party.id === userPartyId
      );

      if (userCurrentParty) {
        setPartyToLeaveFrom(userCurrentParty);
        setIsCreateConfirmDrawerOpen(true);
        return;
      } else {
        // If party not in parties array, fetch it directly from blockchain
        const fetchedParty = await fetchPartyFromBlockchain(userPartyId);

        if (fetchedParty) {
          setPartyToLeaveFrom(fetchedParty);
          setIsCreateConfirmDrawerOpen(true);
        } else {
          // If fetch fails, just open create drawer directly
          setIsCreateDrawerOpen(true);
        }
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

      if (finalPayload.status !== "error") {
        // New party status after the action
        const newStatus = selectedParty.status !== 2 ? 2 : 0;

        // Update party in the UI optimistically - based on the contract behavior
        setParties((prevParties: Party[]) =>
          prevParties.map((party: Party) =>
            party.id === selectedParty.id
              ? {
                  ...party,
                  active: party.status === 2, // If currently INACTIVE, set active to true
                  // When deleting: status becomes 2 (INACTIVE)
                  // When reactivating: status becomes 0 (PENDING), not 1 (ACTIVE)
                  status: newStatus,
                }
              : party
          )
        );

        // Update cache if this is user's party
        if (selectedParty.id === userPartyId) {
          const userPartyCache = localStorage.getItem("userPartyCache");
          if (userPartyCache) {
            const parsedCache = JSON.parse(userPartyCache);
            localStorage.setItem(
              "userPartyCache",
              JSON.stringify({
                ...parsedCache,
                partyStatus: newStatus,
                timestamp: Date.now(),
              })
            );
          }
        }

        setIsDeleteDrawerOpen(false);
        showToast(
          `Party ${selectedParty.status !== 2 ? "deleted" : "reactivated"} successfully`,
          "success"
        );
      }
    } catch (error) {
      console.error(
        `Error ${selectedParty.status !== 2 ? "deleting" : "reactivating"} party:`,
        error
      );
      showToast(
        `Error ${selectedParty.status !== 2 ? "deleting" : "reactivating"} party`,
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

      if (finalPayload.status !== "error") {
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

      if (finalPayload.status !== "error") {
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
            {party.isUserLeader && party.status !== 2 && (
              <Dropdown
                trigger={
                  <button
                    className="text-gray-600 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors"
                    title={
                      dictionary?.components?.politicalPartyList?.partyCard
                        ?.management?.title
                    }
                  >
                    <PiGearBold size={16} />
                  </button>
                }
                menuItems={[
                  {
                    label:
                      dictionary?.components?.politicalPartyList?.partyCard
                        ?.management?.manageMembers,
                    onClick: () => {
                      setSelectedParty(party);
                      setIsMemberManagementDrawerOpen(true);
                    },
                  },
                  {
                    label:
                      dictionary?.components?.politicalPartyList?.partyCard
                        ?.management?.updateInfo,
                    onClick: () => openUpdatePartyDrawer(party),
                  },
                  {
                    label:
                      dictionary?.components?.politicalPartyList?.partyCard
                        ?.management?.transferLeadership,
                    onClick: () => {
                      setSelectedParty(party);
                      setIsTransferLeadershipDrawerOpen(true);
                    },
                  },
                  {
                    label:
                      dictionary?.components?.politicalPartyList?.partyCard
                        ?.management?.deleteParty,
                    onClick: () => {
                      setSelectedParty(party);
                      setIsDeleteDrawerOpen(true);
                    },
                    className: "text-error-600",
                  },
                ]}
                align="right"
              />
            )}
          </div>
        </div>

        <Link href={`/${lang}/govern/party/${party.id}`}>
          <Typography
            as="p"
            variant={{ variant: "body", level: 2 }}
            className="mt-3 text-[15px]"
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
          {party.isUserMember ? (
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
      {/* My Party Section */}
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

        {userPartyId > 0 ? (
          // Display the user's party
          <>
            {activeParties.filter((party) => party.id === userPartyId).length >
            0 ? (
              // If the party is in the parties array
              activeParties
                .filter((party) => party.id === userPartyId)
                .map((party) => renderPartyCard(party))
            ) : (
              // If the party is not in the parties array, fetch it directly
              <FetchUserParty
                partyId={userPartyId}
                renderPartyCard={renderPartyCard}
                walletAddress={walletAddress}
                showToast={showToast}
              />
            )}
          </>
        ) : (
          // Message when user hasn't joined or created a political party yet.
          <div className="p-4 text-center text-gray-500">
            {dictionary?.components?.politicalPartyList?.noParty}
          </div>
        )}
      </div>

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
            onFocus={handleInputFocus}
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
              <div ref={loadMoreRef} className="py-4 text-center">
                <div className="border-t-primary inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300"></div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Party Drawer */}
      <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
        <DrawerContent>
          <div className="p-6">
            <DrawerHeader>
              <DrawerTitle>
                {
                  dictionary?.components?.politicalPartyList?.drawers?.create
                    ?.title
                }
              </DrawerTitle>
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
                  {
                    dictionary?.components?.politicalPartyList?.drawers?.create
                      ?.name?.label
                  }
                </Typography>
                <Form.Control asChild>
                  <Input
                    label={
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.create?.name?.placeholder
                    }
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
                  {
                    dictionary?.components?.politicalPartyList?.drawers?.create
                      ?.name?.error
                  }
                </Form.Message>
                {createPartyForm.name.length >= MAX_STRING_LENGTH * 0.9 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${createPartyForm.name.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {createPartyForm.name.length >= MAX_STRING_LENGTH
                      ? dictionary?.components?.politicalPartyList?.drawers
                          ?.create?.limitWarning?.reached
                      : dictionary?.components?.politicalPartyList?.drawers?.create?.limitWarning?.approaching
                          .replace(
                            "{{current}}",
                            createPartyForm.name.length.toString()
                          )
                          .replace("{{max}}", MAX_STRING_LENGTH.toString())}
                  </Typography>
                )}
              </Form.Field>

              <Form.Field name="shortName" className="mt-4">
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  {
                    dictionary?.components?.politicalPartyList?.drawers?.create
                      ?.shortName?.label
                  }
                </Typography>
                <Form.Control asChild>
                  <Input
                    label={
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.create?.shortName?.placeholder
                    }
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
                  {
                    dictionary?.components?.politicalPartyList?.drawers?.create
                      ?.shortName?.error
                  }
                </Form.Message>
                {createPartyForm.shortName.length >=
                  MAX_SHORT_NAME_LENGTH * 0.8 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${createPartyForm.shortName.length >= MAX_SHORT_NAME_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {createPartyForm.shortName.length >= MAX_SHORT_NAME_LENGTH
                      ? dictionary?.components?.politicalPartyList?.drawers
                          ?.create?.limitWarning?.reached
                      : dictionary?.components?.politicalPartyList?.drawers?.create?.limitWarning?.approaching
                          .replace(
                            "{{current}}",
                            createPartyForm.shortName.length.toString()
                          )
                          .replace("{{max}}", MAX_SHORT_NAME_LENGTH.toString())}
                  </Typography>
                )}
              </Form.Field>

              <Form.Field name="description" className="mt-4">
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  {
                    dictionary?.components?.politicalPartyList?.drawers?.create
                      ?.description?.label
                  }
                </Typography>
                <Form.Control asChild>
                  <Textarea
                    placeholder={
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.create?.description?.placeholder
                    }
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
                  {
                    dictionary?.components?.politicalPartyList?.drawers?.create
                      ?.description?.error
                  }
                </Form.Message>
                {createPartyForm.description.length >=
                  MAX_STRING_LENGTH * 0.9 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${createPartyForm.description.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {createPartyForm.description.length >= MAX_STRING_LENGTH
                      ? dictionary?.components?.politicalPartyList?.drawers
                          ?.create?.limitWarning?.reached
                      : dictionary?.components?.politicalPartyList?.drawers?.create?.limitWarning?.approaching
                          .replace(
                            "{{current}}",
                            createPartyForm.description.length.toString()
                          )
                          .replace("{{max}}", MAX_STRING_LENGTH.toString())}
                  </Typography>
                )}
              </Form.Field>

              <Form.Field name="officialLink" className="mt-4">
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  {
                    dictionary?.components?.politicalPartyList?.drawers?.create
                      ?.officialLink?.label
                  }
                </Typography>
                <Form.Control asChild>
                  <Input
                    label={
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.create?.officialLink?.placeholder
                    }
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
                      ? dictionary?.components?.politicalPartyList?.drawers
                          ?.create?.limitWarning?.reached
                      : dictionary?.components?.politicalPartyList?.drawers?.create?.limitWarning?.approaching
                          .replace(
                            "{{current}}",
                            createPartyForm.officialLink.length.toString()
                          )
                          .replace("{{max}}", MAX_STRING_LENGTH.toString())}
                  </Typography>
                )}
              </Form.Field>

              <Form.Submit asChild className="mt-4">
                <Button variant="primary" fullWidth disabled={isCreating}>
                  {isCreating
                    ? dictionary?.components?.politicalPartyList?.drawers
                        ?.create?.button?.creating
                    : dictionary?.components?.politicalPartyList?.drawers
                        ?.create?.button?.create}
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
              <DrawerTitle>
                {
                  dictionary?.components?.politicalPartyList?.drawers?.update
                    ?.title
                }
              </DrawerTitle>
            </DrawerHeader>

            <div className="grid grid-cols-1 gap-4">
              {/* Name update section */}
              <div>
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  {
                    dictionary?.components?.politicalPartyList?.drawers?.create
                      ?.name?.label
                  }
                </Typography>
                <div className="flex gap-2">
                  <Input
                    label={
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.create?.name?.placeholder
                    }
                    value={updatePartyForm.name}
                    onChange={(e) =>
                      setUpdatePartyForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    className="flex-1"
                    maxLength={MAX_STRING_LENGTH}
                  />
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      if (!selectedParty || !MiniKit.isInstalled()) {
                        showToast("Please connect your wallet first", "error");
                        return;
                      }

                      if (updatePartyForm.name.trim() === selectedParty.name) {
                        showToast("No changes to update", "info");
                        return;
                      }

                      try {
                        setIsProcessing(true);
                        const { finalPayload } =
                          await MiniKit.commandsAsync.sendTransaction({
                            transaction: [
                              {
                                address:
                                  POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
                                abi: parseAbi([
                                  "function updatePartyName(uint256 _partyId, string memory _name) external",
                                ]),
                                functionName: "updatePartyName",
                                args: [
                                  BigInt(selectedParty.id),
                                  updatePartyForm.name.trim(),
                                ],
                              },
                            ],
                          });

                        if (finalPayload.status !== "error") {
                          setParties((prevParties: Party[]) =>
                            prevParties.map((party: Party) =>
                              party.id === selectedParty.id
                                ? {
                                    ...party,
                                    name: updatePartyForm.name.trim(),
                                  }
                                : party
                            )
                          );
                          showToast(
                            "Party name updated successfully",
                            "success"
                          );
                        } else if (
                          finalPayload.error_code !== "user_rejected"
                        ) {
                          showToast("Failed to update party name", "error");
                        }
                      } catch (error) {
                        console.error("Error updating party name:", error);
                        showToast("Error updating party name", "error");
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    disabled={isProcessing}
                  >
                    {
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.update?.button?.update
                    }
                  </Button>
                </div>
                {updatePartyForm.name.length >= MAX_STRING_LENGTH * 0.9 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${updatePartyForm.name.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {updatePartyForm.name.length >= MAX_STRING_LENGTH
                      ? dictionary?.components?.politicalPartyList?.drawers
                          ?.create?.limitWarning?.reached
                      : dictionary?.components?.politicalPartyList?.drawers?.create?.limitWarning?.approaching
                          .replace(
                            "{{current}}",
                            updatePartyForm.name.length.toString()
                          )
                          .replace("{{max}}", MAX_STRING_LENGTH.toString())}
                  </Typography>
                )}
              </div>

              {/* Short name update section */}
              <div>
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  {
                    dictionary?.components?.politicalPartyList?.drawers?.create
                      ?.shortName?.label
                  }
                </Typography>
                <div className="flex gap-2">
                  <Input
                    label={
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.create?.shortName?.placeholder
                    }
                    value={updatePartyForm.shortName}
                    onChange={(e) =>
                      setUpdatePartyForm((prev) => ({
                        ...prev,
                        shortName: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    className="flex-1"
                    maxLength={MAX_SHORT_NAME_LENGTH}
                  />
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      if (!selectedParty || !MiniKit.isInstalled()) {
                        showToast("Please connect your wallet first", "error");
                        return;
                      }

                      if (
                        updatePartyForm.shortName.trim() ===
                        selectedParty.shortName
                      ) {
                        showToast("No changes to update", "info");
                        return;
                      }

                      try {
                        setIsProcessing(true);
                        const { finalPayload } =
                          await MiniKit.commandsAsync.sendTransaction({
                            transaction: [
                              {
                                address:
                                  POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
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

                        if (finalPayload.status !== "error") {
                          setParties((prevParties: Party[]) =>
                            prevParties.map((party: Party) =>
                              party.id === selectedParty.id
                                ? {
                                    ...party,
                                    shortName: updatePartyForm.shortName.trim(),
                                  }
                                : party
                            )
                          );
                          showToast(
                            "Party short name updated successfully",
                            "success"
                          );
                        } else if (
                          finalPayload.error_code !== "user_rejected"
                        ) {
                          showToast(
                            "Failed to update party short name",
                            "error"
                          );
                        }
                      } catch (error) {
                        console.error(
                          "Error updating party short name:",
                          error
                        );
                        showToast("Error updating party short name", "error");
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    disabled={isProcessing}
                  >
                    {
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.update?.button?.update
                    }
                  </Button>
                </div>
                {updatePartyForm.shortName.length >=
                  MAX_SHORT_NAME_LENGTH * 0.8 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${updatePartyForm.shortName.length >= MAX_SHORT_NAME_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {updatePartyForm.shortName.length >= MAX_SHORT_NAME_LENGTH
                      ? dictionary?.components?.politicalPartyList?.drawers
                          ?.create?.limitWarning?.reached
                      : dictionary?.components?.politicalPartyList?.drawers?.create?.limitWarning?.approaching
                          .replace(
                            "{{current}}",
                            updatePartyForm.shortName.length.toString()
                          )
                          .replace("{{max}}", MAX_SHORT_NAME_LENGTH.toString())}
                  </Typography>
                )}
              </div>

              {/* Description update section */}
              <div>
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  {
                    dictionary?.components?.politicalPartyList?.drawers?.create
                      ?.description?.label
                  }
                </Typography>
                <div className="flex flex-col gap-2">
                  <Textarea
                    placeholder={
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.create?.description?.placeholder
                    }
                    value={updatePartyForm.description}
                    onChange={(e) =>
                      setUpdatePartyForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    rows={4}
                    maxLength={MAX_STRING_LENGTH}
                  />
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      if (!selectedParty || !MiniKit.isInstalled()) {
                        showToast("Please connect your wallet first", "error");
                        return;
                      }

                      if (
                        updatePartyForm.description.trim() ===
                        selectedParty.description
                      ) {
                        showToast("No changes to update", "info");
                        return;
                      }

                      try {
                        setIsProcessing(true);
                        const { finalPayload } =
                          await MiniKit.commandsAsync.sendTransaction({
                            transaction: [
                              {
                                address:
                                  POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
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

                        if (finalPayload.status !== "error") {
                          setParties((prevParties: Party[]) =>
                            prevParties.map((party: Party) =>
                              party.id === selectedParty.id
                                ? {
                                    ...party,
                                    description:
                                      updatePartyForm.description.trim(),
                                  }
                                : party
                            )
                          );
                          showToast(
                            "Party description updated successfully",
                            "success"
                          );
                        } else if (
                          finalPayload.error_code !== "user_rejected"
                        ) {
                          showToast(
                            "Failed to update party description",
                            "error"
                          );
                        }
                      } catch (error) {
                        console.error(
                          "Error updating party description:",
                          error
                        );
                        showToast("Error updating party description", "error");
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    disabled={isProcessing}
                  >
                    {
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.update?.button?.updateDescription
                    }
                  </Button>
                </div>
                {updatePartyForm.description.length >=
                  MAX_STRING_LENGTH * 0.9 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${updatePartyForm.description.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {updatePartyForm.description.length >= MAX_STRING_LENGTH
                      ? dictionary?.components?.politicalPartyList?.drawers
                          ?.create?.limitWarning?.reached
                      : dictionary?.components?.politicalPartyList?.drawers?.create?.limitWarning?.approaching
                          .replace(
                            "{{current}}",
                            updatePartyForm.description.length.toString()
                          )
                          .replace("{{max}}", MAX_STRING_LENGTH.toString())}
                  </Typography>
                )}
              </div>

              {/* Official link update section */}
              <div>
                <Typography
                  as="label"
                  variant={{ variant: "caption", level: 1 }}
                  className="mb-1.5 block font-medium"
                >
                  {
                    dictionary?.components?.politicalPartyList?.drawers?.create
                      ?.officialLink?.label
                  }
                </Typography>
                <div className="flex gap-2">
                  <Input
                    label={
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.create?.officialLink?.placeholder
                    }
                    value={updatePartyForm.officialLink}
                    onChange={(e) =>
                      setUpdatePartyForm((prev) => ({
                        ...prev,
                        officialLink: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    className="flex-1"
                    maxLength={MAX_STRING_LENGTH}
                  />
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      if (!selectedParty || !MiniKit.isInstalled()) {
                        showToast("Please connect your wallet first", "error");
                        return;
                      }

                      if (
                        updatePartyForm.officialLink.trim() ===
                        selectedParty.officialLink
                      ) {
                        showToast("No changes to update", "info");
                        return;
                      }

                      try {
                        setIsProcessing(true);
                        const linkToUse =
                          updatePartyForm.officialLink.trim() === ""
                            ? "https://placeholder.com"
                            : updatePartyForm.officialLink.trim();

                        const { finalPayload } =
                          await MiniKit.commandsAsync.sendTransaction({
                            transaction: [
                              {
                                address:
                                  POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
                                abi: parseAbi([
                                  "function updateOfficialLink(uint256 _partyId, string memory _officialLink) external",
                                ]),
                                functionName: "updateOfficialLink",
                                args: [BigInt(selectedParty.id), linkToUse],
                              },
                            ],
                          });

                        if (finalPayload.status !== "error") {
                          setParties((prevParties: Party[]) =>
                            prevParties.map((party: Party) =>
                              party.id === selectedParty.id
                                ? { ...party, officialLink: linkToUse }
                                : party
                            )
                          );
                          showToast(
                            "Party official link updated successfully",
                            "success"
                          );
                        } else if (
                          finalPayload.error_code !== "user_rejected"
                        ) {
                          showToast("Failed to update official link", "error");
                        }
                      } catch (error) {
                        console.error(
                          "Error updating party official link:",
                          error
                        );
                        showToast(
                          "Error updating party official link",
                          "error"
                        );
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    disabled={isProcessing}
                  >
                    {
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.update?.button?.update
                    }
                  </Button>
                </div>
                {updatePartyForm.officialLink.length >=
                  MAX_STRING_LENGTH * 0.9 && (
                  <Typography
                    variant={{ variant: "caption", level: 2 }}
                    className={`mt-[7px] px-2 text-xs ${updatePartyForm.officialLink.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                  >
                    {updatePartyForm.officialLink.length >= MAX_STRING_LENGTH
                      ? dictionary?.components?.politicalPartyList?.drawers
                          ?.create?.limitWarning?.reached
                      : dictionary?.components?.politicalPartyList?.drawers?.create?.limitWarning?.approaching
                          .replace(
                            "{{current}}",
                            updatePartyForm.officialLink.length.toString()
                          )
                          .replace("{{max}}", MAX_STRING_LENGTH.toString())}
                  </Typography>
                )}
              </div>
            </div>
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
              <DrawerTitle>
                {
                  dictionary?.components?.politicalPartyList?.drawers
                    ?.transferLeadership?.title
                }
              </DrawerTitle>
            </DrawerHeader>
            <Typography
              as="p"
              variant={{ variant: "body", level: 2 }}
              className="text-[15px]"
            >
              {
                dictionary?.components?.politicalPartyList?.drawers
                  ?.transferLeadership?.description
              }
            </Typography>

            {/* Username lookup section */}
            <div>
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block font-medium"
              >
                {
                  dictionary?.components?.politicalPartyList?.drawers
                    ?.transferLeadership?.lookup?.label
                }
              </Typography>
              <div className="flex gap-2">
                <Input
                  label={
                    dictionary?.components?.politicalPartyList?.drawers
                      ?.transferLeadership?.lookup?.placeholder
                  }
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
                  {isLeaderLookingUp
                    ? dictionary?.components?.politicalPartyList?.drawers
                        ?.transferLeadership?.lookup?.loading
                    : dictionary?.components?.politicalPartyList?.drawers
                        ?.transferLeadership?.lookup?.buttonText}
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
                    {
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.transferLeadership?.lookup?.foundUser
                    }
                    <span className="font-semibold">{leaderUsername}</span>
                  </Typography>
                  <Typography
                    as="p"
                    variant={{ variant: "caption", level: 1 }}
                    className="truncate text-gray-500"
                  >
                    {
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.transferLeadership?.lookup?.address
                    }
                    {leaderLookupResult.address}
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
                  {
                    dictionary?.components?.politicalPartyList?.drawers
                      ?.transferLeadership?.newLeader?.label
                  }
                </Typography>
                <Form.Control asChild>
                  <Input
                    label={
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.transferLeadership?.newLeader?.placeholder
                    }
                    value={newLeaderAddress}
                    onChange={(e) => setNewLeaderAddress(e.target.value)}
                    onFocus={handleInputFocus}
                    required
                    pattern="^0x[a-fA-F0-9]{40}$"
                  />
                </Form.Control>
                <Form.Message match="valueMissing" error>
                  {
                    dictionary?.components?.politicalPartyList?.drawers
                      ?.transferLeadership?.newLeader?.errors?.required
                  }
                </Form.Message>
                <Form.Message match="patternMismatch" error>
                  {
                    dictionary?.components?.politicalPartyList?.drawers
                      ?.transferLeadership?.newLeader?.errors?.invalid
                  }
                </Form.Message>
              </Form.Field>
              <Form.Submit asChild className="mt-8">
                <Button variant="primary" fullWidth disabled={isProcessing}>
                  {isProcessing
                    ? dictionary?.components?.politicalPartyList?.drawers
                        ?.transferLeadership?.button?.processing
                    : dictionary?.components?.politicalPartyList?.drawers
                        ?.transferLeadership?.button?.transfer}
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
              <DrawerTitle>
                {
                  dictionary?.components?.politicalPartyList?.drawers?.leave
                    ?.title
                }
              </DrawerTitle>
            </DrawerHeader>
            <Typography
              as="p"
              variant={{ variant: "subtitle", level: 1 }}
              className="mx-auto mt-4 text-center text-gray-500"
            >
              {dictionary?.components?.politicalPartyList?.drawers?.leave?.description.replace(
                "{{partyName}}",
                partyToLeaveFrom?.name || ""
              )}
              {partyToLeaveFrom?.isUserLeader && (
                <>
                  <br />
                  <br />
                  {
                    dictionary?.components?.politicalPartyList?.drawers?.leave
                      ?.leaderWarning
                  }
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

      {/* Create Confirmation Drawer */}
      <Drawer
        open={isCreateConfirmDrawerOpen}
        onOpenChange={setIsCreateConfirmDrawerOpen}
      >
        <DrawerContent>
          <div className="flex flex-col p-6">
            <DrawerHeader>
              <DrawerTitle>
                {
                  dictionary?.components?.politicalPartyList?.drawers
                    ?.createConfirm?.title
                }
              </DrawerTitle>
            </DrawerHeader>
            <Typography
              as="p"
              variant={{ variant: "subtitle", level: 1 }}
              className="mx-auto mt-4 text-center text-gray-500"
            >
              {dictionary?.components?.politicalPartyList?.drawers?.createConfirm?.description.replace(
                "{{partyName}}",
                partyToLeaveFrom?.name || ""
              )}
              {partyToLeaveFrom?.isUserLeader && (
                <>
                  <br />
                  <br />
                  {
                    dictionary?.components?.politicalPartyList?.drawers
                      ?.createConfirm?.leaderWarning
                  }
                </>
              )}
            </Typography>
            <Button
              variant="primary"
              fullWidth
              onClick={handleLeaveAndCreate}
              disabled={isProcessing}
              className="mt-10"
            >
              {isProcessing
                ? dictionary?.components?.politicalPartyList?.drawers
                    ?.createConfirm?.button?.processing
                : dictionary?.components?.politicalPartyList?.drawers?.createConfirm?.button?.leaveAndCreate.replace(
                    "{{partyShortName}}",
                    partyToLeaveFrom?.shortName || ""
                  )}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Delete Party Drawer */}
      <Drawer open={isDeleteDrawerOpen} onOpenChange={setIsDeleteDrawerOpen}>
        <DrawerContent>
          <div className="flex flex-col p-6">
            <DrawerHeader>
              <DrawerTitle>
                {
                  dictionary?.components?.politicalPartyList?.drawers?.delete
                    ?.title
                }
              </DrawerTitle>
            </DrawerHeader>
            <Typography
              as="p"
              variant={{ variant: "subtitle", level: 1 }}
              className="mx-auto mt-4 text-center text-gray-500"
            >
              {selectedParty?.status === 0
                ? dictionary?.components?.politicalPartyList?.drawers?.delete
                    ?.confirmPending
                : dictionary?.components?.politicalPartyList?.drawers?.delete
                    ?.confirm}
            </Typography>
            <Button
              variant="primary"
              fullWidth
              onClick={deactivateParty}
              disabled={isProcessing}
              className="mt-10"
            >
              {isProcessing
                ? dictionary?.components?.politicalPartyList?.drawers?.delete
                    ?.button?.processing
                : selectedParty?.status === 0
                  ? dictionary?.components?.politicalPartyList?.drawers?.delete
                      ?.button?.deletePending
                  : dictionary?.components?.politicalPartyList?.drawers?.delete
                      ?.button?.delete}
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
              <DrawerTitle>
                {
                  dictionary?.components?.politicalPartyList?.drawers
                    ?.memberManagement?.title
                }
              </DrawerTitle>
            </DrawerHeader>

            <div className="mb-4 flex items-center gap-1 border-b">
              <button
                className={`h-9 items-center px-4 font-sans text-sm font-medium ${
                  activeMemberTab === "remove" ? "border-black border-b-2" : ""
                }`}
                onClick={() => setActiveMemberTab("remove")}
              >
                {
                  dictionary?.components?.politicalPartyList?.drawers
                    ?.memberManagement?.tabs?.remove
                }
              </button>
              <button
                className={`h-9 items-center px-4 font-sans text-sm font-medium ${
                  activeMemberTab === "ban" ? "border-black border-b-2" : ""
                }`}
                onClick={() => setActiveMemberTab("ban")}
              >
                {
                  dictionary?.components?.politicalPartyList?.drawers
                    ?.memberManagement?.tabs?.ban
                }
              </button>
              <button
                className={`h-9 items-center px-4 font-sans text-sm font-medium ${
                  activeMemberTab === "unban" ? "border-black border-b-2" : ""
                }`}
                onClick={() => setActiveMemberTab("unban")}
              >
                {
                  dictionary?.components?.politicalPartyList?.drawers
                    ?.memberManagement?.tabs?.unban
                }
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
                  {
                    dictionary?.components?.politicalPartyList?.drawers
                      ?.memberManagement?.remove?.description
                  }
                </Typography>

                {/* Username lookup section for member removal in the tab */}
                <div>
                  <Typography
                    as="label"
                    variant={{ variant: "caption", level: 1 }}
                    className="mb-1.5 block font-medium"
                  >
                    {
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.transferLeadership?.lookup?.label
                    }
                  </Typography>
                  <div className="flex gap-2">
                    <Input
                      label={
                        dictionary?.components?.politicalPartyList?.drawers
                          ?.transferLeadership?.lookup?.placeholder
                      }
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
                      {isMemberLookingUp
                        ? dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.lookup?.loading
                        : dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.lookup?.buttonText}
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
                        {
                          dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.lookup?.foundUser
                        }
                        <span className="font-semibold">{memberUsername}</span>
                      </Typography>
                      <Typography
                        as="p"
                        variant={{ variant: "caption", level: 1 }}
                        className="truncate text-gray-500"
                      >
                        {
                          dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.lookup?.address
                        }
                        {memberLookupResult.address}
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
                      {
                        dictionary?.components?.politicalPartyList?.drawers
                          ?.memberManagement?.label
                      }
                    </Typography>
                    <Form.Control asChild>
                      <Input
                        label={
                          dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.newLeader?.placeholder
                        }
                        value={memberToRemove}
                        onChange={(e) => setMemberToRemove(e.target.value)}
                        onFocus={handleInputFocus}
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                      />
                    </Form.Control>
                    <Form.Message match="valueMissing" error>
                      {
                        dictionary?.components?.politicalPartyList?.drawers
                          ?.transferLeadership?.newLeader?.errors?.required
                      }
                    </Form.Message>
                    <Form.Message match="patternMismatch" error>
                      {
                        dictionary?.components?.politicalPartyList?.drawers
                          ?.transferLeadership?.newLeader?.errors?.invalid
                      }
                    </Form.Message>
                  </Form.Field>
                  <Form.Submit asChild className="mt-8">
                    <Button variant="primary" fullWidth disabled={isProcessing}>
                      {isProcessing
                        ? dictionary?.components?.politicalPartyList?.drawers
                            ?.memberManagement?.remove?.button?.processing
                        : dictionary?.components?.politicalPartyList?.drawers
                            ?.memberManagement?.remove?.button?.remove}
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
                  {
                    dictionary?.components?.politicalPartyList?.drawers
                      ?.memberManagement?.ban?.description
                  }
                </Typography>

                {/* Username lookup section */}
                <div>
                  <Typography
                    as="label"
                    variant={{ variant: "caption", level: 1 }}
                    className="mb-1.5 block font-medium"
                  >
                    {
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.transferLeadership?.lookup?.label
                    }
                  </Typography>
                  <div className="flex gap-2">
                    <Input
                      label={
                        dictionary?.components?.politicalPartyList?.drawers
                          ?.transferLeadership?.lookup?.placeholder
                      }
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
                      {isBanLookingUp
                        ? dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.lookup?.loading
                        : dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.lookup?.buttonText}
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
                        {
                          dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.lookup?.foundUser
                        }
                        <span className="font-semibold">
                          {memberToBanUsername}
                        </span>
                      </Typography>
                      <Typography
                        as="p"
                        variant={{ variant: "caption", level: 1 }}
                        className="truncate text-gray-500"
                      >
                        {
                          dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.lookup?.address
                        }
                        {banLookupResult.address}
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
                      {
                        dictionary?.components?.politicalPartyList?.drawers
                          ?.memberManagement?.label
                      }
                    </Typography>
                    <Form.Control asChild>
                      <Input
                        label={
                          dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.newLeader?.placeholder
                        }
                        value={memberToBan}
                        onChange={(e) => setMemberToBan(e.target.value)}
                        onFocus={handleInputFocus}
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                      />
                    </Form.Control>
                    <Form.Message match="valueMissing" error>
                      {
                        dictionary?.components?.politicalPartyList?.drawers
                          ?.transferLeadership?.newLeader?.errors?.required
                      }
                    </Form.Message>
                    <Form.Message match="patternMismatch" error>
                      {
                        dictionary?.components?.politicalPartyList?.drawers
                          ?.transferLeadership?.newLeader?.errors?.invalid
                      }
                    </Form.Message>
                  </Form.Field>
                  <Form.Submit asChild className="mt-8">
                    <Button variant="primary" fullWidth disabled={isProcessing}>
                      {isProcessing
                        ? dictionary?.components?.politicalPartyList?.drawers
                            ?.memberManagement?.ban?.button?.processing
                        : dictionary?.components?.politicalPartyList?.drawers
                            ?.memberManagement?.ban?.button?.ban}
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
                  {
                    dictionary?.components?.politicalPartyList?.drawers
                      ?.memberManagement?.unban?.description
                  }
                </Typography>

                {/* Username lookup section */}
                <div>
                  <Typography
                    as="label"
                    variant={{ variant: "caption", level: 1 }}
                    className="mb-1.5 block font-medium"
                  >
                    {
                      dictionary?.components?.politicalPartyList?.drawers
                        ?.transferLeadership?.lookup?.label
                    }
                  </Typography>
                  <div className="flex gap-2">
                    <Input
                      label={
                        dictionary?.components?.politicalPartyList?.drawers
                          ?.transferLeadership?.lookup?.placeholder
                      }
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
                      {isLookingUp
                        ? dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.lookup?.loading
                        : dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.lookup?.buttonText}
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
                        {
                          dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.lookup?.foundUser
                        }
                        <span className="font-semibold">
                          {bannedMemberUsername}
                        </span>
                      </Typography>
                      <Typography
                        as="p"
                        variant={{ variant: "caption", level: 1 }}
                        className="truncate text-gray-500"
                      >
                        {
                          dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.lookup?.address
                        }
                        {lookupResult.address}
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
                      {
                        dictionary?.components?.politicalPartyList?.drawers
                          ?.memberManagement?.label
                      }
                    </Typography>
                    <Form.Control asChild>
                      <Input
                        label={
                          dictionary?.components?.politicalPartyList?.drawers
                            ?.transferLeadership?.newLeader?.placeholder
                        }
                        value={bannedMemberToUnban}
                        onChange={(e) => setBannedMemberToUnban(e.target.value)}
                        onFocus={handleInputFocus}
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                      />
                    </Form.Control>
                    <Form.Message match="valueMissing" error>
                      {
                        dictionary?.components?.politicalPartyList?.drawers
                          ?.transferLeadership?.newLeader?.errors?.required
                      }
                    </Form.Message>
                    <Form.Message match="patternMismatch" error>
                      {
                        dictionary?.components?.politicalPartyList?.drawers
                          ?.transferLeadership?.newLeader?.errors?.invalid
                      }
                    </Form.Message>
                  </Form.Field>
                  <Form.Submit asChild className="mt-8">
                    <Button variant="primary" fullWidth disabled={isProcessing}>
                      {isProcessing
                        ? dictionary?.components?.politicalPartyList?.drawers
                            ?.memberManagement?.unban?.button?.processing
                        : dictionary?.components?.politicalPartyList?.drawers
                            ?.memberManagement?.unban?.button?.unban}
                    </Button>
                  </Form.Submit>
                </Form.Root>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Add the intersection observer for lazy loading */}
      <div ref={loadMoreRef} style={{ height: "1px" }}></div>

      {/* Scroll to top button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="mb-safe fixed right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 shadow-lg transition-all"
          style={{ bottom: "16px" }}
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
      )}
    </div>
  );
}
