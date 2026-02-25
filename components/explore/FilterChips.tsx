"use client";

import type { BatchStatus } from "@/lib/types";

const FILTERS: { label: string; value: BatchStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Funding", value: "funding" },
  { label: "Growing", value: "growing" },
  { label: "Harvested", value: "harvested" },
  { label: "Settled", value: "settled" },
];

interface Props {
  active: BatchStatus | "all";
  onChange: (v: BatchStatus | "all") => void;
}

export default function FilterChips({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            active === f.value
              ? "bg-primary/10 border-primary text-primary"
              : "border-border text-muted hover:text-foreground hover:border-foreground/20"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
