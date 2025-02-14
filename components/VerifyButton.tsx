"use client";
import {
  MiniKit,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { useState } from "react";
import { Button } from "./ui/Button";

export const VerifyButton = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!MiniKit.isInstalled()) {
      alert("Please install the World App to verify");
      return;
    }

    try {
      setIsVerifying(true);
      const verifyPayload = {
        action: process.env.NEXT_PUBLIC_WLD_ACTION_ID!,
        signal: "",
        verification_level: VerificationLevel.Device,
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
        const address =
          MiniKit.walletAddress || (window as any).MiniKit?.walletAddress;
        if (!address) {
          throw new Error("No wallet address found");
        }

        // Add more detailed logging for the mint request
        console.log("Preparing mint request with address:", address);

        try {
          const mintResponse = await fetch("/api/mint", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: address,
              // Add additional required fields if needed
              // example: tokenAmount: 1,
            }),
          });

          if (!mintResponse.ok) {
            const errorData = await mintResponse.json();
            console.error("Mint API error details:", {
              status: mintResponse.status,
              statusText: mintResponse.statusText,
              error: errorData,
              requestBody: {
                address: address,
              },
            });
            throw new Error(
              `Minting failed: ${errorData.message || "Bad Request"}`,
            );
          }

          const mintData = await mintResponse.json();
          console.log("Mint API success response:", mintData);
          alert("Verification and minting successful!");
        } catch (mintError: any) {
          console.error("Mint API error:", {
            message: mintError.message,
            stack: mintError.stack,
            requestDetails: {
              address: address,
            },
          });
          throw new Error(`Mint API error: ${mintError.message}`);
        }
      } else {
        throw new Error(data.verifyRes.message || "Verification failed");
      }
    } catch (error: any) {
      console.error("Verification error:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      alert(`Error: ${error.message || "Verification failed"}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Button onClick={handleVerify} isLoading={isVerifying} fullWidth>
      Verify to claim
    </Button>
  );
};
