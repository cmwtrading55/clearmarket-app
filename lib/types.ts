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
