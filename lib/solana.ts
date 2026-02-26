// ClearMarket Labs — Solana constants and utilities

export const PROGRAM_ID = "CMLKxr8zNfY3Qe5GJiRjUMBqvKnBFCgWMaJRXiRHpump";
export const SOLANA_NETWORK = "mainnet-beta";

const BASE58_CHARS = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/** Generate a mock 88-char Solana transaction signature */
export function mockTxSignature(): string {
  let sig = "";
  for (let i = 0; i < 88; i++) {
    sig += BASE58_CHARS[Math.floor(Math.random() * BASE58_CHARS.length)];
  }
  return sig;
}

/** Generate a deterministic mock tx signature from an ID (for trade rows) */
export function deterministicTxSig(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  let sig = "";
  for (let i = 0; i < 88; i++) {
    hash = ((hash << 5) - hash + i) | 0;
    sig += BASE58_CHARS[Math.abs(hash) % BASE58_CHARS.length];
  }
  return sig;
}

/** Generate a realistic Solana slot number (~350M range) */
export function mockSlot(): number {
  return 350_000_000 + Math.floor(Math.random() * 5_000_000);
}

/** Deterministic slot from a string ID */
export function deterministicSlot(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return 350_000_000 + Math.abs(hash % 5_000_000);
}

export function solscanTxUrl(sig: string): string {
  return `https://solscan.io/tx/${sig}`;
}

export function solscanAccountUrl(addr: string): string {
  return `https://solscan.io/account/${addr}`;
}

/** Shorten a base58 Solana address (no 0x prefix) */
export function shortenAddress(addr: string, chars = 4): string {
  if (addr.length <= chars * 2 + 3) return addr;
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

/** Inline Solana logo SVG — black gradient mark, works on light and dark backgrounds */
export const SOLANA_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397.7 311.7" fill="currentColor"><path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/><path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/><path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/></svg>`;
