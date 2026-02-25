import { MapPin, Calendar, Shield } from "lucide-react";
import type { Batch } from "@/lib/types";

const STATUS_STYLES = {
  funding: "bg-primary/10 text-primary",
  growing: "bg-blue-500/10 text-blue-400",
  harvested: "bg-warning/10 text-warning",
  settled: "bg-muted/10 text-muted",
};

const RISK_STYLES = {
  A: "bg-primary/10 text-primary",
  B: "bg-blue-500/10 text-blue-400",
  C: "bg-warning/10 text-warning",
  D: "bg-sell/10 text-sell",
};

export default function BatchHero({ batch }: { batch: Batch }) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <img
        src={batch.heroImage}
        alt={batch.strain}
        className="w-full h-48 sm:h-64 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_STYLES[batch.status]}`}>
            {batch.status}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${RISK_STYLES[batch.riskGrade]}`}>
            <Shield size={12} className="inline mr-1" />
            Risk Grade {batch.riskGrade}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{batch.strain}</h1>
        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted">
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {batch.grower} &middot; {batch.region}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> Harvest {new Date(batch.harvestDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  );
}
