import { Brain, Scale, BarChart3, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Brain,
    number: "01",
    title: "Bayesian Aggregation",
    description:
      "Multi-source price signals combined with prior beliefs, continuously updated as new data arrives.",
  },
  {
    icon: Scale,
    number: "02",
    title: "Provenance Weighting",
    description:
      "Every data point is scored by source reliability, recency, and verifiability before inclusion.",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Confidence Bands",
    description:
      "Published prices carry explicit confidence intervals and anomaly flags for institutional consumption.",
  },
];

const FEATURES = [
  "Forward supply expectations and dynamic confidence bands",
  "Continuous validation against historical baselines",
  "Anomaly detection and public data cross-referencing",
  "Multi-source production-grade feeds",
];

export default function SolutionSection() {
  return (
    <section id="solution" className="py-20 bg-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          A Bayesian oracle for{" "}
          <span className="text-primary">real-world</span> markets
        </h2>
        <p className="text-muted text-lg mb-12 max-w-3xl">
          Our core innovation is a Bayesian oracle architecture that makes
          pricing predictive, explainable and defensible.
        </p>

        {/* Flow steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="p-6 rounded-xl bg-card border border-border h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-primary/60">
                    {step.number}
                  </span>
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/30 z-10" />
              )}
            </div>
          ))}
        </div>

        {/* Feature bullets */}
        <div className="grid sm:grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-sm text-muted">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
