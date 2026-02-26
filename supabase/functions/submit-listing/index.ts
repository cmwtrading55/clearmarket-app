import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// --- Oracle logic (server-side mirror of lib/oracle.ts) ---

const FIVE_PT_FIELDS = [
  "strain",
  "description",
  "hero_image",
  "region",
  "yield_kg",
  "harvest_date",
  "funding_target",
  "price_per_token",
  "thc_percent",
  "cbd_percent",
  "grow_method",
  "lighting",
  "nutrients",
  "facility_certification",
  "lab_testing_provider",
  "expected_terpene_profile",
  "token_symbol",
  "grower_location",
];

const TEN_PT_FIELDS = ["insurance_coverage"];

function hasValue(v: unknown): boolean {
  if (v === null || v === undefined || v === "") return false;
  if (typeof v === "number") return v > 0;
  if (typeof v === "boolean") return v;
  return true;
}

function calcCompleteness(data: Record<string, unknown>): number {
  let score = 0;
  for (const f of FIVE_PT_FIELDS) {
    if (hasValue(data[f])) score += 5;
  }
  for (const f of TEN_PT_FIELDS) {
    if (hasValue(data[f])) score += 10;
  }
  return Math.min(score, 100);
}

function calcBuyerBonus(data: Record<string, unknown>): number {
  if (data.contracted_buyer && hasValue(data.contracted_buyer_name)) return 25;
  if (data.contracted_buyer) return 15;
  return 0;
}

interface OracleResult {
  completeness: number;
  buyerBonus: number;
  historyScore: number;
  composite: number;
  discount: number;
  riskGrade: "A" | "B" | "C" | "D";
}

function calcOracle(
  data: Record<string, unknown>,
  historyScore: number
): OracleResult {
  const completeness = calcCompleteness(data);
  const buyerBonus = calcBuyerBonus(data);
  const composite = completeness * 0.4 + buyerBonus * 0.8 + historyScore * 0.4;
  const capped = Math.min(composite, 100);
  const discount = +(40 - (capped / 100) * 35).toFixed(1);

  let riskGrade: "A" | "B" | "C" | "D";
  if (capped >= 75) riskGrade = "A";
  else if (capped >= 50) riskGrade = "B";
  else if (capped >= 25) riskGrade = "C";
  else riskGrade = "D";

  return { completeness, buyerBonus, historyScore, composite, discount, riskGrade };
}

// --- Handler ---

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();

    if (!body.strain || !body.grower_wallet) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: strain, grower_wallet",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculate history score from existing listings by same wallet
    const { data: pastListings } = await supabase
      .from("launchpad_listings")
      .select("status")
      .eq("grower_wallet", body.grower_wallet);

    let historyScore = 0;
    if (pastListings) {
      const settled = pastListings.filter(
        (l: { status: string }) =>
          l.status === "approved" || l.status === "funding"
      ).length;
      const listed = pastListings.length;
      historyScore = Math.min(Math.min(settled * 20, 60) + Math.min(listed * 10, 40), 100);
    }

    const oracle = calcOracle(body, historyScore);

    const row = {
      grower_wallet: body.grower_wallet,
      grower_name: body.grower_name || null,
      grower_location: body.grower_location || null,
      grower_type: body.grower_type || null,
      strain: body.strain,
      description: body.description || null,
      hero_image: body.hero_image || null,
      region: body.region || null,
      yield_kg: body.yield_kg || null,
      thc_percent: body.thc_percent || null,
      cbd_percent: body.cbd_percent || null,
      harvest_date: body.harvest_date || null,
      funding_target: body.funding_target || null,
      price_per_token: body.price_per_token || null,
      token_symbol: body.token_symbol || null,
      grow_method: body.grow_method || null,
      lighting: body.lighting || null,
      nutrients: body.nutrients || null,
      facility_certification: body.facility_certification || null,
      lab_testing_provider: body.lab_testing_provider || null,
      expected_terpene_profile: body.expected_terpene_profile || null,
      insurance_coverage: body.insurance_coverage || false,
      contracted_buyer: body.contracted_buyer || false,
      contracted_buyer_name: body.contracted_buyer_name || null,
      completeness_score: oracle.completeness,
      history_score: oracle.historyScore,
      oracle_discount_pct: oracle.discount,
      risk_grade: oracle.riskGrade,
      status: "pending_review",
    };

    const { data: listing, error } = await supabase
      .from("launchpad_listings")
      .insert(row)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ listing }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
