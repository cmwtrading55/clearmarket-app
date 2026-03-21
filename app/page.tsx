import Link from "next/link";
import Footer from "@/components/Footer";
import {
  Leaf,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Zap,
  Lock,
  Users,
  BarChart3,
  Eye,
  Globe,
  Star,
  ArrowRight,
  Check,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const HERO_STATS = [
  { value: "$0", label: "Total Funded", suffix: "USDC" },
  { value: "3", label: "Active Grows", suffix: "Live" },
  { value: "3", label: "Verified Growers", suffix: "On-chain" },
  { value: "99.9%", label: "Uptime", suffix: "Oracle" },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "Real-Time Oracle Scoring",
    description:
      "Live completeness and risk scoring for every cannabis listing. Data-driven investor discounts updated on every field change.",
    color: "text-primary",
  },
  {
    icon: Lock,
    title: "USDC Escrow on Solana",
    description:
      "Capital held in smart contract escrow, released at verified milestones. No intermediaries, no counterparty risk.",
    color: "text-teal",
  },
  {
    icon: ShieldCheck,
    title: "Grower Verification",
    description:
      "Every grower is wallet-verified with on-chain history scoring. Past performance directly reduces investor discount rates.",
    color: "text-buy",
  },
  {
    icon: Zap,
    title: "Sub-Second Settlement",
    description:
      "Solana-native SPL token issuance and transfers. Fund grows and receive tokens in under a second.",
    color: "text-primary",
  },
  {
    icon: Eye,
    title: "Transparent Pricing",
    description:
      "Oracle discount algorithm is fully visible. Completeness, buyer contracts, and track record, all on-chain.",
    color: "text-teal",
  },
  {
    icon: Globe,
    title: "Global Cannabis Markets",
    description:
      "Fund verified grows across jurisdictions. California, Oregon, Switzerland, and more, all from one launchpad.",
    color: "text-buy",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Finally, a way to get exposure to cannabis without touching the plant. The oracle scoring gives us confidence in every allocation.",
    name: "Alex Rivera",
    role: "DeFi Portfolio Manager",
    company: "Canopy Capital",
  },
  {
    quote:
      "The escrow model is what sold us. Capital is locked until milestones hit, and the grower verification is rigorous. This is how agricultural DeFi should work.",
    name: "Jordan Lee",
    role: "Head of Alternatives",
    company: "Verdant Ventures",
  },
  {
    quote:
      "We listed our first grow and had it fully funded in 48 hours. The oracle discount incentivised us to provide maximum data transparency.",
    name: "Maria Santos",
    role: "Lead Cultivator",
    company: "Pacific Growers Co-op",
  },
];

const TRUST_LOGOS = ["Solana", "Helius", "USDC", "Phantom", "Supabase"];

const CTA_BENEFITS = [
  "No credit card required",
  "Full oracle transparency",
  "USDC-only funding",
  "Withdraw anytime",
];

