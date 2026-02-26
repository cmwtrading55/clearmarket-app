"use client";

import Link from "next/link";
import { useMarkets } from "@/lib/hooks";

export default function MobileMarketBar({
  activeMarket,
}: {
  activeMarket: string;
}) {
  const { markets } = useMarkets();

  return (
    <div className="flex gap-1.5 px-3 py-2 whitespace-nowrap">
      {markets.map((m) => {
        const pct = Number(m.ticker?.price_change_pct_24h || 0);
        const isActive = m.symbol === activeMarket;

        return (
          <Link
            key={m.id}
            href={`/trade/${m.symbol}`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors shrink-0 ${
              isActive
                ? "bg-primary/10 text-primary border-primary/30"
                : "border-border text-muted hover:text-foreground hover:border-primary/20"
            }`}
          >
            <span className="font-bold">{m.symbol.split("-")[0]}</span>
            <span
              className={`font-mono ${pct >= 0 ? "text-buy" : "text-sell"}`}
            >
              {pct >= 0 ? "+" : ""}
              {pct.toFixed(1)}%
            </span>
          </Link>
        );
      })}
    </div>
  );
}
