"use client";

import { useWallet } from "@/lib/wallet";
import Footer from "@/components/Footer";
import { Wallet, Clock, AlertTriangle } from "lucide-react";
import { PROGRAM_ID, shortenAddress } from "@/lib/solana";

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

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settlement</h1>
          <p className="text-sm text-muted mt-1">
            Claim harvest outcomes and track payouts
          </p>
        </div>

        {/* Empty state */}
        <div className="bg-card-bg border border-border rounded-xl p-12 text-center">
          <Clock size={40} className="text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No settlements yet
          </h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            Settlement data will appear here when your funded crops reach
            milestones. Payouts are distributed automatically via Solana
            smart contract when harvests are verified.
          </p>
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
              <p className="text-[10px] text-muted/60 font-mono mt-2">
                ClearMarket Program: {shortenAddress(PROGRAM_ID, 8)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
