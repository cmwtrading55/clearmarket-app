"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCandles } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";
import { INTERVALS, type IntervalValue } from "@/lib/constants";
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  ColorType,
  type CandlestickData,
  type LineData,
  type AreaData,
  type BarData,
  type Time,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  BarSeries,
} from "lightweight-charts";
import { CandlestickChart, LineChart, AreaChart, BarChart3 } from "lucide-react";

type ChartType = "candlestick" | "line" | "area" | "bar";

const CHART_TYPES: { type: ChartType; icon: React.ElementType; label: string }[] = [
  { type: "candlestick", icon: CandlestickChart, label: "Candlestick" },
  { type: "line", icon: LineChart, label: "Line" },
  { type: "area", icon: AreaChart, label: "Area" },
  { type: "bar", icon: BarChart3, label: "Bar" },
];

/* Interval → seconds mapping for bucket calculation */
const INTERVAL_SECONDS: Record<string, number> = {
  "1h": 3600,
  "4h": 14400,
  "1d": 86400,
  "1w": 604800,
};

interface OhlcBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function TradingChart({
  marketId,
}: {
  marketId: string | undefined;
}) {
  const [interval, setInterval] = useState<IntervalValue>("1h");
  const [chartType, setChartType] = useState<ChartType>("candlestick");
  const { candles, loading } = useCandles(marketId, interval);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | ISeriesApi<"Line"> | ISeriesApi<"Area"> | ISeriesApi<"Bar"> | null>(null);

  /* Last bar currently displayed on chart — mutated imperatively for perf */
  const lastBarRef = useRef<OhlcBar | null>(null);

  const createChartInstance = useCallback(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#FFFFFF" },
        textColor: "#6B7280",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#F3F4F6" },
        horzLines: { color: "#F3F4F6" },
      },
      crosshair: {
        vertLine: { color: "#9CA3AF", width: 1, style: 2, labelBackgroundColor: "#F9FAFB" },
        horzLine: { color: "#9CA3AF", width: 1, style: 2, labelBackgroundColor: "#F9FAFB" },
      },
      rightPriceScale: {
        borderColor: "#E5E7EB",
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: "#E5E7EB",
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { vertTouchDrag: false },
    });

    chartRef.current = chart;

    // Add series based on chart type
    if (chartType === "candlestick") {
      seriesRef.current = chart.addSeries(CandlestickSeries, {
        upColor: "#16A34A",
        downColor: "#DC2626",
        borderUpColor: "#16A34A",
        borderDownColor: "#DC2626",
        wickUpColor: "#16A34A",
        wickDownColor: "#DC2626",
      });
    } else if (chartType === "line") {
      seriesRef.current = chart.addSeries(LineSeries, {
        color: "#00C98D",
        lineWidth: 2,
      });
    } else if (chartType === "area") {
      seriesRef.current = chart.addSeries(AreaSeries, {
        lineColor: "#00C98D",
        topColor: "rgba(0, 201, 141, 0.2)",
        bottomColor: "rgba(0, 201, 141, 0.02)",
        lineWidth: 2,
      });
    } else if (chartType === "bar") {
      seriesRef.current = chart.addSeries(BarSeries, {
        upColor: "#16A34A",
        downColor: "#DC2626",
      });
    }

    return chart;
  }, [chartType]);

  // Create/recreate chart when chart type changes
  useEffect(() => {
    createChartInstance();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, [createChartInstance]);

  // Handle resize — guard against zero dimensions (mobile layout transitions)
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container || !chartRef.current) return;

    let rafId: number | null = null;
    const resizeObserver = new ResizeObserver((entries) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const { width, height } = entries[0].contentRect;
        if (width > 0 && height > 0) {
          chartRef.current?.applyOptions({ width, height });
        }
      });
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [chartType]);

  // Track whether we've done the initial setData
  const initialDataSetRef = useRef(false);
  const prevCandlesLenRef = useRef(0);

  // Reset initial flag when chart type or interval changes
  useEffect(() => {
    initialDataSetRef.current = false;
    prevCandlesLenRef.current = 0;
    lastBarRef.current = null;
  }, [chartType, interval]);

  // Load historical candles into chart
  useEffect(() => {
    if (!seriesRef.current || candles.length === 0) return;

    const series = seriesRef.current;
    const isInitial = !initialDataSetRef.current;

    if (isInitial) {
      // First load: setData with all candles
      if (chartType === "candlestick") {
        const data: CandlestickData<Time>[] = candles.map((c) => ({
          time: (new Date(c.open_time).getTime() / 1000) as Time,
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close),
        }));
        (series as ISeriesApi<"Candlestick">).setData(data);
      } else if (chartType === "line") {
        const data: LineData<Time>[] = candles.map((c) => ({
          time: (new Date(c.open_time).getTime() / 1000) as Time,
          value: Number(c.close),
        }));
        (series as ISeriesApi<"Line">).setData(data);
      } else if (chartType === "area") {
        const data: AreaData<Time>[] = candles.map((c) => ({
          time: (new Date(c.open_time).getTime() / 1000) as Time,
          value: Number(c.close),
        }));
        (series as ISeriesApi<"Area">).setData(data);
      } else if (chartType === "bar") {
        const data: BarData<Time>[] = candles.map((c) => ({
          time: (new Date(c.open_time).getTime() / 1000) as Time,
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close),
        }));
        (series as ISeriesApi<"Bar">).setData(data);
      }
      chartRef.current?.timeScale().fitContent();
      initialDataSetRef.current = true;
      prevCandlesLenRef.current = candles.length;

      // Seed lastBarRef from the last historical candle
      const last = candles[candles.length - 1];
      lastBarRef.current = {
        time: Math.floor(new Date(last.open_time).getTime() / 1000),
        open: Number(last.open),
        high: Number(last.high),
        low: Number(last.low),
        close: Number(last.close),
      };
    } else {
      // DB-driven update (fallback): update last candle from server-side candle data
      const last = candles[candles.length - 1];
      const time = (new Date(last.open_time).getTime() / 1000) as Time;

      if (chartType === "candlestick") {
        (series as ISeriesApi<"Candlestick">).update({
          time,
          open: Number(last.open),
          high: Number(last.high),
          low: Number(last.low),
          close: Number(last.close),
        });
      } else if (chartType === "line") {
        (series as ISeriesApi<"Line">).update({ time, value: Number(last.close) });
      } else if (chartType === "area") {
        (series as ISeriesApi<"Area">).update({ time, value: Number(last.close) });
      } else if (chartType === "bar") {
        (series as ISeriesApi<"Bar">).update({
          time,
          open: Number(last.open),
          high: Number(last.high),
          low: Number(last.low),
          close: Number(last.close),
        });
      }

      // Sync lastBarRef with DB candle
      lastBarRef.current = {
        time: Math.floor(new Date(last.open_time).getTime() / 1000),
        open: Number(last.open),
        high: Number(last.high),
        low: Number(last.low),
        close: Number(last.close),
      };

      if (candles.length > prevCandlesLenRef.current) {
        chartRef.current?.timeScale().scrollToRealTime();
      }
      prevCandlesLenRef.current = candles.length;
    }
  }, [candles, chartType]);

  /*
   * Live trade stream → chart update
   *
   * Subscribes directly to the trades table via Supabase Realtime.
   * Builds/updates candles client-side from the tape using series.update().
   * Works for ALL intervals (1h, 4h, 1d, 1w) regardless of server-side candle writes.
   * rAF-batched: accumulates trades and flushes once per frame.
   */
  useEffect(() => {
    if (!marketId) return;

    const intervalSecs = INTERVAL_SECONDS[interval] || 3600;
    let rafId: number | null = null;
    let pendingPrice: number | null = null;
    let pendingTs: number | null = null;

    function processTrade(tradePrice: number, tradeTsSec: number) {
      const series = seriesRef.current;
      const last = lastBarRef.current;
      if (!series || !last) return;

      const bucketTime = Math.floor(tradeTsSec / intervalSecs) * intervalSecs;

      // Ignore stale trades from before the current bar
      if (bucketTime < last.time) return;

      if (bucketTime === last.time) {
        // Update existing bar
        last.high = Math.max(last.high, tradePrice);
        last.low = Math.min(last.low, tradePrice);
        last.close = tradePrice;
      } else {
        // New bar — close old, start new
        const newBar: OhlcBar = {
          time: bucketTime,
          open: last.close,
          high: tradePrice,
          low: tradePrice,
          close: tradePrice,
        };
        lastBarRef.current = newBar;
      }

      // Push to chart
      const bar = lastBarRef.current!;
      if (chartType === "candlestick" || chartType === "bar") {
        (series as ISeriesApi<"Candlestick"> | ISeriesApi<"Bar">).update({
          time: bar.time as Time,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
        });
      } else {
        (series as ISeriesApi<"Line"> | ISeriesApi<"Area">).update({
          time: bar.time as Time,
          value: bar.close,
        });
      }

      // If new bar was created, scroll to keep it visible
      if (bucketTime > last.time) {
        chartRef.current?.timeScale().scrollToRealTime();
      }
    }

    const channel = supabase
      .channel(`chart_live_${marketId}_${interval}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trades",
          filter: `market_id=eq.${marketId}`,
        },
        (payload) => {
          const trade = payload.new as { price: number; executed_at: string };
          const price = Number(trade.price);
          const tsSec = Math.floor(new Date(trade.executed_at).getTime() / 1000);

          // rAF batch: store latest trade, flush once per frame
          pendingPrice = price;
          pendingTs = tsSec;

          if (!rafId) {
            rafId = requestAnimationFrame(() => {
              rafId = null;
              if (pendingPrice !== null && pendingTs !== null) {
                processTrade(pendingPrice, pendingTs);
                pendingPrice = null;
                pendingTs = null;
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [marketId, interval, chartType]);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header with chart type + interval selector */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1">
          {CHART_TYPES.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              title={label}
              className={`p-1.5 rounded transition-colors ${
                chartType === type
                  ? "bg-primary/20 text-primary"
                  : "text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {INTERVALS.map((intv) => (
            <button
              key={intv.value}
              onClick={() => setInterval(intv.value)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                interval === intv.value
                  ? "bg-primary/20 text-primary"
                  : "text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              {intv.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div className="flex-1 min-h-0 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-10 text-xs text-muted">
            Loading chart data...
          </div>
        )}
        {!loading && candles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted">
            No candle data available
          </div>
        )}
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
