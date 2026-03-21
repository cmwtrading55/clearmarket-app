import Link from "next/link";
import type { LaunchpadListing } from "@/lib/types";
import { MapPin, Calendar, TrendingDown, Leaf, Play } from "lucide-react";
import { useState, useRef } from "react";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted/10 text-muted border-muted/20",
  pending_review: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(124,58,237,0.2)]",
  rejected: "bg-sell/10 text-sell border-sell/20",
  funding: "bg-primary/20 text-primary border-primary/30 animate-pulse shadow-[0_0_15px_rgba(124,58,237,0.3)]",
};

const GRADE_STYLES: Record<string, string> = {
  A: "text-primary border-primary/40",
  B: "text-blue-400 border-blue-400/40",
  C: "text-warning border-warning/40",
  D: "text-sell border-sell/40",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1536819114556-1e10f967fb61?w=800&q=80";

interface Props {
  listing: LaunchpadListing;
}

export default function LaunchpadCard({ listing }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const heroImg = listing.hero_image || DEFAULT_IMAGE;
  const displayName = listing.strain;
  const fundingPct = listing.funding_target && listing.funding_target > 0
    ? Math.min((listing.funding_raised / listing.funding_target) * 100, 100)
    : 0;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) videoRef.current.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      href={`/launchpad/${listing.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-card-bg/40 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
    >
      {/* Header with Video Preview Slot */}
      <div className="relative h-48 overflow-hidden">
        {/* Static Image */}
        <img
          src={heroImg}
          alt={displayName || "Crop listing"}
          className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 blur-sm opacity-40' : 'scale-100 opacity-100'}`}
        />
        
        {/* Veo Video Preview (plays on hover) */}
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={`/video/preview-${listing.id}.mp4`} type="video/mp4" />
          {/* Fallback to generic preview if specific one missing */}
          <source src="/video/preview-generic.mp4" type="video/mp4" />
        </video>

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          <span
            className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black border backdrop-blur-md ${
              STATUS_STYLES[listing.status] || STATUS_STYLES.draft
            }`}
          >
            {listing.status.replace("_", " ")}
          </span>
          <span
            className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black border bg-background/40 backdrop-blur-md ${
              GRADE_STYLES[listing.risk_grade]
            }`}
          >
            Grade {listing.risk_grade}
          </span>
        </div>

        {/* Play Icon Indicator on Hover */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <Play size={20} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
              {displayName}
            </h3>
            <p className="text-xs text-muted font-bold flex items-center gap-1.5 mt-1">
              <MapPin size={12} className="text-primary" />
              {listing.grower_name || "Verified Grower"} &middot; {listing.region || "High-Tech Facility"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Leaf size={18} className="text-primary/60" />
          </div>
        </div>

        {/* Financial Metrics - Terminal Style */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted font-black mb-1">Token Price</p>
            <p className="text-xl font-black font-mono text-foreground">
              ${listing.price_per_token?.toFixed(2) || "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted font-black mb-1 flex items-center gap-1 justify-end">
              <TrendingDown size={10} className="text-primary" /> Yield Boost
            </p>
            <p className="text-xl font-black font-mono text-primary shadow-primary/20">
              {listing.oracle_discount_pct.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Funding progress */}
        {listing.funding_target && listing.funding_target > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] uppercase tracking-widest text-muted font-black">{listing.investor_count || 0} Backers</span>
              <span className="text-xs font-black font-mono text-foreground">
                ${((listing.funding_raised || 0) / 1000).toFixed(0)}k <span className="text-muted">/ ${(listing.funding_target / 1000).toFixed(0)}k</span>
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                style={{ width: `${fundingPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Harvest Info */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
            <Calendar size={12} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">
              {listing.harvest_date
                ? new Date(listing.harvest_date).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })
                : "Continuous"}
            </span>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
            View Analysis →
          </button>
        </div>
      </div>
    </Link>
  );
}
