import Link from "next/link";
import Footer from "@/components/Footer";
import VideoBackground from "@/components/VideoBackground";
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
  Terminal,
  Activity,
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
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ============================================================ */}
      {/* 1. HERO — Cinematic Intro                                    */}
      {/* ============================================================ */}
      <VideoBackground 
        src="/video/hero-background.mp4" 
        overlayOpacity={0.85}
        className="min-h-[90vh] flex items-center"
      >
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          {/* Badge */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(152,16,250,0.3)] animate-pulse">
              <Leaf size={14} />
              The New Oracle for Cannabis
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-10">
            <span className="text-foreground">Back the</span>
            <br />
            <span className="text-gradient">Plant.</span>
            <br />
            <span className="text-foreground">Bank the Return.</span>
          </h1>

          {/* Subhead */}
          <p className="mt-8 text-lg sm:text-2xl text-muted/80 max-w-3xl mx-auto text-center leading-relaxed font-medium">
            Real-time oracle scoring, decentralised escrow, and transparent
            investor discounts for verified cannabis grows.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/launchpad"
              className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest px-10 py-5 rounded-2xl bg-buy text-background hover:bg-buy/90 transition-all shadow-[0_0_30px_rgba(5,223,114,0.4)] hover:shadow-[0_0_50px_rgba(5,223,114,0.6)] hover:-translate-y-1"
            >
              Browse Grows
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/growers"
              className="flex items-center gap-3 text-sm font-black uppercase tracking-widest px-10 py-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-foreground hover:bg-white/10 hover:border-primary/40 transition-all hover:-translate-y-1"
            >
              View Growers
            </Link>
          </div>
        </div>
      </VideoBackground>

      {/* ============================================================ */}
      {/* 2. ORACLE TERMINAL PREVIEW — High-Tech Readout               */}
      {/* ============================================================ */}
      <section className="relative z-20 -mt-24 px-4 sm:px-6 mb-24">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[40px] overflow-hidden border border-white/10 bg-card-bg shadow-2xl group">
            {/* Background Video for Terminal */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src="/video/data-terminal.mp4" type="video/mp4" />
              </video>
            </div>
            
            <div className="relative aspect-[16/8] sm:aspect-[16/6] flex flex-col items-center justify-center p-8 sm:p-12 text-center backdrop-blur-3xl">
              <div className="absolute top-6 left-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-buy animate-ping" />
                <p className="text-[10px] font-black font-mono text-buy uppercase tracking-widest">
                  Live Network Feed
                </p>
              </div>
              
              <div className="space-y-6">
                <p className="text-xs font-mono text-muted uppercase tracking-[0.4em] mb-4">
                  ClearMarket Oracle v1.0.4
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-10">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-muted uppercase mb-1">Discount</span>
                    <span className="text-4xl sm:text-6xl font-black font-mono text-buy">6.0%</span>
                  </div>
                  <div className="h-12 w-px bg-white/10 hidden sm:block" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-muted uppercase mb-1">Risk Grade</span>
                    <span className="text-4xl sm:text-6xl font-black font-mono text-primary">A+</span>
                  </div>
                  <div className="h-12 w-px bg-white/10 hidden sm:block" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-muted uppercase mb-1">Integrity</span>
                    <span className="text-4xl sm:text-6xl font-black font-mono text-teal">95%</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5 inline-block">
                  <p className="text-sm sm:text-base text-muted font-bold tracking-tight">
                    <span className="text-foreground">Listing #842:</span> OG Kush &middot; Green Valley Farms &middot; Northern California
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. STATS BAR — Glass Cards                                   */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {HERO_STATS.map((stat) => (
            <div
              key={stat.label}
              className="group bg-white/2 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 text-center hover:border-primary/30 transition-all hover:-translate-y-1 shadow-xl"
            >
              <p className="text-3xl sm:text-4xl font-black font-mono text-foreground mb-2 group-hover:text-primary transition-colors">
                {stat.value}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">{stat.label}</p>
              <div className="h-1 w-4 bg-primary/20 mx-auto mt-4 rounded-full transition-all group-hover:w-12 group-hover:bg-primary" />
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FEATURES — The DeFi Edge                                  */}
      {/* ============================================================ */}
      <section className="relative py-32 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-primary mb-6">
              <Zap size={14} className="fill-primary" />
              Platform Infrastructure
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter leading-none mb-8">
              Built for the Future of
              <br />
              <span className="text-gradient">Cannabis Finance.</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto font-medium">
              A high-integrity bridge between institutional capital and 
              premium agricultural production.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative bg-card-bg/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-10 hover:border-primary/30 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-secondary border border-white/5 flex items-center justify-center mb-8 shadow-inner ${feature.color}`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-muted leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. MARKET INTELLIGENCE — Live Proof                          */}
      {/* ============================================================ */}
      <section className="py-32 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            {/* Text side */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-teal mb-6">
                <Activity size={14} />
                Live Oracle Intelligence
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter leading-[0.95] mb-8">
                Intelligence<br />at Your<br />Fingertips.
              </h2>
              <p className="text-xl text-muted font-medium leading-relaxed max-w-lg mb-10">
                Every listing is scored in real-time. Completeness,
                buyer contracts, and grower history feed a transparent oracle.
              </p>

              <div className="grid grid-cols-3 gap-8 p-8 rounded-3xl bg-white/2 border border-white/5 backdrop-blur-sm">
                <div>
                  <p className="text-3xl font-black font-mono text-foreground mb-1">19</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted">Fields</p>
                </div>
                <div>
                  <p className="text-3xl font-black font-mono text-teal mb-1">&lt;1s</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted">Latency</p>
                </div>
                <div>
                  <p className="text-3xl font-black font-mono text-foreground mb-1">24/7</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted">Audit</p>
                </div>
              </div>
            </div>

            {/* Visual — Verification Video Slot */}
            <div className="flex-1 w-full relative">
              <div className="relative rounded-[48px] overflow-hidden border border-white/10 shadow-2xl">
                <video autoPlay loop muted playsInline className="w-full aspect-square object-cover">
                  <source src="/video/grower-verification.mp4" type="video/mp4" />
                </video>
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-10 flex flex-col justify-end">
                  <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black uppercase tracking-widest text-foreground">Scan Status</p>
                      <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-buy/20 text-buy border border-buy/20">VERIFIED</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Crystalline Structure", value: 98, color: "bg-primary" },
                        { label: "Data Integrity", value: 92, color: "bg-teal" },
                      ].map((bar) => (
                        <div key={bar.label}>
                          <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                            <span className="text-muted">{bar.label}</span>
                            <span className="text-foreground">{bar.value}%</span>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className={`h-full ${bar.color} rounded-full shadow-[0_0_10px_rgba(152,16,250,0.5)]`} style={{ width: `${bar.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. TESTIMONIALS — Industry Proof                             */}
      {/* ============================================================ */}
      <section className="py-32 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-24">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-primary mb-6">
              Industry Validation
            </p>
            <h2 className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter">
              The Standard for <span className="text-teal">Agri-DeFi.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-card-bg/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-10 flex flex-col hover:border-primary/20 transition-all duration-500 shadow-xl"
              >
                <div className="flex gap-1.5 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-primary fill-primary"
                    />
                  ))}
                </div>
                <p className="text-lg text-muted font-medium leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-10 pt-8 border-t border-white/5">
                  <p className="text-lg font-black text-foreground tracking-tight">
                    {t.name}
                  </p>
                  <p className="text-xs font-black uppercase tracking-widest text-muted mt-1">{t.role}</p>
                  <p className="text-xs font-black text-primary mt-1">{t.company}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 pt-16 border-t border-white/5 flex flex-wrap items-center justify-center gap-12 sm:gap-20">
            {TRUST_LOGOS.map((name) => (
              <span
                key={name}
                className="text-xs font-black uppercase tracking-[0.4em] text-muted/40 hover:text-primary transition-all cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. CTA — Final Conversion                                    */}
      {/* ============================================================ */}
      <VideoBackground 
        src="/video/growth-yield.mp4" 
        overlayOpacity={0.9}
        className="py-32"
      >
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-teal mb-10">
            <Terminal size={14} />
            Wallet Authentication Required
          </div>
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-foreground tracking-tighter leading-none mb-10">
            Start Your<br /><span className="text-gradient">Digital Harvest.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-muted max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            Connect your Solana wallet and fund verified cannabis grows
            with USDC. No gatekeepers, just oracle-scored agriculture.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            {CTA_BENEFITS.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full bg-white/5 text-foreground border border-white/10 backdrop-blur-xl"
              >
                <Check size={14} className="text-buy" />
                {b}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/launchpad"
              className="group w-full sm:w-auto flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest px-12 py-6 rounded-[24px] bg-buy text-background hover:bg-buy/90 transition-all shadow-[0_0_40px_rgba(5,223,114,0.4)]"
            >
              Enter Launchpad
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/launchpad/submit"
              className="w-full sm:w-auto flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest px-12 py-6 rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-xl text-foreground hover:bg-white/10 transition-all"
            >
              List a Grow
            </Link>
          </div>
        </div>
      </VideoBackground>

      {/* ============================================================ */}
      {/* FOOTER STATS                                                 */}
      {/* ============================================================ */}
      <section className="border-t border-white/5 bg-background relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
            {FOOTER_STATS.map((stat) => (
              <div key={stat.label} className="text-center group">
                <p className="text-3xl sm:text-4xl font-black font-mono text-foreground group-hover:text-teal transition-colors">
                  {stat.value}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
