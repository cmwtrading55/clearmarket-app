"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { mockActivity } from "@/data/mockActivity";
import { TrendingUp, TrendingDown, DollarSign, Sprout, CheckCircle } from "lucide-react";

interface RecentTrade {
  id: string;
  price: number;
  quantity: number;
  is_maker_buy: boolean;
  executed_at: string;
  market_symbol?: string;
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function shortenId(id: string): string {
  return `0x${id.slice(0, 4)}...${id.slice(-4)}`;
}

export default function ActivityFeed() {
  const [trades, setTrades] = useState<RecentTrade[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    async function fetchTrades() {
      const { data } = await supabase
        .from("trades")
        .select("id, price, quantity, is_maker_buy, executed_at, market_id")
        .order("executed_at", { ascending: false })
        .limit(8);

      if (!data) return;

      // Get market symbols for display
      const marketIds = [...new Set(data.map((t) => t.market_id))];
      const { data: markets } = await supabase
        .from("markets")
        .select("id, symbol")
        .in("id", marketIds);

      const symbolMap = new Map(
        (markets || []).map((m) => [m.id, m.symbol])
      );

      setTrades(
        data.map((t) => ({
          id: t.id,
          price: Number(t.price),
          quantity: Number(t.quantity),
          is_maker_buy: t.is_maker_buy,
          executed_at: t.executed_at,
          market_symbol: symbolMap.get(t.market_id) || "CML-USDC",
        }))
      );
    }

    fetchTrades();

    // Subscribe to new trades across all markets
    const channel = supabase
      .channel("activity_feed_trades")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "trades" },
        (payload) => {
          const t = payload.new as {
            id: string;
            price: string;
            quantity: string;
            is_maker_buy: boolean;
            executed_at: string;
          };
          setTrades((prev) =>
            [
              {
                id: t.id,
                price: Number(t.price),
                quantity: Number(t.quantity),
                is_maker_buy: t.is_maker_buy,
                executed_at: t.executed_at,
                market_symbol: "CML-USDC",
              },
              ...prev,
            ].slice(0, 8)
          );
        }
      )
      .subscribe();

    // Refresh "time ago" labels every 10s
    const timer = setInterval(() => setTick((t) => t + 1), 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="bg-card-bg border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Recent Activity</h3>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
      </div>
      <div className="space-y-3" role="feed" aria-label="Recent activity">
        {trades.length > 0 ? (
          trades.map((trade) => {
            const isBuy = trade.is_maker_buy;
            const Icon = isBuy ? TrendingUp : TrendingDown;
            const color = isBuy ? "text-buy" : "text-sell";
            const label = isBuy ? "bought" : "sold";

            return (
              <div key={trade.id} className="flex items-start gap-3" role="article">
                <div className={`mt-0.5 ${color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">
                    <span className="text-muted">{shortenId(trade.id)}</span>{" "}
                    <span className={color}>{label}</span>{" "}
                    <span className="font-mono">
                      {trade.quantity.toLocaleString()} tokens
                    </span>{" "}
                    <span className="text-muted">@</span>{" "}
                    <span className="font-mono">${trade.price.toFixed(4)}</span>
                  </p>
                  <p className="text-xs text-muted">
                    {trade.market_symbol} &middot; {timeAgo(trade.executed_at)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          mockActivity.slice(0, 8).map((event) => {
            const iconMap = {
              buy: { Icon: TrendingUp, color: "text-buy", label: "bought" },
              sell: { Icon: TrendingDown, color: "text-sell", label: "sold" },
              fund: { Icon: DollarSign, color: "text-primary", label: "funded" },
              harvest: { Icon: Sprout, color: "text-warning", label: "harvested" },
              settle: { Icon: CheckCircle, color: "text-primary", label: "settled" },
            };
            const { Icon, color, label } = iconMap[event.type];

            return (
              <div key={event.id} className="flex items-start gap-3" role="article">
                <div className={`mt-0.5 ${color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">
                    <span className="text-muted">{event.user}</span>{" "}
                    <span className={color}>{label}</span>{" "}
                    {event.amount > 0 && (
                      <>
                        <span className="font-mono">
                          {event.type === "fund"
                            ? `$${event.amount.toLocaleString()}`
                            : `${event.amount.toLocaleString()} tokens`}
                        </span>{" "}
                      </>
                    )}
                    <span className="text-muted">of</span>{" "}
                    <span className="font-medium">{event.strain}</span>
                  </p>
                  <p className="text-xs text-muted">
                    {timeAgo(event.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
