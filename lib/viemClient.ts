import { createPublicClient, http, fallback } from "viem";
import { worldchain } from "viem/chains";

const optimizedFallbackConfig = {
  retryCount: 2,
  retryDelay: 100,
};

export const viemClient = createPublicClient({
  chain: worldchain,
  transport: fallback(
    [
      http(
        "https://lb.drpc.org/ogrpc?network=worldchain&dkey=AgobUm8RhkrUlOLZyf0lrdQFo2ndAh8R8ICcfhHoK236"
      ),
      http("https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro"),
      http("https://worldchain-mainnet.g.alchemy.com/public"),
      http("https://worldchain-mainnet.gateway.tenderly.co"),
      http("https://480.rpc.thirdweb.com"),
      http(
        "https://node.histori.xyz/worldchain-mainnet/8ry9f6t9dct1se2hlagxnd9n2a"
      ),
    ],
    optimizedFallbackConfig
  ),
}) as any;
