import {
  Activity,
  Landmark,
  FileText,
  AlertTriangle,
  Fingerprint,
  Code2,
} from "lucide-react";

const STACK = [
  {
    icon: Activity,
    title: "Spot Price Oracle",
    description:
      "Bayesian aggregation engine producing institutional-grade reference prices with confidence bands and anomaly detection.",
  },
  {
    icon: Landmark,
    title: "Market Reference Standards",
    description:
      "Canonical benchmarks for settlement, collateral valuation, and regulatory reporting across fragmented markets.",
  },
  {
    icon: FileText,
    title: "Forward Contract Primitives",
    description:
      "Pre-production output priced on bonding curves. Buyers hedge future supply; producers receive early liquidity.",
  },
  {
    icon: AlertTriangle,
    title: "Risk & Volatility Signals",
    description:
      "Real-time volatility indices, supply disruption alerts, and risk scoring for portfolio and lending decisions.",
  },
  {
    icon: Fingerprint,
    title: "Data Provenance Layer",
    description:
      "Every data point scored by source reliability, recency, and verifiability — full audit trail for compliance.",
  },
  {
    icon: Code2,
    title: "API & Onchain Feeds",
    description:
      "Production-grade REST and WebSocket APIs alongside on-chain oracle contracts for DeFi and institutional integration.",
  },
];

export default function StackSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          The ClearMarket Stack
        </h2>
        <p className="text-muted text-lg mb-12 max-w-3xl">
          Modular infrastructure for price discovery, settlement, and risk
          management — built for markets that lack financial plumbing.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STACK.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
            >
              <item.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
