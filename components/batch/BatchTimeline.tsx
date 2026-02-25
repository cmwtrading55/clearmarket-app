import type { Batch } from "@/lib/types";
import { CheckCircle, Circle, Loader } from "lucide-react";

const STAGES = [
  { key: "funding", label: "Funding" },
  { key: "growing", label: "Growing" },
  { key: "harvested", label: "Harvested" },
  { key: "settled", label: "Settled" },
] as const;

const STATUS_ORDER = { funding: 0, growing: 1, harvested: 2, settled: 3 };

export default function BatchTimeline({ batch }: { batch: Batch }) {
  const currentIdx = STATUS_ORDER[batch.status];

  return (
    <div className="bg-card-bg border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Batch Progress</h3>
      <div className="space-y-4">
        {STAGES.map((stage, idx) => {
          const isComplete = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isFuture = idx > currentIdx;

          return (
            <div key={stage.key} className="flex items-start gap-3">
              <div className="relative flex flex-col items-center">
                {isComplete && <CheckCircle size={18} className="text-primary" />}
                {isCurrent && <Loader size={18} className="text-primary animate-spin" />}
                {isFuture && <Circle size={18} className="text-muted/30" />}
                {idx < STAGES.length - 1 && (
                  <div className={`w-px h-6 mt-1 ${isComplete ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${isCurrent ? "text-primary" : isComplete ? "text-foreground" : "text-muted/50"}`}>
                  {stage.label}
                </p>
                {isCurrent && (
                  <p className="text-xs text-muted mt-0.5">In progress</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Description */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-xs text-muted mb-2">About this batch</h4>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {batch.description}
        </p>
      </div>
    </div>
  );
}
