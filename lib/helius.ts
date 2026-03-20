// ClearMarket Labs — Helius Integration Layer
//
// Complete Helius platform integration:
// - RPC: balance, tokens, account info
// - Sender: ultra-low-latency transaction submission
// - DAS API: digital asset search, token holders, collection queries
// - Enhanced Transactions: human-readable transaction parsing
// - ZK Compression: compressed NFT minting and queries
// - WebSocket: real-time account and program change streaming
// - Program Monitoring: escrow program account tracking
//
// Set NEXT_PUBLIC_HELIUS_API_KEY in your environment to enable.

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || "";

/** ClearMarket Labs Solana wallet (Helius signup wallet) */
export const CLEARMARKET_WALLET = "HaniJR6VyWGrSWwnPZ2bMj5hXNRQuRoUTeCWoidQ65bG";

/** Helius webhook ID for escrow monitoring */
export const WEBHOOK_ID = "db7363bd-7476-425b-ae12-b47a264145f7";

export const HELIUS_RPC_URL = HELIUS_API_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : "https://api.mainnet-beta.solana.com";

export const HELIUS_WSS_URL = HELIUS_API_KEY
  ? `wss://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : "wss://api.mainnet-beta.solana.com";

export const HELIUS_API_URL = HELIUS_API_KEY
  ? `https://api.helius.xyz/v0`
  : null;

export function isHeliusEnabled(): boolean {
  return HELIUS_API_KEY.length > 0;
}

// ---------------------------------------------------------------------------
// 1. RPC helpers (work with or without Helius, falls back to public RPC)
// ---------------------------------------------------------------------------

async function rpcCall<T>(method: string, params: unknown[]): Promise<T | null> {
  try {
    const res = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
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
              tokenAmount: { amount: string; decimals: number; uiAmount: number };
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

// ---------------------------------------------------------------------------
// 2. Helius Sender — ultra-low-latency transaction submission
// ---------------------------------------------------------------------------

export interface SendTransactionResult {
  signature: string;
  confirmed: boolean;
  slot?: number;
  error?: string;
}

/**
 * Send a signed transaction via Helius Sender for priority landing.
 * Falls back to standard sendTransaction if Helius is not available.
 *
 * @param serializedTx - Base64-encoded signed transaction
 * @param options - skipPreflight, maxRetries, etc.
 */
export async function sendTransaction(
  serializedTx: string,
  options?: { skipPreflight?: boolean; maxRetries?: number }
): Promise<SendTransactionResult> {
  try {
    // Use Helius Sender API for priority landing
    if (isHeliusEnabled()) {
      const res = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "sendTransaction",
            params: [
              serializedTx,
              {
                encoding: "base64",
                skipPreflight: options?.skipPreflight ?? false,
                maxRetries: options?.maxRetries ?? 3,
                preflightCommitment: "confirmed",
              },
            ],
          }),
        }
      );
      const json = await res.json();
      if (json.error) {
        return { signature: "", confirmed: false, error: json.error.message };
      }
      return { signature: json.result, confirmed: true };
    }

    // Fallback to standard RPC
    const result = await rpcCall<string>("sendTransaction", [
      serializedTx,
      { encoding: "base64", skipPreflight: options?.skipPreflight ?? false },
    ]);
    return result
      ? { signature: result, confirmed: true }
      : { signature: "", confirmed: false, error: "RPC send failed" };
  } catch (err) {
    return { signature: "", confirmed: false, error: String(err) };
  }
}

/**
 * Estimate compute units for a transaction (Helius simulation).
 * Helps set optimal compute unit limits for priority fees.
 */
export async function estimateComputeUnits(serializedTx: string): Promise<number | null> {
  try {
    const res = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "simulateTransaction",
        params: [serializedTx, { encoding: "base64", commitment: "confirmed" }],
      }),
    });
    const json = await res.json();
    return json.result?.value?.unitsConsumed ?? null;
  } catch {
    return null;
  }
}

/**
 * Poll for transaction confirmation.
 */
export async function pollTransactionStatus(
  signature: string,
  maxAttempts = 30,
  intervalMs = 1000
): Promise<{ confirmed: boolean; slot?: number; error?: string }> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await rpcCall<{
      value: { confirmationStatus: string; slot: number; err: unknown } | null;
    }>("getSignatureStatuses", [[signature]]);

    const status = result?.value;
    if (status) {
      if (status.err) return { confirmed: false, error: JSON.stringify(status.err) };
      if (status.confirmationStatus === "confirmed" || status.confirmationStatus === "finalized") {
        return { confirmed: true, slot: status.slot };
      }
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return { confirmed: false, error: "Timeout waiting for confirmation" };
}

// ---------------------------------------------------------------------------
// 3. DAS API — Digital Asset Standard queries
// ---------------------------------------------------------------------------

