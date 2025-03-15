import { createPublicClient, http, fallback, webSocket } from "viem";
import { worldchain } from "viem/chains";

export const drpcClient = createPublicClient({
  chain: worldchain,
  transport: fallback(
    [
      http("https://worldchain.drpc.org"),
      http("https://480.rpc.thirdweb.com"),
      http("https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro"),
      http("https://worldchain-mainnet.g.alchemy.com/public"),
      http("https://worldchain-mainnet.gateway.tenderly.co"),
      webSocket("wss://worldchain.drpc.org"),
      webSocket("wss://worldchain-mainnet.gateway.tenderly.co"),
    ],
    { rank: true }
  ),
}) as any;

export const thirdwebClient = createPublicClient({
  chain: worldchain,
  transport: fallback(
    [
      http("https://480.rpc.thirdweb.com"),
      http("https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro"),
      http("https://worldchain-mainnet.g.alchemy.com/public"),
      http("https://worldchain-mainnet.gateway.tenderly.co"),
      http("https://worldchain.drpc.org"),
      webSocket("wss://worldchain.drpc.org"),
      webSocket("wss://worldchain-mainnet.gateway.tenderly.co"),
    ],
    { rank: true }
  ),
}) as any;

export const quiknodeClient = createPublicClient({
  chain: worldchain,
  transport: fallback(
    [
      http("https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro"),
      http("https://worldchain-mainnet.g.alchemy.com/public"),
      http("https://worldchain-mainnet.gateway.tenderly.co"),
      http("https://worldchain.drpc.org"),
      http("https://480.rpc.thirdweb.com"),
      webSocket("wss://worldchain.drpc.org"),
      webSocket("wss://worldchain-mainnet.gateway.tenderly.co"),
    ],
    { rank: true }
  ),
}) as any;

export const alchemyClient = createPublicClient({
  chain: worldchain,
  transport: fallback(
    [
      http("https://worldchain-mainnet.g.alchemy.com/public"),
      http("https://worldchain-mainnet.gateway.tenderly.co"),
      http("https://worldchain.drpc.org"),
      http("https://480.rpc.thirdweb.com"),
      http("https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro"),
      webSocket("wss://worldchain.drpc.org"),
      webSocket("wss://worldchain-mainnet.gateway.tenderly.co"),
    ],
    { rank: true }
  ),
}) as any;

export const tenderlyClient = createPublicClient({
  chain: worldchain,
  transport: fallback(
    [
      http("https://worldchain-mainnet.gateway.tenderly.co"),
      http("https://worldchain.drpc.org"),
      http("https://480.rpc.thirdweb.com"),
      http("https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro"),
      http("https://worldchain-mainnet.g.alchemy.com/public"),
      webSocket("wss://worldchain.drpc.org"),
      webSocket("wss://worldchain-mainnet.gateway.tenderly.co"),
    ],
    { rank: true }
  ),
}) as any;
