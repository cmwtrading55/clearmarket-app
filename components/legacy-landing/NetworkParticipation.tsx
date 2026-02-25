import { Coins, LineChart } from "lucide-react";
import LottieAnimation from "../LottieAnimation";

export default function NetworkParticipation() {
  return (
    <section className="py-20 bg-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-sm font-medium text-primary tracking-wide uppercase mb-4">
          Investment
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Invest in the Frontier
        </h2>
        <p className="text-muted text-lg mb-12 max-w-3xl">
          $CML is the native coordination and settlement asset of the exchange.
          It accrues value from total exchange activity across all listed
          markets.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Network Participation Rights */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <Coins className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Network Participation Rights
            </h3>
            <ul className="space-y-2">
              {[
                "Market participation and fee settlement",
                "Governance voting",
                "Staking to underwrite oracle correctness",
                "Priority access to new market launches",
                "Enhanced fee discounts",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-sm text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Economic Alignment + Working Capital chart */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <LineChart className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Economic Alignment Framework
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-2xl font-bold font-mono text-primary">
                  $0.339
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Private Sale Price
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">
                  $0.565
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Public Launch Price
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">
                  200M
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Total Supply (fixed)
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-primary">
                  $12.8M
                </p>
                <p className="text-xs text-muted mt-0.5">Raise Target</p>
              </div>
            </div>
            <LottieAnimation
              src="/lottie/Graph_04.json"
              className="w-full rounded-lg bg-surface border border-border p-2"
            />
          </div>
        </div>

        {/* Institutional positioning */}
        <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Institutional Positioning
          </h4>
          <p className="text-sm text-muted leading-relaxed">
            40% discount to public launch price. 40M tokens allocated to
            pre-sale. Contact{" "}
            <a
              href="mailto:cedric@clearmarketlabs.io"
              className="text-primary hover:underline"
            >
              cedric@clearmarketlabs.io
            </a>{" "}
            for private sale access and SAFT documentation.
          </p>
        </div>
      </div>
    </section>
  );
}
