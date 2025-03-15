import {
  createPublicClient,
  http,
  fallback,
  type HttpTransportConfig,
  type FallbackTransportConfig,
} from "viem";
import { worldchain } from "viem/chains";

// Improved HTTP options with more aggressive timeout
const httpOptions: HttpTransportConfig = {
  timeout: 5000, // 5 seconds timeout (more aggressive)
  retryCount: 2,
  retryDelay: 500, // 0.5 second between retries (faster feedback)
  fetchOptions: {
    cache: "no-store" as RequestCache, // Ensure fresh responses
  },
};

// List of RPC endpoints
const rpcEndpoints = [
  "https://worldchain.drpc.org",
  "https://480.rpc.thirdweb.com",
  "https://sparkling-autumn-dinghy.worldchain-mainnet.quiknode.pro",
  "https://worldchain-mainnet.g.alchemy.com/public",
  "https://worldchain-mainnet.gateway.tenderly.co",
];

// Custom fallback config
const fallbackConfig: FallbackTransportConfig = {
  rank: {
    interval: 1000 * 60, // Re-rank every minute
    sampleCount: 10, // Sample size for ranking
  },
};

// Create a robust client that will automatically handle failovers
export const robustClient = createPublicClient({
  chain: worldchain,
  transport: fallback(
    rpcEndpoints.map((endpoint) => http(endpoint, httpOptions)),
    fallbackConfig
  ),
});

// For backward compatibility, keep the individual clients, but use the robust implementation
export const drpcClient = robustClient;
export const thirdwebClient = robustClient;
export const quiknodeClient = robustClient;
export const alchemyClient = robustClient;
export const tenderlyClient = robustClient;

// Export a function to make custom RPC calls with smart retries
export async function executeRpcCall<TResult = unknown>(
  method: string,
  params: any[] = [],
  maxRetries: number = 3
): Promise<TResult> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Use the any type cast here to bypass type checking for the method and params
      // This allows flexibility in the RPC methods you can call
      return (await robustClient.request({
        method,
        params,
      } as any)) as TResult;
    } catch (error) {
      lastError = error;
      console.warn(
        `RPC call failed (attempt ${attempt + 1}/${maxRetries + 1}): ${method}`,
        error
      );

      // If this isn't the last attempt, wait before retrying
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError;
}
