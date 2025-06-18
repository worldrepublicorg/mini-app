"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useWallet } from "./WalletContext";
import { useToast } from "@/components/ui/Toast";
import { parseAbi } from "viem";
import { viemClient } from "@/lib/viemClient";
import type { Party, PartiesContextType } from "@/lib/types";

const PartiesContext = createContext<PartiesContextType>({
  activeParties: [],
  pendingParties: [],
  parties: [],
  activeLoading: false,
  pendingLoading: false,
  userPartyId: 0,
  userPartyData: null,
  fetchActiveParties: async () => {},
  fetchPendingParties: async () => {},
  fetchPartyById: async () => null,
  setUserPartyId: () => {},
  setParties: () => {},
  getOptimisticPartyId: () => 0,
  storeUserParty: () => {},
  shuffledActiveParties: [],
});

const GOLDSKY_SUBGRAPH_URL =
  "https://api.goldsky.com/api/public/project_cm9oeq0bhalzw01y0hwth80bk/subgraphs/political-party-registry/1.0.0/gn";

const POLITICAL_PARTY_REGISTRY_ADDRESS: string =
  "0x70a993E1D1102F018365F966B5Fc009e8FA9b7dC";

export const PartiesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeParties, setActiveParties] = useState<Party[]>([]);
  const [pendingParties, setPendingParties] = useState<Party[]>([]);
  const [parties, setPartiesState] = useState<Party[]>([]);
  const [activeLoading, setActiveLoading] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [userPartyId, setUserPartyIdState] = useState<number>(0);
  const [highestKnownPartyId, setHighestKnownPartyId] = useState<number>(0);
  const [userPartyData, setUserPartyData] = useState<Party | null>(null);
  const [shuffledActiveParties, setShuffledActiveParties] = useState<Party[]>(
    []
  );
  const { walletAddress } = useWallet();
  const { showToast } = useToast();

  // Function to set parties and maintain combined array for backward compatibility
  const setParties = useCallback(
    (partiesOrFn: Party[] | ((prevParties: Party[]) => Party[])) => {
      setPartiesState(partiesOrFn);
    },
    []
  );

  // Function to set userPartyId with localStorage persistence
  const setUserPartyId = useCallback((id: number) => {
    setUserPartyIdState(id);

    // Persist to localStorage
    if (typeof window !== "undefined") {
      if (id > 0) {
        localStorage.setItem("userPartyId", id.toString());
      } else {
        localStorage.removeItem("userPartyId");
      }
    }
  }, []);

  // Generate a safe optimistic ID for new parties
  const getOptimisticPartyId = useCallback(() => {
    return highestKnownPartyId + 1;
  }, [highestKnownPartyId]);

  // Update highest known party ID when parties change
  useEffect(() => {
    const allParties = [...activeParties, ...pendingParties];
    if (allParties.length > 0) {
      const maxId = Math.max(...allParties.map((party) => party.id));
      if (maxId > highestKnownPartyId) {
        setHighestKnownPartyId(maxId);
      }
    }
  }, [activeParties, pendingParties, highestKnownPartyId]);

  // Restore userPartyId from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserPartyId = localStorage.getItem("userPartyId");
      if (savedUserPartyId && parseInt(savedUserPartyId) > 0) {
        setUserPartyIdState(parseInt(savedUserPartyId));
      }
    }
  }, []);

  // Update the combined parties array when active or pending parties change
  useEffect(() => {
    setPartiesState([...activeParties, ...pendingParties]);
  }, [activeParties, pendingParties]);

  // Add a function to store user party data
  const storeUserParty = useCallback((party: Party | null) => {
    setUserPartyData(party);
  }, []);

  // Fetch a specific party by ID
  const fetchPartyById = useCallback(
    async (partyId: number): Promise<Party | null> => {
      // First check if it's the user's party and we have it cached
      if (partyId === userPartyId && userPartyData) {
        return userPartyData;
      }

      // First check if we already have this party in our state
      const cachedParty = [...activeParties, ...pendingParties].find(
        (p) => p.id === partyId
      );
      if (cachedParty) return cachedParty;

      // If not found in cache, get from blockchain
      try {
        console.log(`Fetching party ${partyId} from blockchain`);
        const partyDetails = await viemClient.readContract({
          address: POLITICAL_PARTY_REGISTRY_ADDRESS as `0x${string}`,
          abi: parseAbi([
            "function getPartyDetails(uint256 _partyId) view returns (string memory name, string memory shortName, string memory description, string memory officialLink, address founder, address currentLeader, uint256 creationTime, uint8 status, uint256 memberCount, uint256 documentVerifiedMemberCount, uint256 verifiedMemberCount)",
          ]),
          functionName: "getPartyDetails",
          args: [BigInt(partyId)],
        });

        // Create a Party object from the blockchain data
        const party: Party = {
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
          isUserMember: userPartyId === partyId,
          isUserLeader:
            walletAddress?.toLowerCase() === partyDetails[5].toLowerCase(),
        };

        // Update highest known ID if needed
        if (partyId > highestKnownPartyId) {
          setHighestKnownPartyId(partyId);
        }

        // If this is the user's party, cache it
        if (partyId === userPartyId) {
          setUserPartyData(party);
        }

        return party;
      } catch (error) {
        console.error(`Error fetching party ${partyId} details:`, error);
        showToast(`Failed to load party #${partyId}`, "error");
        return null;
      }
    },
    [
      activeParties,
      pendingParties,
      walletAddress,
      userPartyId,
      highestKnownPartyId,
      showToast,
      userPartyData,
    ]
  );

  const fetchActiveParties = useCallback(async () => {
    if (!GOLDSKY_SUBGRAPH_URL) {
      setActiveLoading(false);
      return;
    }

    try {
      setActiveLoading(true);

      let allFetchedParties: any[] = [];
      let hasMore = true;
      let skip = 0;
      const pageSize = 1000;

      while (hasMore) {
        // Query to get active parties from subgraph with pagination
        const query = `
          query {
            parties(first: ${pageSize}, skip: ${skip}, where: { memberCount_not: 0, status: 1 }) {
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

        // Fetch active parties from Goldsky subgraph
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

        const currentPageParties = result.data.parties;
        allFetchedParties = [...allFetchedParties, ...currentPageParties];

        // If we received fewer results than the page size, we've reached the end
        if (currentPageParties.length < pageSize) {
          hasMore = false;
        } else {
          skip += pageSize; // Move to the next page
        }
      }

      // Get user party info
      let userParty = 0;

      if (walletAddress) {
        try {
          const userQuery = `
            query {
              userPartyMapping(id: "${walletAddress.toLowerCase()}") {
                party { id }
              }
            }
          `;

          const userResponse = await fetch(GOLDSKY_SUBGRAPH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: userQuery }),
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData.data?.userPartyMapping?.party) {
              userParty = Number(userData.data.userPartyMapping.party.id);
            }
          }
        } catch (error) {
          console.error("Error fetching user party mapping:", error);
        }
      }

      setUserPartyId(userParty > 0 ? userParty : 0);

      // Transform the data to match your Party interface
      const fetchedParties = allFetchedParties.map((party: any) => ({
        id: Number(party.id),
        name: party.name,
        shortName: party.shortName,
        description: party.description,
        officialLink: party.officialLink,
        founder: party.founder,
        leader: party.currentLeader,
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

      setActiveParties(fetchedParties);

      if (fetchedParties.length > 0) {
        // Only shuffle if we haven't shuffled yet or if the active parties list changed significantly
        if (
          shuffledActiveParties.length === 0 ||
          Math.abs(shuffledActiveParties.length - fetchedParties.length) > 10
        ) {
          // Sort parties by creation time (newest first)
          const sortedByCreation = [...fetchedParties].sort(
            (a, b) => b.creationTime - a.creationTime
          );

          // Shuffle the top 100 only once after fetching
          const top100 = sortedByCreation.slice(0, 100);
          for (let i = top100.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [top100[i], top100[j]] = [top100[j], top100[i]];
          }

          setShuffledActiveParties([...top100, ...sortedByCreation.slice(100)]);
        }
      }
    } catch (error) {
      console.error("Error fetching active parties from subgraph:", error);
      showToast("Failed to load active political parties", "error");
    } finally {
      setActiveLoading(false);
    }
  }, [walletAddress, showToast, setUserPartyId, shuffledActiveParties]);

  const fetchPendingParties = useCallback(async () => {
    if (!GOLDSKY_SUBGRAPH_URL) {
      setPendingLoading(false);
      return;
    }

    try {
      setPendingLoading(true);

      let allFetchedPendingParties: any[] = [];
      let hasMore = true;
      let skip = 0;
      const pageSize = 1000;

      while (hasMore) {
        // Query to get pending parties from subgraph with pagination
        const query = `
          query {
            parties(first: ${pageSize}, skip: ${skip}, where: { status: 0 }) {
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

        // Fetch pending parties from Goldsky subgraph
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

        const currentPageParties = result.data.parties;
        allFetchedPendingParties = [
          ...allFetchedPendingParties,
          ...currentPageParties,
        ];

        // If we received fewer results than the page size, we've reached the end
        if (currentPageParties.length < pageSize) {
          hasMore = false;
        } else {
          skip += pageSize; // Move to the next page
        }
      }

      // Transform the data to match your Party interface
      const fetchedPendingParties = allFetchedPendingParties.map(
        (party: any) => ({
          id: Number(party.id),
          name: party.name,
          shortName: party.shortName,
          description: party.description,
          officialLink: party.officialLink,
          founder: party.founder,
          leader: party.currentLeader,
          creationTime: Number(party.creationTime),
          status: Number(party.status),
          active: party.active,
          memberCount: Number(party.memberCount),
          documentVerifiedMemberCount: Number(
            party.documentVerifiedMemberCount
          ),
          verifiedMemberCount: Number(party.verifiedMemberCount),
          isUserMember: userPartyId === Number(party.id),
          isUserLeader:
            walletAddress?.toLowerCase() === party.currentLeader?.toLowerCase(),
        })
      );

      setPendingParties(fetchedPendingParties);
    } catch (error) {
      console.error("Error fetching pending parties from subgraph:", error);
      showToast("Failed to load pending political parties", "error");
    } finally {
      setPendingLoading(false);
    }
  }, [walletAddress, userPartyId, showToast]);

  return (
    <PartiesContext.Provider
      value={{
        activeParties,
        pendingParties,
        parties,
        activeLoading,
        pendingLoading,
        userPartyId,
        userPartyData,
        fetchActiveParties,
        fetchPendingParties,
        fetchPartyById,
        setUserPartyId,
        setParties,
        getOptimisticPartyId,
        storeUserParty,
        shuffledActiveParties,
      }}
    >
      {children}
    </PartiesContext.Provider>
  );
};

export const useParties = () => useContext(PartiesContext);
