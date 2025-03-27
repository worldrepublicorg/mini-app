"use client";
import {
  MiniKit,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { useState } from "react";
import { Button } from "./ui/Button";
import { useToast } from "./ui/Toast";

// Define the props interface with verification level
interface VerifyButtonProps {
  verificationLevel?: VerificationLevel;
  buttonText?: string;
  actionId?: string;
}

export const VerifyButton = ({
  verificationLevel = VerificationLevel.Device,
  buttonText = "Verify to Claim",
  actionId = process.env.NEXT_PUBLIC_WLD_ACTION_ID!,
}: VerifyButtonProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const { showToast } = useToast();

  const handleVerify = async () => {
    if (!MiniKit.isInstalled()) {
      showToast("Please install the World App to verify", "error");
      return;
    }

    try {
      setIsVerifying(true);
      const verifyPayload = {
        action: actionId,
        signal: "",
        verification_level: verificationLevel,
      };

      const response = await MiniKit.commandsAsync.verify(verifyPayload);

      if (response.finalPayload.status === "error") {
        throw new Error("Verification failed");
      }

      // Verify the proof in the backend
      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: response.finalPayload as ISuccessResult,
          action: verifyPayload.action,
          signal: verifyPayload.signal,
        }),
      });

      const data = await verifyResponse.json();

      if (data.status === 200 && data.verifyRes.success) {
        // Remove the minting logic and just show success message
        console.log("Verification successful:", data.verifyRes);
      } else {
        throw new Error(data.verifyRes.message || "Verification failed");
      }
    } catch (error: any) {
      console.error("Verification error:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Button onClick={handleVerify} isLoading={isVerifying} fullWidth>
      {buttonText}
    </Button>
  );
};
