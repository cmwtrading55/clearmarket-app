"use client";

import { useTradeHistory } from "@/lib/hooks";
import { deterministicTxSig, solscanTxUrl } from "@/lib/solana";
import { ExternalLink } from "lucide-react";

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatPrice(n: number): string {
  const num = Number(n);
  if (num >= 100) return num.toFixed(2);
  if (num >= 1) return num.toFixed(3);
  return num.toFixed(4);
}

export default function TradeHistory({
  marketId,
}: {
  marketId: string | undefined;
}) {
  const trades = useTradeHistory(marketId);

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="px-3 py-2 border-b border-border">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
          Recent Trades
        </h3>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 gap-2 px-3 py-1.5 text-[10px] text-muted uppercase tracking-wider border-b border-border">
        <span>Time</span>
        <span className="text-right">Price</span>
        <span className="text-right">Size</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {trades.length === 0 ? (
          <div className="p-3 text-xs text-muted">No trades yet</div>
        ) : (
          trades.map((trade, i) => {
            const prevTrade = trades[i + 1];
            const isUptick = prevTrade
              ? Number(trade.price) >= Number(prevTrade.price)
              : trade.is_maker_buy;

            return (
              <a
                key={trade.id}
                href={solscanTxUrl(deterministicTxSig(trade.id))}
                target="_blank"
                rel="noopener noreferrer"
                className="grid grid-cols-3 gap-2 px-3 py-0.5 text-xs group hover:bg-primary/5 transition-colors"
              >
                <span className="font-mono text-muted flex items-center gap-1">
                  {formatTime(trade.executed_at)}
                  <ExternalLink size={8} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                </span>
                <span
                  className={`font-mono text-right ${
                    isUptick ? "text-buy" : "text-sell"
                  }`}
                >
                  {formatPrice(Number(trade.price))}
                </span>
                <span className="font-mono text-right text-foreground">
                  {Number(trade.quantity).toFixed(2)}
                </span>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
