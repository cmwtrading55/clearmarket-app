// ClearMarket Labs — Helius RPC integration
// Uses Helius for production-grade Solana RPC, DAS API, and token queries.
// Set NEXT_PUBLIC_HELIUS_API_KEY in your environment to enable.

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || "";

/** ClearMarket Labs Solana wallet (Helius signup wallet) */
export const CLEARMARKET_WALLET = "HaniJR6VyWGrSWwnPZ2bMj5hXNRQuRoUTeCWoidQ65bG";

export const HELIUS_RPC_URL = HELIUS_API_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : "https://api.mainnet-beta.solana.com";

export const HELIUS_API_URL = HELIUS_API_KEY
  ? `https://api.helius.xyz/v0`
  : null;

export function isHeliusEnabled(): boolean {
  return HELIUS_API_KEY.length > 0;
}

// ---------------------------------------------------------------------------
// RPC helpers (work with or without Helius, falls back to public RPC)
// ---------------------------------------------------------------------------

async function rpcCall<T>(method: string, params: unknown[]): Promise<T | null> {
  try {
    const res = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });
    const json = await res.json();
    return json.result ?? null;
  } catch {
    return null;
  }
}

/** Get native SOL balance in lamports */
export async function getSolBalance(address: string): Promise<number | null> {
  const result = await rpcCall<{ value: number }>("getBalance", [address]);
  return result?.value ?? null;
}

/** Get SOL balance formatted in SOL (not lamports) */
export async function getSolBalanceFormatted(address: string): Promise<string> {
  const lamports = await getSolBalance(address);
  if (lamports === null) return "0.000";
  return (lamports / 1e9).toFixed(3);
}

/** Get SPL token accounts for a wallet */
export interface TokenBalance {
  mint: string;
  amount: string;
  decimals: number;
  uiAmount: number;
}

export async function getTokenBalances(address: string): Promise<TokenBalance[]> {
  const result = await rpcCall<{
    value: Array<{
      account: {
        data: {
          parsed: {
            info: {
              mint: string;
              tokenAmount: {
                amount: string;
                decimals: number;
                uiAmount: number;
              };
            };
          };
        };
      };
    }>;
  }>("getTokenAccountsByOwner", [
    address,
    { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
    { encoding: "jsonParsed" },
  ]);

  if (!result?.value) return [];

  return result.value.map((acc) => {
    const info = acc.account.data.parsed.info;
    return {
      mint: info.mint,
      amount: info.tokenAmount.amount,
      decimals: info.tokenAmount.decimals,
      uiAmount: info.tokenAmount.uiAmount,
    };
  });
}

// ---------------------------------------------------------------------------
// Helius-specific APIs (require API key)
// ---------------------------------------------------------------------------

/** Get enriched transaction details (Helius enhanced API) */
export async function getEnrichedTransaction(signature: string): Promise<unknown | null> {
  if (!HELIUS_API_URL || !HELIUS_API_KEY) return null;
  try {
    const res = await fetch(
      `${HELIUS_API_URL}/transactions/?api-key=${HELIUS_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: [signature] }),
      }
    );
    const data = await res.json();
    return data?.[0] ?? null;
  } catch {
    return null;
  }
}

/** Search for digital assets (DAS API) owned by an address */
export interface DasAsset {
  id: string;
  content: {
    metadata: {
      name: string;
      symbol: string;
    };
    links?: {
      image?: string;
    };
  };
  token_info?: {
    balance: number;
    decimals: number;
    supply: number;
  };
}

export async function searchAssetsByOwner(ownerAddress: string): Promise<DasAsset[]> {
  try {
    const res = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "searchAssets",
        params: {
          ownerAddress,
          displayOptions: { showFungible: true },
        },
      }),
    });
    const json = await res.json();
    return json.result?.items ?? [];
  } catch {
    return [];
  }
}

/** Get current Solana network status */
export async function getNetworkStatus(): Promise<{
  slot: number;
  blockHeight: number;
  epoch: number;
} | null> {
  try {
    const [slotResult, epochResult] = await Promise.all([
      rpcCall<number>("getSlot", []),
      rpcCall<{ absoluteSlot: number; blockHeight: number; epoch: number }>("getEpochInfo", []),
    ]);
    if (!epochResult) return null;
    return {
      slot: slotResult ?? epochResult.absoluteSlot,
      blockHeight: epochResult.blockHeight,
      epoch: epochResult.epoch,
    };
  } catch {
    return null;
  }
}
