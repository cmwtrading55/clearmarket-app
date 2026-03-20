import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Helius Webhook Receiver
 *
 * Receives real-time transaction notifications from Helius for:
 * - USDC deposits to the ClearMarket escrow wallet
 * - Milestone releases (ClearMarket wallet transfers to grower wallets)
 * - Token mints (crop token creation)
 * - Badge mints (compressed NFT grower badges)
 *
 * Helius sends enhanced transaction data with parsed instructions,
 * token transfers, and account changes.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Webhook auth token (set in Helius webhook config)
const WEBHOOK_SECRET = Deno.env.get("HELIUS_WEBHOOK_SECRET") || "";

// ClearMarket escrow wallet address
const CLEARMARKET_WALLET = "HaniJR6VyWGrSWwnPZ2bMj5hXNRQuRoUTeCWoidQ65bG";

// USDC mint on Solana mainnet
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

interface HeliusWebhookPayload {
  type: string;
  timestamp: string;
  signature: string;
  slot: number;
  source: string;
  fee: number;
  feePayer: string;
  nativeTransfers: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    amount: number;
  }>;
  tokenTransfers: Array<{
    fromUserAccount: string;
    toUserAccount: string;
    fromTokenAccount: string;
    toTokenAccount: string;
    tokenAmount: number;
    mint: string;
    tokenStandard: string;
  }>;
  accountData: Array<{
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges: Array<{
      mint: string;
      rawTokenAmount: { tokenAmount: string; decimals: number };
      userAccount: string;
    }>;
  }>;
  description: string;
  events: Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify webhook authenticity
    const authHeader = req.headers.get("authorization");
    if (WEBHOOK_SECRET && authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const payload: HeliusWebhookPayload[] = await req.json();

    // Helius sends an array of transactions
    const results = [];

    for (const tx of payload) {
      // Process token transfers
      for (const transfer of tx.tokenTransfers) {
        // ---------------------------------------------------------------
        // USDC deposit confirmation: transfer TO the ClearMarket wallet
        // ---------------------------------------------------------------
        if (
          transfer.toUserAccount === CLEARMARKET_WALLET &&
          transfer.mint === USDC_MINT
        ) {
          // Find the pending deposit by tx_signature
          const { data: deposit } = await supabase
            .from("escrow_deposits")
            .select("id, escrow_id, amount, tokens_allocated")
            .eq("tx_signature", tx.signature)
            .eq("status", "pending")
            .single();

          if (deposit) {
            // Update deposit status to confirmed
            await supabase
              .from("escrow_deposits")
              .update({ status: "confirmed" })
              .eq("id", deposit.id);

            // Update escrow total_deposited
            const { data: currentEscrow } = await supabase
              .from("escrow_accounts")
              .select("id, listing_id, total_deposited")
              .eq("id", deposit.escrow_id)
              .single();

            if (currentEscrow) {
              const newTotal = Number(currentEscrow.total_deposited) + Number(deposit.amount);

              await supabase
                .from("escrow_accounts")
                .update({
                  total_deposited: newTotal,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", currentEscrow.id);

              // Update listing funding_raised and investor_count
              const { data: listing } = await supabase
                .from("launchpad_listings")
                .select("funding_raised, investor_count, funding_target, status")
                .eq("id", currentEscrow.listing_id)
                .single();

              if (listing) {
                const newFundingRaised = Number(listing.funding_raised) + Number(deposit.amount);
                const newInvestorCount = Number(listing.investor_count) + 1;
                const fundingTarget = Number(listing.funding_target);

                // Check if funding target reached
                const isFunded = newFundingRaised >= fundingTarget;

                await supabase
                  .from("launchpad_listings")
                  .update({
                    funding_raised: newFundingRaised,
                    investor_count: newInvestorCount,
                    ...(isFunded && listing.status === "open" ? { status: "funded" } : {}),
                    updated_at: new Date().toISOString(),
                  })
                  .eq("id", currentEscrow.listing_id);

                // If funded, update escrow status too
                if (isFunded) {
                  await supabase
                    .from("escrow_accounts")
                    .update({
                      status: "funded",
                      updated_at: new Date().toISOString(),
                    })
                    .eq("id", currentEscrow.id);
                }
              }
            }

            results.push({
              type: "usdc_deposit_confirmed",
              signature: tx.signature,
              escrow_id: deposit.escrow_id,
              amount: deposit.amount,
            });

            // Skip the old escrow_pubkey-based matching for this transfer
            continue;
          }
        }

        // ---------------------------------------------------------------
        // Legacy: deposit to escrow PDA (for backwards compatibility)
        // ---------------------------------------------------------------
        const { data: escrow } = await supabase
          .from("escrow_accounts")
          .select("id, listing_id")
          .eq("escrow_pubkey", transfer.toUserAccount)
          .eq("status", "open")
          .single();

        if (escrow) {
          // Confirm the pending deposit
          const { data: deposit } = await supabase
            .from("escrow_deposits")
            .update({
              status: "confirmed",
              tx_signature: tx.signature,
            })
            .eq("escrow_id", escrow.id)
            .eq("investor_wallet", transfer.fromUserAccount)
            .eq("status", "pending")
            .select()
            .single();

          if (deposit) {
            // Update escrow totals
            const { data: currentEscrow } = await supabase
              .from("escrow_accounts")
              .select("total_deposited")
              .eq("id", escrow.id)
              .single();

            if (currentEscrow) {
              await supabase
                .from("escrow_accounts")
                .update({
                  total_deposited: Number(currentEscrow.total_deposited) + transfer.tokenAmount,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", escrow.id);
            }

            // Update listing funding totals
            const { data: listing } = await supabase
              .from("launchpad_listings")
              .select("funding_raised, investor_count, funding_target, status")
              .eq("id", escrow.listing_id)
              .single();

            if (listing) {
              const newFundingRaised = Number(listing.funding_raised) + transfer.tokenAmount;
              const isFunded = newFundingRaised >= Number(listing.funding_target);

              await supabase
                .from("launchpad_listings")
                .update({
                  funding_raised: newFundingRaised,
                  investor_count: Number(listing.investor_count) + 1,
                  ...(isFunded && listing.status === "open" ? { status: "funded" } : {}),
                  updated_at: new Date().toISOString(),
                })
                .eq("id", escrow.listing_id);
            }

            results.push({
              type: "deposit_confirmed",
              signature: tx.signature,
              escrow_id: escrow.id,
              amount: transfer.tokenAmount,
            });
          }
        }

        // ---------------------------------------------------------------
        // Release from escrow/ClearMarket wallet to grower
        // ---------------------------------------------------------------
        if (transfer.fromUserAccount === CLEARMARKET_WALLET && transfer.mint === USDC_MINT) {
          // Check if this corresponds to a milestone release
          const { data: releasingEscrows } = await supabase
            .from("escrow_accounts")
            .select("id")
            .in("status", ["funded", "releasing"]);

          if (releasingEscrows) {
            for (const releaseEscrow of releasingEscrows) {
              const { data: pendingMilestone } = await supabase
                .from("escrow_milestones")
                .select("id")
                .eq("escrow_id", releaseEscrow.id)
                .eq("status", "verified")
                .order("created_at", { ascending: true })
                .limit(1)
                .single();

              if (pendingMilestone) {
                await supabase
                  .from("escrow_milestones")
                  .update({
                    status: "released",
                    released_at: new Date().toISOString(),
                  })
                  .eq("id", pendingMilestone.id);

                // Update escrow released total
                const { data: currentRelease } = await supabase
                  .from("escrow_accounts")
                  .select("total_deposited, total_released")
                  .eq("id", releaseEscrow.id)
                  .single();

                if (currentRelease) {
                  const newReleased = Number(currentRelease.total_released) + transfer.tokenAmount;
                  const allFundsReleased = newReleased >= Number(currentRelease.total_deposited);

                  await supabase
                    .from("escrow_accounts")
                    .update({
                      total_released: newReleased,
                      status: allFundsReleased ? "settled" : "releasing",
                      updated_at: new Date().toISOString(),
                    })
                    .eq("id", releaseEscrow.id);
                }

                results.push({
                  type: "milestone_released",
                  signature: tx.signature,
                  escrow_id: releaseEscrow.id,
                  amount: transfer.tokenAmount,
                });

                break; // Only match one escrow per release transfer
              }
            }
          }
        }
      }

      // Log all webhook events for audit trail
      await supabase.from("oracle_observations").insert({
        commodity: "webhook",
        source_id: null,
        region: "solana",
        price: 0,
        unit: tx.type,
        reported_at: new Date(tx.timestamp).toISOString(),
        raw_data: {
          signature: tx.signature,
          slot: tx.slot,
          description: tx.description,
          fee: tx.fee,
          feePayer: tx.feePayer,
          tokenTransfers: tx.tokenTransfers.length,
          nativeTransfers: tx.nativeTransfers.length,
        },
      }).then(() => {}).catch(() => {
        // Non-critical, don't fail the webhook
      });
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
