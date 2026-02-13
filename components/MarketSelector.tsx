"use client";

import { useState } from "react";
import Link from "next/link";
import { useMarkets } from "@/lib/hooks";
import { Search } from "lucide-react";

function formatPrice(n: number | null | undefined): string {
  if (n == null) return "—";
  const num = Number(n);
  if (num >= 100) return num.toFixed(2);
  if (num >= 1) return num.toFixed(3);
  return num.toFixed(4);
}

export default function MarketSelector({
  activeMarket,
}: {
  activeMarket: string;
}) {
  const { markets, loading } = useMarkets();
  const [search, setSearch] = useState("");

  const filtered = markets.filter(
    (m) =>
      m.symbol.toLowerCase().includes(search.toLowerCase()) ||
      m.base_asset?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="px-3 py-3 border-b border-border">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
          Markets
        </h3>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input
            type="text"
            placeholder="Search pairs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface text-foreground text-xs pl-7 pr-2 py-1.5 rounded border border-border focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Market list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-3 text-xs text-muted">Loading...</div>
        ) : (
          filtered.map((m) => {
            const pct = Number(m.ticker?.price_change_pct_24h || 0);
            const isActive = m.symbol === activeMarket;

            return (
              <Link
                key={m.id}
                href={`/trade/${m.symbol}`}
                className={`flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-surface ${
                  isActive
                    ? "bg-surface border-l-2 border-l-primary"
                    : "border-l-2 border-l-transparent"
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-foreground truncate">
                    {m.symbol}
                  </span>
                  <span className="text-[10px] text-muted truncate">
                    {m.base_asset?.name || ""}
                  </span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="font-mono text-xs text-foreground">
                    {formatPrice(m.ticker?.last_price)}
                  </span>
                  <span
                    className={`font-mono text-[10px] ${
                      pct >= 0 ? "text-buy" : "text-sell"
                    }`}
                  >
                    {pct >= 0 ? "+" : ""}
                    {pct.toFixed(2)}%
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
}
