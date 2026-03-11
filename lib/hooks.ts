"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "./supabase";
import type {
  Market,
  MarketTicker,
  MarketCandle,
  Order,
  Trade,
  Wallet,
  Asset,
  MarketWithTicker,
  OrderBookData,
  OrderBookLevel,
} from "./types";
import { MOCK_USER_ID } from "./constants";
import { SUPABASE_URL, SUPABASE_ANON_KEY, TRADE_SIMULATOR_INTERVAL_MS } from "./config";

export function useTradeSimulator(marketId: string | undefined) {
  const tickRef = useRef(0);

  useEffect(() => {
    if (!marketId) return;

    const interval = setInterval(async () => {
      tickRef.current++;
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/simulate-trade`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            market_id: marketId,
            tick_count: tickRef.current,
          }),
        });
      } catch {
        // silent fail — simulator is best-effort
      }
    }, TRADE_SIMULATOR_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [marketId]);
}

export function useMarkets() {
  const [markets, setMarkets] = useState<MarketWithTicker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data: marketsData } = await supabase
        .from("markets")
        .select("*")
        .eq("is_perpetual", false)
        .eq("status", "active")
        .order("symbol");

      if (!marketsData) return;

      const marketIds = marketsData.map((m) => m.id);

      const [{ data: tickers }, { data: assets }] = await Promise.all([
        supabase.from("market_tickers").select("*").in("market_id", marketIds),
        supabase.from("assets").select("*").eq("is_active", true),
      ]);

      const tickerMap = new Map(
        (tickers || []).map((t) => [t.market_id, t as MarketTicker])
      );
      const assetMap = new Map(
        (assets || []).map((a) => [a.id, a as Asset])
      );

      const result: MarketWithTicker[] = marketsData.map((m) => ({
        ...(m as Market),
        ticker: tickerMap.get(m.id) || null,
        base_asset: assetMap.get(m.base_asset_id) || null,
      }));

      setMarkets(result);
      setLoading(false);
    }

    fetch();

    const channel = supabase
      .channel("market_tickers_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "market_tickers" },
        (payload) => {
          const updated = payload.new as MarketTicker;
          setMarkets((prev) =>
            prev.map((m) =>
              m.id === updated.market_id
                ? { ...m, ticker: updated }
                : m
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { markets, loading };
}

export function useMarketTicker(marketId: string | undefined) {
  const [ticker, setTicker] = useState<MarketTicker | null>(null);

  useEffect(() => {
    if (!marketId) return;

    async function fetch() {
      const { data } = await supabase
        .from("market_tickers")
        .select("*")
        .eq("market_id", marketId)
        .single();

      if (data) setTicker(data as MarketTicker);
    }

    fetch();

    const channel = supabase
      .channel(`ticker_${marketId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "market_tickers",
          filter: `market_id=eq.${marketId}`,
        },
        (payload) => {
          setTicker(payload.new as MarketTicker);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [marketId]);

  return ticker;
}

export function useOrderBook(marketId: string | undefined): OrderBookData {
  const [book, setBook] = useState<OrderBookData>({
    bids: [],
    asks: [],
    spread: 0,
    spreadPct: 0,
  });

  const buildBook = useCallback((orders: Order[]) => {
    const buyOrders = orders.filter((o) => o.side === "buy" && o.price);
    const sellOrders = orders.filter((o) => o.side === "sell" && o.price);

    // Aggregate by price level
    const bidMap = new Map<number, number>();
    buyOrders.forEach((o) => {
      const p = Number(o.price);
      bidMap.set(p, (bidMap.get(p) || 0) + Number(o.remaining_quantity));
    });

    const askMap = new Map<number, number>();
    sellOrders.forEach((o) => {
      const p = Number(o.price);
      askMap.set(p, (askMap.get(p) || 0) + Number(o.remaining_quantity));
    });

    // Sort and build cumulative
    const bids: OrderBookLevel[] = [];
    let cumBid = 0;
    Array.from(bidMap.entries())
      .sort((a, b) => b[0] - a[0])
      .slice(0, 15)
      .forEach(([price, size]) => {
        cumBid += size;
        bids.push({ price, size, total: cumBid });
      });

    const asks: OrderBookLevel[] = [];
    let cumAsk = 0;
    Array.from(askMap.entries())
      .sort((a, b) => a[0] - b[0])
      .slice(0, 15)
      .forEach(([price, size]) => {
        cumAsk += size;
        asks.push({ price, size, total: cumAsk });
      });

    const bestBid = bids[0]?.price || 0;
    const bestAsk = asks[0]?.price || 0;
    const spread = bestAsk - bestBid;
    const spreadPct = bestBid > 0 ? (spread / bestBid) * 100 : 0;

    setBook({ bids, asks, spread, spreadPct });
  }, []);

  useEffect(() => {
    if (!marketId) return;

    async function fetch() {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("market_id", marketId)
        .eq("status", "open")
        .eq("order_type", "limit")
        .order("price", { ascending: false });

      if (data) buildBook(data as Order[]);
    }

    fetch();

    const channel = supabase
      .channel(`orderbook_${marketId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `market_id=eq.${marketId}`,
        },
        () => {
          fetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [marketId, buildBook]);

  return book;
}

export function useTradeHistory(marketId: string | undefined) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (!marketId) return;

    async function fetch() {
      const { data } = await supabase
        .from("trades")
        .select("*")
        .eq("market_id", marketId)
        .order("executed_at", { ascending: false })
        .limit(50);

      if (data) setTrades(data as Trade[]);
    }

    fetch();

    const channel = supabase
      .channel(`trades_${marketId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trades",
          filter: `market_id=eq.${marketId}`,
        },
        (payload) => {
          setTrades((prev) => [payload.new as Trade, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [marketId]);

  return trades;
}

export function useCandles(marketId: string | undefined, interval: string) {
  const [candles, setCandles] = useState<MarketCandle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!marketId) return;
    let cancelled = false;

    async function fetchCandles() {
      const { data } = await supabase
        .from("market_candles")
        .select("*")
        .eq("market_id", marketId)
        .eq("interval", interval)
        .order("open_time", { ascending: true })
        .limit(720);

      if (cancelled) return;
      if (data) setCandles(data as MarketCandle[]);
      setLoading(false);
    }

    fetchCandles();

    const channel = supabase
      .channel(`candles_${marketId}_${interval}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "market_candles",
          filter: `market_id=eq.${marketId}`,
        },
        (payload) => {
          const updated = payload.new as MarketCandle;
          if (updated.interval !== interval) return;

          setCandles((prev) => {
            const idx = prev.findIndex((c) => c.id === updated.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = updated;
              return next;
            }
            return [...prev, updated];
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [marketId, interval]);

  return { candles, loading };
}

export function useMockWallet() {
  const [wallets, setWallets] = useState<(Wallet & { asset?: Asset })[]>([]);

  useEffect(() => {
    async function fetch() {
      const { data: walletsData } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", MOCK_USER_ID);

      if (!walletsData) return;

      const assetIds = walletsData.map((w) => w.asset_id);
      const { data: assets } = await supabase
        .from("assets")
        .select("*")
        .in("id", assetIds);

      const assetMap = new Map(
        (assets || []).map((a) => [a.id, a as Asset])
      );

      setWallets(
        walletsData.map((w) => ({
          ...(w as Wallet),
          asset: assetMap.get(w.asset_id),
        }))
      );
    }

    fetch();
  }, []);

  return wallets;
}

export function useUserOrders(marketId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!marketId) return;

    async function fetch() {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", MOCK_USER_ID)
        .eq("market_id", marketId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) setOrders(data as Order[]);
    }

    fetch();

    const channel = supabase
      .channel(`user_orders_${marketId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${MOCK_USER_ID}`,
        },
        () => {
          fetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [marketId]);

  return orders;
}
