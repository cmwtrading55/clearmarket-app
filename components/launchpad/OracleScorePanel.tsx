"use client";

import type { OracleResult } from "@/lib/oracle";
import { Shield, Users, History, TrendingDown } from "lucide-react";

const GRADE_COLOURS = {
  A: "text-primary",
  B: "text-blue-400",
  C: "text-warning",
  D: "text-sell",
};

const GRADE_BG = {
  A: "bg-primary/10",
  B: "bg-blue-500/10",
  C: "bg-warning/10",
  D: "bg-sell/10",
};

interface Props {
  oracle: OracleResult;
}

function Ring({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(value / max, 1);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <svg width="88" height="88" className="shrink-0">
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="text-border"
      />
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary transition-all duration-500"
        transform="rotate(-90 44 44)"
      />
      <text
        x="44"
        y="44"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground text-lg font-bold font-mono"
      >
        {value}
      </text>
    </svg>
  );
}

export default function OracleScorePanel({ oracle }: Props) {
  return (
    <div className="bg-card-bg border border-border rounded-xl p-5 space-y-5">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Shield size={16} className="text-primary" />
        Oracle Discount
      </h3>

      {/* Discount + grade */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold font-mono text-foreground">
            {oracle.discount.toFixed(1)}%
          </p>
          <p className="text-xs text-muted mt-0.5">Investor discount</p>
        </div>
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${
            GRADE_BG[oracle.riskGrade]
          } ${GRADE_COLOURS[oracle.riskGrade]}`}
        >
          {oracle.riskGrade}
        </div>
      </div>

      {/* Completeness ring */}
      <div className="flex items-center gap-4">
        <Ring value={oracle.completeness} />
        <div>
          <p className="text-sm font-medium text-foreground">Completeness</p>
          <p className="text-xs text-muted">
            {oracle.completeness}/100 data points
          </p>
        </div>
      </div>

      {/* Buyer bonus */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
        <Users size={16} className="text-muted shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground">Buyer Bonus</p>
          <p className="text-xs text-muted">Contracted buyer discount</p>
        </div>
        <span className="text-sm font-bold font-mono text-foreground">
          +{oracle.buyerBonus}
        </span>
      </div>

      {/* History score */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
        <History size={16} className="text-muted shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground">Track Record</p>
          <p className="text-xs text-muted">Past batch history</p>
        </div>
        <span className="text-sm font-bold font-mono text-foreground">
          {oracle.historyScore}
        </span>
      </div>

      {/* Composite */}
      <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
        <TrendingDown size={16} className="text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground">Composite Score</p>
          <p className="text-xs text-muted">
            Lower discount = lower risk
          </p>
        </div>
        <span className="text-sm font-bold font-mono text-primary">
          {oracle.composite.toFixed(0)}
        </span>
      </div>
    </div>
  );
}
