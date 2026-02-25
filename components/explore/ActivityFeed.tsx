import { mockActivity } from "@/data/mockActivity";
import { TrendingUp, TrendingDown, Sprout, Leaf, CheckCircle } from "lucide-react";

const TYPE_CONFIG = {
  buy: { icon: TrendingUp, color: "text-buy", label: "Bought" },
  sell: { icon: TrendingDown, color: "text-sell", label: "Sold" },
  fund: { icon: Sprout, color: "text-primary", label: "Funded" },
  harvest: { icon: Leaf, color: "text-warning", label: "Harvested" },
  settle: { icon: CheckCircle, color: "text-primary", label: "Settled" },
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ActivityFeed() {
  return (
    <div className="bg-card-bg border border-border rounded-xl p-4">
      <h3 className="text-sm font-medium text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {mockActivity.slice(0, 6).map((event) => {
          const config = TYPE_CONFIG[event.type];
          const Icon = config.icon;
          return (
            <div key={event.id} className="flex items-start gap-3">
              <div className={`mt-0.5 ${config.color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground truncate">
                  <span className="text-muted">{event.user}</span>{" "}
                  <span className={config.color}>{config.label.toLowerCase()}</span>{" "}
                  {event.amount > 0 && (
                    <span className="font-mono">
                      {event.amount.toLocaleString()} tokens
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted">{event.strain} &middot; {timeAgo(event.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
