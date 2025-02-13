import { createPublicClient, http } from "viem";
import { worldchain } from "viem/chains";

export const viemClient = createPublicClient({
  chain: worldchain,
  transport: http(),
}) as any; // Temporary type assertion to bypass the error
