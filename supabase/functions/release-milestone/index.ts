// ClearMarket Labs — Release Milestone Edge Function
// Releases escrow funds to grower when an admin verifies a milestone.
//
// POST { milestoneId, escrowId, adminWallet }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ADMIN_WALLETS = [
  "HaniJR6VyWGrSWwnPZ2bMj5hXNRQuRoUTeCWoidQ65bG", // ClearMarket main
];

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { milestoneId, escrowId, adminWallet } = await req.json();

  // Admin check
  if (!ADMIN_WALLETS.includes(adminWallet)) {
    return new Response(JSON.stringify({ error: "Unauthorised" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch milestone
  const { data: milestone, error: msErr } = await supabase
    .from("escrow_milestones")
    .select("*")
    .eq("id", milestoneId)
    .single();

  if (msErr || !milestone) {
    return new Response(JSON.stringify({ error: "Milestone not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (milestone.status !== "verified") {
    return new Response(
      JSON.stringify({ error: `Milestone status is '${milestone.status}', expected 'verified'` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Fetch escrow with listing
  const { data: escrow, error: escErr } = await supabase
    .from("escrow_accounts")
    .select("*, listing:launchpad_listings(*)")
    .eq("id", escrowId)
    .single();

  if (escErr || !escrow) {
    return new Response(JSON.stringify({ error: "Escrow not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const totalDeposited = Number(escrow.total_deposited);
  const releaseAmount = +(totalDeposited * Number(milestone.release_percent) / 100).toFixed(2);

  // -----------------------------------------------------------------------
  // Platform fee: deduct on first release if not already recorded
  // -----------------------------------------------------------------------
  const { data: existingFee } = await supabase
    .from("platform_fees")
    .select("id")
    .eq("listing_id", escrow.listing_id)
    .limit(1)
    .maybeSingle();

  if (!existingFee) {
    const feePercent = 15; // default 15%, configurable per listing later
    const feeAmount = +(totalDeposited * feePercent / 100).toFixed(2);

    await supabase.from("platform_fees").insert({
      listing_id: escrow.listing_id,
      fee_percent: feePercent,
      fee_amount: feeAmount,
      status: "deducted",
    });
  }

  // -----------------------------------------------------------------------
  // Record release (placeholder tx, server-side signing added later)
  // -----------------------------------------------------------------------
  const txSignature = `pending_release_${milestoneId.slice(0, 8)}`;

  // Update milestone to released
  await supabase
    .from("escrow_milestones")
    .update({
      status: "released",
      released_at: new Date().toISOString(),
    })
    .eq("id", milestoneId);

  // Update escrow totals
  const newReleased = Number(escrow.total_released) + releaseAmount;

  // Check if all milestones are now released
  const { data: allMilestones } = await supabase
    .from("escrow_milestones")
    .select("id, status")
    .eq("escrow_id", escrowId);

  const allReleased = (allMilestones ?? []).every(
    (m: { id: string; status: string }) => m.status === "released" || m.id === milestoneId
  );

  await supabase
    .from("escrow_accounts")
    .update({
      total_released: newReleased,
      status: allReleased ? "settled" : "releasing",
      updated_at: new Date().toISOString(),
    })
    .eq("id", escrowId);

  return new Response(
    JSON.stringify({
      released: releaseAmount,
      tx_signature: txSignature,
      escrow_status: allReleased ? "settled" : "releasing",
      total_released: newReleased,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
