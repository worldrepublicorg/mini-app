import { parseAbi } from "viem";
import { useWallet } from "@/components/contexts/WalletContext";
import { MiniKit } from "@worldcoin/minikit-js";
import { useToast } from "@/components/ui/Toast";
import { useParties } from "@/components/contexts/PartiesContext";
import type { Party, CreatePartyForm } from "@/lib/types";

const POLITICAL_PARTY_REGISTRY_ADDRESS: `0x${string}` =
  "0x70a993E1D1102F018365F966B5Fc009e8FA9b7dC";

export const usePartyActions = () => {
  const { walletAddress } = useWallet();
  const { showToast } = useToast();
  const {
    activeParties,
    pendingParties,
    setParties,
    setUserPartyId,
    storeUserParty,
    userPartyId,
  } = useParties();

  const joinNewParty = async (partyId: number) => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }
    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS,
            abi: parseAbi(["function joinParty(uint256 _partyId) external"]),
            functionName: "joinParty",
            args: [BigInt(partyId)],
          },
        ],
      });

      if (finalPayload.status !== "error") {
        const partyToJoin = [...activeParties, ...pendingParties].find(
          (party) => party.id === partyId
        );

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

        if (partyToJoin) {
          const partyWithMemberFlag = {
            ...partyToJoin,
            isUserMember: true,
            memberCount: partyToJoin.memberCount + 1,
          };
          storeUserParty(partyWithMemberFlag);
          localStorage.setItem(
            `user_party_details_${partyId}`,
            JSON.stringify(partyWithMemberFlag)
          );
        }

        setUserPartyId(partyId);
        localStorage.setItem(
          "userPartyCache",
          JSON.stringify({
            partyId: partyId,
            isLeader: false,
            partyStatus: 1, // ACTIVE
            timestamp: Date.now(),
          })
        );
        showToast("Successfully joined party!", "success");
      } else if (finalPayload.error_code !== "user_rejected") {
        showToast("Failed to join party", "error");
        setUserPartyId(0);
        storeUserParty(null);
        localStorage.removeItem("userPartyCache");
        localStorage.removeItem("optimisticParty");
        if (partyId) {
          localStorage.removeItem(`user_party_details_${partyId}`);
        }
      }
    } catch (error) {
      console.error("Error joining party:", error);
      showToast("Error joining party", "error");
      setUserPartyId(0);
      storeUserParty(null);
      localStorage.removeItem("userPartyCache");
      localStorage.removeItem("optimisticParty");
      if (partyId) {
        localStorage.removeItem(`user_party_details_${partyId}`);
      }
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
            address: POLITICAL_PARTY_REGISTRY_ADDRESS,
            abi: parseAbi(["function leaveParty(uint256 _partyId) external"]),
            functionName: "leaveParty",
            args: [BigInt(partyId)],
          },
        ],
      });

      if (finalPayload.status !== "error") {
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
        localStorage.removeItem("userPartyCache");
        localStorage.removeItem(`user_party_details_${partyId}`);
        showToast("Successfully left party", "success");
      } else if (finalPayload.error_code !== "user_rejected") {
        showToast("Failed to leave party", "error");
      }
    } catch (error) {
      console.error("Error leaving party:", error);
      showToast("Error leaving party", "error");
    }
  };

  const createParty = async (form: CreatePartyForm) => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }
    if (
      !form.name.trim() ||
      !form.shortName.trim() ||
      !form.description.trim()
    ) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    try {
      const optimisticParty: Party = {
        id: -1, // Temporary ID
        name: form.name.trim(),
        shortName: form.shortName.trim(),
        description: form.description.trim(),
        officialLink: form.officialLink.trim(),
        founder: walletAddress || "",
        leader: walletAddress || "",
        memberCount: 1,
        documentVerifiedMemberCount: 0,
        verifiedMemberCount: 0,
        creationTime: Math.floor(Date.now() / 1000),
        active: false,
        status: 0, // PENDING
        isUserMember: true,
        isUserLeader: true,
      };

      storeUserParty(optimisticParty);
      setUserPartyId(-1);
      localStorage.setItem("optimisticParty", JSON.stringify(optimisticParty));

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS,
            abi: parseAbi([
              "function createParty(string memory _name, string memory _shortName, string memory _description, string memory _officialLink) external returns (uint256)",
            ]),
            functionName: "createParty",
            args: [
              form.name.trim(),
              form.shortName.trim(),
              form.description.trim(),
              form.officialLink.trim(),
            ],
          },
        ],
      });

      if (finalPayload.status === "error") {
        if (finalPayload.error_code !== "user_rejected") {
          showToast("Failed to create party", "error");
        }
        setUserPartyId(0);
        storeUserParty(null);
        localStorage.removeItem("userPartyCache");
        localStorage.removeItem("optimisticParty");
      } else {
        showToast("Party created successfully!", "success");
      }
    } catch (error) {
      console.error("Error creating party:", error);
      showToast("Error creating party", "error");
      setUserPartyId(0);
      storeUserParty(null);
      localStorage.removeItem("userPartyCache");
      localStorage.removeItem("optimisticParty");
    }
  };

  const updatePartyDetails = async (
    partyId: number,
    field: "name" | "shortName" | "description" | "officialLink",
    value: string
  ) => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    const functionMap = {
      name: "updatePartyName",
      shortName: "updatePartyShortName",
      description: "updatePartyDescription",
      officialLink: "updateOfficialLink",
    };
    const functionName = functionMap[field];
    const abi = `function ${functionName}(uint256 _partyId, string memory _value) external`;

    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS,
            abi: parseAbi([abi]),
            functionName,
            args: [BigInt(partyId), value],
          },
        ],
      });

      if (finalPayload.status !== "error") {
        setParties((prevParties) =>
          prevParties.map((p) =>
            p.id === partyId ? { ...p, [field]: value } : p
          )
        );
        if (partyId === userPartyId) {
          // also update the user party data cache
          const cachedPartyJson = localStorage.getItem(
            `user_party_details_${partyId}`
          );
          if (cachedPartyJson) {
            const cachedParty = JSON.parse(cachedPartyJson);
            const updatedParty = { ...cachedParty, [field]: value };
            localStorage.setItem(
              `user_party_details_${partyId}`,
              JSON.stringify(updatedParty)
            );
            storeUserParty(updatedParty);
          }
        }
        showToast(`Party ${field} updated successfully`, "success");
      } else if (finalPayload.error_code !== "user_rejected") {
        showToast(`Failed to update party ${field}`, "error");
      }
    } catch (error) {
      console.error(`Error updating party ${field}:`, error);
      showToast(`Error updating party ${field}`, "error");
    }
  };

  const transferLeadership = async (
    partyId: number,
    newLeaderAddress: string
  ) => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }
    if (!newLeaderAddress) {
      showToast("Please provide a valid address", "error");
      return;
    }

    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS,
            abi: parseAbi([
              "function transferLeadership(uint256 _partyId, address _newLeader) external",
            ]),
            functionName: "transferLeadership",
            args: [BigInt(partyId), newLeaderAddress as `0x${string}`],
          },
        ],
      });

      if (finalPayload.status !== "error") {
        setParties((prevParties: Party[]) =>
          prevParties.map((p: Party) =>
            p.id === partyId
              ? {
                  ...p,
                  leader: newLeaderAddress,
                  isUserLeader: false,
                }
              : p
          )
        );

        if (partyId === userPartyId) {
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
        showToast("Party leadership transferred successfully", "success");
      } else if (finalPayload.error_code !== "user_rejected") {
        showToast("Failed to transfer leadership", "error");
      }
    } catch (error) {
      console.error("Error transferring leadership:", error);
      showToast("Error transferring leadership", "error");
    }
  };

  const removeMember = async (partyId: number, memberToRemove: string) => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }
    if (!memberToRemove) {
      showToast("Please provide a valid address", "error");
      return;
    }

    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS,
            abi: parseAbi([
              "function removeMember(uint256 _partyId, address _member) external",
            ]),
            functionName: "removeMember",
            args: [BigInt(partyId), memberToRemove as `0x${string}`],
          },
        ],
      });

      if (finalPayload.status !== "error") {
        setParties((prevParties: Party[]) =>
          prevParties.map((p: Party) =>
            p.id === partyId
              ? {
                  ...p,
                  memberCount: p.memberCount > 0 ? p.memberCount - 1 : 0,
                }
              : p
          )
        );

        showToast("Member removed successfully", "success");
      } else if (finalPayload.error_code !== "user_rejected") {
        showToast("Failed to remove member", "error");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      showToast("Error removing member", "error");
    }
  };

  const banMember = async (partyId: number, memberToBan: string) => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }
    if (!memberToBan) {
      showToast("Please provide a valid address", "error");
      return;
    }

    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS,
            abi: parseAbi([
              "function banMember(uint256 _partyId, address _member) external",
            ]),
            functionName: "banMember",
            args: [BigInt(partyId), memberToBan as `0x${string}`],
          },
        ],
      });

      if (finalPayload.status !== "error") {
        showToast("Member banned successfully", "success");
      } else if (finalPayload.error_code !== "user_rejected") {
        showToast("Failed to ban member", "error");
      }
    } catch (error) {
      console.error("Error banning member:", error);
      showToast("Error banning member", "error");
    }
  };

  const unbanMember = async (partyId: number, memberToUnban: string) => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }
    if (!memberToUnban) {
      showToast("Please provide a valid address", "error");
      return;
    }

    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS,
            abi: parseAbi([
              "function unbanMember(uint256 _partyId, address _member) external",
            ]),
            functionName: "unbanMember",
            args: [BigInt(partyId), memberToUnban as `0x${string}`],
          },
        ],
      });

      if (finalPayload.status !== "error") {
        showToast("Member unbanned successfully", "success");
      } else if (finalPayload.error_code !== "user_rejected") {
        showToast("Failed to unban member", "error");
      }
    } catch (error) {
      console.error("Error unbanning member:", error);
      showToast("Error unbanning member", "error");
    }
  };

  const togglePartyStatus = async (party: Party) => {
    if (!MiniKit.isInstalled()) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    try {
      const functionName =
        party.status === 1 || party.status === 0
          ? "deactivateParty"
          : "reactivateParty";
      const functionAbi = `function ${functionName}(uint256 _partyId) external`;

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: POLITICAL_PARTY_REGISTRY_ADDRESS,
            abi: parseAbi([functionAbi]),
            functionName: functionName,
            args: [BigInt(party.id)],
          },
        ],
      });

      if (finalPayload.status !== "error") {
        const newStatus = party.status !== 2 ? 2 : 0;
        const newActiveState = newStatus !== 2;

        setParties((prevParties: Party[]) =>
          prevParties.map((p: Party) =>
            p.id === party.id
              ? {
                  ...p,
                  active: newActiveState,
                  status: newStatus,
                }
              : p
          )
        );

        if (party.id === userPartyId) {
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

        showToast(
          `Party ${
            functionName === "deactivateParty" ? "deleted" : "reactivated"
          } successfully`,
          "success"
        );
      } else if (finalPayload.error_code !== "user_rejected") {
        showToast("Failed to toggle party status", "error");
      }
    } catch (error) {
      console.error("Error toggling party status:", error);
      showToast("Error toggling party status", "error");
    }
  };

  return {
    joinNewParty,
    leaveParty,
    createParty,
    updatePartyDetails,
    transferLeadership,
    removeMember,
    banMember,
    unbanMember,
    togglePartyStatus,
  };
};
