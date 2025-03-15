import { createPublicClient, http } from "viem";
import { worldchain } from "viem/chains";

export const viemClient = createPublicClient({
  chain: worldchain,
  transport: http("https://worldchain-mainnet.g.alchemy.com/v2/_NsuCc68eeT4D5AZNEGdDG5nms3v8gcY"),
}) as any;
