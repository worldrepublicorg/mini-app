"use client";

import { useState, useEffect } from "react";
import { useParties } from "@/components/contexts/PartiesContext";
import { usePartyActions } from "@/hooks/usePartyActions";
import { useTranslations } from "@/hooks/useTranslations";
import { Typography } from "@/components/ui/Typography";
import { LoadingSkeleton } from "@/components/PartySkeletons";
import { UserPartySection } from "./political-party/UserPartySection";
import { PartyList } from "./political-party/PartyList";
import { CreatePartyDrawer } from "./political-party/drawers/CreatePartyDrawer";
import { LeaveConfirmDrawer } from "./political-party/drawers/LeaveConfirmDrawer";
import { CreateConfirmDrawer } from "./political-party/drawers/CreateConfirmDrawer";
import { UpdatePartyDrawer } from "./political-party/drawers/UpdatePartyDrawer";
import { MemberManagementDrawer } from "./political-party/drawers/MemberManagementDrawer";
import { DeletePartyDrawer } from "./political-party/drawers/DeletePartyDrawer";
import { TransferLeadershipDrawer } from "./political-party/drawers/TransferLeadershipDrawer";
import type { Party, PoliticalPartyListProps } from "@/lib/types";

export function PoliticalPartyList({ lang }: PoliticalPartyListProps) {
  const dictionary = useTranslations(lang);
  const { activeLoading, fetchActiveParties, activeParties, userPartyId } =
    useParties();
  const { joinNewParty, leaveParty } = usePartyActions();

  // Overall state
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);

  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isLeaveConfirmDrawerOpen, setIsLeaveConfirmDrawerOpen] =
    useState(false);
  const [isCreateConfirmDrawerOpen, setIsCreateConfirmDrawerOpen] =
    useState(false);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [isMemberManagementDrawerOpen, setIsMemberManagementDrawerOpen] =
    useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [isTransferLeadershipDrawerOpen, setIsTransferLeadershipDrawerOpen] =
    useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("governVisited", "true");
    }
  }, []);

  useEffect(() => {
    if (activeParties.length === 0 && !activeLoading) {
      fetchActiveParties();
    }
  }, [activeParties.length, activeLoading, fetchActiveParties]);

  // Handler for joining a party, which might trigger a confirmation
  const handleJoin = async (partyId: number) => {
    if (userPartyId > 0) {
      const currentParty = activeParties.find((p) => p.id === userPartyId);
      setSelectedParty(currentParty || null);
      setIsLeaveConfirmDrawerOpen(true);
    } else {
      await joinNewParty(partyId);
    }
  };

  // Handler for creating a party, which might trigger a confirmation
  const handleCreate = () => {
    if (userPartyId > 0) {
      const currentParty = activeParties.find((p) => p.id === userPartyId);
      setSelectedParty(currentParty || null);
      setIsCreateConfirmDrawerOpen(true);
    } else {
      setIsCreateDrawerOpen(true);
    }
  };

  // Handler for when user confirms they want to leave their current party to create a new one
  const handleLeaveAndCreate = async () => {
    if (selectedParty) {
      await leaveParty(selectedParty.id);
      setIsCreateDrawerOpen(true);
    }
  };

  // Combined handler for opening management drawers
  const handleManage = (party: Party) => {
    setSelectedParty(party);
    // For now, we'll just open the main management drawer.
    // The old `update` and `transfer` can be accessed from here.
    setIsMemberManagementDrawerOpen(true);
  };

  const handleDelete = (party: Party) => {
    setSelectedParty(party);
    setIsDeleteDrawerOpen(true);
  };

  if (activeLoading) {
    return <LoadingSkeleton dictionary={dictionary} />;
  }

  return (
    <div className="w-full overflow-x-hidden">
      <UserPartySection
        lang={lang}
        onJoin={handleJoin}
        onLeave={leaveParty}
        onCreate={handleCreate}
        onManage={handleManage}
        onDelete={handleDelete}
      />

      <Typography
        as="h2"
        variant={{ variant: "subtitle", level: 1 }}
        className="mb-3 text-[19px] font-semibold"
      >
        {dictionary?.components?.politicalPartyList?.discover}
      </Typography>

      <PartyList
        lang={lang}
        onJoin={handleJoin}
        onLeave={leaveParty}
        onManage={handleManage}
        onDelete={handleDelete}
      />

      {/* --- DRAWERS --- */}
      <CreatePartyDrawer
        lang={lang}
        isOpen={isCreateDrawerOpen}
        onOpenChange={setIsCreateDrawerOpen}
      />
      <LeaveConfirmDrawer
        lang={lang}
        isOpen={isLeaveConfirmDrawerOpen}
        onOpenChange={setIsLeaveConfirmDrawerOpen}
        party={selectedParty}
        onConfirm={leaveParty}
      />
      <CreateConfirmDrawer
        lang={lang}
        isOpen={isCreateConfirmDrawerOpen}
        onOpenChange={setIsCreateConfirmDrawerOpen}
        party={selectedParty}
        onConfirm={handleLeaveAndCreate}
      />
      <UpdatePartyDrawer
        lang={lang}
        isOpen={isUpdateDrawerOpen}
        onOpenChange={setIsUpdateDrawerOpen}
        party={selectedParty}
      />
      <MemberManagementDrawer
        lang={lang}
        isOpen={isMemberManagementDrawerOpen}
        onOpenChange={setIsMemberManagementDrawerOpen}
        party={selectedParty}
      />
      <DeletePartyDrawer
        lang={lang}
        isOpen={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        party={selectedParty}
      />
      <TransferLeadershipDrawer
        lang={lang}
        isOpen={isTransferLeadershipDrawerOpen}
        onOpenChange={setIsTransferLeadershipDrawerOpen}
        party={selectedParty}
      />
    </div>
  );
}
