"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  searchAssetsByOwner,
  getTokenHolders,
  getTransactionHistory,
  getSolBalanceFormatted,
  getTokenBalances,
  getNetworkStatus,
  subscribeToAccount,
  isHeliusEnabled,
  type DasAsset,
  type TokenHolder,
  type EnrichedTransaction,
  type TokenBalance,
} from "./helius";

// ---------------------------------------------------------------------------
// Hook: useWalletAssets — DAS-powered portfolio
// ---------------------------------------------------------------------------

export function useWalletAssets(walletAddress: string | null) {
  const [assets, setAssets] = useState<DasAsset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      setAssets([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    searchAssetsByOwner(walletAddress, {
      showFungible: true,
      showNativeBalance: true,
    }).then((items) => {
      if (!cancelled) {
        setAssets(items);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [walletAddress]);

  return { assets, loading };
}

// ---------------------------------------------------------------------------
// Hook: useWalletBalances — SOL + token balances
// ---------------------------------------------------------------------------

export function useWalletBalances(walletAddress: string | null) {
  const [solBalance, setSolBalance] = useState("0.000");
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    let cancelled = false;
    setLoading(true);

    Promise.all([
      getSolBalanceFormatted(walletAddress),
      getTokenBalances(walletAddress),
    ]).then(([sol, toks]) => {
      if (!cancelled) {
        setSolBalance(sol);
        setTokens(toks);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [walletAddress]);

  return { solBalance, tokens, loading };
}

// ---------------------------------------------------------------------------
// Hook: useTokenHolders — cap table for a token mint
// ---------------------------------------------------------------------------

export function useTokenHolders(mintAddress: string | null, limit = 20) {
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mintAddress) return;

    let cancelled = false;
    setLoading(true);

    getTokenHolders(mintAddress, limit).then((h) => {
      if (!cancelled) {
        setHolders(h);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [mintAddress, limit]);

  return { holders, loading };
}

// ---------------------------------------------------------------------------
// Hook: useTransactionHistory — enriched tx feed for an address
// ---------------------------------------------------------------------------

export function useTransactionHistory(address: string | null, limit = 20) {
  const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address || !isHeliusEnabled()) return;

    let cancelled = false;
    setLoading(true);

    getTransactionHistory(address, limit).then((txs) => {
      if (!cancelled) {
        setTransactions(txs);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [address, limit]);

  return { transactions, loading };
}

// ---------------------------------------------------------------------------
// Hook: useAccountStream — real-time WebSocket account changes
// ---------------------------------------------------------------------------

export function useAccountStream(address: string | null) {
  const [lastUpdate, setLastUpdate] = useState<unknown>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!address || typeof window === "undefined") return;

    setConnected(true);
    const unsubscribe = subscribeToAccount(address, (data) => {
      setLastUpdate(data);
    });

    return () => {
      unsubscribe();
      setConnected(false);
    };
  }, [address]);

  return { lastUpdate, connected };
}

// ---------------------------------------------------------------------------
// Hook: useNetworkStatus — Solana network health
// ---------------------------------------------------------------------------

export function useNetworkStatus(pollIntervalMs = 30000) {
  const [status, setStatus] = useState<{
    slot: number;
    blockHeight: number;
    epoch: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const s = await getNetworkStatus();
      if (!cancelled && s) setStatus(s);
    };

    poll();
    const interval = setInterval(poll, pollIntervalMs);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pollIntervalMs]);

  return status;
}
