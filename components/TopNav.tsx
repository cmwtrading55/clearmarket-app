"use client";

import { useMarketTicker } from "@/lib/hooks";
import type { Market } from "@/lib/types";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

function formatNum(n: number | undefined | null, decimals = 2): string {
  if (n == null) return "—";
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatVol(n: number | undefined | null): string {
  if (n == null) return "—";
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toFixed(0);
}

export default function TopNav({ market }: { market: Market | undefined }) {
  const ticker = useMarketTicker(market?.id);

  const pctChange = Number(ticker?.price_change_pct_24h || 0);
  const isPositive = pctChange >= 0;

  return (
    <header className="flex items-center h-14 px-4 bg-card border-b border-border shrink-0">
      {/* Wordmark */}
      <div className="flex items-center gap-3 mr-6">
        <span className="text-lg font-bold tracking-tight text-foreground">
          ClearMarket Labs
        </span>
        <span className="text-xs text-muted px-2 py-0.5 rounded bg-surface border border-border">
          Exchange
        </span>
      </div>

      {/* Market symbol */}
      {market && (
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <span className="text-base font-bold text-foreground">
            {market.symbol}
          </span>

          {/* Last price */}
          <div className="flex flex-col">
            <span className="text-xs text-muted">Last Price</span>
            <span
              className={`font-mono text-sm font-medium ${
                isPositive ? "text-buy" : "text-sell"
              }`}
            >
              {formatNum(ticker?.last_price, 3)}
            </span>
          </div>

          {/* 24h Change */}
          <div className="flex flex-col">
            <span className="text-xs text-muted">24h Change</span>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-3 h-3 text-buy" />
              ) : (
                <TrendingDown className="w-3 h-3 text-sell" />
              )}
              <span
                className={`font-mono text-sm ${
                  isPositive ? "text-buy" : "text-sell"
                }`}
              >
                {isPositive ? "+" : ""}
                {formatNum(pctChange)}%
              </span>
            </div>
          </div>

          {/* 24h High */}
          <div className="flex flex-col">
            <span className="text-xs text-muted">24h High</span>
            <span className="font-mono text-sm text-foreground">
              {formatNum(ticker?.high_24h, 3)}
            </span>
          </div>

          {/* 24h Low */}
          <div className="flex flex-col">
            <span className="text-xs text-muted">24h Low</span>
            <span className="font-mono text-sm text-foreground">
              {formatNum(ticker?.low_24h, 3)}
            </span>
          </div>

          {/* 24h Volume */}
          <div className="flex flex-col">
            <span className="text-xs text-muted">24h Volume</span>
            <span className="font-mono text-sm text-foreground">
              {formatVol(ticker?.volume_quote_24h)}
            </span>
          </div>
        </div>
      )}

      {/* Wallet */}
      <div className="flex items-center gap-2 ml-auto">
        <Wallet className="w-4 h-4 text-muted" />
        <span className="text-sm text-muted">Demo Account</span>
      </div>
    </header>
  );
}
