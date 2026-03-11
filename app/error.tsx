"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-sell/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-sell" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-muted">
            An unexpected error occurred. This has been logged and our team will
            investigate.
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
            Try Again
          </button>
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-surface transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
