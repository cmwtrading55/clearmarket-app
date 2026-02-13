"use client";

import { use, useMemo } from "react";
import { useMarkets } from "@/lib/hooks";
import TopNav from "@/components/TopNav";
import MarketSelector from "@/components/MarketSelector";
import TradingChart from "@/components/TradingChart";
import OrderBook from "@/components/OrderBook";
import OrderForm from "@/components/OrderForm";
import TradeHistory from "@/components/TradeHistory";
import PositionsTable from "@/components/PositionsTable";

export default function TradePage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market: marketSymbol } = use(params);
  const { markets, loading } = useMarkets();

  const currentMarket = useMemo(
    () => markets.find((m) => m.symbol === marketSymbol),
    [markets, marketSymbol]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-muted text-sm">
        Loading exchange...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top navigation bar */}
      <TopNav market={currentMarket} />

      {/* Main trading grid */}
      <div className="flex-1 grid grid-cols-[220px_1fr_320px] min-h-0">
        {/* Left: Market selector */}
        <MarketSelector activeMarket={marketSymbol} />

        {/* Centre: Chart (top) + Order Book (bottom) */}
        <div className="flex flex-col min-h-0 border-r border-border">
          {/* Chart — 60% */}
          <div className="flex-[6] min-h-0 border-b border-border">
            <TradingChart marketId={currentMarket?.id} />
          </div>
          {/* Order Book — 40% */}
          <div className="flex-[4] min-h-0">
            <OrderBook marketId={currentMarket?.id} />
          </div>
        </div>

        {/* Right: Order Form (top) + Trade History + Positions (bottom) */}
        <div className="flex flex-col min-h-0">
          {/* Order Form */}
          <OrderForm market={currentMarket} />
          {/* Trade History */}
          <div className="flex-1 min-h-0 border-b border-border">
            <TradeHistory marketId={currentMarket?.id} />
          </div>
          {/* Positions / Open Orders */}
          <div className="h-[200px] shrink-0">
            <PositionsTable market={currentMarket} />
          </div>
        </div>
      </div>
    </div>
  );
}
