import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
	const nonce = crypto.randomUUID().replace(/-/g, "");

	const cookieStore = await cookies();
	cookieStore.set("siwe", nonce, { secure: true });
	return NextResponse.json({ nonce });
}
