"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Search,
  ExternalLink,
  CheckCircle2,
  MapPin,
  Building2,
  Leaf,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import LottieAnimation from "@/components/LottieAnimation";
import Footer from "@/components/Footer";

interface Producer {
  id: string;
  name: string;
  name_display: string;
  industry: string;
  website: string;
  city: string;
  country: string | null;
  region: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_data_provider: boolean;
}

interface OraclePrice {
  id: string;
  commodity: string;
  region: string;
  price: number;
  confidence_low: number;
  confidence_high: number;
  confidence_level: number;
  observation_count: number;
  methodology: string;
  anomaly_flag: boolean;
  computed_at: string;
}

export default function SuppliersPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [oraclePrices, setOraclePrices] = useState<OraclePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      supabase
        .from("producers")
        .select("*")
        .eq("is_active", true)
        .order("name"),
      supabase
        .from("oracle_prices")
        .select("*")
        .order("computed_at", { ascending: false }),
    ]).then(([prodRes, priceRes]) => {
      setProducers((prodRes.data as Producer[]) || []);
      setOraclePrices((priceRes.data as OraclePrice[]) || []);
      setLoading(false);
    });
  }, []);

  const filtered = producers.filter(
    (p) =>
      p.name_display.toLowerCase().includes(search.toLowerCase()) ||
      p.industry?.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase())
  );

  const verifiedCount = producers.filter((p) => p.is_verified).length;
  const dataProviders = producers.filter((p) => p.is_data_provider).length;

  return (
    <main className="min-h-screen bg-grid-pattern">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-12">
          <p className="text-sm font-medium text-primary tracking-wide uppercase mb-4">
            Supply Network
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
            Suppliers &amp; Batches
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            Live producer network feeding the ClearMarket oracle — real-world
            supply data powering institutional price discovery.
          </p>
        </div>
      </section>

      {/* Dashboard stats */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-card border border-border">
            <Building2 className="w-5 h-5 text-primary mb-2" />
            <p className="text-3xl font-bold font-mono text-foreground">
              {producers.length}
            </p>
            <p className="text-xs text-muted mt-1">Total Producers</p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border">
            <CheckCircle2 className="w-5 h-5 text-buy mb-2" />
            <p className="text-3xl font-bold font-mono text-foreground">
              {verifiedCount}
            </p>
            <p className="text-xs text-muted mt-1">Verified</p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border">
            <BarChart3 className="w-5 h-5 text-primary mb-2" />
            <p className="text-3xl font-bold font-mono text-foreground">
              {dataProviders}
            </p>
            <p className="text-xs text-muted mt-1">Data Providers</p>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border">
            <Leaf className="w-5 h-5 text-primary mb-2" />
            <p className="text-3xl font-bold font-mono text-foreground">
              {oraclePrices.length}
            </p>
            <p className="text-xs text-muted mt-1">Oracle Price Feeds</p>
          </div>
        </div>
      </section>

      {/* Oracle Prices */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Live Oracle Prices
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {oraclePrices.slice(0, 6).map((op) => (
            <div
              key={op.id}
              className="p-5 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground capitalize">
                  {op.commodity}
                </span>
                <span className="text-xs text-muted px-2 py-0.5 rounded bg-surface border border-border">
                  {op.region}
                </span>
              </div>
              <p className="text-3xl font-bold font-mono text-primary">
                ${Number(op.price).toFixed(2)}
                <span className="text-xs text-muted font-normal">/g</span>
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <p className="text-xs text-muted">Confidence</p>
                  <p className="text-sm font-mono text-foreground">
                    ${Number(op.confidence_low).toFixed(2)} — $
                    {Number(op.confidence_high).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Sources</p>
                  <p className="text-sm font-mono text-foreground">
                    {op.observation_count}
                  </p>
                </div>
              </div>
              {op.anomaly_flag && (
                <div className="mt-2 text-xs text-warning font-medium">
                  Anomaly detected
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Lottie chart */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-card border border-border overflow-hidden p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Supply Volume Trend
            </h3>
            <LottieAnimation src="/lottie/Graph_02.json" className="w-full" />
          </div>
          <div className="rounded-xl bg-card border border-border overflow-hidden p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Working Capital
            </h3>
            <LottieAnimation src="/lottie/Graph_04.json" className="w-full" />
          </div>
        </div>
      </section>

      {/* Producer list */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Producer Network
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search producers..."
              className="pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary transition-colors w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted text-sm">
            Loading producers...
          </div>
        ) : (
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-xs text-muted font-medium">
                    Producer
                  </th>
                  <th className="text-left p-4 text-xs text-muted font-medium">
                    Industry
                  </th>
                  <th className="text-left p-4 text-xs text-muted font-medium">
                    Location
                  </th>
                  <th className="text-center p-4 text-xs text-muted font-medium">
                    Verified
                  </th>
                  <th className="text-center p-4 text-xs text-muted font-medium">
                    Data Provider
                  </th>
                  <th className="text-right p-4 text-xs text-muted font-medium">
                    Website
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 50).map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-medium text-foreground">
                        {p.name_display}
                      </span>
                    </td>
                    <td className="p-4 text-muted capitalize">
                      {p.industry || "—"}
                    </td>
                    <td className="p-4">
                      {p.city ? (
                        <span className="flex items-center gap-1 text-muted">
                          <MapPin className="w-3 h-3" />
                          {p.city}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {p.is_verified ? (
                        <CheckCircle2 className="w-4 h-4 text-buy mx-auto" />
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {p.is_data_provider ? (
                        <BarChart3 className="w-4 h-4 text-primary mx-auto" />
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {p.website ? (
                        <a
                          href={p.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 50 && (
              <div className="p-4 text-center text-xs text-muted border-t border-border">
                Showing 50 of {filtered.length} producers
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
