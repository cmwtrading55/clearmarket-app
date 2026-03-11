"use client";

import { useOrderBook } from "@/lib/hooks";

function formatPrice(n: number): string {
  if (n >= 100) return n.toFixed(2);
  if (n >= 1) return n.toFixed(3);
  return n.toFixed(4);
}

function formatSize(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}K`;
  return n.toFixed(2);
}

export default function OrderBook({ marketId }: { marketId: string | undefined }) {
  const book = useOrderBook(marketId);

  const maxTotal = Math.max(
    book.bids[book.bids.length - 1]?.total || 0,
    book.asks[book.asks.length - 1]?.total || 0
  );

  return (
    <div className="flex flex-col h-full bg-card" role="region" aria-label="Order book">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider" id="orderbook-heading">
          Order Book
        </h3>
        <span className="text-[10px] text-muted">
          Spread: <span className="font-mono text-foreground">{book.spread.toFixed(3)}</span>{" "}
          <span className="font-mono">({book.spreadPct.toFixed(2)}%)</span>
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 gap-2 px-3 py-1.5 text-[10px] text-muted uppercase tracking-wider border-b border-border">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (reversed so lowest ask at bottom) */}
      <div className="flex-1 overflow-hidden flex flex-col justify-end">
        {[...book.asks].reverse().map((level, i) => {
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
          {book.bids[0]?.price ? formatPrice(book.bids[0].price) : "—"}
        </span>
      </div>

      {/* Bids */}
      <div className="flex-1 overflow-hidden">
        {book.bids.map((level, i) => {
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
