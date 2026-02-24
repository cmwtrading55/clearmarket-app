import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-lg font-bold tracking-tight text-foreground">
                ClearMarket Labs
              </span>
            </div>
            <p className="text-sm text-muted max-w-md">
              Infrastructure for the next generation of commodities. Built for
              regulated reality.
            </p>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} ClearMarket Labs. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
