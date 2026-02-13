import TradePage from "@/components/TradePage";

const MARKET_SYMBOLS = [
  "CML-USDC", "CML-USDT", "CANN-US-USDC", "CANN-EU-USDC", "CANN-CA-USDC",
  "HEMP-USDC", "CBD-USDC", "THC-US-USDC", "TERP-USDC", "GROW-USDC",
];

export function generateStaticParams() {
  return MARKET_SYMBOLS.map((market) => ({ market }));
}

export default async function TradePageRoute({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  return <TradePage marketSymbol={market} />;
}
