"use client";

import { useState, useMemo } from "react";
import { useOrderBook } from "@/lib/hooks";
import type { OrderBookLevel } from "@/lib/types";

const TICK_OPTIONS = [0.01, 0.1, 1.0];

function formatPrice(n: number): string {
  if (n >= 100) return n.toFixed(2);
  if (n >= 1) return n.toFixed(3);
  return n.toFixed(4);
}

function formatSize(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}K`;
  return n.toFixed(2);
}

function groupLevels(levels: OrderBookLevel[], tickSize: number, side: "bid" | "ask"): OrderBookLevel[] {
  if (tickSize <= 0.01) return levels;

  const grouped = new Map<number, number>();
  for (const level of levels) {
    const bucket = side === "bid"
      ? Math.floor(level.price / tickSize) * tickSize
      : Math.ceil(level.price / tickSize) * tickSize;
    grouped.set(bucket, (grouped.get(bucket) || 0) + level.size);
  }

  const sorted = Array.from(grouped.entries()).sort((a, b) =>
    side === "bid" ? b[0] - a[0] : a[0] - b[0]
  );

  const result: OrderBookLevel[] = [];
  let cum = 0;
  for (const [price, size] of sorted) {
    cum += size;
    result.push({ price, size, total: cum });
  }
  return result.slice(0, 15);
}

export default function OrderBook({ marketId }: { marketId: string | undefined }) {
  const book = useOrderBook(marketId);
  const [tickSize, setTickSize] = useState(0.01);

  const groupedBids = useMemo(() => groupLevels(book.bids, tickSize, "bid"), [book.bids, tickSize]);
  const groupedAsks = useMemo(() => groupLevels(book.asks, tickSize, "ask"), [book.asks, tickSize]);

  const maxTotal = Math.max(
    groupedBids[groupedBids.length - 1]?.total || 0,
    groupedAsks[groupedAsks.length - 1]?.total || 0
  );

  return (
    <div className="flex flex-col h-full bg-card" role="region" aria-label="Order book">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider" id="orderbook-heading">
          Order Book
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md overflow-hidden border border-border">
            {TICK_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setTickSize(t)}
                className={`text-[9px] font-mono px-1.5 py-0.5 transition-colors ${
                  tickSize === t
                    ? "bg-primary/15 text-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-muted">
            <span className="font-mono text-foreground">{book.spread.toFixed(3)}</span>{" "}
            <span className="font-mono">({book.spreadPct.toFixed(2)}%)</span>
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 gap-2 px-3 py-1.5 text-[10px] text-muted uppercase tracking-wider border-b border-border">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (reversed so lowest ask at bottom) */}
      <div className="flex-1 overflow-hidden flex flex-col justify-end">
        {[...groupedAsks].reverse().map((level) => {
          const pct = maxTotal > 0 ? (level.total / maxTotal) * 100 : 0;
          return (
            <div key={`ask-${level.price}`} className="relative grid grid-cols-3 gap-2 px-3 py-0.5 text-xs">
              <div
                className="absolute inset-0 bg-sell/10"
                style={{ width: `${pct}%`, right: 0, left: "auto" }}
              />
              <span className="font-mono text-sell relative z-10">
                {formatPrice(level.price)}
              </span>
              <span className="font-mono text-foreground text-right relative z-10">
                {formatSize(level.size)}
              </span>
              <span className="font-mono text-muted text-right relative z-10">
                {formatSize(level.total)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Spread indicator */}
      <div className="flex items-center justify-center py-1.5 border-y border-border bg-surface">
        <span className="font-mono text-xs font-medium text-foreground">
          {groupedBids[0]?.price ? formatPrice(groupedBids[0].price) : "—"}
        </span>
      </div>

      {/* Bids */}
      <div className="flex-1 overflow-hidden">
        {groupedBids.map((level) => {
          const pct = maxTotal > 0 ? (level.total / maxTotal) * 100 : 0;
          return (
            <div key={`bid-${level.price}`} className="relative grid grid-cols-3 gap-2 px-3 py-0.5 text-xs">
              <div
                className="absolute inset-0 bg-buy/10"
                style={{ width: `${pct}%`, right: 0, left: "auto" }}
              />
              <span className="font-mono text-buy relative z-10">
                {formatPrice(level.price)}
              </span>
              <span className="font-mono text-foreground text-right relative z-10">
                {formatSize(level.size)}
              </span>
              <span className="font-mono text-muted text-right relative z-10">
                {formatSize(level.total)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
