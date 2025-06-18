"use client";

import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/Drawer";
import { Input } from "@worldcoin/mini-apps-ui-kit-react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useTranslations } from "@/hooks/useTranslations";
import { usePartyActions } from "@/hooks/usePartyActions";
import { useInputFocus } from "@/hooks/useInputFocus";
import type { Party } from "@/lib/types";

const MAX_STRING_LENGTH = 256;
const MAX_SHORT_NAME_LENGTH = 16;

type UpdatePartyDrawerProps = {
  lang: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  party: Party | null;
};

export function UpdatePartyDrawer({
  lang,
  isOpen,
  onOpenChange,
  party,
}: UpdatePartyDrawerProps) {
  const dictionary = useTranslations(lang);
  const { updatePartyDetails } = usePartyActions();
  const { handleFocus } = useInputFocus();
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    shortName: "",
    description: "",
    officialLink: "",
  });

  useEffect(() => {
    if (party) {
      setForm({
        name: party.name,
        shortName: party.shortName,
        description: party.description,
        officialLink: party.officialLink,
      });
    }
  }, [party]);

  const handleUpdate = async (
    field: "name" | "shortName" | "description" | "officialLink"
  ) => {
    if (!party || form[field].trim() === party[field]) {
      // You might want a toast here to inform user "No changes"
      return;
    }

    setIsProcessing(true);
    try {
      await updatePartyDetails(party.id, field, form[field].trim());
    } catch (error) {
      // Error toast is handled in the hook
    } finally {
      setIsProcessing(false);
    }
  };

  const t = dictionary?.components?.politicalPartyList?.drawers;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="flex flex-col gap-4 p-6">
          <div className="mb-4">
            <DrawerTitle>{t?.update?.title}</DrawerTitle>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {/* Name */}
            <div>
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block font-medium"
              >
                {t?.create?.name?.label}
              </Typography>
              <div className="flex gap-2">
                <Input
                  label={t?.create?.name?.placeholder}
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  onFocus={handleFocus}
                  className="flex-1"
                  maxLength={MAX_STRING_LENGTH}
                />
                <Button
                  variant="secondary"
                  onClick={() => handleUpdate("name")}
                  disabled={isProcessing}
                >
                  {t?.update?.button?.update}
                </Button>
              </div>
            </div>
            {/* Short Name */}
            <div>
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block font-medium"
              >
                {t?.create?.shortName?.label}
              </Typography>
              <div className="flex gap-2">
                <Input
                  label={t?.create?.shortName?.placeholder}
                  value={form.shortName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, shortName: e.target.value }))
                  }
                  onFocus={handleFocus}
                  className="flex-1"
                  maxLength={MAX_SHORT_NAME_LENGTH}
                />
                <Button
                  variant="secondary"
                  onClick={() => handleUpdate("shortName")}
                  disabled={isProcessing}
                >
                  {t?.update?.button?.update}
                </Button>
              </div>
            </div>
            {/* Description */}
            <div>
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block font-medium"
              >
                {t?.create?.description?.label}
              </Typography>
              <div className="flex flex-col gap-2">
                <Textarea
                  placeholder={t?.create?.description?.placeholder}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  onFocus={handleFocus}
                  rows={4}
                  maxLength={MAX_STRING_LENGTH}
                />
                <Button
                  variant="secondary"
                  onClick={() => handleUpdate("description")}
                  disabled={isProcessing}
                >
                  {t?.update?.button?.updateDescription}
                </Button>
              </div>
            </div>
            {/* Official Link */}
            <div>
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block font-medium"
              >
                {t?.create?.officialLink?.label}
              </Typography>
              <div className="flex gap-2">
                <Input
                  label={t?.create?.officialLink?.placeholder}
                  value={form.officialLink}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      officialLink: e.target.value,
                    }))
                  }
                  onFocus={handleFocus}
                  className="flex-1"
                  maxLength={MAX_STRING_LENGTH}
                />
                <Button
                  variant="secondary"
                  onClick={() => handleUpdate("officialLink")}
                  disabled={isProcessing}
                >
                  {t?.update?.button?.update}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
