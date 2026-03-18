"use client";

import { useRef, useEffect, useCallback } from "react";
import { useOrderBook } from "@/lib/hooks";

interface Props {
  marketId: string | undefined;
}

export default function DepthChart({ marketId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const book = useOrderBook(marketId);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    if (book.bids.length === 0 && book.asks.length === 0) return;

    // Cumulative depth data
    const bids = book.bids.map((l) => ({ price: l.price, total: l.total }));
    const asks = book.asks.map((l) => ({ price: l.price, total: l.total }));

    const midPrice = bids[0]?.price ?? asks[0]?.price ?? 0;
    if (midPrice === 0) return;

    // Price range: show +/- 5% from mid
    const spread = 0.05;
    const minPrice = midPrice * (1 - spread);
    const maxPrice = midPrice * (1 + spread);
    const maxTotal = Math.max(
      bids[bids.length - 1]?.total || 0,
      asks[asks.length - 1]?.total || 0
    );

    if (maxTotal === 0) return;

    const priceToX = (p: number) => ((p - minPrice) / (maxPrice - minPrice)) * w;
    const totalToY = (t: number) => h - (t / maxTotal) * (h * 0.85) - h * 0.05;

    // Draw bid area (green, left side)
    ctx.beginPath();
    ctx.moveTo(priceToX(bids[0]?.price ?? midPrice), h);
    for (const bid of bids) {
      if (bid.price < minPrice) break;
      ctx.lineTo(priceToX(bid.price), totalToY(bid.total));
    }
    const lastBid = bids.findLast((b) => b.price >= minPrice) ?? bids[bids.length - 1];
    if (lastBid) ctx.lineTo(priceToX(lastBid.price), h);
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 194, 120, 0.12)";
    ctx.fill();

    // Bid line
    ctx.beginPath();
    for (let i = 0; i < bids.length; i++) {
      if (bids[i].price < minPrice) break;
      const x = priceToX(bids[i].price);
      const y = totalToY(bids[i].total);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(0, 194, 120, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw ask area (red, right side)
    ctx.beginPath();
    ctx.moveTo(priceToX(asks[0]?.price ?? midPrice), h);
    for (const ask of asks) {
      if (ask.price > maxPrice) break;
      ctx.lineTo(priceToX(ask.price), totalToY(ask.total));
    }
    const lastAsk = asks.findLast((a) => a.price <= maxPrice) ?? asks[asks.length - 1];
    if (lastAsk) ctx.lineTo(priceToX(lastAsk.price), h);
    ctx.closePath();
    ctx.fillStyle = "rgba(234, 57, 67, 0.12)";
    ctx.fill();

    // Ask line
    ctx.beginPath();
    for (let i = 0; i < asks.length; i++) {
      if (asks[i].price > maxPrice) break;
      const x = priceToX(asks[i].price);
      const y = totalToY(asks[i].total);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(234, 57, 67, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Mid price line
    const midX = priceToX(midPrice);
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, h);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Mid price label
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(midPrice.toFixed(2), midX, 12);
  }, [book]);

  useEffect(() => {
    draw();
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => draw());
    observer.observe(container);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
