// ClearMarket Labs — Solana Escrow Program Client
// Manages milestone-based crop funding escrow on Solana.
//
// Architecture:
//   1. Grower lists crop on Launchpad
//   2. System creates an escrow account (PDA) on Solana
//   3. Investors deposit USDC into escrow
//   4. Milestones (planting, growth, harvest, delivery) are verified
//   5. Funds release to grower as milestones are met
//   6. If cancelled, investors get refunded from escrow

import { supabase } from "./supabase";
import { CLEARMARKET_WALLET, HELIUS_RPC_URL } from "./helius";
import { mockTxSignature } from "./solana";

// Program ID for the ClearMarket Escrow program (to be deployed)
export const ESCROW_PROGRAM_ID = "CMEscrow1111111111111111111111111111111111";

export type MilestoneType = "planting" | "growth" | "harvest" | "delivery";
export type EscrowStatus = "open" | "funded" | "releasing" | "settled" | "cancelled";
export type DepositStatus = "pending" | "confirmed" | "refunded";
export type MilestoneStatus = "pending" | "verified" | "released" | "disputed";

export interface EscrowAccount {
  id: string;
  listing_id: string;
  escrow_pubkey: string;
  authority_pubkey: string;
  total_deposited: number;
  total_released: number;
  status: EscrowStatus;
  created_at: string;
}

export interface EscrowDeposit {
  id: string;
  escrow_id: string;
  investor_wallet: string;
  amount: number;
  tokens_allocated: number;
  tx_signature: string | null;
  status: DepositStatus;
  created_at: string;
}

export interface EscrowMilestone {
  id: string;
  escrow_id: string;
  milestone_type: MilestoneType;
  release_percent: number;
  status: MilestoneStatus;
  verified_at: string | null;
  released_at: string | null;
  verifier_wallet: string | null;
  evidence_url: string | null;
}

// Default milestone schedule: how funds are released at each stage
const DEFAULT_MILESTONES: { type: MilestoneType; percent: number }[] = [
  { type: "planting", percent: 25 },
  { type: "growth", percent: 25 },
  { type: "harvest", percent: 35 },
  { type: "delivery", percent: 15 },
];

// ---------------------------------------------------------------------------
// Escrow lifecycle functions
// ---------------------------------------------------------------------------

/** Derive a deterministic escrow PDA from listing ID */
function deriveEscrowPubkey(listingId: string): string {
  // In production this would be a real PDA derivation using:
  // PublicKey.findProgramAddressSync([Buffer.from("escrow"), listingIdBytes], ESCROW_PROGRAM_ID)
  // For now, generate a deterministic mock address
  let hash = 0;
  for (let i = 0; i < listingId.length; i++) {
    hash = ((hash << 5) - hash + listingId.charCodeAt(i)) | 0;
  }
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let addr = "CME";
  for (let i = 0; i < 41; i++) {
    hash = ((hash << 5) - hash + i) | 0;
    addr += chars[Math.abs(hash) % chars.length];
  }
  return addr;
}

/** Create an escrow account for a listing and set up milestones */
export async function createEscrow(listingId: string): Promise<EscrowAccount | null> {
  const escrowPubkey = deriveEscrowPubkey(listingId);

  const { data: escrow, error: escrowErr } = await supabase
    .from("escrow_accounts")
    .insert({
      listing_id: listingId,
      escrow_pubkey: escrowPubkey,
      authority_pubkey: CLEARMARKET_WALLET,
      status: "open",
    })
    .select()
    .single();

  if (escrowErr || !escrow) return null;

  // Create milestone schedule
  const milestones = DEFAULT_MILESTONES.map((m) => ({
    escrow_id: escrow.id,
    milestone_type: m.type,
    release_percent: m.percent,
    status: "pending",
  }));

  await supabase.from("escrow_milestones").insert(milestones);

  return escrow as EscrowAccount;
}

/** Fetch escrow account for a listing */
export async function getEscrow(listingId: string): Promise<EscrowAccount | null> {
  const { data } = await supabase
    .from("escrow_accounts")
    .select("*")
    .eq("listing_id", listingId)
    .single();

  return (data as EscrowAccount) ?? null;
}

/** Fetch milestones for an escrow */
export async function getMilestones(escrowId: string): Promise<EscrowMilestone[]> {
  const { data } = await supabase
    .from("escrow_milestones")
    .select("*")
    .eq("escrow_id", escrowId)
    .order("created_at", { ascending: true });

  return (data as EscrowMilestone[]) ?? [];
}

