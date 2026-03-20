// ClearMarket Labs — Distribute Returns Edge Function
// Creates settlement records for investor payouts based on oracle discount %.
//
// POST { escrowId, adminWallet }

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

  const { escrowId, adminWallet } = await req.json();

  if (!ADMIN_WALLETS.includes(adminWallet)) {
    return new Response(JSON.stringify({ error: "Unauthorised" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get escrow with listing
  const { data: escrow } = await supabase
    .from("escrow_accounts")
    .select("*, listing:launchpad_listings(*)")
    .eq("id", escrowId)
    .single();

  if (!escrow) {
    return new Response(JSON.stringify({ error: "Escrow not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get confirmed deposits
  const { data: deposits } = await supabase
    .from("escrow_deposits")
    .select("*")
    .eq("escrow_id", escrowId)
    .eq("status", "confirmed");

  if (!deposits?.length) {
    return new Response(JSON.stringify({ error: "No confirmed deposits" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const returnPct = escrow.listing?.oracle_discount_pct || 0;

  // Create settlement records for each investor
  const settlements = deposits.map((d: { investor_wallet: string; amount: number }) => ({
    escrow_id: escrowId,
    investor_wallet: d.investor_wallet,
    principal: d.amount,
    return_percent: returnPct,
    return_amount: +(d.amount * returnPct / 100).toFixed(2),
    total_payout: +(d.amount * (1 + returnPct / 100)).toFixed(2),
    status: "pending",
  }));

  const { data: created, error } = await supabase
    .from("escrow_settlements")
    .insert(settlements)
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      settlements: created,
      total_payout: settlements.reduce((s: number, r) => s + r.total_payout, 0),
      return_percent: returnPct,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
