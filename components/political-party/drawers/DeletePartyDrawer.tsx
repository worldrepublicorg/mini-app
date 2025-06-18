"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useTranslations } from "@/hooks/useTranslations";
import { usePartyActions } from "@/hooks/usePartyActions";
import type { Party } from "@/lib/types";

type DeletePartyDrawerProps = {
  lang: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  party: Party | null;
};

export function DeletePartyDrawer({
  lang,
  isOpen,
  onOpenChange,
  party,
}: DeletePartyDrawerProps) {
  const dictionary = useTranslations(lang);
  const { togglePartyStatus } = usePartyActions();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!party) return;
    setIsProcessing(true);
    try {
      await togglePartyStatus(party);
      onOpenChange(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const t = dictionary?.components?.politicalPartyList?.drawers?.delete;
  if (!party) return null;

  const isPending = party.status === 0;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="flex flex-col p-6">
          <div className="mb-4">
            <DrawerTitle>{t?.title}</DrawerTitle>
          </div>
          <Typography
            as="p"
            variant={{ variant: "body", level: 2 }}
            className="mx-auto mt-4 text-center"
          >
            {isPending ? t?.confirmPending : t?.confirm}
          </Typography>
          <Button
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            disabled={isProcessing}
            className="mt-10 bg-error-600"
          >
            {isProcessing
              ? t?.button?.processing
              : isPending
                ? t?.button?.deletePending
                : t?.button?.delete}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