export interface DasAsset {
  id: string;
  content: {
    metadata: { name: string; symbol: string; description?: string };
    links?: { image?: string; external_url?: string };
    json_uri?: string;
  };
  token_info?: {
    balance: number;
    decimals: number;
    supply: number;
    price_info?: { price_per_token: number; currency: string };
  };
  ownership: {
    owner: string;
    delegate?: string;
    frozen: boolean;
  };
  compression?: {
    compressed: boolean;
    tree: string;
    leaf_index: number;
  };
  grouping?: Array<{ group_key: string; group_value: string }>;
  authorities?: Array<{ address: string; scopes: string[] }>;
}

/** Search for all digital assets owned by an address */
export async function searchAssetsByOwner(
  ownerAddress: string,
  options?: { showFungible?: boolean; showNativeBalance?: boolean; limit?: number }
): Promise<DasAsset[]> {
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
          displayOptions: {
            showFungible: options?.showFungible ?? true,
            showNativeBalance: options?.showNativeBalance ?? true,
          },
          limit: options?.limit ?? 100,
        },
      }),
    });
    const json = await res.json();
    return json.result?.items ?? [];
  } catch {
    return [];
  }
}

/** Get a single asset by mint address */
export async function getAsset(mintAddress: string): Promise<DasAsset | null> {
  try {
    const res = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAsset",
        params: { id: mintAddress },
      }),
    });
    const json = await res.json();
    return json.result ?? null;
  } catch {
    return null;
  }
}

/** Get top token holders for a mint */
export interface TokenHolder {
  owner: string;
  balance: number;
  percentage: number;
}

