"use client";

import { VerifyButton } from "@/components/VerifyButton";
import { Typography } from "@/components/ui/Typography";
import { VerificationLevel } from "@worldcoin/minikit-js";
import { BiChevronLeft } from "react-icons/bi";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

export default function VerificationPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = useTranslations(lang);

  return (
    <div className="flex flex-col px-6 pb-20">
      <div className="relative flex items-center justify-center py-6">
        <Link
          href={`/${lang}/menu`}
          className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
        >
          <BiChevronLeft className="size-6 text-gray-500" />
        </Link>
        <Typography as="h2" variant={{ variant: "heading", level: 3 }}>
          {dictionary?.pages?.verification?.title ?? "Verification"}
        </Typography>
      </div>

      <div className="mt-4 space-y-10">
        <div>
          <Typography
            as="h3"
            variant={{ variant: "subtitle", level: 1 }}
            className="mb-2"
          >
            {dictionary?.pages?.verification?.levels?.device?.title ??
              "Device verification"}
          </Typography>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-4 text-gray-500"
          >
            {dictionary?.pages?.verification?.levels?.device?.description ??
              "Verify your device to get started"}
          </Typography>
          <VerifyButton
            lang={lang}
            verificationLevel={VerificationLevel.Device}
            buttonText={
              dictionary?.pages?.verification?.levels?.device?.buttonText ??
              "Verify device"
            }
            actionId="verify-device"
          />
        </div>

        <div>
          <Typography
            as="h3"
            variant={{ variant: "subtitle", level: 1 }}
            className="mb-2"
          >
            {dictionary?.pages?.verification?.levels?.document?.title ??
              "Document verification"}
          </Typography>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-4 text-gray-500"
          >
            {dictionary?.pages?.verification?.levels?.document?.description ??
              "Verify with your ID document"}
          </Typography>
          <VerifyButton
            lang={lang}
            verificationLevel={VerificationLevel.Document}
            buttonText={
              dictionary?.pages?.verification?.levels?.document?.buttonText ??
              "Verify with document"
            }
            actionId="verify-document"
          />
        </div>

        <div>
          <Typography
            as="h3"
            variant={{ variant: "subtitle", level: 1 }}
            className="mb-2"
          >
            {dictionary?.pages?.verification?.levels?.secureDocument?.title ??
              "Secure Document Verification"}
          </Typography>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-4 text-gray-500"
          >
            {dictionary?.pages?.verification?.levels?.secureDocument?.description ??
              "Verify your secure document"}
          </Typography>
          <VerifyButton
            lang={lang}
            verificationLevel={VerificationLevel.SecureDocument}
            buttonText={
              dictionary?.pages?.verification?.levels?.secureDocument
                ?.buttonText ?? "Verify secure document"
            }
            actionId="verify-secure-document"
          />
        </div>

        <div>
          <Typography
            as="h3"
            variant={{ variant: "subtitle", level: 1 }}
            className="mb-2"
          >
            {dictionary?.pages?.verification?.levels?.orb?.title ??
              "Orb Verification"}
          </Typography>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-4 text-gray-500"
          >
            {dictionary?.pages?.verification?.levels?.orb?.description ??
              "Verify your orb"}
          </Typography>
          <VerifyButton
            lang={lang}
            verificationLevel={VerificationLevel.Orb}
            buttonText={
              dictionary?.pages?.verification?.levels?.orb?.buttonText ??
              "Verify orb"
            }
            actionId="verify-orb"
          />
        </div>
      </div>
    </div>
  );
}
