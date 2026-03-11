import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <span className="text-6xl font-bold font-mono text-muted/30">404</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Page Not Found
          </h2>
          <p className="text-sm text-muted">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
          >
            Go to Explore
          </Link>
          <Link
            href="/trade/CML-USDC"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-surface transition-colors"
          >
            Open Exchange
          </Link>
        </div>
      </div>
    </div>
  );
}
