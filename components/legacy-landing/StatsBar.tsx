const STATS = [
  { value: "$2.18/g", label: "Beta Spot Feed" },
  { value: "99.2%", label: "Bayesian Confidence" },
  { value: "250+", label: "Oracle Feeds Q3" },
  { value: "800K+", label: "Throughput TPS" },
  { value: "98.4%", label: "Network Agreement" },
];

export default function StatsBar() {
  return (
    <section className="border-y border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold font-mono text-primary">
                {stat.value}
              </p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
