import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="text-xs text-muted">Last updated: 20 March 2026</p>

        <div className="prose prose-sm prose-invert max-w-none space-y-4 text-sm text-foreground/80 leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ClearMarket Labs (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms
            of Service. ClearMarket Labs operates a crop funding platform on the Solana blockchain using USDC
            stablecoin. Use of this platform involves real digital assets and on-chain transactions.
          </p>

          <h2 className="text-lg font-semibold text-foreground">2. Platform Description</h2>
          <p>
            ClearMarket Labs is a crop funding platform that connects agricultural growers with investors.
            Growers list crops for funding, investors contribute USDC via Solana, and funds are held in escrow
            until milestone-based release. ClearMarket acts as an intermediary, facilitating the connection
            between growers and investors, verifying milestones, and managing escrow disbursements.
          </p>

          <h2 className="text-lg font-semibold text-foreground">3. How Funding Works</h2>
          <p>
            Investors deposit USDC into a ClearMarket-managed escrow wallet. Funds are released to growers
            upon verification of agricultural milestones (planting, growth, harvest, delivery). ClearMarket
            charges a platform fee of 10-20% of total funding raised, deducted before release to the grower.
            The platform fee percentage is displayed on each listing prior to investment.
          </p>

          <h2 className="text-lg font-semibold text-foreground">4. Investor Returns</h2>
          <p>
            Investor returns are determined by the oracle discount percentage assigned to each listing at the
            time of funding. Upon successful completion of all milestones, growers repay investor principal
            plus the oracle discount return. Returns are not guaranteed. Agricultural investments carry
            inherent risks including crop failure, weather events, market price fluctuations, and grower
            default. Past performance does not indicate future results.
          </p>

          <h2 className="text-lg font-semibold text-foreground">5. Risk Disclosure</h2>
          <p>
            Agricultural investments are speculative and carry significant risk, including the possible loss
            of your entire investment. Risks include but are not limited to: crop failure due to weather,
            pests, or disease; market price volatility; grower inability to deliver; regulatory changes
            affecting cannabis or commodity markets; smart contract vulnerabilities; blockchain network
            disruptions; and USDC stablecoin depegging. You should only invest funds you can afford to lose.
          </p>

          <h2 className="text-lg font-semibold text-foreground">6. Wallet & Transactions</h2>
          <p>
            You are solely responsible for the security of your Solana wallet and private keys. All
            transactions on the Solana blockchain are irreversible. ClearMarket cannot reverse, cancel,
            or refund blockchain transactions once submitted. Ensure you verify all transaction details
            before signing with your wallet.
          </p>

          <h2 className="text-lg font-semibold text-foreground">7. Escrow & Milestone Verification</h2>
          <p>
            Funds deposited into escrow are managed by ClearMarket and released upon milestone verification.
            Milestone verification is performed by ClearMarket administrators based on evidence submitted by
            growers. ClearMarket exercises reasonable judgement in milestone verification but does not
            guarantee the accuracy of grower-submitted evidence.
          </p>

          <h2 className="text-lg font-semibold text-foreground">8. No Financial Advice</h2>
          <p>
            Nothing on this platform constitutes financial advice, investment recommendations, or an
            offer to buy or sell securities. Oracle scores, risk grades, and discount percentages are
            algorithmic assessments and do not constitute investment advice. You should consult a qualified
            financial adviser before making investment decisions.
          </p>

          <h2 className="text-lg font-semibold text-foreground">9. Intellectual Property</h2>
          <p>
            All content, designs, and code on this platform are the property of ClearMarket Labs.
            Unauthorised reproduction or distribution is prohibited.
          </p>

          <h2 className="text-lg font-semibold text-foreground">10. Limitation of Liability</h2>
          <p>
            ClearMarket Labs provides this platform &ldquo;as is&rdquo; without warranty of any kind. To the
            maximum extent permitted by law, ClearMarket Labs shall not be liable for any direct, indirect,
            incidental, consequential, or special damages arising from your use of the platform, including
            but not limited to loss of funds, lost profits, or data loss. Our total liability shall not
            exceed the platform fees collected on your transactions.
          </p>

          <h2 className="text-lg font-semibold text-foreground">11. Governing Law</h2>
          <p>
            These terms are governed by the laws of England and Wales. Any disputes shall be
            subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2 className="text-lg font-semibold text-foreground">12. Contact</h2>
          <p>
            For questions about these terms, contact us at legal@clearmarketlabs.com.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
