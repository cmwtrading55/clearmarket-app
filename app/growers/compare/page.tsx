"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mockGrowers } from "@/data/mockGrowers";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids")?.split(",") ?? [];
  const growers = ids.map((id) => mockGrowers.find((g) => g.id === id)).filter(Boolean);

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
    { label: "Location", render: (g: typeof growers[0]) => g!.location },
    { label: "Type", render: (g: typeof growers[0]) => g!.type },
    { label: "Rating", render: (g: typeof growers[0]) => `${g!.rating} / 5.0` },
    { label: "Trust Score", render: (g: typeof growers[0]) => `${g!.trustScore}%` },
    { label: "Batches", render: (g: typeof growers[0]) => g!.batchCount.toString() },
    { label: "Total Volume", render: (g: typeof growers[0]) => `$${(g!.totalVolume / 1000000).toFixed(2)}M` },
    { label: "Verified", render: (g: typeof growers[0]) => g!.verified ? "Yes" : "No" },
    { label: "Specialities", render: (g: typeof growers[0]) => g!.specialities.join(", ") },
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
                <th key={g!.id} className="text-left p-4 min-w-[180px]">
                  <div className="flex items-center gap-2">
                    <img src={g!.avatar} alt={g!.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        {g!.name}
                        {g!.verified && <CheckCircle size={12} className="text-primary" />}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border/50">
                <td className="p-4 text-xs text-muted font-medium">{row.label}</td>
                {growers.map((g) => (
                  <td key={g!.id} className="p-4 text-sm text-foreground capitalize">
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
