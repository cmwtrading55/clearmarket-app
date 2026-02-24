"use client";

import { useMemo } from "react";
import { useMarkets } from "@/lib/hooks";
import MarketStatsBar from "@/components/MarketStatsBar";
import MarketSelector from "@/components/MarketSelector";
import TradingChart from "@/components/TradingChart";
import OrderBook from "@/components/OrderBook";
import OrderForm from "@/components/OrderForm";
import TradeHistory from "@/components/TradeHistory";
import PositionsTable from "@/components/PositionsTable";

export default function TradePage({ marketSymbol }: { marketSymbol: string }) {
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
      <MarketStatsBar market={currentMarket} />

      <div className="flex-1 grid grid-cols-[220px_minmax(0,1fr)_320px] min-h-0 min-w-0 overflow-hidden">
        <MarketSelector activeMarket={marketSymbol} />

        <div className="flex flex-col min-h-0 min-w-0 overflow-hidden border-r border-border">
          <div className="flex-[6] min-h-0 min-w-0 overflow-hidden border-b border-border">
            <TradingChart marketId={currentMarket?.id} />
          </div>
          <div className="flex-[4] min-h-0 overflow-hidden">
            <OrderBook marketId={currentMarket?.id} />
          </div>
        </div>

        <div className="flex flex-col min-h-0">
          <OrderForm market={currentMarket} />
          <div className="flex-1 min-h-0 border-b border-border">
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
