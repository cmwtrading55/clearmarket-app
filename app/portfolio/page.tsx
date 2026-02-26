"use client";

import { useWallet } from "@/lib/wallet";
import { mockHoldings, mockPayouts } from "@/data/mockPortfolio";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Package, PieChart, Coins } from "lucide-react";

const STATUS_STYLES = {
  funding: "bg-primary/10 text-primary",
  growing: "bg-blue-500/10 text-blue-400",
  harvested: "bg-warning/10 text-warning",
  settled: "bg-muted/10 text-muted",
};

const PAYOUT_STYLES = {
  completed: "bg-primary/10 text-primary",
  processing: "bg-warning/10 text-warning",
  pending: "bg-muted/10 text-muted",
};

export default function PortfolioPage() {
  const { connected, balance, solBalance } = useWallet();

  if (!connected) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Wallet size={40} className="text-muted mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">Connect Your Wallet</h2>
          <p className="text-sm text-muted max-w-sm">
            Connect a wallet to view your batch token holdings and payout history.
          </p>
        </div>
      </main>
    );
  }

  const totalValue = mockHoldings.reduce((sum, h) => sum + h.tokens * h.currentPrice, 0);
  const totalPnl = mockHoldings.reduce((sum, h) => sum + h.pnl, 0);
  const totalPayouts = mockPayouts.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);

  const summaryCards = [
    { icon: DollarSign, label: "Portfolio Value", value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
    { icon: Package, label: "Batches Held", value: mockHoldings.length.toString() },
    { icon: totalPnl >= 0 ? TrendingUp : TrendingDown, label: "Total P&L", value: `${totalPnl >= 0 ? "+" : ""}$${totalPnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: totalPnl >= 0 ? "text-buy" : "text-sell" },
    { icon: PieChart, label: "Payouts Received", value: `$${totalPayouts.toLocaleString()}` },
    { icon: Coins, label: "SOL Balance", value: `${solBalance.toFixed(2)} SOL` },
  ];

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Portfolio</h1>
          <p className="text-sm text-muted mt-1">
            Your batch token holdings and payouts
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-card-bg border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className="text-primary" />
                  <span className="text-xs text-muted">{card.label}</span>
                </div>
                <p className={`text-xl font-semibold ${card.color || "text-foreground"}`}>
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Holdings */}
        <div className="bg-card-bg border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-medium text-foreground">Holdings</h2>
            <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">SPL Token Accounts</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="text-left py-2 pr-4 font-medium">Batch</th>
                  <th className="text-left py-2 pr-4 font-medium">Grower</th>
                  <th className="text-left py-2 pr-4 font-medium">Status</th>
                  <th className="text-right py-2 pr-4 font-medium">SPL Tokens</th>
                  <th className="text-right py-2 pr-4 font-medium">Avg Price</th>
                  <th className="text-right py-2 pr-4 font-medium">Current</th>
                  <th className="text-right py-2 font-medium">P&L</th>
                </tr>
              </thead>
              <tbody>
                {mockHoldings.map((h) => (
                  <tr key={h.id} className="border-b border-border/50">
                    <td className="py-3 pr-4">
                      <Link href={`/batch/${h.batchId}`} className="text-foreground hover:text-primary transition-colors font-medium">
                        {h.strain}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-muted">{h.grower}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[h.status]}`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-foreground">{h.tokens.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-right font-mono text-muted">${h.avgPrice.toFixed(2)}</td>
                    <td className="py-3 pr-4 text-right font-mono text-foreground">${h.currentPrice.toFixed(2)}</td>
                    <td className={`py-3 text-right font-mono ${h.pnl >= 0 ? "text-buy" : "text-sell"}`}>
                      {h.pnl >= 0 ? "+" : ""}${h.pnl.toLocaleString()} ({h.pnlPercent >= 0 ? "+" : ""}{h.pnlPercent.toFixed(1)}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payouts */}
        <div className="bg-card-bg border border-border rounded-xl p-6">
          <h2 className="text-sm font-medium text-foreground mb-4">Payouts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="text-left py-2 pr-4 font-medium">Batch</th>
                  <th className="text-left py-2 pr-4 font-medium">Status</th>
                  <th className="text-right py-2 pr-4 font-medium">Amount</th>
                  <th className="text-right py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockPayouts.map((p) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-3 pr-4 text-foreground">{p.strain}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full capitalize ${PAYOUT_STYLES[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-foreground">${p.amount.toLocaleString()}</td>
                    <td className="py-3 text-right text-muted">{new Date(p.date).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
