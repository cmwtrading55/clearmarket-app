import { mockBatches } from "@/data/mockBatches";

const stats = [
  {
    label: "Total Volume",
    value: `$${(mockBatches.reduce((sum, b) => sum + b.fundingRaised, 0) / 1000000).toFixed(1)}M`,
  },
  {
    label: "Active Batches",
    value: mockBatches.filter((b) => b.status !== "settled").length.toString(),
  },
  {
    label: "Growers",
    value: new Set(mockBatches.map((b) => b.growerId)).size.toString(),
  },
  {
    label: "Avg Price",
    value: `$${(mockBatches.reduce((sum, b) => sum + b.price, 0) / mockBatches.length).toFixed(2)}`,
  },
];

export default function MarketStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card-bg border border-border rounded-xl p-4"
        >
          <p className="text-xs text-muted mb-1">{stat.label}</p>
          <p className="text-xl font-semibold text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
