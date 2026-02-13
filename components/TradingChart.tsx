"use client";

import { useState, useMemo } from "react";
import { useCandles } from "@/lib/hooks";
import { INTERVALS, type IntervalValue } from "@/lib/constants";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface CandleBar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  // For the bar chart — [low, high] of the body
  body: [number, number];
  // Full range [low, high] for the wick
  wick: [number, number];
  bullish: boolean;
}

function formatTime(dateStr: string, interval: string): string {
  const d = new Date(dateStr);
  if (interval === "1d" || interval === "1w") {
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  }
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
}

// Custom candlestick shape
function CandlestickShape(props: Record<string, unknown>) {
  const { x, y, width, height, payload } = props as {
    x: number;
    y: number;
    width: number;
    height: number;
    payload: CandleBar;
  };

  if (!payload) return null;

  const color = payload.bullish ? "#4ADE80" : "#F15B5B";
  const bodyWidth = Math.max(width * 0.6, 2);
  const wickX = x + width / 2;
  const bodyX = x + (width - bodyWidth) / 2;

  return (
    <g>
      {/* Wick line */}
      <line
        x1={wickX}
        y1={y}
        x2={wickX}
        y2={y + height}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body rectangle */}
      <rect
        x={bodyX}
        y={payload.bullish ? y + (height * (payload.high - payload.close)) / (payload.high - payload.low || 1) : y + (height * (payload.high - payload.open)) / (payload.high - payload.low || 1)}
        width={bodyWidth}
        height={Math.max((height * Math.abs(payload.close - payload.open)) / (payload.high - payload.low || 1), 1)}
        fill={color}
        stroke={color}
      />
    </g>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload as CandleBar;
  return (
    <div className="bg-card border border-border rounded px-3 py-2 text-xs shadow-lg">
      <div className="text-muted mb-1">{d.time}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono">
        <span className="text-muted">O</span>
        <span className="text-foreground">{d.open.toFixed(3)}</span>
        <span className="text-muted">H</span>
        <span className="text-foreground">{d.high.toFixed(3)}</span>
        <span className="text-muted">L</span>
        <span className="text-foreground">{d.low.toFixed(3)}</span>
        <span className="text-muted">C</span>
        <span className={d.bullish ? "text-buy" : "text-sell"}>
          {d.close.toFixed(3)}
        </span>
        <span className="text-muted">Vol</span>
        <span className="text-foreground">
          {Number(d.volume).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default function TradingChart({
  marketId,
}: {
  marketId: string | undefined;
}) {
  const [interval, setInterval] = useState<IntervalValue>("1h");
  const { candles, loading } = useCandles(marketId, interval);

  const data: CandleBar[] = useMemo(() => {
    return candles.map((c) => {
      const o = Number(c.open);
      const h = Number(c.high);
      const l = Number(c.low);
      const cl = Number(c.close);
      return {
        time: formatTime(c.open_time, interval),
        open: o,
        high: h,
        low: l,
        close: cl,
        volume: Number(c.volume),
        body: [Math.min(o, cl), Math.max(o, cl)],
        wick: [l, h],
        bullish: cl >= o,
      };
    });
  }, [candles, interval]);

  const [minPrice, maxPrice] = useMemo(() => {
    if (data.length === 0) return [0, 0];
    const lows = data.map((d) => d.low);
    const highs = data.map((d) => d.high);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const padding = (max - min) * 0.05;
    return [min - padding, max + padding];
  }, [data]);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header with interval selector */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
          Chart
        </h3>
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
      <div className="flex-1 min-h-0 p-2">
        {loading ? (
          <div className="flex items-center justify-center h-full text-xs text-muted">
            Loading chart data...
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-muted">
            No candle data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1E2D3D"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: "#6B7A8D", fontSize: 10 }}
                axisLine={{ stroke: "#1E2D3D" }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={60}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                tick={{ fill: "#6B7A8D", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                orientation="right"
                tickFormatter={(v: number) => v.toFixed(2)}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Candlestick as Bar with wick range */}
              <Bar
                dataKey="wick"
                shape={<CandlestickShape />}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.bullish ? "#4ADE80" : "#F15B5B"}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
