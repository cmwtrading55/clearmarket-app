import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="text-xs text-muted">Last updated: 25 February 2026</p>

        <div className="prose prose-sm prose-invert max-w-none space-y-4 text-sm text-foreground/80 leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ClearMarket Labs (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms
            of Service. ClearMarket Labs is a prototype platform and does not provide regulated financial
            services. No tokens, trades, or transactions on this platform are real or legally binding.
          </p>

          <h2 className="text-lg font-semibold text-foreground">2. Platform Description</h2>
          <p>
            ClearMarket Labs is a demonstration platform for tokenised cannabis crop markets. The platform
            showcases bonding curve mechanics, batch funding, grower profiles, and settlement flows using
            mock data and simulated transactions.
          </p>

          <h2 className="text-lg font-semibold text-foreground">3. No Financial Advice</h2>
          <p>
            Nothing on this platform constitutes financial advice, investment recommendations, or an
            offer to buy or sell securities. All prices, yields, and returns displayed are hypothetical
            and for demonstration purposes only.
          </p>

          <h2 className="text-lg font-semibold text-foreground">4. User Accounts</h2>
          <p>
            Wallet connections and user accounts on this platform are simulated. No real blockchain
            transactions occur. No real cryptocurrency or fiat currency is transacted.
          </p>

          <h2 className="text-lg font-semibold text-foreground">5. Intellectual Property</h2>
          <p>
            All content, designs, and code on this platform are the property of ClearMarket Labs.
            Unauthorised reproduction or distribution is prohibited.
          </p>

          <h2 className="text-lg font-semibold text-foreground">6. Limitation of Liability</h2>
          <p>
            ClearMarket Labs provides this platform &ldquo;as is&rdquo; without warranty of any kind. We are not
            liable for any damages arising from your use of or inability to use the platform.
          </p>

          <h2 className="text-lg font-semibold text-foreground">7. Governing Law</h2>
          <p>
            These terms are governed by the laws of England and Wales. Any disputes shall be
            subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2 className="text-lg font-semibold text-foreground">8. Contact</h2>
          <p>
            For questions about these terms, contact us at legal@clearmarketlabs.com.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
