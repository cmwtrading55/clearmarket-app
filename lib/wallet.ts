"use client";

import { useSyncExternalStore, useCallback } from "react";

export interface WalletState {
  connected: boolean;
  address: string | null;
  provider: string | null;
  balance: number;
  solBalance: number;
  network: string;
}

const STORAGE_KEY = "cml-wallet";

const defaultState: WalletState = {
  connected: false,
  address: null,
  provider: null,
  balance: 0,
  solBalance: 0,
  network: "mainnet-beta",
};

let listeners: (() => void)[] = [];
let cachedState: WalletState | null = null;

function getState(): WalletState {
  if (cachedState) return cachedState;
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cachedState = raw ? JSON.parse(raw) : defaultState;
    return cachedState!;
  } catch {
    return defaultState;
  }
}

function setState(state: WalletState) {
  cachedState = state;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): WalletState {
  return getState();
}

function getServerSnapshot(): WalletState {
  return defaultState;
}

// Generate a mock Solana-style address
function mockAddress(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let addr = "";
  for (let i = 0; i < 44; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
}

export function connectWallet(provider: string) {
  setState({
    connected: true,
    address: mockAddress(),
    provider,
    balance: parseFloat((Math.random() * 10000 + 500).toFixed(2)),
    solBalance: parseFloat((Math.random() * 48 + 2).toFixed(2)),
    network: "mainnet-beta",
  });
}

export function disconnectWallet() {
  cachedState = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  listeners.forEach((l) => l());
}

export function useWallet() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const connect = useCallback((provider: string) => {
    connectWallet(provider);
  }, []);

  const disconnect = useCallback(() => {
    disconnectWallet();
  }, []);

  return { ...state, connect, disconnect };
}
