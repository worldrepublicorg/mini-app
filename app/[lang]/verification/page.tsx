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
          {dictionary?.pages?.verification?.title}
        </Typography>
      </div>

      <div className="mt-4 space-y-10">
        <div>
          <Typography
            as="h3"
            variant={{ variant: "subtitle", level: 1 }}
            className="mb-2"
          >
            {dictionary?.pages?.verification?.levels?.document?.title}
          </Typography>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-4 text-gray-500"
          >
            {dictionary?.pages?.verification?.levels?.document?.description}
          </Typography>
          <VerifyButton
            lang={lang}
            verificationLevel={VerificationLevel.Document}
            buttonText={
              dictionary?.pages?.verification?.levels?.document?.buttonText
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
            {dictionary?.pages?.verification?.levels?.secureDocument?.title}
          </Typography>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-4 text-gray-500"
          >
            {
              dictionary?.pages?.verification?.levels?.secureDocument
                ?.description
            }
          </Typography>
          <VerifyButton
            lang={lang}
            verificationLevel={VerificationLevel.SecureDocument}
            buttonText={
              dictionary?.pages?.verification?.levels?.secureDocument
                ?.buttonText
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
            {dictionary?.pages?.verification?.levels?.orb?.title}
          </Typography>
          <Typography
            as="p"
            variant={{ variant: "body", level: 1 }}
            className="mb-4 text-gray-500"
          >
            {dictionary?.pages?.verification?.levels?.orb?.description}
          </Typography>
          <VerifyButton
            lang={lang}
            verificationLevel={VerificationLevel.Orb}
            buttonText={
              dictionary?.pages?.verification?.levels?.orb?.buttonText
            }
            actionId="verify-orb"
          />
        </div>
      </div>
    </div>
  );
}
