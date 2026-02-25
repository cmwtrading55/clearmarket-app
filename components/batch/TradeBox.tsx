"use client";

import { useState } from "react";
import { AlertTriangle, Wallet } from "lucide-react";
import type { Batch } from "@/lib/types";
import { useWallet } from "@/lib/wallet";

export default function TradeBox({ batch }: { batch: Batch }) {
  const { connected, balance } = useWallet();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");

  const numAmount = parseFloat(amount) || 0;
  const tokens = numAmount / batch.price;
  const insufficientFunds = connected && side === "buy" && numAmount > balance;

  // Simple mock bonding curve — price increases with funding %
  const curveMultiplier = 1 + (batch.fundingPercent / 100) * 0.3;
  const effectivePrice = batch.price * (side === "buy" ? curveMultiplier : 1 / curveMultiplier);

  return (
    <div className="bg-card-bg border border-border rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-medium text-foreground">Trade {batch.tokenSymbol}</h3>

      {/* Buy / Sell tabs */}
      <div className="flex rounded-lg overflow-hidden border border-border">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            side === "buy"
              ? "bg-buy/10 text-buy"
              : "text-muted hover:text-foreground"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            side === "sell"
              ? "bg-sell/10 text-sell"
              : "text-muted hover:text-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Price info */}
      <div className="flex justify-between text-xs text-muted">
        <span>Curve Price</span>
        <span className="font-mono text-foreground">${effectivePrice.toFixed(4)}</span>
      </div>

      {/* Amount */}
      <div>
        <label className="text-xs text-muted mb-1 block">
          Amount ({side === "buy" ? "USDC" : batch.tokenSymbol})
        </label>
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

      {/* Quick amounts */}
      <div className="flex gap-2">
        {[100, 500, 1000, 5000].map((v) => (
          <button
            key={v}
            onClick={() => setAmount(v.toString())}
            className="flex-1 text-xs py-1.5 rounded border border-border text-muted hover:text-foreground hover:border-primary/30 transition-colors"
          >
            ${v}
          </button>
        ))}
      </div>

      {/* Estimate */}
      {numAmount > 0 && (
        <div className="bg-background rounded-lg p-3 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted">You {side === "buy" ? "receive" : "get"}</span>
            <span className="font-mono text-foreground">
              {side === "buy"
                ? `~${tokens.toFixed(2)} ${batch.tokenSymbol}`
                : `~$${(numAmount * effectivePrice).toFixed(2)} USDC`}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted">Slippage</span>
            <span className="font-mono text-foreground">~0.5%</span>
          </div>
        </div>
      )}

      {/* Warnings */}
      {!connected && (
        <div className="flex items-center gap-2 p-3 bg-warning/5 border border-warning/20 rounded-lg text-xs text-warning">
          <Wallet size={14} />
          Connect wallet to trade
        </div>
      )}
      {insufficientFunds && (
        <div className="flex items-center gap-2 p-3 bg-sell/5 border border-sell/20 rounded-lg text-xs text-sell">
          <AlertTriangle size={14} />
          Insufficient balance
        </div>
      )}

      {/* Action */}
      <button
        disabled={!connected || numAmount <= 0 || insufficientFunds}
        className={`w-full py-3 rounded-lg font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
          side === "buy"
            ? "bg-buy text-background hover:bg-buy/90"
            : "bg-sell text-white hover:bg-sell/90"
        }`}
      >
        {!connected
          ? "Connect Wallet"
          : `${side === "buy" ? "Buy" : "Sell"} ${batch.tokenSymbol}`}
      </button>

      <p className="text-xs text-muted text-center">
        Mock bonding curve — no real transactions.
      </p>
    </div>
  );
}
