"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/Drawer";
import { Form, Input } from "@worldcoin/mini-apps-ui-kit-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useTranslations } from "@/hooks/useTranslations";
import { usePartyActions } from "@/hooks/usePartyActions";
import { useUsernameLookup } from "@/hooks/useUsernameLookup";
import { useInputFocus } from "@/hooks/useInputFocus";
import type { Party } from "@/lib/types";

type MemberManagementDrawerProps = {
  lang: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  party: Party | null;
};

// A small sub-component for the lookup and form UI
const ManagementPanel = ({
  party,
  action,
  lookupHook,
  onAction,
  t,
  isProcessing,
  setAddress,
  address,
  username,
  setUsername,
}: any) => {
  const { handleFocus } = useInputFocus();

  const handleLookup = async () => {
    const foundAddress = await lookupHook.lookup(username);
    if (foundAddress) {
      setAddress(foundAddress);
    }
  };

  const handleSubmit = async () => {
    if (!party) return;
    await onAction(party.id, address);
    setAddress("");
    setUsername("");
    lookupHook.setResult(null);
    lookupHook.setError("");
  };

  return (
    <>
      <Typography as="p" variant={{ variant: "body", level: 2 }}>
        {action.description}
      </Typography>
      <div>
        <Typography
          as="label"
          variant={{ variant: "caption", level: 1 }}
          className="mb-1.5 block font-medium"
        >
          {t?.lookup?.label}
        </Typography>
        <div className="flex gap-2">
          <Input
            label={t?.lookup?.placeholder}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1"
            onFocus={handleFocus}
          />
          <Button
            variant="secondary"
            onClick={handleLookup}
            disabled={lookupHook.isLoading || !username.trim()}
          >
            {lookupHook.isLoading ? t?.lookup?.loading : t?.lookup?.buttonText}
          </Button>
        </div>
        {lookupHook.error && (
          <Typography as="p" className="text-red-500 mt-2 text-sm">
            {lookupHook.error}
          </Typography>
        )}
        {lookupHook.result && (
          <div className="mt-2 rounded-lg bg-gray-50 p-3">
            <Typography
              as="p"
              variant={{ variant: "caption", level: 1 }}
              className="text-gray-700"
            >
              {t?.lookup?.foundUser}
              <span className="font-semibold">{username}</span>
            </Typography>
            <Typography
              as="p"
              variant={{ variant: "caption", level: 1 }}
              className="truncate text-gray-500"
            >
              {t?.lookup?.address}
              {lookupHook.result.address}
            </Typography>
          </div>
        )}
      </div>
      <Form.Root
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Form.Field name="memberAddress">
          <Typography
            as="label"
            variant={{ variant: "caption", level: 1 }}
            className="mb-1.5 block font-medium"
          >
            {t?.management?.label}
          </Typography>
          <Form.Control asChild>
            <Input
              label={t?.newLeader?.placeholder}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              pattern="^0x[a-fA-F0-9]{40}$"
              onFocus={handleFocus}
            />
          </Form.Control>
          <Form.Message match="valueMissing" error>
            {t?.newLeader?.errors?.required}
          </Form.Message>
          <Form.Message match="patternMismatch" error>
            {t?.newLeader?.errors?.invalid}
          </Form.Message>
        </Form.Field>
        <Form.Submit asChild className="mt-8">
          <Button variant="primary" fullWidth disabled={isProcessing}>
            {isProcessing ? action.button.processing : action.button.label}
          </Button>
        </Form.Submit>
      </Form.Root>
    </>
  );
};

export function MemberManagementDrawer({
  lang,
  isOpen,
  onOpenChange,
  party,
}: MemberManagementDrawerProps) {
  const dictionary = useTranslations(lang);
  const { removeMember, banMember, unbanMember } = usePartyActions();
  const [activeTab, setActiveTab] = useState<"remove" | "ban" | "unban">(
    "remove"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Separate state for each tab's form
  const [removeAddress, setRemoveAddress] = useState("");
  const [removeUsername, setRemoveUsername] = useState("");
  const [banAddress, setBanAddress] = useState("");
  const [banUsername, setBanUsername] = useState("");
  const [unbanAddress, setUnbanAddress] = useState("");
  const [unbanUsername, setUnbanUsername] = useState("");

  // Separate lookup hooks for each tab
  const removeLookup = useUsernameLookup();
  const banLookup = useUsernameLookup();
  const unbanLookup = useUsernameLookup();

  const handleAction = async (
    action: (partyId: number, address: string) => Promise<void>,
    partyId: number,
    address: string
  ) => {
    setIsProcessing(true);
    try {
      await action(partyId, address);
    } finally {
      setIsProcessing(false);
    }
  };

  const t = dictionary?.components?.politicalPartyList?.drawers;
  const t_mm = t?.memberManagement;
  const t_tl = t?.transferLeadership;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="flex flex-col gap-4 p-6">
          <div className="mb-4">
            <DrawerTitle>{t_mm?.title}</DrawerTitle>
          </div>
          <div className="mb-4 flex items-center gap-1 border-b">
            <button
              className={`h-9 items-center px-4 font-sans text-sm font-medium ${activeTab === "remove" ? "border-black border-b-2" : ""}`}
              onClick={() => setActiveTab("remove")}
            >
              {t_mm?.tabs?.remove}
            </button>
            <button
              className={`h-9 items-center px-4 font-sans text-sm font-medium ${activeTab === "ban" ? "border-black border-b-2" : ""}`}
              onClick={() => setActiveTab("ban")}
            >
              {t_mm?.tabs?.ban}
            </button>
            <button
              className={`h-9 items-center px-4 font-sans text-sm font-medium ${activeTab === "unban" ? "border-black border-b-2" : ""}`}
              onClick={() => setActiveTab("unban")}
            >
              {t_mm?.tabs?.unban}
            </button>
          </div>

          {activeTab === "remove" && (
            <ManagementPanel
              party={party}
              action={{
                description: t_mm?.remove.description,
                button: {
                  processing: t_mm?.remove.button.processing,
                  label: t_mm?.remove.button.remove,
                },
              }}
              lookupHook={removeLookup}
              onAction={removeMember}
              t={t_tl}
              isProcessing={isProcessing}
              address={removeAddress}
              setAddress={setRemoveAddress}
              username={removeUsername}
              setUsername={setRemoveUsername}
            />
          )}

          {activeTab === "ban" && (
            <ManagementPanel
              party={party}
              action={{
                description: t_mm?.ban.description,
                button: {
                  processing: t_mm?.ban.button.processing,
                  label: t_mm?.ban.button.ban,
                },
              }}
              lookupHook={banLookup}
              onAction={banMember}
              t={t_tl}
              isProcessing={isProcessing}
              address={banAddress}
              setAddress={setBanAddress}
              username={banUsername}
              setUsername={setBanUsername}
            />
          )}

          {activeTab === "unban" && (
            <ManagementPanel
              party={party}
              action={{
                description: t_mm?.unban.description,
                button: {
                  processing: t_mm?.unban.button.processing,
                  label: t_mm?.unban.button.unban,
                },
              }}
              lookupHook={unbanLookup}
              onAction={unbanMember}
              t={t_tl}
              isProcessing={isProcessing}
              address={unbanAddress}
              setAddress={setUnbanAddress}
              username={unbanUsername}
              setUsername={setUnbanUsername}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
