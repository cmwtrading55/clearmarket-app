import { TrendingUp, Globe, Shield } from "lucide-react";
import LottieAnimation from "../LottieAnimation";

export default function StrategicFocus() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Strategic Market Focus
        </h2>
        <p className="text-muted text-lg mb-12 max-w-3xl">
          Proving architecture in hostile data markets — if it works for
          cannabis, it works for everything.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Cannabis stats */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Why Cannabis First
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Cannabis is our proving ground. Legal in over 50 countries yet
              structurally unbanked with no reliable price discovery. If a
              pricing oracle can bring institutional clarity to the most
              fragmented commodity on earth, it can be applied to any real-world
              asset class.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-surface border border-border">
                <p className="text-2xl font-bold font-mono text-primary">
                  $500B+
                </p>
                <p className="text-xs text-muted mt-1">Total Addressable Market</p>
              </div>
              <div className="p-4 rounded-lg bg-surface border border-border">
                <p className="text-2xl font-bold font-mono text-buy">
                  +14.2%
                </p>
                <p className="text-xs text-muted mt-1">CAGR Growth</p>
              </div>
              <div className="p-4 rounded-lg bg-surface border border-border col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    Legal in 50+ Countries
                  </p>
                </div>
                <p className="text-xs text-muted">
                  Yet producers remain excluded from hedging, insurance and
                  structured finance
                </p>
              </div>
            </div>
          </div>

          {/* Infrastructure hardening + chart */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-card border border-border overflow-hidden flex-1">
              <LottieAnimation
                src="/lottie/Graph_02.json"
                className="w-full"
              />
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Infrastructure Hardening
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Cannabis hardens our oracle under real-world stress — extreme
                data fragmentation, regulatory complexity, and cross-border
                supply chains. Then we expand to energy, synthetics, and defence
                futures.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
              <Shield className="w-6 h-6 text-primary mb-3" />
              <p className="text-sm text-foreground font-medium">
                Proving ground for infrastructure
              </p>
              <p className="text-xs text-muted mt-1">
                Built for regulated reality
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
