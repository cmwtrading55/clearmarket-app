"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import type { LaunchpadListing } from "@/lib/types";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, MapPin, CheckCircle, Loader2, Sprout } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted/10 text-muted",
  pending_review: "bg-warning/10 text-warning",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-red-500/10 text-red-400",
  funding: "bg-blue-500/10 text-blue-400",
};

export default function GrowerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [listings, setListings] = useState<LaunchpadListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGrowerListings() {
      try {
        const { data, error } = await supabase
          .from("launchpad_listings")
          .select("*")
          .eq("grower_wallet", id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setListings(data as LaunchpadListing[]);
        }
      } catch {
        // Fail silently, show empty state
      } finally {
        setLoading(false);
      }
    }

    fetchGrowerListings();
  }, [id]);

  const growerName = listings[0]?.grower_name || "Grower";
  const growerLocation = listings[0]?.grower_location;

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <Link
          href="/growers"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Growers
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-primary animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <Sprout size={40} className="text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Grower not found
            </h3>
            <p className="text-sm text-muted">
              No listings found for this wallet address.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-card-bg border border-border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sprout size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-foreground">{growerName}</h1>
                    <CheckCircle size={16} className="text-primary" />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted">
                    {growerLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {growerLocation}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-muted/60 mt-2">{id}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted">Total Listings</p>
                  <p className="text-lg font-semibold text-foreground">{listings.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Total Raised</p>
                  <p className="text-lg font-semibold text-foreground">
                    ${listings.reduce((sum, l) => sum + (l.funding_raised || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Total Investors</p>
                  <p className="text-lg font-semibold text-foreground">
                    {listings.reduce((sum, l) => sum + (l.investor_count || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Listings */}
            <div className="bg-card-bg border border-border rounded-xl p-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Crop Listings</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted">
                      <th className="text-left py-2 pr-4 font-medium">Name</th>
                      <th className="text-left py-2 pr-4 font-medium">Type</th>
                      <th className="text-left py-2 pr-4 font-medium">Status</th>
                      <th className="text-right py-2 pr-4 font-medium">Target</th>
                      <th className="text-right py-2 font-medium">Raised</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id} className="border-b border-border/50">
                        <td className="py-2.5 pr-4">
                          <Link
                            href={`/launchpad/${listing.id}`}
                            className="text-foreground hover:text-primary transition-colors font-medium"
                          >
                            {listing.strain || "Unnamed"}
                          </Link>
                        </td>
                        <td className="py-2.5 pr-4 text-muted capitalize">
                          Cannabis
                        </td>
                        <td className="py-2.5 pr-4">
                          <span className={`px-2 py-0.5 rounded-full capitalize text-[10px] ${STATUS_STYLES[listing.status] || "bg-muted/10 text-muted"}`}>
                            {listing.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 text-right font-mono text-foreground">
                          {listing.funding_target ? `$${listing.funding_target.toLocaleString()}` : "-"}
                        </td>
                        <td className="py-2.5 text-right font-mono text-foreground">
                          ${(listing.funding_raised || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}
