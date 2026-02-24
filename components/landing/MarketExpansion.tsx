const PHASES = [
  {
    phase: "Phase 1",
    status: "Active",
    statusColor: "bg-primary",
    title: "Cannabis Pricing & Settlement",
    description:
      "Bayesian spot oracle, forward contract primitives, and institutional settlement rails for the $500B+ global cannabis market.",
  },
  {
    phase: "Phase 2",
    status: "Planning",
    statusColor: "bg-warning",
    title: "Digital Energy Index Market",
    description:
      "Extending the oracle stack to renewable energy certificates, carbon credits, and distributed energy pricing across fragmented grids.",
  },
  {
    phase: "Phase 3",
    status: "Future",
    statusColor: "bg-muted",
    title: "Synthetic Data Pricing & Defence Futures",
    description:
      "Pricing infrastructure for synthetic and derived data assets, strategic materials, and defence-adjacent futures markets.",
  },
];

export default function MarketExpansion() {
  return (
    <section className="py-20 bg-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Market Expansion
        </h2>
        <p className="text-muted text-lg mb-12 max-w-3xl">
          Each phase compounds $CML token utility across every listed market.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {PHASES.map((p) => (
            <div
              key={p.phase}
              className="p-6 rounded-xl bg-card border border-border relative overflow-hidden"
            >
              {/* Active indicator */}
              {p.status === "Active" && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
              )}

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-muted">{p.phase}</span>
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${p.statusColor} ${
                      p.status === "Active" ? "animate-pulse" : ""
                    }`}
                  />
                  <span className="text-xs text-muted">{p.status}</span>
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {p.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
