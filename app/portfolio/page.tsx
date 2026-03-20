"use client";

import { useWallet } from "@/lib/wallet";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Wallet, Sprout } from "lucide-react";

export default function PortfolioPage() {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Wallet size={40} className="text-muted mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">Connect Your Wallet</h2>
          <p className="text-sm text-muted max-w-sm">
            Connect a wallet to view your crop funding investments and payout history.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Portfolio</h1>
          <p className="text-sm text-muted mt-1">
            Your crop funding investments and payouts
          </p>
        </div>

        {/* Empty state */}
        <div className="bg-card-bg border border-border rounded-xl p-12 text-center">
          <Sprout size={40} className="text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No investments yet
          </h3>
          <p className="text-sm text-muted max-w-md mx-auto mb-6">
            Your funded crops will appear here once you invest in listings
            on the launchpad. Returns will be tracked as harvests settle.
          </p>
          <Link
            href="/launchpad"
            className="inline-flex items-center gap-2 text-sm font-medium px-6 py-2.5 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
          >
            Browse Launchpad
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
