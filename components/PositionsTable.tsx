"use client";

import { useState } from "react";
import { useUserOrders, useMockWallet, useMarketTicker } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";
import type { Market } from "@/lib/types";
import { X } from "lucide-react";

function formatPrice(n: number | null): string {
  if (n == null) return "—";
  const num = Number(n);
  if (num >= 100) return num.toFixed(2);
  if (num >= 1) return num.toFixed(3);
  return num.toFixed(4);
}

export default function PositionsTable({
  market,
}: {
  market: Market | undefined;
}) {
  const [tab, setTab] = useState<"orders" | "positions" | "history">("orders");
  const orders = useUserOrders(market?.id);
  const wallets = useMockWallet();
  const ticker = useMarketTicker(market?.id);

  const openOrders = orders.filter((o) => o.status === "open");
  const filledOrders = orders.filter(
    (o) => o.status === "filled" || o.status === "cancelled"
  );

  const baseWallet = wallets.find(
    (w) => w.asset_id === market?.base_asset_id
  );
  const quoteWallet = wallets.find(
    (w) => w.asset_id === market?.quote_asset_id
  );

  const handleCancel = async (orderId: string) => {
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);
  };

  const tabs = [
    { key: "orders" as const, label: "Open Orders", count: openOrders.length },
    { key: "positions" as const, label: "Positions" },
    { key: "history" as const, label: "History" },
  ];

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Tab headers */}
      <div className="flex border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              tab === t.key
                ? "text-foreground border-b-2 border-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="ml-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Open Orders */}
        {tab === "orders" && (
          <>
            {openOrders.length === 0 ? (
              <div className="p-3 text-xs text-muted">No open orders</div>
            ) : (
              <div>
                <div className="grid grid-cols-6 gap-2 px-3 py-1.5 text-[10px] text-muted uppercase tracking-wider border-b border-border">
                  <span>Side</span>
                  <span>Type</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Filled</span>
                  <span></span>
                </div>
                {openOrders.slice(0, 20).map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-6 gap-2 px-3 py-1 text-xs items-center"
                  >
                    <span
                      className={`font-medium ${
                        order.side === "buy" ? "text-buy" : "text-sell"
                      }`}
                    >
                      {order.side.toUpperCase()}
                    </span>
                    <span className="text-muted capitalize">
                      {order.order_type}
                    </span>
                    <span className="font-mono text-right text-foreground">
                      {formatPrice(order.price)}
                    </span>
                    <span className="font-mono text-right text-foreground">
                      {Number(order.quantity).toFixed(2)}
                    </span>
                    <span className="font-mono text-right text-muted">
                      {Number(order.filled_quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="text-sell/60 hover:text-sell ml-auto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Positions (wallet balances) */}
        {tab === "positions" && (
          <div>
            {baseWallet && (
              <div className="px-3 py-2 border-b border-border">
                <div className="flex justify-between text-xs">
                  <span className="text-muted">
                    {market?.symbol.split("-")[0]} SPL Balance
                  </span>
                  <span className="font-mono text-foreground">
                    {Number(baseWallet.balance).toLocaleString()}
                  </span>
                </div>
                {ticker && (
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted">Value (USDC)</span>
                    <span className="font-mono text-foreground">
                      {(
                        Number(baseWallet.balance) *
                        Number(ticker.last_price)
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}
            {quoteWallet && (
              <div className="px-3 py-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted">USDC Balance (Solana)</span>
                  <span className="font-mono text-foreground">
                    {Number(quoteWallet.balance).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trade History */}
        {tab === "history" && (
          <>
            {filledOrders.length === 0 ? (
              <div className="p-3 text-xs text-muted">No order history</div>
            ) : (
              <div>
                <div className="grid grid-cols-5 gap-2 px-3 py-1.5 text-[10px] text-muted uppercase tracking-wider border-b border-border">
                  <span>Side</span>
                  <span>Status</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Filled</span>
                </div>
                {filledOrders.slice(0, 20).map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-5 gap-2 px-3 py-1 text-xs"
                  >
                    <span
                      className={
                        order.side === "buy" ? "text-buy" : "text-sell"
                      }
                    >
                      {order.side.toUpperCase()}
                    </span>
                    <span className="text-muted capitalize">
                      {order.status}
                    </span>
                    <span className="font-mono text-right text-foreground">
                      {formatPrice(order.price)}
                    </span>
                    <span className="font-mono text-right text-foreground">
                      {Number(order.quantity).toFixed(2)}
                    </span>
                    <span className="font-mono text-right text-muted">
                      {Number(order.filled_quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
