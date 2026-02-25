"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { Batch } from "@/lib/types";
import { useWallet } from "@/lib/wallet";

interface Props {
  batch: Batch | null;
  onClose: () => void;
}

export default function QuickBuyModal({ batch, onClose }: Props) {
  const { connected, balance } = useWallet();
  const [amount, setAmount] = useState("");

  if (!batch) return null;

  const tokens = amount ? parseFloat(amount) / batch.price : 0;
  const total = amount ? parseFloat(amount) : 0;
  const insufficientFunds = connected && total > balance;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card-bg border border-border rounded-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Buy {batch.strain}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Batch info */}
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
            <img
              src={batch.heroImage}
              alt={batch.strain}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-medium text-foreground">{batch.strain}</p>
              <p className="text-xs text-muted">{batch.grower}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm font-mono font-semibold text-foreground">${batch.price.toFixed(2)}</p>
              <p className="text-xs text-muted">per token</p>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="text-xs text-muted mb-1 block">Amount (USDC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Token estimate */}
          {tokens > 0 && (
            <div className="flex justify-between text-sm text-muted p-3 bg-background rounded-lg">
              <span>You&apos;ll receive</span>
              <span className="font-mono text-foreground">
                ~{tokens.toFixed(2)} {batch.tokenSymbol}
              </span>
            </div>
          )}

          {/* Wallet gate */}
          {!connected ? (
            <div className="flex items-center gap-2 p-3 bg-warning/5 border border-warning/20 rounded-lg text-xs text-warning">
              <AlertTriangle size={14} />
              Connect your wallet to trade
            </div>
          ) : insufficientFunds ? (
            <div className="flex items-center gap-2 p-3 bg-sell/5 border border-sell/20 rounded-lg text-xs text-sell">
              <AlertTriangle size={14} />
              Insufficient balance (${balance.toFixed(2)} available)
            </div>
          ) : null}

          {/* Buy button */}
          <button
            disabled={!connected || !amount || parseFloat(amount) <= 0 || insufficientFunds}
            className="w-full py-3 rounded-lg bg-primary text-background font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {!connected ? "Connect Wallet" : `Buy ${batch.tokenSymbol}`}
          </button>

          <p className="text-xs text-muted text-center">
            Mock transaction — no real funds will be exchanged.
          </p>
        </div>
      </div>
    </div>
  );
}
