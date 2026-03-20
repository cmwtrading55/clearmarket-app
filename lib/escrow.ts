// ClearMarket Labs — Solana Escrow Program Client
// Manages milestone-based crop funding escrow on Solana.
//
// Architecture (v1, no custom program):
//   1. Grower lists crop on Launchpad
//   2. System creates an escrow record in Supabase
//   3. Investors sign real SPL USDC transfers to the ClearMarket wallet
//   4. Helius webhook confirms deposits and updates escrow totals
//   5. Milestones (planting, growth, harvest, delivery) are verified
//   6. Funds release to grower as milestones are met (server-side)
//   7. If cancelled, investors get refunded from escrow

import { supabase } from "./supabase";
import { CLEARMARKET_WALLET } from "./helius";
import { buildUsdcTransferTx } from "./usdc";
import { PublicKey, type Connection, type Transaction } from "@solana/web3.js";

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

export interface EscrowSettlement {
  id: string;
  escrow_id: string;
  investor_wallet: string;
  principal: number;
  return_percent: number;
  return_amount: number;
  total_payout: number;
  tx_signature: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
}

export interface PlatformFee {
  id: string;
  listing_id: string;
  fee_percent: number;
  fee_amount: number;
  status: "pending" | "deducted" | "collected";
  created_at: string;
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

// ---------------------------------------------------------------------------
// Real USDC deposit flow (two-phase: build tx, then record)
// ---------------------------------------------------------------------------

/**
 * Build an unsigned SPL USDC transfer transaction for an investor deposit.
 *
 * The caller must sign this with the investor's wallet adapter,
 * send the raw transaction, then call recordPendingDeposit with the signature.
 */
export async function buildDepositTransaction(
  connection: Connection,
  investorPubkey: PublicKey,
  amount: number
): Promise<Transaction> {
  const escrowWallet = new PublicKey(CLEARMARKET_WALLET);
  return buildUsdcTransferTx(connection, investorPubkey, escrowWallet, amount);
}

/**
 * Record a pending deposit in Supabase after the investor's wallet
 * has signed and submitted the transaction.
 *
 * The deposit starts as "pending". The Helius webhook will confirm it
 * once the transaction lands on-chain.
 */
export async function recordPendingDeposit(
  escrowId: string,
  investorWallet: string,
  amount: number,
  tokensAllocated: number,
  txSignature: string
): Promise<EscrowDeposit | null> {
  const { data: deposit, error } = await supabase
    .from("escrow_deposits")
    .insert({
      escrow_id: escrowId,
      investor_wallet: investorWallet,
      amount,
      tokens_allocated: tokensAllocated,
      tx_signature: txSignature,
      status: "pending",
    })
    .select()
    .single();

  if (error || !deposit) return null;

  return deposit as EscrowDeposit;
}

// ---------------------------------------------------------------------------
// Milestone verification and release
// ---------------------------------------------------------------------------

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
 * Release funds for a verified milestone (system action).
 *
 * NOTE: In production, this triggers a server-side Solana transaction
 * from the ClearMarket wallet to the grower's wallet. The actual SPL
 * transfer must be executed by a backend with access to the escrow
 * wallet's private key. This function only updates ledger state.
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

  // TODO: Execute real SPL USDC transfer server-side from ClearMarket wallet
  // to grower wallet. The tx signature should come from that transfer.
  // For now, mark as released in the ledger. The server-side release
  // function will set the real signature via a separate edge function.
  const txSignature = "pending_server_release";

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

// ---------------------------------------------------------------------------
// Platform fee tracking
// ---------------------------------------------------------------------------

/** Fetch settlements for an escrow */
export async function getSettlements(escrowId: string): Promise<EscrowSettlement[]> {
  const { data } = await supabase
    .from("escrow_settlements")
    .select("*")
    .eq("escrow_id", escrowId)
    .order("created_at", { ascending: false });
  return (data as EscrowSettlement[]) ?? [];
}

/** Fetch platform fee for a listing */
export async function getPlatformFee(listingId: string): Promise<PlatformFee | null> {
  const { data } = await supabase
    .from("platform_fees")
    .select("*")
    .eq("listing_id", listingId)
    .single();
  return (data as PlatformFee) ?? null;
}

/** Record platform fee for a funded listing */
export async function recordPlatformFee(
  listingId: string,
  feePercent: number,
  feeAmount: number
): Promise<boolean> {
  const { error } = await supabase
    .from("platform_fees")
    .insert({
      listing_id: listingId,
      fee_percent: feePercent,
      fee_amount: feeAmount,
      status: "pending",
    });
  return !error;
}
