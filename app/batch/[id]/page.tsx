import { notFound } from "next/navigation";
import { mockBatches } from "@/data/mockBatches";
import BatchHero from "@/components/batch/BatchHero";
import TradeBox from "@/components/batch/TradeBox";
import BatchEconomics from "@/components/batch/BatchEconomics";
import BatchTimeline from "@/components/batch/BatchTimeline";
import BatchActivity from "@/components/batch/BatchActivity";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return mockBatches.map((batch) => ({ id: batch.id }));
}

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const batch = mockBatches.find((b) => b.id === id);

  if (!batch) notFound();

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Explore
        </Link>

        {/* Hero */}
        <BatchHero batch={batch} />

        {/* Main content + sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: content */}
          <div className="flex-1 space-y-6">
            <BatchEconomics batch={batch} />
            <BatchTimeline batch={batch} />
            <BatchActivity batchId={batch.id} />
          </div>

          {/* Right: sticky trade box */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-20">
              <TradeBox batch={batch} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
