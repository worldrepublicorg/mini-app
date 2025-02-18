import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  MiniAppWalletAuthSuccessPayload,
  verifySiweMessage,
} from "@worldcoin/minikit-js";

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
}

export async function POST(req: NextRequest) {
  const { payload, nonce } = (await req.json()) as IRequestPayload;

  if (nonce !== cookies().get("siwe")?.value) {
    return NextResponse.json({
      status: "error",
      isValid: false,
      message: "Invalid nonce",
    });
  }

  try {
    const validMessage = await verifySiweMessage(payload, nonce);

    // Set auth cookies
    cookies().set("wallet-auth", "authenticated", {
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookies().set("wallet-address", payload.address, {
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      status: "success",
      isValid: validMessage.isValid,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      isValid: false,
      message: error.message,
    });
  }
}
