import Link from "next/link";
import type { Batch } from "@/lib/types";
import { TrendingUp, Clock, MapPin } from "lucide-react";

const STATUS_STYLES = {
  funding: "bg-primary/10 text-primary",
  growing: "bg-blue-500/10 text-blue-400",
  harvested: "bg-warning/10 text-warning",
  settled: "bg-muted/10 text-muted",
};

const RISK_STYLES = {
  A: "text-primary",
  B: "text-blue-400",
  C: "text-warning",
  D: "text-sell",
};

interface Props {
  batch: Batch;
  onQuickBuy?: (batch: Batch) => void;
}

export default function BatchCard({ batch, onQuickBuy }: Props) {
  return (
    <div className="bg-card-bg border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors group">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={batch.heroImage}
          alt={batch.strain}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[batch.status]}`}>
            {batch.status}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-background/60 backdrop-blur-sm ${RISK_STYLES[batch.riskGrade]}`}>
            Grade {batch.riskGrade}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{batch.strain}</h3>
          <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
            <MapPin size={12} /> {batch.grower} &middot; {batch.region}
          </p>
        </div>

        {/* Price + yield */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-muted">Token Price</p>
              <span className="text-[9px] font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">SPL</span>
            </div>
            <p className="text-lg font-semibold font-mono text-foreground">${batch.price.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">THC / CBD</p>
            <p className="text-sm font-mono text-foreground">{batch.thcPercent}% / {batch.cbdPercent}%</p>
          </div>
        </div>

        {/* Progress bar */}
        {batch.status === "funding" && (
          <div>
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>{batch.fundingPercent}% funded</span>
              <span>${(batch.fundingRaised / 1000).toFixed(0)}k / ${(batch.fundingTarget / 1000).toFixed(0)}k</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${batch.fundingPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Harvest date */}
        <div className="flex items-center gap-1 text-xs text-muted">
          <Clock size={12} />
          <span>Harvest: {new Date(batch.harvestDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link
            href={`/batch/${batch.id}`}
            className="flex-1 text-center text-xs font-medium py-2 rounded-lg border border-border text-foreground hover:border-primary/40 transition-colors"
          >
            View
          </Link>
          {(batch.status === "funding" || batch.status === "growing") && onQuickBuy && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickBuy(batch);
              }}
              className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
            >
              <TrendingUp size={12} />
              Quick Buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
