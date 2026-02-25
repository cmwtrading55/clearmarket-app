"use client";

import { useWallet } from "@/lib/wallet";
import { mockBatches } from "@/data/mockBatches";
import { mockPayouts } from "@/data/mockPortfolio";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Wallet, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const PAYOUT_STYLES = {
  completed: { bg: "bg-primary/10 text-primary", icon: CheckCircle },
  processing: { bg: "bg-warning/10 text-warning", icon: Clock },
  pending: { bg: "bg-muted/10 text-muted", icon: Clock },
};

export default function SettlementPage() {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Wallet size={40} className="text-muted mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">Settlement</h2>
          <p className="text-sm text-muted max-w-sm">
            Connect your wallet to view settlements and claim outcomes.
          </p>
        </div>
      </main>
    );
  }

  const settledBatches = mockBatches.filter((b) => b.status === "settled" || b.status === "harvested");

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settlement</h1>
          <p className="text-sm text-muted mt-1">
            Claim harvest outcomes and track payouts
          </p>
        </div>

        {/* Settled batches */}
        <div className="space-y-4">
          {settledBatches.map((batch) => {
            const payout = mockPayouts.find((p) => p.batchId === batch.id);
            return (
              <div key={batch.id} className="bg-card-bg border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{batch.strain}</h3>
                    <p className="text-xs text-muted mt-0.5">{batch.grower} &middot; {batch.region}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${batch.status === "settled" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}`}>
                    {batch.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted">Yield</p>
                    <p className="text-sm font-medium text-foreground">{batch.yieldKg} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Token Price</p>
                    <p className="text-sm font-mono text-foreground">${batch.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Payout</p>
                    <p className="text-sm font-mono text-foreground">
                      {payout ? `$${payout.amount.toLocaleString()}` : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                  {batch.status === "settled" ? (
                    <button className="text-xs font-medium px-4 py-2 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors">
                      Claim Payout
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-warning">
                      <Clock size={14} />
                      Awaiting quality assurance
                    </div>
                  )}
                  <Link
                    href={`/batch/${batch.id}`}
                    className="text-xs text-muted hover:text-foreground transition-colors"
                  >
                    View Batch
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dispute notice */}
        <div className="bg-card-bg border border-warning/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Dispute Resolution</p>
              <p className="text-xs text-muted mt-1">
                If you believe a settlement outcome is incorrect, you may raise a dispute within 7 days
                of batch settlement. Disputes are reviewed by the ClearMarket arbitration panel.
              </p>
              <button className="text-xs text-warning hover:text-warning/80 mt-2 font-medium transition-colors">
                Learn more about disputes
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