const FOOTER_STATS = [
  { value: "$0", label: "Total Value in Escrow" },
  { value: "3", label: "Active Growers" },
  { value: "99.9%", label: "Oracle Uptime" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* ============================================================ */}
      {/* HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Leaf size={14} />
              Cannabis DeFi on Solana
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            <span className="text-foreground">A New Oracle for</span>
            <br />
            <span className="text-gradient">Cannabis</span>
            <br />
            <span className="text-foreground">Commodities</span>
          </h1>

          {/* Subhead */}
          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto text-center leading-relaxed">
            Real-time oracle scoring, decentralised escrow, and transparent
            investor discounts for verified cannabis grows. Powered by Solana.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/launchpad"
              className="flex items-center gap-2 text-sm font-semibold px-8 py-3.5 rounded-xl bg-buy text-background hover:bg-buy/90 transition-colors"
            >
              Browse Grows
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/growers"
              className="flex items-center gap-2 text-sm font-medium px-8 py-3.5 rounded-xl border border-border text-foreground hover:border-primary/40 transition-colors"
            >
              View Growers
            </Link>
          </div>

          {/* Hero visual — oracle terminal preview */}
          <div className="mt-16 relative rounded-2xl overflow-hidden border border-border bg-card-bg">
            <div className="aspect-[16/7] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-teal/5" />
              <div className="relative text-center px-8">
                <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">
                  ClearMarket Oracle v1
                </p>
                <p className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
                  <span className="text-buy">6.0%</span>
                  <span className="text-muted mx-3">/</span>
                  <span className="text-primary">Grade A</span>
                  <span className="text-muted mx-3">/</span>
                  <span className="text-teal">95% Complete</span>
                </p>
                <p className="text-sm text-muted mt-2">
                  Blue Dream, Green Valley Farms, Northern California
                </p>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-card-bg/60 border border-border rounded-xl px-4 py-4 text-center"
              >
                <p className="text-2xl sm:text-3xl font-bold font-mono text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURES                                                     */}
      {/* ============================================================ */}
      <section className="border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest text-primary mb-3">
              Platform Features
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Built for the Future of
              <br />
              Cannabis Finance
            </h2>
            <p className="text-lg text-muted mt-4 max-w-2xl mx-auto">
              Everything you need to fund cannabis grows with confidence.
              Oracle-scored, escrow-protected, settled on Solana.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-card-bg border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4 ${feature.color}`}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MARKET INTELLIGENCE                                          */}
      {/* ============================================================ */}
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Text side */}
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-widest text-teal mb-3">
                Live Oracle Intelligence
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Market Intelligence
                <br />
                at Your Fingertips
              </h2>
              <p className="text-lg text-muted mt-4 max-w-lg">
                Every cannabis listing is scored in real-time. Completeness,
                buyer contracts, and grower history feed a transparent oracle
                that calculates fair investor discounts.
              </p>

              <div className="flex gap-6 mt-8">
                <div>
                  <p className="text-2xl font-bold font-mono text-foreground">
                    19
                  </p>
                  <p className="text-xs text-muted">Scoring Fields</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-teal">
                    &lt;1s
                  </p>
                  <p className="text-xs text-muted">Score Latency</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-foreground">
                    24/7
                  </p>
                  <p className="text-xs text-muted">Monitoring</p>
                </div>
              </div>
            </div>

            {/* Visual — oracle score card */}
            <div className="flex-1 w-full">
              <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    Oracle Score Breakdown
                  </p>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-buy/10 text-buy">
                    Live
                  </span>
                </div>

                {[
                  { label: "Completeness", value: 95, color: "bg-primary" },
                  { label: "Buyer Bonus", value: 25, color: "bg-teal" },
                  { label: "Track Record", value: 60, color: "bg-buy" },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">{bar.label}</span>
                      <span className="text-foreground font-mono">
                        {bar.value}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bar.color} rounded-full`}
                        style={{ width: `${bar.value}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted">Composite Score</p>
                    <p className="text-2xl font-bold font-mono text-foreground">
                      78.0
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted">Oracle Discount</p>
                    <p className="text-2xl font-bold font-mono text-buy">
                      12.7%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-buy/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-buy">A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TESTIMONIALS                                                 */}
      {/* ============================================================ */}
      <section className="border-y border-border bg-card-bg/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest text-primary mb-3">
              Trusted by Industry Leaders
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-card-bg border border-border rounded-2xl p-6 flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-warning fill-warning"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted">{t.role}</p>
                  <p className="text-xs text-primary">{t.company}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-8">
            <p className="text-xs text-muted uppercase tracking-widest w-full text-center mb-2">
              Powered By
            </p>
            {TRUST_LOGOS.map((name) => (
              <span
                key={name}
                className="text-sm font-medium text-muted/60 hover:text-foreground transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA                                                          */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-50" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-teal mb-3">
            Get Started
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Ready to Fund
            <br />
            Your First Grow?
          </h2>
          <p className="text-lg text-muted mt-4 max-w-lg mx-auto">
            Connect your Solana wallet and start funding verified cannabis grows
            with USDC. No sign-ups, no gatekeepers, just oracle-scored
            agriculture.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {CTA_BENEFITS.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-muted border border-border"
              >
                <Check size={12} className="text-buy" />
                {b}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/launchpad"
              className="flex items-center gap-2 text-sm font-semibold px-8 py-3.5 rounded-xl bg-buy text-background hover:bg-buy/90 transition-colors"
            >
              Browse the Launchpad
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/launchpad/submit"
              className="flex items-center gap-2 text-sm font-medium px-8 py-3.5 rounded-xl border border-border text-foreground hover:border-teal/40 transition-colors"
            >
              List a Grow
            </Link>
          </div>

          <p className="text-xs text-muted mt-6">
            Your wallet is your membership. Connect and go.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER STATS                                                 */}
      {/* ============================================================ */}
      <section className="border-t border-border bg-card-bg/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-3 gap-4">
            {FOOTER_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
