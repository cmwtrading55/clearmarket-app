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
  "CANN-OG-KUSH": 58.42,
  "CANN-GIRL-SCOUT-COOKIES": 62.15,
  "CANN-BLUE-DREAM": 45.82,
  "CANN-SOUR-DIESEL": 51.56,
  "CANN-NORTHERN-LIGHTS": 42.18,
  "CANN-WHITE-WIDOW": 48.93,
  "THC-DISTILLATE": 15.67,
  "CBD-ISOLATE": 8.40,
  "TERPENE-MYRCENE": 3.21,
  "CANN-LIVE-RESIN": 74.78,
};