/** Fetch deposits for an escrow */
export async function getDeposits(escrowId: string): Promise<EscrowDeposit[]> {
  const { data } = await supabase
    .from("escrow_deposits")
    .select("*")
    .eq("escrow_id", escrowId)
    .order("created_at", { ascending: false });

  return (data as EscrowDeposit[]) ?? [];
}

/**
 * Deposit USDC into escrow (investor action)
 *
 * In production:
 *   1. Build Solana transaction: transfer USDC from investor to escrow PDA
 *   2. Investor signs with their wallet
 *   3. Submit via Helius RPC for priority landing
 *   4. Helius webhook fires on confirmation, updating deposit status
 *
 * Current implementation: simulated with mock tx signature
 */
export async function depositToEscrow(
  escrowId: string,
  investorWallet: string,
  amount: number,
  tokensAllocated: number
): Promise<EscrowDeposit | null> {
  // Simulate Solana transaction
  const txSignature = mockTxSignature();

  const { data: deposit, error } = await supabase
    .from("escrow_deposits")
    .insert({
      escrow_id: escrowId,
      investor_wallet: investorWallet,
      amount,
      tokens_allocated: tokensAllocated,
      tx_signature: txSignature,
      status: "confirmed", // In production: starts as "pending", webhook confirms
    })
    .select()
    .single();

  if (error || !deposit) return null;

  // Update escrow totals
  const { data: currentEscrow } = await supabase
    .from("escrow_accounts")
    .select("total_deposited")
    .eq("id", escrowId)
    .single();

  if (currentEscrow) {
    await supabase
      .from("escrow_accounts")
      .update({
        total_deposited: Number(currentEscrow.total_deposited) + amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", escrowId);
  }

  // Update listing funding_raised and investor_count
  const { data: escrow } = await supabase
    .from("escrow_accounts")
    .select("listing_id")
    .eq("id", escrowId)
    .single();

  if (escrow) {
    const { data: listing } = await supabase
      .from("launchpad_listings")
      .select("funding_raised, investor_count")
      .eq("id", escrow.listing_id)
      .single();

    if (listing) {
      await supabase
        .from("launchpad_listings")
        .update({
          funding_raised: Number(listing.funding_raised) + amount,
          investor_count: Number(listing.investor_count) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", escrow.listing_id);
    }
  }

  return deposit as EscrowDeposit;
}

/**
 * Verify a milestone (verifier action, e.g. oracle, auditor, or DAO vote)
 */
export async function verifyMilestone(
  milestoneId: string,
  verifierWallet: string,
  evidenceUrl?: string
): Promise<boolean> {
  const { error } = await supabase
    .from("escrow_milestones")
    .update({
      status: "verified",
      verified_at: new Date().toISOString(),
      verifier_wallet: verifierWallet,
      evidence_url: evidenceUrl ?? null,
    })
    .eq("id", milestoneId)
    .eq("status", "pending");

  return !error;
}

/**
 * Release funds for a verified milestone (system action)
 *
 * In production: this triggers a Solana transaction from the escrow PDA
 * to the grower's wallet for the milestone's percentage of total deposits.
 */
export async function releaseMilestone(
  milestoneId: string,
  escrowId: string
): Promise<{ released: number; txSignature: string } | null> {
  // Get milestone and escrow data
  const [{ data: milestone }, { data: escrow }] = await Promise.all([
    supabase.from("escrow_milestones").select("*").eq("id", milestoneId).single(),
    supabase.from("escrow_accounts").select("*").eq("id", escrowId).single(),
  ]);

  if (!milestone || !escrow) return null;
  if (milestone.status !== "verified") return null;

  const releaseAmount = (Number(escrow.total_deposited) * Number(milestone.release_percent)) / 100;
  const txSignature = mockTxSignature();

  // Update milestone
  await supabase
    .from("escrow_milestones")
    .update({
      status: "released",
      released_at: new Date().toISOString(),
    })
    .eq("id", milestoneId);

  // Update escrow totals
  const newReleased = Number(escrow.total_released) + releaseAmount;
  const allMilestones = await getMilestones(escrowId);
  const allReleased = allMilestones.every(
    (m) => m.status === "released" || m.id === milestoneId
  );

  await supabase
    .from("escrow_accounts")
    .update({
      total_released: newReleased,
      status: allReleased ? "settled" : "releasing",
      updated_at: new Date().toISOString(),
    })
    .eq("id", escrowId);

  return { released: releaseAmount, txSignature };
}
