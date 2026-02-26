import type { LaunchpadListing } from "@/lib/types";
import type { Batch } from "@/lib/types";

/** Fields worth 5 points each */
const FIVE_PT_FIELDS: (keyof LaunchpadListing)[] = [
  "strain",
  "description",
  "hero_image",
  "region",
  "yield_kg",
  "harvest_date",
  "funding_target",
  "price_per_token",
  "thc_percent",
  "cbd_percent",
  "grow_method",
  "lighting",
  "nutrients",
  "facility_certification",
  "lab_testing_provider",
  "expected_terpene_profile",
  "token_symbol",
  "grower_location",
];

/** Fields worth 10 points each */
const TEN_PT_FIELDS: (keyof LaunchpadListing)[] = ["insurance_coverage"];

function hasValue(v: unknown): boolean {
  if (v === null || v === undefined || v === "") return false;
  if (typeof v === "number") return v > 0;
  if (typeof v === "boolean") return v;
  return true;
}

export function calcCompleteness(data: Partial<LaunchpadListing>): number {
  let score = 0;
  for (const f of FIVE_PT_FIELDS) {
    if (hasValue(data[f])) score += 5;
  }
  for (const f of TEN_PT_FIELDS) {
    if (hasValue(data[f])) score += 10;
  }
  return Math.min(score, 100);
}

export function calcBuyerBonus(data: Partial<LaunchpadListing>): number {
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
  data: Partial<LaunchpadListing>,
  batches: Batch[] = [],
  wallet: string = ""
): OracleResult {
  const completeness = calcCompleteness(data);
  const buyerBonus = calcBuyerBonus(data);
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
