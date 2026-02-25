import {
  Layers,
  ShieldAlert,
  Clock,
  Wallet,
  Unplug,
} from "lucide-react";

const PROBLEMS = [
  {
    icon: Layers,
    title: "Price Fragmentation",
    description:
      "Disconnected venues and closed dealmaking create isolated price islands with no shared market truth.",
  },
  {
    icon: ShieldAlert,
    title: "Unverifiable Data",
    description:
      "Market participants rely on self-reported or opaque data with no provenance, auditability, or cross-validation.",
  },
  {
    icon: Clock,
    title: "Settlement Friction",
    description:
      "Without standardised pricing and settlement rails, trades remain manual, slow, and exposed to counterparty risk.",
  },
  {
    icon: Wallet,
    title: "Capital Inefficiency",
    description:
      "Assets without trusted pricing cannot be used as collateral, restricting borrowing and structured finance.",
  },
  {
    icon: Unplug,
    title: "Infrastructure Gap",
    description:
      "No API, no feed, no on-chain primitive — real-world markets lack the connective tissue that digital finance requires.",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
          The Macro <span className="text-primary">Problem</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROBLEMS.map((problem) => (
            <div
              key={problem.title}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <problem.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="mt-10 p-6 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed">
            Systemic risk is a product of data opacity. Without trusted,
            verifiable pricing infrastructure, markets remain fragmented,
            illiquid, and uninvestable.
          </p>
        </div>
      </div>
    </section>
  );
}