export async function getTokenHolders(
  mintAddress: string,
  limit = 20
): Promise<TokenHolder[]> {
  try {
    // Use Helius enhanced API if available
    if (HELIUS_API_URL) {
      const res = await fetch(
        `${HELIUS_API_URL}/token-metadata?api-key=${HELIUS_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mintAccounts: [mintAddress] }),
        }
      );
      const data = await res.json();
      // This returns metadata, not holders. For holders, use the RPC method.
    }

    // Use RPC getTokenLargestAccounts
    const result = await rpcCall<{
      value: Array<{
        address: string;
        amount: string;
        decimals: number;
        uiAmount: number;
      }>;
    }>("getTokenLargestAccounts", [mintAddress]);

    if (!result?.value) return [];

    const totalSupply = result.value.reduce((sum, h) => sum + h.uiAmount, 0);

    return result.value.slice(0, limit).map((h) => ({
      owner: h.address,
      balance: h.uiAmount,
      percentage: totalSupply > 0 ? (h.uiAmount / totalSupply) * 100 : 0,
    }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// 4. Enhanced Transaction Parsing
// ---------------------------------------------------------------------------

export interface EnrichedTransaction {
  signature: string;
  timestamp: number;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  description: string;
  nativeTransfers: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    amount: number;
  }>;
  tokenTransfers: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    tokenAmount: number;
    mint: string;
  }>;
}

/** Get enriched/parsed transaction details */
export async function getEnrichedTransaction(signature: string): Promise<EnrichedTransaction | null> {
  if (!HELIUS_API_URL) return null;
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

/** Get enriched transaction history for an address */
export async function getTransactionHistory(
  address: string,
  limit = 20
): Promise<EnrichedTransaction[]> {
  if (!HELIUS_API_URL) return [];
  try {
    const res = await fetch(
      `${HELIUS_API_URL}/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=${limit}`
    );
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Format an enriched transaction into a human-readable string.
 * Turns raw tx data into "Bought 50 CANN-OG-KUSH @ $58.42" style descriptions.
 */
export function formatTransactionDescription(tx: EnrichedTransaction): string {
  // Helius already provides a description field
  if (tx.description) return tx.description;

  // Fallback: build from token transfers
  if (tx.tokenTransfers.length > 0) {
    const transfer = tx.tokenTransfers[0];
    const direction = transfer.fromUserAccount === CLEARMARKET_WALLET ? "Sent" : "Received";
    return `${direction} ${transfer.tokenAmount.toLocaleString()} tokens`;
  }

  if (tx.nativeTransfers.length > 0) {
    const transfer = tx.nativeTransfers[0];
    const sol = (transfer.amount / 1e9).toFixed(4);
    const direction = transfer.fromUserAccount === CLEARMARKET_WALLET ? "Sent" : "Received";
    return `${direction} ${sol} SOL`;
  }

  return `Transaction ${tx.type}`;
}

// ---------------------------------------------------------------------------
// 5. ZK Compression — compressed NFT operations
// ---------------------------------------------------------------------------

export interface CompressedNftParams {
  name: string;
  symbol: string;
  owner: string;
  delegate?: string;
  uri?: string;
  collection?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

/**
 * Mint a compressed NFT via Helius.
 * Costs ~0.000005 SOL vs ~0.01 SOL for standard NFTs.
 */
export async function mintCompressedNft(
  params: CompressedNftParams
): Promise<{ assetId: string; signature: string } | null> {
  if (!isHeliusEnabled()) return null;
  try {
    const res = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "mintCompressedNft",
        params: {
          name: params.name,
          symbol: params.symbol,
          owner: params.owner,
          delegate: params.delegate ?? CLEARMARKET_WALLET,
          uri: params.uri ?? "",
          collection: params.collection,
          attributes: params.attributes,
        },
      }),
    });
    const json = await res.json();
    if (json.result) {
      return {
        assetId: json.result.assetId,
        signature: json.result.signature,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/** Get a compressed account by address */
export async function getCompressedAccount(address: string): Promise<unknown | null> {
  try {
    const res = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getCompressedAccount",
        params: { address },
      }),
    });
    const json = await res.json();
    return json.result ?? null;
  } catch {
    return null;
  }
}

/** Get all compressed token accounts owned by a wallet */
export async function getCompressedTokensByOwner(owner: string): Promise<unknown[]> {
  try {
    const res = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getCompressedTokenAccountsByOwner",
        params: { owner },
      }),
    });
    const json = await res.json();
    return json.result?.items ?? [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// 6. WebSocket streaming
// ---------------------------------------------------------------------------

export type WebSocketCallback = (data: unknown) => void;

/**
 * Create a WebSocket connection to Helius for real-time updates.
 * Returns cleanup function.
 */
export function subscribeToAccount(
  address: string,
  onUpdate: WebSocketCallback
): () => void {
  if (typeof window === "undefined") return () => {};

  const ws = new WebSocket(HELIUS_WSS_URL);
  let subId: number | null = null;

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "accountSubscribe",
        params: [address, { encoding: "jsonParsed", commitment: "confirmed" }],
      })
    );
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.id === 1 && data.result !== undefined) {
        subId = data.result;
      } else if (data.method === "accountNotification") {
        onUpdate(data.params?.result);
      }
    } catch {
      // Ignore parse errors
    }
  };

  return () => {
    if (subId !== null && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "accountUnsubscribe",
          params: [subId],
        })
      );
    }
    ws.close();
  };
}

/** Subscribe to all account changes for a program */
export function subscribeToProgram(
  programId: string,
  onUpdate: WebSocketCallback
): () => void {
  if (typeof window === "undefined") return () => {};

  const ws = new WebSocket(HELIUS_WSS_URL);
  let subId: number | null = null;

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "programSubscribe",
        params: [programId, { encoding: "jsonParsed", commitment: "confirmed" }],
      })
    );
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.id === 1 && data.result !== undefined) {
        subId = data.result;
      } else if (data.method === "programNotification") {
        onUpdate(data.params?.result);
      }
    } catch {
      // Ignore parse errors
    }
  };

  return () => {
    if (subId !== null && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "programUnsubscribe",
          params: [subId],
        })
      );
    }
    ws.close();
  };
}

/** Subscribe to transaction confirmation */
export function subscribeToSignature(
  signature: string,
  onConfirmed: (slot: number) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const ws = new WebSocket(HELIUS_WSS_URL);

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "signatureSubscribe",
        params: [signature, { commitment: "confirmed" }],
      })
    );
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.method === "signatureNotification") {
        const slot = data.params?.result?.context?.slot ?? 0;
        onConfirmed(slot);
        ws.close();
      }
    } catch {
      // Ignore parse errors
    }
  };

  return () => ws.close();
}

// ---------------------------------------------------------------------------
// 7. Program account monitoring
// ---------------------------------------------------------------------------

/** Get all accounts owned by a program */
export async function getProgramAccounts(
  programId: string,
  filters?: Array<{ memcmp?: { offset: number; bytes: string }; dataSize?: number }>
): Promise<Array<{ pubkey: string; account: unknown }>> {
  const result = await rpcCall<
    Array<{ pubkey: string; account: unknown }>
  >("getProgramAccounts", [
    programId,
    {
      encoding: "jsonParsed",
      filters: filters ?? [],
    },
  ]);
  return result ?? [];
}

/** Get account info for any address */
export async function getAccountInfo(address: string): Promise<unknown | null> {
  const result = await rpcCall<{ value: unknown }>("getAccountInfo", [
    address,
    { encoding: "jsonParsed" },
  ]);
  return result?.value ?? null;
}

/** Get recent block production info (for network health monitoring) */
export async function getRecentPerformance(): Promise<Array<{
  slot: number;
  numTransactions: number;
  numNonVoteTransactions: number;
  samplePeriodSecs: number;
}>> {
  const result = await rpcCall<Array<{
    slot: number;
    numTransactions: number;
    numNonVoteTransactions: number;
    samplePeriodSecs: number;
  }>>("getRecentPerformanceSamples", [5]);
  return result ?? [];
}
