import type { Batch } from "@/lib/types";
import { DollarSign, Scale, Leaf, TrendingUp } from "lucide-react";

export default function BatchEconomics({ batch }: { batch: Batch }) {
  const tokenSupply = Math.floor(batch.fundingTarget / batch.price);
  const marketCap = tokenSupply * batch.price;

  const cards = [
    {
      icon: DollarSign,
      label: "Funding Target",
      value: `$${(batch.fundingTarget / 1000).toFixed(0)}k`,
      sub: `${batch.fundingPercent}% funded`,
    },
    {
      icon: TrendingUp,
      label: "Market Cap",
      value: `$${(marketCap / 1000).toFixed(0)}k`,
      sub: `${tokenSupply.toLocaleString()} tokens`,
    },
    {
      icon: Leaf,
      label: "Expected Yield",
      value: `${batch.yieldKg} kg`,
      sub: `THC ${batch.thcPercent}% / CBD ${batch.cbdPercent}%`,
    },
    {
      icon: Scale,
      label: "Risk Grade",
      value: batch.riskGrade,
      sub: batch.riskGrade === "A" ? "Low risk" : batch.riskGrade === "B" ? "Medium risk" : "Higher risk",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="bg-card-bg border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className="text-primary" />
              <span className="text-xs text-muted">{card.label}</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{card.value}</p>
            <p className="text-xs text-muted mt-0.5">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
