"use client";

import { VerifyButton } from "@/components/VerifyButton";
import { Typography } from "@/components/ui/Typography";
import { VerificationLevel } from "@worldcoin/minikit-js";
import { BiChevronLeft } from "react-icons/bi";
import Link from "next/link";

export default function VerificationPage() {
  return (
    <div className="flex flex-col px-6 pb-20">
      <div className="relative flex items-center justify-center py-6">
        <Link
          href="/menu"
          className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
        >
          <BiChevronLeft className="size-6 text-gray-500" />
        </Link>
        <Typography as="h2" variant={{ variant: "heading", level: 2 }}>
          Verification Test
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
            verificationLevel={VerificationLevel.Device}
            buttonText="Verify with Device"
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
            verificationLevel={VerificationLevel.Document}
            buttonText="Verify with Document"
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
            verificationLevel={VerificationLevel.SecureDocument}
            buttonText="Verify with Secure Document"
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
            verificationLevel={VerificationLevel.Orb}
            buttonText="Verify with Orb"
          />
        </div>
      </div>
    </div>
  );
}
