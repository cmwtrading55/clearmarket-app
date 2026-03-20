import type { LaunchpadListing } from "@/lib/types";
import type { Batch } from "@/lib/types";

// ---------------------------------------------------------------------------
// Cannabis oracle scoring engine
// ---------------------------------------------------------------------------

export interface ScoringField {
  key: string;
  points: number;
}

const SCORING_FIELDS: ScoringField[] = [
  { key: "strain", points: 5 },
  { key: "description", points: 5 },
  { key: "hero_image", points: 5 },
  { key: "region", points: 5 },
  { key: "yield_kg", points: 5 },
  { key: "harvest_date", points: 5 },
  { key: "funding_target", points: 5 },
  { key: "price_per_token", points: 5 },
  { key: "thc_percent", points: 5 },
  { key: "cbd_percent", points: 5 },
  { key: "grow_method", points: 5 },
  { key: "lighting", points: 5 },
  { key: "nutrients", points: 5 },
  { key: "facility_certification", points: 5 },
  { key: "lab_testing_provider", points: 5 },
  { key: "expected_terpene_profile", points: 5 },
  { key: "token_symbol", points: 5 },
  { key: "grower_location", points: 5 },
  { key: "insurance_coverage", points: 10 },
];

const MAX_SCORE = Math.min(SCORING_FIELDS.reduce((s, f) => s + f.points, 0), 100);

// ---------------------------------------------------------------------------
// Scoring functions
// ---------------------------------------------------------------------------

function hasValue(v: unknown): boolean {
  if (v === null || v === undefined || v === "") return false;
  if (typeof v === "number") return v > 0;
  if (typeof v === "boolean") return v;
  return true;
}

export function calcCompleteness(data: Record<string, unknown>): number {
  let score = 0;
  for (const field of SCORING_FIELDS) {
    if (hasValue(data[field.key])) score += field.points;
  }
  return Math.min(score, 100);
}

export function calcBuyerBonus(data: Record<string, unknown>): number {
  if (data.contracted_buyer && hasValue(data.contracted_buyer_name)) return 25;
  if (data.contracted_buyer) return 15;
  return 0;
}

export function calcHistoryScore(
  wallet: string,
  batches: Batch[]
): number {
  const growerBatches = batches.filter(
    (b) => b.growerId === wallet || b.grower === wallet
  );
  const settled = growerBatches.filter(
    (b) => b.status === "settled" || b.status === "harvested"
  ).length;
  const listed = growerBatches.length;

  const settledPts = Math.min(settled * 20, 60);
  const listedPts = Math.min(listed * 10, 40);
  return Math.min(settledPts + listedPts, 100);
}

export interface OracleResult {
  completeness: number;
  buyerBonus: number;
  historyScore: number;
  composite: number;
  discount: number;
  riskGrade: "A" | "B" | "C" | "D";
}

export function calcOracleDiscount(
  data: Partial<LaunchpadListing> & Record<string, unknown>,
  batches: Batch[] = [],
  wallet: string = ""
): OracleResult {
  const completeness = calcCompleteness(data as Record<string, unknown>);
  const buyerBonus = calcBuyerBonus(data as Record<string, unknown>);
  const historyScore = calcHistoryScore(wallet, batches);

  const composite =
    completeness * 0.4 + buyerBonus * 0.8 + historyScore * 0.4;
  const capped = Math.min(composite, 100);
  const discount = +(40 - (capped / 100) * 35).toFixed(1);

  let riskGrade: "A" | "B" | "C" | "D";
  if (capped >= 75) riskGrade = "A";
  else if (capped >= 50) riskGrade = "B";
  else if (capped >= 25) riskGrade = "C";
  else riskGrade = "D";

  return { completeness, buyerBonus, historyScore, composite, discount, riskGrade };
}
