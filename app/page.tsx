import Link from "next/link";
import Footer from "@/components/Footer";
import { Sprout, DollarSign, TrendingUp, Users, Wheat, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    icon: Sprout,
    title: "Browse Crop Listings",
    description:
      "Explore verified crop listings from growers across multiple commodity markets, each scored by our on-chain oracle.",
  },
  {
    icon: DollarSign,
    title: "Fund with USDC",
    description:
      "Back the crops you believe in by funding directly with USDC on Solana. Every investment is tokenised as an SPL token.",
  },
  {
    icon: TrendingUp,
    title: "Earn Returns at Harvest",
    description:
      "When the crop is harvested and settled, returns are distributed proportionally to token holders via smart contract.",
  },
];

const STATS = [
  { label: "Total Funded", value: "$0", note: "USDC" },
  { label: "Active Listings", value: "0", note: "Crops" },
  { label: "Growers", value: "0", note: "Verified" },
  { label: "Avg. Return", value: "0%", note: "Historical" },
];

export default function FundingLandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
            <ShieldCheck size={14} />
            Built on Solana
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Fund Real Crops.
            <br />
            Earn Real Returns.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            ClearMarket connects investors directly with verified growers.
            Fund crop production with USDC on Solana, earn returns when
            harvests settle, all scored by our transparent on-chain oracle.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/launchpad"
              className="flex items-center gap-2 text-sm font-semibold px-8 py-3.5 rounded-xl bg-primary text-background hover:bg-primary/90 transition-colors"
            >
              <Wheat size={18} />
              Browse Crop Listings
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
            From listing to harvest, every step is transparent and verified on-chain.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="bg-card-bg border border-border rounded-2xl p-6 text-center"
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

      {/* CTA */}
      <section className="border-t border-border bg-card-bg/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Ready to fund your first crop?
          </h2>
          <p className="text-sm text-muted mt-3 max-w-md mx-auto">
            Connect your Solana wallet, browse verified listings on the launchpad,
            and start earning real-world agricultural returns.
          </p>
          <Link
            href="/launchpad"
            className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-3.5 rounded-xl bg-primary text-background hover:bg-primary/90 transition-colors mt-8"
          >
            Go to Launchpad
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
