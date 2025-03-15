import { createPublicClient, http, fallback } from "viem";
import { worldchain } from "viem/chains";

const httpOptions = {
  timeout: 2000, // 2 seconds timeout
  retryCount: 2,
  retryDelay: 500, // 0.5 second between retries
};

export const drpcClient = createPublicClient({
  chain: worldchain,
  transport: fallback([
    http("https://worldchain.drpc.org", httpOptions),
    http("https://480.rpc.thirdweb.com", httpOptions),
    http(
      "https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro",
      httpOptions
    ),
    http("https://worldchain-mainnet.g.alchemy.com/public", httpOptions),
    http("https://worldchain-mainnet.gateway.tenderly.co", httpOptions),
  ]),
}) as any;

export const thirdwebClient = createPublicClient({
  chain: worldchain,
  transport: fallback([
    http("https://480.rpc.thirdweb.com", httpOptions),
    http(
      "https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro",
      httpOptions
    ),
    http("https://worldchain-mainnet.g.alchemy.com/public", httpOptions),
    http("https://worldchain-mainnet.gateway.tenderly.co", httpOptions),
    http("https://worldchain.drpc.org", httpOptions),
  ]),
}) as any;

export const quiknodeClient = createPublicClient({
  chain: worldchain,
  transport: fallback([
    http(
      "https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro",
      httpOptions
    ),
    http("https://worldchain-mainnet.g.alchemy.com/public", httpOptions),
    http("https://worldchain-mainnet.gateway.tenderly.co", httpOptions),
    http("https://worldchain.drpc.org", httpOptions),
    http("https://480.rpc.thirdweb.com", httpOptions),
  ]),
}) as any;

export const alchemyClient = createPublicClient({
  chain: worldchain,
  transport: fallback([
    http("https://worldchain-mainnet.g.alchemy.com/public", httpOptions),
    http("https://worldchain-mainnet.gateway.tenderly.co", httpOptions),
    http("https://worldchain.drpc.org", httpOptions),
    http("https://480.rpc.thirdweb.com", httpOptions),
    http(
      "https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro",
      httpOptions
    ),
  ]),
}) as any;

export const tenderlyClient = createPublicClient({
  chain: worldchain,
  transport: fallback([
    http("https://worldchain-mainnet.gateway.tenderly.co", httpOptions),
    http("https://worldchain.drpc.org", httpOptions),
    http("https://480.rpc.thirdweb.com", httpOptions),
    http(
      "https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro",
      httpOptions
    ),
    http("https://worldchain-mainnet.g.alchemy.com/public", httpOptions),
  ]),
}) as any;
