"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCandles } from "@/lib/hooks";
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
        background: { type: ColorType.Solid, color: "#0F1D32" },
        textColor: "#6B7A8D",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1E2D3D" },
        horzLines: { color: "#1E2D3D" },
      },
      crosshair: {
        vertLine: { color: "#6B7A8D", width: 1, style: 2, labelBackgroundColor: "#0F1D32" },
        horzLine: { color: "#6B7A8D", width: 1, style: 2, labelBackgroundColor: "#0F1D32" },
      },
      rightPriceScale: {
        borderColor: "#1E2D3D",
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: "#1E2D3D",
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { vertTouchDrag: false },
    });

    chartRef.current = chart;

    // Add series based on chart type
    if (chartType === "candlestick") {
      seriesRef.current = chart.addSeries(CandlestickSeries, {
        upColor: "#4ADE80",
        downColor: "#F15B5B",
        borderUpColor: "#4ADE80",
        borderDownColor: "#F15B5B",
        wickUpColor: "#4ADE80",
        wickDownColor: "#F15B5B",
      });
    } else if (chartType === "line") {
      seriesRef.current = chart.addSeries(LineSeries, {
        color: "#00E5A0",
        lineWidth: 2,
      });
    } else if (chartType === "area") {
      seriesRef.current = chart.addSeries(AreaSeries, {
        lineColor: "#00E5A0",
        topColor: "rgba(0, 229, 160, 0.3)",
        bottomColor: "rgba(0, 229, 160, 0.02)",
        lineWidth: 2,
      });
    } else if (chartType === "bar") {
      seriesRef.current = chart.addSeries(BarSeries, {
        upColor: "#4ADE80",
        downColor: "#F15B5B",
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

  // Handle resize
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container || !chartRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chartRef.current?.applyOptions({ width, height });
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [chartType]);

  // Update data when candles change
  useEffect(() => {
    if (!seriesRef.current || candles.length === 0) return;

    if (chartType === "candlestick") {
      const data: CandlestickData<Time>[] = candles.map((c) => ({
        time: (new Date(c.open_time).getTime() / 1000) as Time,
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close),
      }));
      (seriesRef.current as ISeriesApi<"Candlestick">).setData(data);
    } else if (chartType === "line") {
      const data: LineData<Time>[] = candles.map((c) => ({
        time: (new Date(c.open_time).getTime() / 1000) as Time,
        value: Number(c.close),
      }));
      (seriesRef.current as ISeriesApi<"Line">).setData(data);
    } else if (chartType === "area") {
      const data: AreaData<Time>[] = candles.map((c) => ({
        time: (new Date(c.open_time).getTime() / 1000) as Time,
        value: Number(c.close),
      }));
      (seriesRef.current as ISeriesApi<"Area">).setData(data);
    } else if (chartType === "bar") {
      const data: BarData<Time>[] = candles.map((c) => ({
        time: (new Date(c.open_time).getTime() / 1000) as Time,
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close),
      }));
      (seriesRef.current as ISeriesApi<"Bar">).setData(data);
    }

    chartRef.current?.timeScale().fitContent();
  }, [candles, chartType]);

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
