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
        <Typography as="h2" variant={{ variant: "heading", level: 2 }}>
          Verification Tests
        </Typography>
      </div>

      <div className="mt-4 space-y-10">
        <div>
          <Typography
            as="h3"
            variant={{ variant: "subtitle", level: 1 }}
            className="mb-2"
          >
            Device Verification
          </Typography>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-4 text-gray-500"
          >
            Basic verification using the device.
          </Typography>
          <VerifyButton
            lang={lang}
            verificationLevel={VerificationLevel.Device}
            buttonText="Test Device Verification"
            actionId="verify-device"
          />
        </div>

        <div>
          <Typography
            as="h3"
            variant={{ variant: "subtitle", level: 1 }}
            className="mb-2"
          >
            Document Verification
          </Typography>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-4 text-gray-500"
          >
            Verification using identity documents.
          </Typography>
          <VerifyButton
            lang={lang}
            verificationLevel={VerificationLevel.Document}
            buttonText="Test Document Verification"
            actionId="verify-document"
          />
        </div>

        <div>
          <Typography
            as="h3"
            variant={{ variant: "subtitle", level: 1 }}
            className="mb-2"
          >
            Secure Document Verification
          </Typography>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-4 text-gray-500"
          >
            Enhanced verification using secure identity documents.
          </Typography>
          <VerifyButton
            lang={lang}
            verificationLevel={VerificationLevel.SecureDocument}
            buttonText="Test Secure Document Verification"
            actionId="verify-secure-document"
          />
        </div>

        <div>
          <Typography
            as="h3"
            variant={{ variant: "subtitle", level: 1 }}
            className="mb-2"
          >
            Orb Verification
          </Typography>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-4 text-gray-500"
          >
            Highest security using Orb biometric verification.
          </Typography>
          <VerifyButton
            lang={lang}
            verificationLevel={VerificationLevel.Orb}
            buttonText="Test Orb Verification"
            actionId="verify-orb"
          />
        </div>
      </div>
    </div>
  );
}
