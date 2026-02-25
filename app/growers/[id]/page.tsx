import { notFound } from "next/navigation";
import Link from "next/link";
import { mockGrowers } from "@/data/mockGrowers";
import { mockBatches } from "@/data/mockBatches";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, Star, CheckCircle, Leaf, Calendar } from "lucide-react";

export function generateStaticParams() {
  return mockGrowers.map((g) => ({ id: g.id }));
}

const STATUS_STYLES = {
  funding: "bg-primary/10 text-primary",
  growing: "bg-blue-500/10 text-blue-400",
  harvested: "bg-warning/10 text-warning",
  settled: "bg-muted/10 text-muted",
};

export default async function GrowerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const grower = mockGrowers.find((g) => g.id === id);
  if (!grower) notFound();

  const growerBatches = mockBatches.filter((b) => b.growerId === grower.id);

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

        {/* Header */}
        <div className="bg-card-bg border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <img
              src={grower.avatar}
              alt={grower.name}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground">{grower.name}</h1>
                {grower.verified && (
                  <CheckCircle size={16} className="text-primary" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted">
                <span className="flex items-center gap-1"><MapPin size={14} /> {grower.location}</span>
                <span className="flex items-center gap-1"><Leaf size={14} /> {grower.type}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> Joined {grower.joinedDate}</span>
              </div>
              <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{grower.bio}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted">Rating</p>
              <p className="text-lg font-semibold text-foreground flex items-center gap-1">
                <Star size={14} className="text-warning" /> {grower.rating}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Trust Score</p>
              <p className="text-lg font-semibold text-foreground">{grower.trustScore}%</p>
            </div>
            <div>
              <p className="text-xs text-muted">Batches</p>
              <p className="text-lg font-semibold text-foreground">{grower.batchCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Volume</p>
              <p className="text-lg font-semibold text-foreground">${(grower.totalVolume / 1000000).toFixed(2)}M</p>
            </div>
          </div>

          {/* Specialities */}
          <div className="mt-4">
            <p className="text-xs text-muted mb-2">Specialities</p>
            <div className="flex flex-wrap gap-2">
              {grower.specialities.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Batch history */}
        <div className="bg-card-bg border border-border rounded-xl p-6">
          <h2 className="text-sm font-medium text-foreground mb-4">Batch History</h2>
          {growerBatches.length === 0 ? (
            <p className="text-xs text-muted">No batches on record.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted">
                    <th className="text-left py-2 pr-4 font-medium">Strain</th>
                    <th className="text-left py-2 pr-4 font-medium">Status</th>
                    <th className="text-right py-2 pr-4 font-medium">Price</th>
                    <th className="text-right py-2 pr-4 font-medium">Yield</th>
                    <th className="text-right py-2 font-medium">Funded</th>
                  </tr>
                </thead>
                <tbody>
                  {growerBatches.map((batch) => (
                    <tr key={batch.id} className="border-b border-border/50">
                      <td className="py-2.5 pr-4">
                        <Link href={`/batch/${batch.id}`} className="text-foreground hover:text-primary transition-colors">
                          {batch.strain}
                        </Link>
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className={`px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[batch.status]}`}>
                          {batch.status}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-right font-mono">${batch.price.toFixed(2)}</td>
                      <td className="py-2.5 pr-4 text-right font-mono">{batch.yieldKg} kg</td>
                      <td className="py-2.5 text-right font-mono">{batch.fundingPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
