"use client";

import { useState } from "react";
import { useWallet } from "@/lib/wallet";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Wallet, Plus, X, Package, DollarSign, Clock } from "lucide-react";

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
            Connect your wallet to manage listings and view revenue.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted mt-1">Manage your listings and revenue</p>
          </div>
          <Link
            href="/launchpad/submit"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            New Listing
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card-bg border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package size={14} className="text-primary" />
              <span className="text-xs text-muted">Active Investments</span>
            </div>
            <p className="text-xl font-semibold text-foreground">0</p>
          </div>
          <div className="bg-card-bg border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={14} className="text-primary" />
              <span className="text-xs text-muted">Total Funded</span>
            </div>
            <p className="text-xl font-semibold text-foreground">$0</p>
          </div>
          <div className="bg-card-bg border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-primary" />
              <span className="text-xs text-muted">Pending Settlements</span>
            </div>
            <p className="text-xl font-semibold text-foreground">0</p>
          </div>
        </div>

        {/* Empty listings table */}
        <div className="bg-card-bg border border-border rounded-xl p-6">
          <h2 className="text-sm font-medium text-foreground mb-4">Your Listings</h2>
          <div className="text-center py-12">
            <Package size={32} className="text-muted mx-auto mb-3" />
            <p className="text-sm text-muted mb-4">
              No listings yet. Submit a crop listing on the launchpad to get started.
            </p>
            <Link
              href="/launchpad/submit"
              className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
            >
              <Plus size={14} />
              Submit Listing
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
