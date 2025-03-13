import { createPublicClient, http } from "viem";
import { worldchain } from "viem/chains";

export const drpcClient = createPublicClient({
  chain: worldchain,
  transport: http("https://worldchain.drpc.org"),
}) as any;

export const thirdwebClient = createPublicClient({
  chain: worldchain,
  transport: http("https://480.rpc.thirdweb.com"),
}) as any;

export const quiknodeClient = createPublicClient({
  chain: worldchain,
  transport: http(
    "https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro"
  ),
}) as any;

export const alchemyClient = createPublicClient({
  chain: worldchain,
  transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
}) as any;

export const tenderlyClient = createPublicClient({
  chain: worldchain,
  transport: http("https://worldchain-mainnet.gateway.tenderly.co"),
}) as any;
