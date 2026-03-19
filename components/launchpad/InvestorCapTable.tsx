"use client";

import { useTokenHolders } from "@/lib/useHelius";
import { shortenAddress, solscanAccountUrl } from "@/lib/solana";
import { Users, Loader2 } from "lucide-react";

interface Props {
  mintAddress: string | null;
  tokenSymbol: string;
}

export default function InvestorCapTable({ mintAddress, tokenSymbol }: Props) {
  const { holders, loading } = useTokenHolders(mintAddress);

  if (!mintAddress) return null;

  return (
    <div className="bg-card-bg border border-border rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Users size={16} className="text-primary" />
        Investor Cap Table
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 size={18} className="animate-spin text-muted" />
        </div>
      ) : holders.length === 0 ? (
        <p className="text-xs text-muted text-center py-4">
          No token holders found. Investors will appear here after funding.
        </p>
      ) : (
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-3 gap-2 text-[10px] text-muted uppercase tracking-wider px-2 pb-1 border-b border-border">
            <span>Holder</span>
            <span className="text-right">Balance</span>
            <span className="text-right">Share</span>
          </div>

          {/* Rows */}
          {holders.map((holder, i) => (
            <div
              key={holder.owner}
              className="grid grid-cols-3 gap-2 px-2 py-1.5 text-xs rounded hover:bg-secondary transition-colors"
            >
              <a
                href={solscanAccountUrl(holder.owner)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-foreground hover:text-primary transition-colors truncate"
              >
                {shortenAddress(holder.owner, 4)}
              </a>
              <span className="font-mono text-foreground text-right">
                {holder.balance.toLocaleString()} {tokenSymbol}
              </span>
              <div className="flex items-center justify-end gap-1.5">
                <div className="w-12 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min(holder.percentage, 100)}%` }}
                  />
                </div>
                <span className="font-mono text-muted w-10 text-right">
                  {holder.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
