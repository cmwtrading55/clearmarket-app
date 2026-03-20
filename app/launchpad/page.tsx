"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { LaunchpadListing } from "@/lib/types";
import LaunchpadCard from "@/components/launchpad/LaunchpadCard";
import {
  Rocket,
  Sprout,
  BarChart3,
  Filter,
  Loader2,
} from "lucide-react";

type GradeFilter = "all" | "A" | "B" | "C" | "D";

export default function LaunchpadPage() {
  const [listings, setListings] = useState<LaunchpadListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("launchpad_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setListings(data as LaunchpadListing[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = listings.filter((l) => {
    if (gradeFilter !== "all" && l.risk_grade !== gradeFilter) return false;
    return true;
  });

  const avgDiscount =
    listings.length > 0
      ? listings.reduce((s, l) => s + l.oracle_discount_pct, 0) / listings.length
      : 0;

  const totalFunding = listings.reduce(
    (s, l) => s + (l.funding_target || 0),
    0
  );

  const totalRaised = listings.reduce(
    (s, l) => s + (l.funding_raised || 0),
    0
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Rocket size={22} className="text-primary" />
              Cannabis Launchpad
            </h1>
            <p className="text-sm text-muted mt-1">
              Forward-fund cannabis grows with transparent oracle-based
              investor discounts.
            </p>
          </div>
          <Link
            href="/launchpad/submit"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors shrink-0"
          >
            <Sprout size={14} />
            List Your Grow
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat
            label="Total Listings"
            value={String(listings.length)}
            icon={<Sprout size={14} />}
          />
          <Stat
            label="Avg Discount"
            value={`${avgDiscount.toFixed(1)}%`}
            icon={<BarChart3 size={14} />}
          />
          <Stat
            label="Total Target"
            value={`$${(totalFunding / 1000).toFixed(0)}k`}
            icon={<Rocket size={14} />}
          />
          <Stat
            label="Total Raised"
            value={`$${(totalRaised / 1000).toFixed(0)}k`}
            icon={<Filter size={14} />}
          />
        </div>

        {/* Grade filter chips */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "A", "B", "C", "D"] as GradeFilter[]).map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                gradeFilter === g
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "border-border text-muted hover:text-foreground hover:border-primary/20"
              }`}
            >
              {g === "all" ? "All Grades" : `Grade ${g}`}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-muted" size={24} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Sprout size={40} className="text-muted mx-auto mb-3" />
            <p className="text-muted text-sm">
              {listings.length === 0
                ? "No listings yet. Be the first to list your grow!"
                : "No listings match this filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((listing) => (
              <LaunchpadCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-card-bg border border-border rounded-lg px-4 py-3">
      <div className="flex items-center gap-1.5 text-muted mb-1">{icon}<span className="text-xs">{label}</span></div>
      <p className="text-lg font-bold font-mono text-foreground">{value}</p>
    </div>
  );
}
