"use client";

import { useState } from "react";
import { useWallet } from "@/lib/wallet";
import { mockBatches } from "@/data/mockBatches";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Wallet, Plus, X, Package, DollarSign, Clock } from "lucide-react";

const STATUS_STYLES = {
  funding: "bg-primary/10 text-primary",
  growing: "bg-blue-500/10 text-blue-400",
  harvested: "bg-warning/10 text-warning",
  settled: "bg-muted/10 text-muted",
};

export default function DashboardPage() {
  const { connected } = useWallet();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!connected) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Wallet size={40} className="text-muted mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">Grower Dashboard</h2>
          <p className="text-sm text-muted max-w-sm">
            Connect your wallet to manage batches and view revenue.
          </p>
        </div>
      </main>
    );
  }

  // Mock: show batches from first grower as "yours"
  const myBatches = mockBatches.filter((b) => b.growerId === "grower-001");
  const activeBatches = myBatches.filter((b) => b.status !== "settled").length;
  const totalRevenue = myBatches.reduce((sum, b) => sum + b.fundingRaised, 0);
  const pendingSettlements = myBatches.filter((b) => b.status === "harvested").length;

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted mt-1">Manage your batches and revenue</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            New Batch
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card-bg border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package size={14} className="text-primary" />
              <span className="text-xs text-muted">Active Batches</span>
            </div>
            <p className="text-xl font-semibold text-foreground">{activeBatches}</p>
          </div>
          <div className="bg-card-bg border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={14} className="text-primary" />
              <span className="text-xs text-muted">Revenue</span>
            </div>
            <p className="text-xl font-semibold text-foreground">${(totalRevenue / 1000).toFixed(0)}k</p>
          </div>
          <div className="bg-card-bg border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-primary" />
              <span className="text-xs text-muted">Pending Settlements</span>
            </div>
            <p className="text-xl font-semibold text-foreground">{pendingSettlements}</p>
          </div>
        </div>

        {/* Batch table */}
        <div className="bg-card-bg border border-border rounded-xl p-6">
          <h2 className="text-sm font-medium text-foreground mb-4">Your Batches</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="text-left py-2 pr-4 font-medium">Strain</th>
                  <th className="text-left py-2 pr-4 font-medium">Status</th>
                  <th className="text-right py-2 pr-4 font-medium">Price</th>
                  <th className="text-right py-2 pr-4 font-medium">Funded</th>
                  <th className="text-right py-2 pr-4 font-medium">Yield</th>
                  <th className="text-right py-2 font-medium">Harvest</th>
                </tr>
              </thead>
              <tbody>
                {myBatches.map((b) => (
                  <tr key={b.id} className="border-b border-border/50">
                    <td className="py-3 pr-4">
                      <Link href={`/batch/${b.id}`} className="text-foreground hover:text-primary transition-colors font-medium">
                        {b.strain}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-foreground">${b.price.toFixed(2)}</td>
                    <td className="py-3 pr-4 text-right font-mono text-foreground">{b.fundingPercent}%</td>
                    <td className="py-3 pr-4 text-right font-mono text-foreground">{b.yieldKg} kg</td>
                    <td className="py-3 text-right text-muted">
                      {new Date(b.harvestDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Batch Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-card-bg border border-border rounded-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Create New Batch</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-muted hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <input placeholder="Strain name" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50" />
              <input placeholder="Expected yield (kg)" type="number" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50" />
              <input placeholder="Funding target ($)" type="number" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50" />
              <input placeholder="Harvest date" type="date" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50" />
              <textarea placeholder="Description" rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 resize-none" />
              <button className="w-full py-2.5 rounded-lg bg-primary text-background font-medium text-sm hover:bg-primary/90 transition-colors">
                Create Batch
              </button>
              <p className="text-xs text-muted text-center">Mock — batch will not be created on-chain.</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
