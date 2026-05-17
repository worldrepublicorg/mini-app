import {
	type MiniAppWalletAuthSuccessPayload,
	verifySiweMessage,
} from "@worldcoin/minikit-js";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

interface IRequestPayload {
	payload: MiniAppWalletAuthSuccessPayload;
	nonce: string;
}

export async function POST(req: NextRequest) {
	const { payload, nonce } = (await req.json()) as IRequestPayload;
	const cookieStore = await cookies();

	if (nonce !== cookieStore.get("siwe")?.value) {
		return NextResponse.json({
			status: "error",
			isValid: false,
			message: "Invalid nonce",
		});
	}

	try {
		const validMessage = await verifySiweMessage(payload, nonce);

		// Set auth cookies
		cookieStore.set("wallet-auth", "authenticated", {
			secure: true,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7,
		});

		cookieStore.set("wallet-address", payload.address, {
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
