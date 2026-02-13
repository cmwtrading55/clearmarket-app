"use client";

import { useState } from "react";
import { useMarketTicker, useMockWallet } from "@/lib/hooks";
import { MOCK_USER_ID } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import type { Market } from "@/lib/types";

export default function OrderForm({ market }: { market: Market | undefined }) {
  const ticker = useMarketTicker(market?.id);
  const wallets = useMockWallet();

  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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

    const { error } = await supabase.from("orders").insert({
      user_id: MOCK_USER_ID,
      market_id: market.id,
      side,
      order_type: orderType,
      status: "open",
      price: orderType === "limit" ? priceNum : null,
      quantity: amountNum,
      filled_quantity: 0,
      remaining_quantity: amountNum,
      time_in_force: "gtc",
    });

    setSubmitting(false);

    if (error) {
      setToast(`Error: ${error.message}`);
    } else {
      setToast(`${side.toUpperCase()} order placed`);
      setAmount("");
      if (orderType === "limit") setPrice("");
    }

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
          <div className="text-xs text-center text-primary py-1">{toast}</div>
        )}
      </div>
    </div>
  );
}
