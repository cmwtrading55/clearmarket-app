import Footer from "@/components/Footer";

export default function CookiesPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Cookie Policy</h1>
        <p className="text-xs text-muted">Last updated: 25 February 2026</p>

        <div className="prose prose-sm prose-invert max-w-none space-y-4 text-sm text-foreground/80 leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground">What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help
            the site remember your preferences and improve your experience.
          </p>

          <h2 className="text-lg font-semibold text-foreground">Cookies We Use</h2>
          <p><strong>Essential cookies:</strong> Required for authentication and session management. These cannot be disabled.</p>
          <p><strong>Analytics cookies:</strong> Help us understand how visitors interact with the platform. These are anonymous and aggregated.</p>

          <h2 className="text-lg font-semibold text-foreground">Local Storage</h2>
          <p>
            We also use browser localStorage to persist wallet connection state and user preferences.
            This data stays on your device and is not transmitted to our servers.
          </p>

          <h2 className="text-lg font-semibold text-foreground">Managing Cookies</h2>
          <p>
            You can control cookies through your browser settings. Disabling essential cookies may
            prevent some platform features from working correctly.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
