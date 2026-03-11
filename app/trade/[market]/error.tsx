"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function TradeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to external service in production
  }, [error]);

  return (
    <div className="h-dvh bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-sell/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-sell" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Exchange Unavailable
          </h2>
          <p className="text-sm text-muted">
            The exchange encountered an error. This may be temporary, please try
            again.
          </p>
        </div>
        {error.digest && (
          <p className="text-xs font-mono text-muted/60">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>
        </div>
      </div>
    </div>
  );
}
