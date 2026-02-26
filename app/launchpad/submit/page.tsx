"use client";

import SubmissionForm from "@/components/launchpad/SubmissionForm";
import { useWallet } from "@/lib/wallet";
import { Sprout } from "lucide-react";

export default function LaunchpadSubmitPage() {
  const { connected } = useWallet();

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sprout size={22} className="text-primary" />
            List Your Crop
          </h1>
          <p className="text-sm text-muted mt-1">
            Submit a crop proposal to the launchpad. The oracle algorithm
            calculates an investor discount based on data completeness, buyer
            contracts, and your track record.
          </p>
        </div>

        {!connected && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg px-4 py-3 text-sm text-warning">
            Connect your wallet to begin the submission process.
          </div>
        )}

        <SubmissionForm />
      </div>
    </main>
  );
}
