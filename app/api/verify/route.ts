import {
  verifyCloudProof,
  IVerifyResponse,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { NextRequest, NextResponse } from "next/server";

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal: string | undefined;
}

export async function POST(req: NextRequest) {
  const { payload, action, signal } = (await req.json()) as IRequestPayload;
  const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;

  try {
    const verifyRes = (await verifyCloudProof(
      payload,
      app_id,
      action,
      signal
    )) as IVerifyResponse;

    console.log("Verification response:", verifyRes);

    if (verifyRes.success) {
      return NextResponse.json({
        verifyRes,
        status: 200,
        nullifier_hash: payload.nullifier_hash,
      });
    } else {
      return NextResponse.json({
        verifyRes,
        status: 400,
        message: "Verification failed",
      });
    }
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
}
