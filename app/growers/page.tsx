"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Users, MapPin, CheckCircle, Loader2 } from "lucide-react";

interface GrowerSummary {
  grower_wallet: string;
  grower_name: string | null;
  grower_location: string | null;
  listing_count: number;
}

export default function GrowersPage() {
  const [growers, setGrowers] = useState<GrowerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGrowers() {
      try {
        const { data, error } = await supabase
          .from("launchpad_listings")
          .select("grower_wallet, grower_name, grower_location")
          .order("created_at", { ascending: false });

        if (error || !data) {
          setGrowers([]);
          setLoading(false);
          return;
        }

        // Aggregate by grower_wallet to get distinct growers
        const walletMap = new Map<string, GrowerSummary>();
        for (const row of data) {
          const existing = walletMap.get(row.grower_wallet);
          if (existing) {
            existing.listing_count += 1;
          } else {
            walletMap.set(row.grower_wallet, {
              grower_wallet: row.grower_wallet,
              grower_name: row.grower_name,
              grower_location: row.grower_location,
              listing_count: 1,
            });
          }
        }

        setGrowers(Array.from(walletMap.values()));
      } catch {
        setGrowers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchGrowers();
  }, []);

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Growers</h1>
          <p className="text-sm text-muted mt-1">
            Verified crop cultivators on the ClearMarket network
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-primary animate-spin" />
          </div>
        ) : growers.length === 0 ? (
          <div className="text-center py-20">
            <Users size={40} className="text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No growers found
            </h3>
            <p className="text-sm text-muted max-w-md mx-auto">
              Growers will appear here once they submit crop listings on the launchpad.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {growers.map((grower) => (
              <Link
                key={grower.grower_wallet}
                href={`/growers/${grower.grower_wallet}`}
                className="bg-card-bg border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {grower.grower_name || "Unnamed Grower"}
                      </h3>
                      <CheckCircle size={14} className="text-primary shrink-0" />
                    </div>
                    {grower.grower_location && (
                      <p className="text-xs text-muted flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {grower.grower_location}
                      </p>
                    )}
                    <p className="text-xs text-muted mt-2">
                      {grower.listing_count} listing{grower.listing_count !== 1 ? "s" : ""}
                    </p>
                    <p className="text-[10px] font-mono text-muted/60 mt-1 truncate">
                      {grower.grower_wallet}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
