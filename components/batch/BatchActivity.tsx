import { mockActivity } from "@/data/mockActivity";
import { TrendingUp, TrendingDown, Sprout } from "lucide-react";

const TYPE_CONFIG = {
  buy: { icon: TrendingUp, color: "text-buy", label: "Bought" },
  sell: { icon: TrendingDown, color: "text-sell", label: "Sold" },
  fund: { icon: Sprout, color: "text-primary", label: "Funded" },
  harvest: { icon: TrendingUp, color: "text-warning", label: "Harvested" },
  settle: { icon: TrendingUp, color: "text-primary", label: "Settled" },
};

export default function BatchActivity({ batchId }: { batchId: string }) {
  const events = mockActivity.filter((e) => e.batchId === batchId);

  if (events.length === 0) {
    return (
      <div className="bg-card-bg border border-border rounded-xl p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">Activity</h3>
        <p className="text-xs text-muted">No activity yet for this batch.</p>
      </div>
    );
  }

  return (
    <div className="bg-card-bg border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-3">Activity</h3>
      <div className="space-y-3">
        {events.map((event) => {
          const config = TYPE_CONFIG[event.type];
          const Icon = config.icon;
          return (
            <div key={event.id} className="flex items-center gap-3">
              <Icon size={14} className={config.color} />
              <div className="flex-1">
                <p className="text-xs text-foreground">
                  {event.user}{" "}
                  <span className={config.color}>{config.label.toLowerCase()}</span>{" "}
                  {event.amount > 0 && (
                    <span className="font-mono">{event.amount.toLocaleString()} tokens</span>
                  )}
                </p>
              </div>
              {event.amount > 0 && (
                <span className="text-xs font-mono text-muted">
                  ${(event.amount * event.price).toLocaleString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
