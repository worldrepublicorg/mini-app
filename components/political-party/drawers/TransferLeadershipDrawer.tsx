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

type TransferLeadershipDrawerProps = {
  lang: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  party: Party | null;
};

export function TransferLeadershipDrawer({
  lang,
  isOpen,
  onOpenChange,
  party,
}: TransferLeadershipDrawerProps) {
  const dictionary = useTranslations(lang);
  const { transferLeadership } = usePartyActions();
  const {
    lookup,
    isLoading: isLookingUp,
    error: lookupError,
    result: lookupResult,
    setError: setLookupError,
  } = useUsernameLookup();
  const { handleFocus } = useInputFocus();
  const [isProcessing, setIsProcessing] = useState(false);
  const [newLeaderAddress, setNewLeaderAddress] = useState("");
  const [leaderUsername, setLeaderUsername] = useState("");

  const handleLookup = async () => {
    const address = await lookup(leaderUsername);
    if (address) {
      setNewLeaderAddress(address);
    }
  };

  const handleSubmit = async () => {
    if (!party) return;
    setIsProcessing(true);
    try {
      await transferLeadership(party.id, newLeaderAddress);
      onOpenChange(false);
      setNewLeaderAddress("");
      setLeaderUsername("");
      setLookupError("");
    } finally {
      setIsProcessing(false);
    }
  };

  const t =
    dictionary?.components?.politicalPartyList?.drawers?.transferLeadership;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="flex flex-col gap-4 p-6">
          <div className="mb-4">
            <DrawerTitle>{t?.title}</DrawerTitle>
          </div>
          <Typography as="p" variant={{ variant: "body", level: 2 }}>
            {t?.description}
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
                value={leaderUsername}
                onChange={(e) => setLeaderUsername(e.target.value)}
                onFocus={handleFocus}
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={handleLookup}
                disabled={isLookingUp || !leaderUsername.trim()}
              >
                {isLookingUp ? t?.lookup?.loading : t?.lookup?.buttonText}
              </Button>
            </div>
            {lookupError && (
              <Typography as="p" className="text-red-500 mt-2 text-sm">
                {lookupError}
              </Typography>
            )}
            {lookupResult && (
              <div className="mt-2 rounded-lg bg-gray-50 p-3">
                <Typography
                  as="p"
                  variant={{ variant: "caption", level: 1 }}
                  className="text-gray-700"
                >
                  {t?.lookup?.foundUser}
                  <span className="font-semibold">{leaderUsername}</span>
                </Typography>
                <Typography
                  as="p"
                  variant={{ variant: "caption", level: 1 }}
                  className="truncate text-gray-500"
                >
                  {t?.lookup?.address}
                  {lookupResult.address}
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
            <Form.Field name="leaderAddress">
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block font-medium"
              >
                {t?.newLeader?.label}
              </Typography>
              <Form.Control asChild>
                <Input
                  label={t?.newLeader?.placeholder}
                  value={newLeaderAddress}
                  onChange={(e) => setNewLeaderAddress(e.target.value)}
                  onFocus={handleFocus}
                  required
                  pattern="^0x[a-fA-F0-9]{40}$"
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
                {isProcessing ? t?.button?.processing : t?.button?.transfer}
              </Button>
            </Form.Submit>
          </Form.Root>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
