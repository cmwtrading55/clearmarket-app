import Link from "next/link";
import type { LaunchpadListing } from "@/lib/types";
import { MapPin, Calendar, TrendingDown, Leaf } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted/10 text-muted",
  pending_review: "bg-warning/10 text-warning",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-sell/10 text-sell",
  funding: "bg-blue-500/10 text-blue-400",
};

const GRADE_STYLES: Record<string, string> = {
  A: "text-primary",
  B: "text-blue-400",
  C: "text-warning",
  D: "text-sell",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1536819114556-1e10f967fb61?w=800&q=80";

interface Props {
  listing: LaunchpadListing;
}

export default function LaunchpadCard({ listing }: Props) {
  const heroImg = listing.hero_image || DEFAULT_IMAGE;
  const displayName = listing.strain;
  const fundingPct = listing.funding_target && listing.funding_target > 0
    ? Math.min((listing.funding_raised / listing.funding_target) * 100, 100)
    : 0;

  return (
    <Link
      href={`/launchpad/${listing.id}`}
      className="block bg-card-bg border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors group"
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={heroImg}
          alt={displayName || "Crop listing"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
              STATUS_STYLES[listing.status] || STATUS_STYLES.draft
            }`}
          >
            {listing.status.replace("_", " ")}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium bg-background/60 backdrop-blur-sm ${
              GRADE_STYLES[listing.risk_grade]
            }`}
          >
            Grade {listing.risk_grade}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {displayName}
          </h3>
          <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
            <MapPin size={12} />
            {listing.grower_name || "Anonymous"} &middot;{" "}
            {listing.region || "Unknown"}
          </p>
        </div>

        {/* Token price + discount */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Token Price</p>
            <p className="text-lg font-semibold font-mono text-foreground">
              ${listing.price_per_token?.toFixed(2) || "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted flex items-center gap-1 justify-end">
              <TrendingDown size={10} /> Discount
            </p>
            <p className="text-lg font-semibold font-mono text-primary">
              {listing.oracle_discount_pct.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Funding progress bar */}
        {listing.funding_target && listing.funding_target > 0 && (
          <div>
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>{listing.investor_count || 0} investors</span>
              <span className="font-mono">
                ${((listing.funding_raised || 0) / 1000).toFixed(0)}k / ${(listing.funding_target / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full transition-all"
                style={{ width: `${fundingPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Completeness bar */}
        <div>
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>Completeness</span>
            <span>{listing.completeness_score}%</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${listing.completeness_score}%` }}
            />
          </div>
        </div>

        {/* Harvest */}
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {listing.harvest_date
              ? new Date(listing.harvest_date).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })
              : "TBD"}
          </span>
        </div>
      </div>
    </Link>
  );
}
