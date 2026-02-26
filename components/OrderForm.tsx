"use client";

import { useState } from "react";
import { useMarketTicker, useMockWallet } from "@/lib/hooks";
import { useAuth } from "@/lib/auth";
import type { Market } from "@/lib/types";
import { mockTxSignature, shortenAddress, solscanTxUrl } from "@/lib/solana";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sealcisjhqlrpmuescsu.supabase.co";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlYWxjaXNqaHFscnBtdWVzY3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDUwNDYsImV4cCI6MjA4NjQ4MTA0Nn0.P_hNdWsn1O7wz4j25-ji1dQ_lJwviWgG5NXF6LcObiA";

export default function OrderForm({ market }: { market: Market | undefined }) {
  const ticker = useMarketTicker(market?.id);
  const { user } = useAuth();
  const wallets = useMockWallet();

  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; txSig?: string } | null>(null);

  const quoteWallet = wallets.find(
    (w) => w.asset_id === market?.quote_asset_id
  );
  const baseWallet = wallets.find(
    (w) => w.asset_id === market?.base_asset_id
  );

  const availableBalance =
    side === "buy"
      ? Number(quoteWallet?.balance || 0)
      : Number(baseWallet?.balance || 0);

  const priceNum = orderType === "market" ? Number(ticker?.last_price || 0) : Number(price);
  const amountNum = Number(amount);
  const total = priceNum * amountNum;

  const handlePercentage = (pct: number) => {
    if (side === "buy" && priceNum > 0) {
      const maxAmount = (availableBalance * pct) / 100 / priceNum;
      setAmount(maxAmount.toFixed(2));
    } else if (side === "sell") {
      const maxAmount = (availableBalance * pct) / 100;
      setAmount(maxAmount.toFixed(2));
    }
  };

  const handleSubmit = async () => {
    if (!market || amountNum <= 0) return;
    if (orderType === "limit" && priceNum <= 0) return;

    setSubmitting(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ANON_KEY}`,
      };
      // If user is authenticated, pass their session token instead
      if (user) {
        const { data } = await (await import("@/lib/supabase")).supabase.auth.getSession();
        if (data.session?.access_token) {
          headers.Authorization = `Bearer ${data.session.access_token}`;
        }
      }

      const res = await fetch(`${SUPABASE_URL}/functions/v1/place-order`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          market_id: market.id,
          side,
          order_type: orderType,
          price: orderType === "limit" ? priceNum : null,
          quantity: amountNum,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setToast({ message: `Error: ${result.error || "Order failed"}` });
      } else {
        const txSig = mockTxSignature();
        setToast({ message: `${side.toUpperCase()} order placed`, txSig });
        setAmount("");
        if (orderType === "limit") setPrice("");
      }
    } catch (err) {
      setToast({ message: `Error: ${String(err)}` });
    }

    setSubmitting(false);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex flex-col bg-card border-b border-border">
      {/* Side toggle */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
            side === "buy"
              ? "text-buy border-b-2 border-buy bg-buy/5"
              : "text-muted hover:text-foreground"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
            side === "sell"
              ? "text-sell border-b-2 border-sell bg-sell/5"
              : "text-muted hover:text-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Order type toggle */}
        <div className="flex bg-surface rounded p-0.5">
          <button
            onClick={() => setOrderType("limit")}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
              orderType === "limit"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted"
            }`}
          >
            Limit
          </button>
          <button
            onClick={() => setOrderType("market")}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
              orderType === "market"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted"
            }`}
          >
            Market
          </button>
        </div>

        {/* Price input */}
        {orderType === "limit" && (
          <div>
            <label className="text-xs text-muted mb-1 block">Price</label>
            <input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="any"
              className="w-full bg-surface text-foreground font-mono text-sm px-3 py-2 rounded border border-border focus:border-primary focus:outline-none"
            />
          </div>
        )}

        {/* Amount input */}
        <div>
          <label className="text-xs text-muted mb-1 block">Amount</label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="any"
            className="w-full bg-surface text-foreground font-mono text-sm px-3 py-2 rounded border border-border focus:border-primary focus:outline-none"
          />
        </div>

        {/* Percentage buttons */}
        <div className="flex gap-1.5">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              onClick={() => handlePercentage(pct)}
              className="flex-1 py-1 text-[10px] font-medium text-muted rounded bg-surface hover:bg-border hover:text-foreground transition-colors"
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between text-xs">
          <span className="text-muted">Total</span>
          <span className="font-mono text-foreground">
            {total > 0 ? total.toFixed(2) : "0.00"} USDC
          </span>
        </div>

        {/* Available balance */}
        <div className="flex justify-between text-xs">
          <span className="text-muted">Available</span>
          <span className="font-mono text-foreground">
            {availableBalance.toLocaleString()} {side === "buy" ? "USDC" : market?.symbol.split("-")[0] || ""}
          </span>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || amountNum <= 0}
          className={`w-full py-2.5 text-sm font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            side === "buy"
              ? "bg-buy text-background hover:bg-buy/90"
              : "bg-sell text-white hover:bg-sell/90"
          }`}
        >
          {submitting
            ? "Placing..."
            : `${side === "buy" ? "Buy" : "Sell"} ${market?.symbol.split("-")[0] || ""}`}
        </button>

        {/* Toast */}
        {toast && (
          <div className="text-xs text-center py-1 space-y-0.5">
            <p className="text-primary">{toast.message}</p>
            {toast.txSig && (
              <a
                href={solscanTxUrl(toast.txSig)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-colors font-mono"
              >
                tx: {shortenAddress(toast.txSig, 6)} &#8599;
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
