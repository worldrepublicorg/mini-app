import { createPublicClient, http, fallback, webSocket } from "viem";
import { worldchain } from "viem/chains";

const optimizedFallbackConfig = {
  retryCount: 10,
  retryDelay: 100,
};

export const viemClient = createPublicClient({
  chain: worldchain,
  transport: fallback(
    [
      http(
        "https://lb.drpc.org/ogrpc?network=worldchain&dkey=AgobUm8RhkrUlOLZyf0lrdQFo2ndAh8R8ICcfhHoK236"
      ),
      webSocket(
        "wss://lb.drpc.org/ogws?network=worldchain&dkey=AgobUm8RhkrUlOLZyf0lrdQFo2ndAh8R8ICcfhHoK236"
      ),
      http(
        "https://lb.drpc.org/ogrpc?network=worldchain&dkey=AgobUm8RhkrUlOLZyf0lrdRm99dUAfUR8ICJfhHoK236"
      ),
      webSocket(
        "wss://lb.drpc.org/ogws?network=worldchain&dkey=AgobUm8RhkrUlOLZyf0lrdRm99dUAfUR8ICJfhHoK236"
      ),
    ],
    optimizedFallbackConfig
  ),
}) as any;
