"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/Drawer";
import { Form, Input } from "@worldcoin/mini-apps-ui-kit-react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useTranslations } from "@/hooks/useTranslations";
import { usePartyActions } from "@/hooks/usePartyActions";
import { useInputFocus } from "@/hooks/useInputFocus";
import type { CreatePartyForm } from "@/lib/types";

const MAX_STRING_LENGTH = 256;
const MAX_SHORT_NAME_LENGTH = 16;

type CreatePartyDrawerProps = {
  lang: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function CreatePartyDrawer({
  lang,
  isOpen,
  onOpenChange,
}: CreatePartyDrawerProps) {
  const dictionary = useTranslations(lang);
  const { createParty } = usePartyActions();
  const { handleFocus } = useInputFocus();
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState<CreatePartyForm>({
    name: "",
    shortName: "",
    description: "",
    officialLink: "",
  });

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      await createParty(form);
      onOpenChange(false); // Close drawer on success
      setForm({ name: "", shortName: "", description: "", officialLink: "" }); // Reset form
    } catch (error) {
      // Error toast is handled in the hook
    } finally {
      setIsProcessing(false);
    }
  };

  const t = dictionary?.components?.politicalPartyList?.drawers?.create;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="p-6">
          <div className="mb-4">
            <DrawerTitle>{t?.title}</DrawerTitle>
          </div>
          <Form.Root
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Form.Field name="name" className="mt-4">
              <Typography
                as="label"
                variant={{ variant: "caption", level: 1 }}
                className="mb-1.5 block font-medium"
              >
                {t?.name?.label}
              </Typography>
              <Form.Control asChild>
                <Input
                  label={t?.name?.placeholder}
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  onFocus={handleFocus}
                  required
                  maxLength={MAX_STRING_LENGTH}
                />
              </Form.Control>
              <Form.Message match="valueMissing" error>
                {t?.name?.error}
              </Form.Message>
              {form.name.length >= MAX_STRING_LENGTH * 0.9 && (
                <Typography
                  variant={{ variant: "caption", level: 2 }}
                  className={`mt-[7px] px-2 text-xs ${form.name.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                >
                  {form.name.length >= MAX_STRING_LENGTH
                    ? t?.limitWarning?.reached
                    : t?.limitWarning?.approaching
                        .replace("{{current}}", form.name.length.toString())
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
                {t?.shortName?.label}
              </Typography>
              <Form.Control asChild>
                <Input
                  label={t?.shortName?.placeholder}
                  value={form.shortName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, shortName: e.target.value }))
                  }
                  onFocus={handleFocus}
                  maxLength={MAX_SHORT_NAME_LENGTH}
                  required
                />
              </Form.Control>
              <Form.Message match="valueMissing" error>
                {t?.shortName?.error}
              </Form.Message>
              {form.shortName.length >= MAX_SHORT_NAME_LENGTH * 0.8 && (
                <Typography
                  variant={{ variant: "caption", level: 2 }}
                  className={`mt-[7px] px-2 text-xs ${form.shortName.length >= MAX_SHORT_NAME_LENGTH ? "text-error-600" : "text-gray-500"}`}
                >
                  {form.shortName.length >= MAX_SHORT_NAME_LENGTH
                    ? t?.limitWarning?.reached
                    : t?.limitWarning?.approaching
                        .replace(
                          "{{current}}",
                          form.shortName.length.toString()
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
                {t?.description?.label}
              </Typography>
              <Form.Control asChild>
                <Textarea
                  placeholder={t?.description?.placeholder}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  onFocus={handleFocus}
                  rows={4}
                  required
                  maxLength={MAX_STRING_LENGTH}
                />
              </Form.Control>
              <Form.Message match="valueMissing" error>
                {t?.description?.error}
              </Form.Message>
              {form.description.length >= MAX_STRING_LENGTH * 0.9 && (
                <Typography
                  variant={{ variant: "caption", level: 2 }}
                  className={`mt-[7px] px-2 text-xs ${form.description.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                >
                  {form.description.length >= MAX_STRING_LENGTH
                    ? t?.limitWarning?.reached
                    : t?.limitWarning?.approaching
                        .replace(
                          "{{current}}",
                          form.description.length.toString()
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
                {t?.officialLink?.label}
              </Typography>
              <Form.Control asChild>
                <Input
                  label={t?.officialLink?.placeholder}
                  value={form.officialLink}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      officialLink: e.target.value,
                    }))
                  }
                  onFocus={handleFocus}
                  maxLength={MAX_STRING_LENGTH}
                />
              </Form.Control>
              {form.officialLink.length >= MAX_STRING_LENGTH * 0.9 && (
                <Typography
                  variant={{ variant: "caption", level: 2 }}
                  className={`mt-[7px] px-2 text-xs ${form.officialLink.length >= MAX_STRING_LENGTH ? "text-error-600" : "text-gray-500"}`}
                >
                  {form.officialLink.length >= MAX_STRING_LENGTH
                    ? t?.limitWarning?.reached
                    : t?.limitWarning?.approaching
                        .replace(
                          "{{current}}",
                          form.officialLink.length.toString()
                        )
                        .replace("{{max}}", MAX_STRING_LENGTH.toString())}
                </Typography>
              )}
            </Form.Field>

            <Form.Submit asChild className="mt-4">
              <Button variant="primary" fullWidth disabled={isProcessing}>
                {isProcessing ? t?.button?.creating : t?.button?.create}
              </Button>
            </Form.Submit>
          </Form.Root>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
