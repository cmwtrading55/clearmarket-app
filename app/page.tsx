"use client";

import { useState } from "react";
import type { Batch, BatchStatus } from "@/lib/types";
import { mockBatches } from "@/data/mockBatches";
import MarketStats from "@/components/explore/MarketStats";
import ActivityFeed from "@/components/explore/ActivityFeed";
import FilterChips from "@/components/explore/FilterChips";
import BatchCard from "@/components/explore/BatchCard";
import QuickBuyModal from "@/components/QuickBuyModal";
import Footer from "@/components/Footer";

export default function ExplorePage() {
  const [filter, setFilter] = useState<BatchStatus | "all">("all");
  const [quickBuyBatch, setQuickBuyBatch] = useState<Batch | null>(null);

  const filteredBatches =
    filter === "all"
      ? mockBatches
      : mockBatches.filter((b) => b.status === filter);

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Explore Batches
          </h1>
          <p className="text-sm text-muted mt-1">
            Browse tokenised cannabis batches from verified growers
          </p>
        </div>

        {/* Stats */}
        <MarketStats />

        {/* Filters */}
        <FilterChips active={filter} onChange={setFilter} />

        {/* Main grid + sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Batch grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredBatches.map((batch) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  onQuickBuy={setQuickBuyBatch}
                />
              ))}
            </div>
            {filteredBatches.length === 0 && (
              <div className="text-center py-16 text-muted text-sm">
                No batches match this filter.
              </div>
            )}
          </div>

          {/* Activity sidebar */}
          <div className="lg:w-72 shrink-0">
            <ActivityFeed />
          </div>
        </div>
      </div>

      <Footer />

      <QuickBuyModal
        batch={quickBuyBatch}
        onClose={() => setQuickBuyBatch(null)}
      />
    </main>
  );
}
