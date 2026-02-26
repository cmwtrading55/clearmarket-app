"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useMarkets, useTradeSimulator } from "@/lib/hooks";
import MarketStatsBar from "@/components/MarketStatsBar";
import MarketSelector from "@/components/MarketSelector";
import TradingChart from "@/components/TradingChart";
import OrderBook from "@/components/OrderBook";
import OrderForm from "@/components/OrderForm";
import TradeHistory from "@/components/TradeHistory";
import PositionsTable from "@/components/PositionsTable";
import MobileMarketBar from "@/components/MobileMarketBar";

export default function TradePage({ marketSymbol }: { marketSymbol: string }) {
  const { markets, loading } = useMarkets();

  const currentMarket = useMemo(
    () => markets.find((m) => m.symbol === marketSymbol),
    [markets, marketSymbol]
  );

  useTradeSimulator(currentMarket?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-muted text-sm">
        Loading exchange...
      </div>
    );
  }

  /*
   * QA CHECKLIST — Mobile responsive trade layout
   * Test:
   *  - 390px width (iPhone 14)
   *  - 360px width (Android small)
   *  - Landscape mode
   *  - Chart resize correctness (ResizeObserver, no zero-dim)
   *  - No horizontal overflow at any breakpoint
   *  - Desktop layout pixel-identical (md+ unchanged)
   */
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <MarketStatsBar market={currentMarket} />

      {/* Mobile: vertical scroll stack | Desktop: 3-col grid (unchanged) */}
      <div className="flex-1 flex flex-col overflow-y-auto md:overflow-hidden md:grid md:grid-cols-[220px_minmax(0,1fr)_320px] min-h-0 min-w-0">

        {/* MarketSelector: hidden on mobile, full sidebar on desktop */}
        <div className="hidden md:flex md:flex-col md:h-full">
          <MarketSelector activeMarket={marketSymbol} />
        </div>

        {/* Mobile: horizontal market scroller */}
        <div className="md:hidden overflow-x-auto border-b border-border shrink-0">
          <MobileMarketBar activeMarket={marketSymbol} />
        </div>

        {/* Chart + OrderBook column */}
        <div className="flex flex-col min-h-0 min-w-0 overflow-hidden md:border-r md:border-border">
          {/* Chart: explicit height on mobile, flex-grow on desktop */}
          <div className="h-[45vh] min-h-[320px] max-h-[520px] md:h-auto md:min-h-0 md:max-h-none md:flex-[6] shrink-0 md:shrink min-w-0 overflow-hidden border-b border-border">
            <TradingChart marketId={currentMarket?.id} />
          </div>
          <div className="h-[300px] md:h-auto md:flex-[4] min-h-0 overflow-hidden">
            <OrderBook marketId={currentMarket?.id} />
          </div>
        </div>

        {/* Right panel: full-width stack on mobile, fixed col on desktop */}
        <div className="flex flex-col min-h-0 w-full md:w-auto">
          <OrderForm market={currentMarket} />
          <div className="h-[260px] md:h-auto md:flex-1 min-h-0 border-b border-border">
            <TradeHistory marketId={currentMarket?.id} />
          </div>
          <div className="h-[200px] shrink-0">
            <PositionsTable market={currentMarket} />
          </div>
        </div>
      </div>
    </div>
  );
}
