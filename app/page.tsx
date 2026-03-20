import Link from "next/link";
import Footer from "@/components/Footer";
import { Leaf, DollarSign, TrendingUp, ShieldCheck, Zap, Lock, Users } from "lucide-react";

const STEPS = [
  {
    icon: Leaf,
    title: "Pick a Grow",
    description:
      "Browse verified cannabis grows scored by our on-chain oracle. Every listing is transparent, graded, and real.",
  },
  {
    icon: DollarSign,
    title: "Fund with USDC",
    description:
      "Back growers directly with USDC on Solana. Your capital is held in escrow and released at verified milestones.",
  },
  {
    icon: TrendingUp,
    title: "Harvest Returns",
    description:
      "When the crop settles, returns flow back to token holders proportionally. No middlemen, no delays.",
  },
];

const STATS = [
  { label: "Total Funded", value: "$0", note: "USDC" },
  { label: "Active Grows", value: "0", note: "Live" },
  { label: "Growers", value: "0", note: "Verified" },
  { label: "Avg. Return", value: "0%", note: "Historical" },
];

const TRUST = [
  { icon: Zap, label: "Built on Solana" },
  { icon: Lock, label: "USDC Escrow" },
  { icon: ShieldCheck, label: "Milestone-Verified" },
  { icon: Users, label: "Real Growers" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8">
            <Leaf size={14} />
            Cannabis DeFi on Solana
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Back the Plant.
            <br />
            <span className="text-gradient">Bank the Return.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            ClearMarket connects capital with verified cannabis growers.
            Fund real grows with USDC, scored by our transparent oracle,
            settled on Solana.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/launchpad"
              className="flex items-center gap-2 text-sm font-semibold px-8 py-3.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Leaf size={18} />
              Browse Grows
            </Link>
            <Link
              href="/growers"
              className="flex items-center gap-2 text-sm font-medium px-8 py-3.5 rounded-xl border border-border text-foreground hover:border-primary/40 transition-colors"
            >
              <Users size={18} />
              View Growers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card-bg/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted mt-1">{stat.label}</p>
                <p className="text-xs text-muted/60 mt-0.5">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-sm text-muted mt-2 max-w-lg mx-auto">
            Three steps from capital to cannabis. Every one verified on-chain.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="bg-card-bg border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <p className="text-xs font-mono text-muted mb-2">
                  Step {i + 1}
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-y border-border bg-card-bg/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {TRUST.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Your wallet is your membership.
        </h2>
        <p className="text-sm text-muted mt-3 max-w-md mx-auto">
          Connect a Solana wallet, browse verified grows, and start
          funding cannabis with USDC. No sign-ups, no gatekeepers.
        </p>
        <Link
          href="/launchpad"
          className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-3.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors mt-8"
        >
          Go to Launchpad
        </Link>
      </section>

      <Footer />
    </main>
  );
}
