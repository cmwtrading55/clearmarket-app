"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

interface GrowerData {
  grower_wallet: string;
  grower_name: string | null;
  grower_location: string | null;
  listing_count: number;
  total_raised: number;
  total_investors: number;
}

function CompareContent() {
  const searchParams = useSearchParams();
  const wallets = searchParams.get("ids")?.split(",") ?? [];
  const [growers, setGrowers] = useState<GrowerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGrowers() {
      if (wallets.length < 2) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("launchpad_listings")
          .select("grower_wallet, grower_name, grower_location, funding_raised, investor_count")
          .in("grower_wallet", wallets);

        if (error || !data) {
          setLoading(false);
          return;
        }

        const walletMap = new Map<string, GrowerData>();
        for (const row of data) {
          const existing = walletMap.get(row.grower_wallet);
          if (existing) {
            existing.listing_count += 1;
            existing.total_raised += row.funding_raised || 0;
            existing.total_investors += row.investor_count || 0;
          } else {
            walletMap.set(row.grower_wallet, {
              grower_wallet: row.grower_wallet,
              grower_name: row.grower_name,
              grower_location: row.grower_location,
              listing_count: 1,
              total_raised: row.funding_raised || 0,
              total_investors: row.investor_count || 0,
            });
          }
        }

        setGrowers(Array.from(walletMap.values()));
      } catch {
        // Fail silently
      } finally {
        setLoading(false);
      }
    }

    fetchGrowers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="text-primary animate-spin" />
      </div>
    );
  }

  if (growers.length < 2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm text-muted">Select at least 2 growers to compare.</p>
          <Link href="/growers" className="text-sm text-primary hover:underline">
            Back to Growers
          </Link>
        </div>
      </div>
    );
  }

  const rows = [
    { label: "Location", render: (g: GrowerData) => g.grower_location || "-" },
    { label: "Listings", render: (g: GrowerData) => g.listing_count.toString() },
    { label: "Total Raised", render: (g: GrowerData) => `$${g.total_raised.toLocaleString()}` },
    { label: "Total Investors", render: (g: GrowerData) => g.total_investors.toString() },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/growers"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Growers
      </Link>

      <h1 className="text-2xl font-bold text-foreground">Compare Growers</h1>

      <div className="bg-card-bg border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-xs text-muted font-medium min-w-[120px]">Metric</th>
              {growers.map((g) => (
                <th key={g.grower_wallet} className="text-left p-4 min-w-[180px]">
                  <p className="text-sm font-medium text-foreground">
                    {g.grower_name || "Unnamed Grower"}
                  </p>
                  <p className="text-[10px] font-mono text-muted/60 mt-0.5 truncate max-w-[160px]">
                    {g.grower_wallet}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border/50">
                <td className="p-4 text-xs text-muted font-medium">{row.label}</td>
                {growers.map((g) => (
                  <td key={g.grower_wallet} className="p-4 text-sm text-foreground">
                    {row.render(g)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CompareGrowersPage() {
  return (
    <main className="min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <CompareContent />
      </Suspense>
      <Footer />
    </main>
  );
}
