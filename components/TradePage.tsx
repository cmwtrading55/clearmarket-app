"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useMarkets, useTradeSimulator } from "@/lib/hooks";
import MarketStatsBar from "@/components/MarketStatsBar";
import MarketSelector from "@/components/MarketSelector";
import TradingChart from "@/components/TradingChart";
import OrderBook from "@/components/OrderBook";
import DepthChart from "@/components/DepthChart";
import OrderForm from "@/components/OrderForm";
import TradeHistory from "@/components/TradeHistory";
import PositionsTable from "@/components/PositionsTable";
import MobileMarketBar from "@/components/MobileMarketBar";
import { AlertTriangle, RefreshCw } from "lucide-react";

const LOAD_TIMEOUT_MS = 15_000;

type MobileTab = "chart" | "book" | "order";

export default function TradePage({ marketSymbol }: { marketSymbol: string }) {
  const { markets, loading } = useMarkets();
  const [timedOut, setTimedOut] = useState(false);
  const [showDepth, setShowDepth] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("chart");

  const currentMarket = useMemo(
    () => markets.find((m) => m.symbol === marketSymbol),
    [markets, marketSymbol]
  );

  useTradeSimulator(currentMarket?.id);

  // Timeout: if still loading after 15s, show error state
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [loading]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger if user is typing in an input/textarea
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
      // Enter in input triggers submit via form, Escape blurs
      if (e.key === "Escape") {
        (e.target as HTMLElement).blur();
      }
      return;
    }

    switch (e.key) {
      case "1":
        setMobileTab("chart");
        break;
      case "2":
        setMobileTab("book");
        break;
      case "3":
        setMobileTab("order");
        break;
      case "d":
      case "D":
        setShowDepth((prev) => !prev);
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading && timedOut) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background gap-4 px-4">
        <div className="w-14 h-14 rounded-full bg-sell/10 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-sell" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Connection Failed</h2>
        <p className="text-sm text-muted text-center max-w-sm">
          Unable to connect to the exchange. The data service may be temporarily
          unavailable.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <Link
            href="/"
            className="text-sm font-medium px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-surface transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-dvh bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <span className="text-sm text-muted">Connecting to exchange...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-background overflow-hidden" role="main" aria-label="Exchange">
      <MarketStatsBar market={currentMarket} />

      {/* Mobile: tab selector + content | Desktop: 3-col grid */}
      <div className="flex-1 flex flex-col overflow-hidden md:grid md:grid-cols-[220px_minmax(0,1fr)_320px] min-h-0 min-w-0">

        {/* MarketSelector: hidden on mobile, full sidebar on desktop */}
        <nav className="hidden md:flex md:flex-col md:h-full" aria-label="Market pairs">
          <MarketSelector activeMarket={marketSymbol} />
        </nav>

        {/* Mobile: horizontal market scroller */}
        <nav className="md:hidden overflow-x-auto border-b border-border shrink-0" aria-label="Market pairs">
          <MobileMarketBar activeMarket={marketSymbol} />
        </nav>

        {/* Mobile tab bar */}
        <div className="md:hidden flex border-b border-border shrink-0">
          {([
            { key: "chart" as MobileTab, label: "Chart", shortcut: "1" },
            { key: "book" as MobileTab, label: "Book", shortcut: "2" },
            { key: "order" as MobileTab, label: "Order", shortcut: "3" },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMobileTab(tab.key)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                mobileTab === tab.key
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile content: show active tab */}
        <div className="md:hidden flex-1 overflow-y-auto min-h-0">
          {mobileTab === "chart" && (
            <div className="h-[60vh] min-h-[320px]">
              <TradingChart marketId={currentMarket?.id} />
            </div>
          )}
          {mobileTab === "book" && (
            <div className="h-full">
              <OrderBook marketId={currentMarket?.id} />
            </div>
          )}
          {mobileTab === "order" && (
            <div className="space-y-0">
              <OrderForm market={currentMarket} />
              <TradeHistory marketId={currentMarket?.id} />
            </div>
          )}
        </div>

        {/* Desktop: Chart + OrderBook column */}
        <div className="hidden md:flex md:flex-col min-h-0 min-w-0 overflow-hidden md:border-r md:border-border">
          {/* Chart */}
          <div className="h-auto min-h-0 flex-[6] shrink min-w-0 overflow-hidden border-b border-border">
            <TradingChart marketId={currentMarket?.id} />
          </div>
          <section className="h-auto flex-[4] min-h-0 overflow-hidden flex flex-col" aria-label="Order book">
            {/* Book/Depth toggle */}
            <div className="flex items-center border-b border-border shrink-0">
              <button
                onClick={() => setShowDepth(false)}
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 transition-colors ${
                  !showDepth ? "text-foreground border-b-2 border-primary" : "text-muted hover:text-foreground"
                }`}
              >
                Book
              </button>
              <button
                onClick={() => setShowDepth(true)}
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 transition-colors ${
                  showDepth ? "text-foreground border-b-2 border-primary" : "text-muted hover:text-foreground"
                }`}
              >
                Depth
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              {showDepth ? (
                <DepthChart marketId={currentMarket?.id} />
              ) : (
                <OrderBook marketId={currentMarket?.id} />
              )}
            </div>
          </section>
        </div>

        {/* Desktop: Right panel */}
        <div className="hidden md:flex md:flex-col min-h-0 w-full md:w-auto">
          <section aria-label="Place order">
            <OrderForm market={currentMarket} />
          </section>
          <section className="h-auto flex-1 min-h-0 border-b border-border" aria-label="Recent trades">
            <TradeHistory marketId={currentMarket?.id} />
          </section>
          <section className="h-[200px] shrink-0" aria-label="Positions and orders">
            <PositionsTable market={currentMarket} />
          </section>
        </div>
      </div>
    </div>
  );
}
