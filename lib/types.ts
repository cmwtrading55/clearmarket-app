export interface Asset {
  id: string;
  symbol: string;
  name: string;
  asset_type: string;
  decimals: number;
  icon_url: string | null;
  is_active: boolean;
}

// Batch marketplace types

export type BatchStatus = "funding" | "growing" | "harvested" | "settled";

export interface Batch {
  id: string;
  strain: string;
  grower: string;
  growerId: string;
  price: number;
  tokenSymbol: string;
  fundingPercent: number;
  fundingTarget: number;
  fundingRaised: number;
  status: BatchStatus;
  harvestDate: string;
  heroImage: string;
  region: string;
  riskGrade: "A" | "B" | "C" | "D";
  thcPercent: number;
  cbdPercent: number;
  yieldKg: number;
  description: string;
  createdAt: string;
}

export interface Grower {
  id: string;
  name: string;
  avatar: string;
  location: string;
  region: string;
  type: "indoor" | "outdoor" | "greenhouse";
  rating: number;
  trustScore: number;
  batchCount: number;
  totalVolume: number;
  verified: boolean;
  joinedDate: string;
  bio: string;
  specialities: string[];
}

export interface ActivityEvent {
  id: string;
  type: "buy" | "sell" | "fund" | "harvest" | "settle";
  batchId: string;
  strain: string;
  user: string;
  amount: number;
  price: number;
  timestamp: string;
}

export interface PortfolioHolding {
  id: string;
  batchId: string;
  strain: string;
  grower: string;
  tokens: number;
  avgPrice: number;
  currentPrice: number;
  status: BatchStatus;
  pnl: number;
  pnlPercent: number;
}

export interface Payout {
  id: string;
  batchId: string;
  strain: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "processing";
}

// Launchpad types

export type LaunchpadStatus = "draft" | "pending_review" | "approved" | "rejected" | "funding";

export interface LaunchpadListing {
  id: string;
  commodity_type: "cannabis";
  grower_wallet: string;
  grower_name: string | null;
  grower_location: string | null;
  grower_type: "indoor" | "outdoor" | "greenhouse" | null;
  // Shared fields
  description: string | null;
  hero_image: string | null;
  region: string | null;
  harvest_date: string | null;
  funding_target: number | null;
  funding_raised: number;
  investor_count: number;
  price_per_token: number | null;
  token_symbol: string | null;
  insurance_coverage: boolean;
  contracted_buyer: boolean;
  contracted_buyer_name: string | null;
  // Cannabis-specific fields
  strain: string | null;
  yield_kg: number | null;
  thc_percent: number | null;
  cbd_percent: number | null;
  grow_method: string | null;
  lighting: string | null;
  nutrients: string | null;
  facility_certification: string | null;
  lab_testing_provider: string | null;
  expected_terpene_profile: string | null;
  // Oracle scores
  completeness_score: number;
  history_score: number;
  oracle_discount_pct: number;
  risk_grade: "A" | "B" | "C" | "D";
  status: LaunchpadStatus;
  created_at: string;
  updated_at: string;
}
