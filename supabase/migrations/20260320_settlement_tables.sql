-- Settlement tables for milestone release and investor payouts
-- ClearMarket Labs, 2026-03-20

-- Platform fees table
CREATE TABLE IF NOT EXISTS platform_fees (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid REFERENCES launchpad_listings(id) NOT NULL,
  fee_percent numeric NOT NULL DEFAULT 15,
  fee_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'deducted', 'collected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Escrow settlements table (investor payouts)
CREATE TABLE IF NOT EXISTS escrow_settlements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  escrow_id uuid REFERENCES escrow_accounts(id) NOT NULL,
  investor_wallet text NOT NULL,
  principal numeric NOT NULL,
  return_percent numeric NOT NULL DEFAULT 0,
  return_amount numeric NOT NULL DEFAULT 0,
  total_payout numeric NOT NULL DEFAULT 0,
  tx_signature text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_platform_fees_listing ON platform_fees(listing_id);
CREATE INDEX IF NOT EXISTS idx_escrow_settlements_escrow ON escrow_settlements(escrow_id);
CREATE INDEX IF NOT EXISTS idx_escrow_settlements_investor ON escrow_settlements(investor_wallet);
