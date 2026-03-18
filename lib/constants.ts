export const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";
export const DEFAULT_MARKET = "CML-USDC";

export const INTERVALS = [
  { label: "1H", value: "1h" },
  { label: "4H", value: "4h" },
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
] as const;

export type IntervalValue = (typeof INTERVALS)[number]["value"];

export const MARKET_PRICES: Record<string, number> = {
  "CML-USDC": 2.45,
  "CML-USDT": 2.44,
  "CANN-US-USDC": 47.82,
  "CANN-EU-USDC": 31.56,
  "CANN-CA-USDC": 22.18,
  "HEMP-USDC": 8.93,
  "CBD-USDC": 15.67,
  "THC-US-USDC": 52.40,
  "TERP-USDC": 3.21,
  "GROW-USDC": 6.78,
  "SOY-USDC": 11.42,
};
