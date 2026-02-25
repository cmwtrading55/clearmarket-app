import Footer from "@/components/Footer";
import { AlertTriangle } from "lucide-react";

export default function RiskPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle size={28} className="text-warning" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Risk Notice</h1>
        </div>
        <p className="text-xs text-muted">Last updated: 25 February 2026</p>

        <div className="bg-warning/5 border border-warning/20 rounded-xl p-5 text-sm text-foreground/80 leading-relaxed">
          <p className="font-medium text-warning mb-2">Important</p>
          <p>
            ClearMarket Labs is a prototype demonstration platform. All trades, tokens, prices, and
            transactions shown are simulated and do not involve real assets or funds.
          </p>
        </div>

        <div className="prose prose-sm prose-invert max-w-none space-y-4 text-sm text-foreground/80 leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground">General Risks</h2>
          <p>
            Tokenised commodity markets, including cannabis crop tokens, carry significant risks
            including but not limited to: market volatility, regulatory changes, crop failure,
            counterparty risk, and liquidity risk.
          </p>

          <h2 className="text-lg font-semibold text-foreground">Bonding Curve Risk</h2>
          <p>
            Bonding curve pricing means token prices change with supply. Early participants may
            benefit from lower prices but face higher liquidity risk. Late participants face higher
            prices but benefit from deeper liquidity.
          </p>

          <h2 className="text-lg font-semibold text-foreground">Agricultural Risk</h2>
          <p>
            Cannabis cultivation is subject to environmental conditions, pest infestation, regulatory
            enforcement, and other agricultural risks that may impact harvest outcomes and settlement values.
          </p>

          <h2 className="text-lg font-semibold text-foreground">Regulatory Risk</h2>
          <p>
            Cannabis markets are subject to varying and evolving regulations across jurisdictions.
            Changes in law may affect the viability of tokenised crop markets.
          </p>

          <h2 className="text-lg font-semibold text-foreground">No Guarantees</h2>
          <p>
            Past performance of settled batches does not guarantee future results. All risk grades
            and trust scores are indicative and should not be relied upon as investment advice.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
