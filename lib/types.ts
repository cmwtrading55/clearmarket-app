export interface Asset {
  id: string;
  symbol: string;
  name: string;
  asset_type: string;
  decimals: number;
  icon_url: string | null;
  is_active: boolean;
}

export interface Market {
  id: string;
  symbol: string;
  base_asset_id: string;
  quote_asset_id: string;
  status: string;
  min_order_size: number;
  tick_size: number;
  maker_fee_bps: number;
  taker_fee_bps: number;
  is_perpetual: boolean;
}

export interface MarketTicker {
  id: string;
  market_id: string;
  last_price: number;
  bid_price: number;
  ask_price: number;
  high_24h: number;
  low_24h: number;
  volume_24h: number;
  volume_quote_24h: number;
  price_change_24h: number;
  price_change_pct_24h: number;
  trade_count_24h: number;
  updated_at: string;
}

export interface MarketCandle {
  id: string;
  market_id: string;
  interval: string;
  open_time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trade_count: number;
  closed: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  market_id: string;
  side: "buy" | "sell";
  order_type: string;
  status: string;
  price: number | null;
  quantity: number;
  filled_quantity: number;
  remaining_quantity: number;
  average_fill_price: number | null;
  time_in_force: string;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  market_id: string;
  buy_order_id: string;
  sell_order_id: string;
  buyer_id: string;
  seller_id: string;
  price: number;
  quantity: number;
  buyer_fee: number;
  seller_fee: number;
  is_maker_buy: boolean;
  executed_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  asset_id: string;
  balance: number;
  locked_balance: number;
}

export interface MarketWithTicker extends Market {
  ticker: MarketTicker | null;
  base_asset: Asset | null;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

export interface OrderBookData {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  spreadPct: number;
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

export type CommodityType = "cannabis" | "soybeans";

export type LaunchpadStatus = "draft" | "pending_review" | "approved" | "rejected" | "funding";

export interface LaunchpadListing {
  id: string;
  commodity_type: CommodityType;
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
  // Cannabis-specific fields (null for soybean listings)
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
  // Soybean-specific fields
  variety: string | null;
  yield_tonnes: number | null;
  protein_content: number | null;
  moisture_percent: number | null;
  oil_content: number | null;
  usda_grade: string | null;
  storage_facility: string | null;
  delivery_terms: string | null;
  farm_certification: string | null;
  // Oracle scores
  completeness_score: number;
  history_score: number;
  oracle_discount_pct: number;
  risk_grade: "A" | "B" | "C" | "D";
  status: LaunchpadStatus;
  created_at: string;
  updated_at: string;
}
