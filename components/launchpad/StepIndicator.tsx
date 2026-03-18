"use client";

import { Check } from "lucide-react";

const DEFAULT_STEPS = ["Grower Info", "Crop Details", "Financials", "Review"];

interface Props {
  current: number;
  steps?: string[];
}

export default function StepIndicator({ current, steps = DEFAULT_STEPS }: Props) {
  return (
    <div className="flex items-center gap-2 w-full">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? "bg-primary text-background"
                    : active
                    ? "bg-primary/20 text-primary border border-primary"
                    : "bg-secondary text-muted border border-border"
                }`}
              >
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium truncate hidden sm:block ${
                  active ? "text-foreground" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px ${
                  done ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
