import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-xs text-muted">Last updated: 25 February 2026</p>

        <div className="prose prose-sm prose-invert max-w-none space-y-4 text-sm text-foreground/80 leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p>
            ClearMarket Labs may collect: email addresses provided during sign-up, wallet addresses
            used to connect to the platform, and usage analytics (page views, interactions). As a
            prototype, data collection is minimal.
          </p>

          <h2 className="text-lg font-semibold text-foreground">2. How We Use Information</h2>
          <p>
            Information is used solely to operate the platform demonstration, improve the user
            experience, and communicate with users about platform updates. We do not sell or share
            personal information with third parties for marketing purposes.
          </p>

          <h2 className="text-lg font-semibold text-foreground">3. Data Storage</h2>
          <p>
            Data is stored on Supabase (hosted on AWS) and Cloudflare infrastructure. Wallet
            connection state is stored locally in your browser&apos;s localStorage.
          </p>

          <h2 className="text-lg font-semibold text-foreground">4. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. See our
            Cookie Policy for more details.
          </p>

          <h2 className="text-lg font-semibold text-foreground">5. Your Rights</h2>
          <p>
            Under GDPR, you have the right to access, rectify, or delete your personal data.
            Contact us at privacy@clearmarketlabs.com to exercise these rights.
          </p>

          <h2 className="text-lg font-semibold text-foreground">6. Changes</h2>
          <p>
            We may update this policy from time to time. Changes will be posted on this page
            with an updated revision date.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
