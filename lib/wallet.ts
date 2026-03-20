"use client";

import { useCallback, useState, useEffect } from "react";
import {
  useWallet as useWalletAdapter,
  useConnection,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletName,
  SolflareWalletName,
} from "@solana/wallet-adapter-wallets";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { WalletName } from "@solana/wallet-adapter-base";

export interface WalletState {
  connected: boolean;
  address: string | null;
  provider: string | null;
  balance: number;
  solBalance: number;
  network: string;
}

const WALLET_MAP: Record<string, WalletName> = {
  phantom: PhantomWalletName,
  solflare: SolflareWalletName,
  Phantom: PhantomWalletName,
  Solflare: SolflareWalletName,
};

export function useWallet() {
  const {
    publicKey,
    connected,
    wallet,
    select,
    disconnect: adapterDisconnect,
  } = useWalletAdapter();
  const { connection } = useConnection();
  const [solBalance, setSolBalance] = useState(0);

  const address = publicKey?.toBase58() ?? null;
  const provider = wallet?.adapter?.name ?? null;

  // Fetch SOL balance when connected
  useEffect(() => {
    if (!publicKey || !connection) {
      setSolBalance(0);
      return;
    }
    let cancelled = false;
    connection
      .getBalance(publicKey)
      .then((lamports) => {
        if (!cancelled) setSolBalance(lamports / LAMPORTS_PER_SOL);
      })
      .catch(() => {
        /* swallow */
      });
    return () => {
      cancelled = true;
    };
  }, [publicKey, connection]);

  const connect = useCallback(
    (providerId: string) => {
      const walletName = WALLET_MAP[providerId];
      if (walletName) {
        select(walletName);
      }
      // WalletProvider autoConnect handles the actual connection after select
    },
    [select],
  );

  const disconnect = useCallback(() => {
    adapterDisconnect();
  }, [adapterDisconnect]);

  return {
    connected,
    address,
    provider,
    balance: 0, // USDC balance fetched separately via Helius
    solBalance,
    network: "mainnet-beta",
    connect,
    disconnect,
  };
}

// Legacy named exports for backwards compatibility (no-ops, real connection through hook)
export function connectWallet(_provider: string) {}
export function disconnectWallet() {}
