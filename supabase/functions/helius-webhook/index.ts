import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Helius Webhook Receiver
 *
 * Receives real-time transaction notifications from Helius for:
 * - Escrow deposits (USDC transfers to escrow PDAs)
 * - Milestone releases (escrow PDA transfers to grower wallets)
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
      // Process USDC token transfers (escrow deposits)
      for (const transfer of tx.tokenTransfers) {
        // Check if this is a deposit to one of our escrow accounts
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
              .select("funding_raised, investor_count")
              .eq("id", escrow.listing_id)
              .single();

            if (listing) {
              await supabase
                .from("launchpad_listings")
                .update({
                  funding_raised: Number(listing.funding_raised) + transfer.tokenAmount,
                  investor_count: Number(listing.investor_count) + 1,
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

        // Check if this is a release from escrow to a grower wallet
        const { data: releaseEscrow } = await supabase
          .from("escrow_accounts")
          .select("id")
          .eq("escrow_pubkey", transfer.fromUserAccount)
          .in("status", ["funded", "releasing"])
          .single();

        if (releaseEscrow) {
          // Mark the corresponding milestone as released
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
