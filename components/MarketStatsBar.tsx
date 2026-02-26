"use client";

import { useState } from "react";
import Link from "next/link";
import { useMarketTicker } from "@/lib/hooks";
import { useWallet } from "@/lib/wallet";
import type { Market } from "@/lib/types";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import ConnectWalletModal from "./ConnectWalletModal";
import ProfileDropdown from "./ProfileDropdown";

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

export default function MarketStatsBar({
  market,
}: {
  market: Market | undefined;
}) {
  const ticker = useMarketTicker(market?.id);
  const { connected, disconnect } = useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const pctChange = Number(ticker?.price_change_pct_24h || 0);
  const isPositive = pctChange >= 0;

  return (
    <header className="flex items-center h-12 md:h-14 px-3 md:px-4 bg-card border-b border-border shrink-0 min-w-0 overflow-hidden">
      {/* Wordmark — links back to landing */}
      <Link href="/" className="flex items-center gap-2 mr-3 md:mr-6 shrink-0">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-base md:text-lg font-bold tracking-tight text-foreground">
          ClearMarket Labs
        </span>
        <span className="hidden sm:inline text-xs text-muted px-2 py-0.5 rounded bg-surface border border-border">
          Exchange
        </span>
      </Link>

      {/* Market symbol + ticker data */}
      {market && (
        <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0 overflow-x-auto">
          <span className="text-sm md:text-base font-bold text-foreground shrink-0">
            {market.symbol}
          </span>

          <div className="flex flex-col shrink-0">
            <span className="text-xs text-muted">Last Price</span>
            <span
              className={`font-mono text-sm font-medium ${
                isPositive ? "text-buy" : "text-sell"
              }`}
            >
              {formatNum(ticker?.last_price, 3)}
            </span>
          </div>

          <div className="flex flex-col shrink-0">
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

          <div className="hidden sm:flex flex-col shrink-0">
            <span className="text-xs text-muted">24h High</span>
            <span className="font-mono text-sm text-foreground">
              {formatNum(ticker?.high_24h, 3)}
            </span>
          </div>

          <div className="hidden sm:flex flex-col shrink-0">
            <span className="text-xs text-muted">24h Low</span>
            <span className="font-mono text-sm text-foreground">
              {formatNum(ticker?.low_24h, 3)}
            </span>
          </div>

          <div className="hidden lg:flex flex-col shrink-0">
            <span className="text-xs text-muted">24h Volume</span>
            <span className="font-mono text-sm text-foreground">
              {formatVol(ticker?.volume_quote_24h)}
            </span>
          </div>
        </div>
      )}

      {/* Auth CTA consistency — wallet connect is the global standard across all pages */}
      <div className="flex items-center ml-auto shrink-0">
        {connected ? (
          <ProfileDropdown onDisconnect={disconnect} />
        ) : (
          <button
            onClick={() => setWalletModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Connect Wallet</span>
          </button>
        )}
      </div>

      <ConnectWalletModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </header>
  );
}
