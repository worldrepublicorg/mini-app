import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // Read the cookies you set during SIWE verification
  const walletAuthCookie = cookies().get("wallet-auth")?.value;
  const walletAddress = cookies().get("wallet-address")?.value;

  if (walletAuthCookie === "authenticated" && walletAddress) {
    return NextResponse.json({ walletAddress });
  } else {
    return NextResponse.json({ walletAddress: null });
  }
} 