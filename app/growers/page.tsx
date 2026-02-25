"use client";

import { useState, useMemo } from "react";
import { mockGrowers } from "@/data/mockGrowers";
import GrowerCard from "@/components/growers/GrowerCard";
import GrowerFilters from "@/components/growers/GrowerFilters";
import Footer from "@/components/Footer";
import Link from "next/link";
import { X } from "lucide-react";

export default function GrowersPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("trust");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let result = [...mockGrowers];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.location.toLowerCase().includes(q) ||
          g.specialities.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (region) result = result.filter((g) => g.region === region);
    if (type) result = result.filter((g) => g.type === type);

    result.sort((a, b) => {
      switch (sort) {
        case "rating": return b.rating - a.rating;
        case "batches": return b.batchCount - a.batchCount;
        case "volume": return b.totalVolume - a.totalVolume;
        default: return b.trustScore - a.trustScore;
      }
    });

    return result;
  }, [search, region, type, sort]);

  function toggleCompare(id: string) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Growers</h1>
          <p className="text-sm text-muted mt-1">
            Verified cannabis cultivators on the ClearMarket network
          </p>
        </div>

        <GrowerFilters
          search={search}
          onSearchChange={setSearch}
          region={region}
          onRegionChange={setRegion}
          type={type}
          onTypeChange={setType}
          sort={sort}
          onSortChange={setSort}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((grower) => (
            <GrowerCard
              key={grower.id}
              grower={grower}
              selected={compareIds.includes(grower.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted text-sm">
            No growers match your filters.
          </div>
        )}
      </div>

      {/* Compare pill */}
      {compareIds.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-background px-5 py-3 rounded-full shadow-lg flex items-center gap-3">
          <span className="text-sm font-medium">
            Compare {compareIds.length} growers
          </span>
          <Link
            href={`/growers/compare?ids=${compareIds.join(",")}`}
            className="text-sm font-bold underline"
          >
            Compare
          </Link>
          <button
            onClick={() => setCompareIds([])}
            className="text-background/70 hover:text-background"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <Footer />
    </main>
  );
}
