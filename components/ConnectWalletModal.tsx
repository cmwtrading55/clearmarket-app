"use client";

import { X } from "lucide-react";
import { useWallet } from "@/lib/wallet";

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
  {
    id: "metamask",
    name: "MetaMask",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='24' fill='%23F6851B'/%3E%3Cpath d='M100 38L82 48l-6-10L64 28 52 38l-6 10-18-10-6 16 10 18-4 16 10 6 12-4 14 6 14-6 12 4 10-6-4-16 10-18-6-16z' fill='white' stroke='%23E4761B' stroke-width='1'/%3E%3C/svg%3E",
    color: "#F6851B",
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Connect Wallet</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X size={20} />
          </button>
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
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {wallet.name}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted text-center">
            This is a mock wallet connection for demonstration purposes.
            No real blockchain transactions will occur.
          </p>
        </div>
      </div>
    </div>
  );
}
