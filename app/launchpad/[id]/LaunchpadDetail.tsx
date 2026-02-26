"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { LaunchpadListing } from "@/lib/types";
import OracleScorePanel from "@/components/launchpad/OracleScorePanel";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Leaf,
  FlaskConical,
  Shield,
  Loader2,
  ExternalLink,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted/10 text-muted",
  pending_review: "bg-warning/10 text-warning",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-sell/10 text-sell",
  funding: "bg-blue-500/10 text-blue-400",
};

export default function LaunchpadDetail({ id }: { id: string }) {
  const [listing, setListing] = useState<LaunchpadListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const { data } = await supabase
        .from("launchpad_listings")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setListing(data as LaunchpadListing);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-muted" size={28} />
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <p className="text-muted">Listing not found.</p>
        <Link href="/launchpad" className="text-sm text-primary hover:underline">
          Back to Launchpad
        </Link>
      </main>
    );
  }

  const oracle = {
    completeness: listing.completeness_score,
    buyerBonus: listing.contracted_buyer
      ? listing.contracted_buyer_name
        ? 25
        : 15
      : 0,
    historyScore: listing.history_score,
    composite:
      listing.completeness_score * 0.4 +
      (listing.contracted_buyer
        ? listing.contracted_buyer_name
          ? 25
          : 15
        : 0) *
        0.8 +
      listing.history_score * 0.4,
    discount: listing.oracle_discount_pct,
    riskGrade: listing.risk_grade,
  };

  const heroImg =
    listing.hero_image ||
    "https://images.unsplash.com/photo-1536819114556-1e10f967fb61?w=800&q=80";

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Link
          href="/launchpad"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Launchpad
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 space-y-5">
            {/* Hero image */}
            <div className="relative rounded-xl overflow-hidden h-52 sm:h-64">
              <img
                src={heroImg}
                alt={listing.strain}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                    STATUS_STYLES[listing.status] || STATUS_STYLES.draft
                  }`}
                >
                  {listing.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Title + meta */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {listing.strain}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {listing.grower_name || "Anonymous"} &middot;{" "}
                  {listing.region || "Unknown"}
                </span>
                {listing.harvest_date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(listing.harvest_date).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <p className="text-sm text-muted leading-relaxed">
                {listing.description}
              </p>
            )}

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <MetricCard
                icon={<Leaf size={14} />}
                label="THC / CBD"
                value={`${listing.thc_percent ?? "–"}% / ${
                  listing.cbd_percent ?? "–"
                }%`}
              />
              <MetricCard
                icon={<FlaskConical size={14} />}
                label="Yield"
                value={
                  listing.yield_kg
                    ? `${Number(listing.yield_kg).toLocaleString()} kg`
                    : "—"
                }
              />
              <MetricCard
                icon={<Shield size={14} />}
                label="Token"
                value={
                  listing.token_symbol
                    ? `${listing.token_symbol} @ $${
                        Number(listing.price_per_token)?.toFixed(2) || "—"
                      }`
                    : "—"
                }
              />
            </div>

            {/* Detail rows */}
            <div className="bg-card-bg border border-border rounded-xl divide-y divide-border">
              <DetailRow
                label="Funding Target"
                value={
                  listing.funding_target
                    ? `$${Number(listing.funding_target).toLocaleString()}`
                    : null
                }
              />
              <DetailRow label="Grow Method" value={listing.grow_method} />
              <DetailRow label="Lighting" value={listing.lighting} />
              <DetailRow label="Nutrients" value={listing.nutrients} />
              <DetailRow
                label="Facility Cert"
                value={listing.facility_certification}
              />
              <DetailRow
                label="Lab Testing"
                value={listing.lab_testing_provider}
              />
              <DetailRow
                label="Terpene Profile"
                value={listing.expected_terpene_profile}
              />
              <DetailRow
                label="Insurance"
                value={listing.insurance_coverage ? "Covered" : "None"}
              />
              <DetailRow
                label="Contracted Buyer"
                value={
                  listing.contracted_buyer
                    ? listing.contracted_buyer_name || "Yes (unnamed)"
                    : "None"
                }
              />
              <DetailRow label="Grower Type" value={listing.grower_type} />
              <DetailRow
                label="Wallet"
                value={
                  listing.grower_wallet
                    ? `${listing.grower_wallet.slice(
                        0,
                        6
                      )}...${listing.grower_wallet.slice(-4)}`
                    : null
                }
              />
            </div>
          </div>

          {/* Oracle sidebar */}
          <div className="lg:w-72 xl:w-80 shrink-0">
            <div className="lg:sticky lg:top-20 space-y-4">
              <OracleScorePanel oracle={oracle} />

              {(listing.status === "funding" ||
                listing.status === "approved") && (
                <button className="w-full flex items-center justify-center gap-1.5 text-sm font-medium px-4 py-3 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors">
                  <ExternalLink size={14} />
                  Fund This Crop
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card-bg border border-border rounded-lg px-4 py-3">
      <div className="flex items-center gap-1.5 text-muted mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold font-mono text-foreground">{value}</p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-foreground font-medium capitalize">
        {value || "—"}
      </span>
    </div>
  );
}
