"use client";

import { X } from "lucide-react";
import { useWallet } from "@/lib/wallet";
import { SOLANA_NETWORK } from "@/lib/solana";

const WALLETS = [
  {
    id: "phantom",
    name: "Phantom",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='24' fill='%23AB9FF2'/%3E%3Cpath d='M110.5 64.2c0-1.3-.1-2.7-.2-4-.7-7.5-3.6-14.5-8.3-20.3C95 31.5 84.8 27.3 74 27.3c-5 0-9.9 1-14.4 2.8-4.5 1.9-8.6 4.7-12 8.1s-6.2 7.5-8.1 12c-1.9 4.5-2.8 9.4-2.8 14.4v.7c0 1.8.1 3.6.3 5.3.1.8.7 1.5 1.5 1.7.2 0 .3.1.5.1.6 0 1.2-.3 1.6-.8l.2-.3c2.1-3.1 5.7-4.9 9.4-4.9 6.4 0 11.5 5.1 11.5 11.5 0 3.1-1.2 5.9-3.2 8-1 1.1-.9 2.7.1 3.7.5.5 1.1.7 1.8.7.6 0 1.3-.2 1.8-.7 3.2-2.8 7.3-4.4 11.7-4.4 6.4 0 12.1 3.4 15.3 8.5.6 1 1.7 1.5 2.8 1.4 1.1-.1 2.1-.9 2.5-1.9 1.4-3.7 2.8-7.5 3.9-11.4 1-3.6 1.6-7.4 1.6-11.3v-6.4z' fill='white'/%3E%3Ccircle cx='61.5' cy='56' r='5' fill='%23AB9FF2'/%3E%3Ccircle cx='83.5' cy='56' r='5' fill='%23AB9FF2'/%3E%3C/path%3E%3C/svg%3E",
    color: "#AB9FF2",
  },
  {
    id: "solflare",
    name: "Solflare",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='24' fill='%23FC7227'/%3E%3Cpath d='M64 28L38 100h16l10-28 10 28h16L64 28z' fill='white'/%3E%3C/svg%3E",
    color: "#FC7227",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ConnectWalletModal({ open, onClose }: Props) {
  const { connect } = useWallet();

  if (!open) return null;

  function handleConnect(providerId: string) {
    connect(providerId);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card-bg border border-border rounded-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-foreground">Connect Wallet</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Solana network badge */}
        <div className="flex items-center gap-1.5 mb-5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          <span className="text-xs text-muted capitalize">
            Solana {SOLANA_NETWORK.replace("-", " ")}
          </span>
        </div>

        <div className="space-y-3">
          {WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <img
                src={wallet.icon}
                alt={wallet.name}
                className="w-10 h-10 rounded-lg"
              />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {wallet.name}
                </span>
                <span className="text-[10px] text-muted">Solana Wallet</span>
              </div>
            </button>
          ))}
        </div>

        {/* Powered by Solana footer */}
        <div className="mt-5 pt-4 border-t border-border flex items-center justify-center gap-2">
          <svg
            className="w-3.5 h-3.5 text-muted"
            viewBox="0 0 397.7 311.7"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
            <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
            <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
          </svg>
          <span className="text-xs text-muted">Powered by Solana</span>
        </div>
      </div>
    </div>
  );
}
