"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useTranslations } from "@/hooks/useTranslations";
import type { Party } from "@/lib/types";

type CreateConfirmDrawerProps = {
  lang: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  party: Party | null;
  onConfirm: () => Promise<void>;
};

export function CreateConfirmDrawer({
  lang,
  isOpen,
  onOpenChange,
  party,
  onConfirm,
}: CreateConfirmDrawerProps) {
  const dictionary = useTranslations(lang);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!party) return;
    setIsProcessing(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const t = dictionary?.components?.politicalPartyList?.drawers?.createConfirm;
  if (!party) return null;

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
            {t?.description.replace("{{partyName}}", party.name || "")}
            {party.isUserLeader && (
              <>
                <br />
                <br />
                <div className="text-error-600">{t?.leaderWarning}</div>
              </>
            )}
          </Typography>
          <Button
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            disabled={isProcessing}
            className="mt-10"
          >
            {isProcessing
              ? t?.button?.processing
              : t?.button?.leaveAndCreate.replace(
                  "{{partyShortName}}",
                  party.shortName || ""
                )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
