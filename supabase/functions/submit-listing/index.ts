import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// --- Cannabis oracle scoring engine ---

interface ScoringField {
  key: string;
  points: number;
}

const SCORING_FIELDS: ScoringField[] = [
  { key: "strain", points: 5 },
  { key: "description", points: 5 },
  { key: "hero_image", points: 5 },
  { key: "region", points: 5 },
  { key: "yield_kg", points: 5 },
  { key: "harvest_date", points: 5 },
  { key: "funding_target", points: 5 },
  { key: "price_per_token", points: 5 },
  { key: "thc_percent", points: 5 },
  { key: "cbd_percent", points: 5 },
  { key: "grow_method", points: 5 },
  { key: "lighting", points: 5 },
  { key: "nutrients", points: 5 },
  { key: "facility_certification", points: 5 },
  { key: "lab_testing_provider", points: 5 },
  { key: "expected_terpene_profile", points: 5 },
  { key: "token_symbol", points: 5 },
  { key: "grower_location", points: 5 },
  { key: "insurance_coverage", points: 10 },
];

function hasValue(v: unknown): boolean {
  if (v === null || v === undefined || v === "") return false;
  if (typeof v === "number") return v > 0;
  if (typeof v === "boolean") return v;
  return true;
}

function calcCompleteness(data: Record<string, unknown>): number {
  let score = 0;
  for (const f of SCORING_FIELDS) {
    if (hasValue(data[f.key])) score += f.points;
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

    if (!body.strain) {
      return new Response(
        JSON.stringify({ error: "Missing required field: strain" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!body.grower_wallet) {
      return new Response(
        JSON.stringify({ error: "Missing required field: grower_wallet" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    const row: Record<string, unknown> = {
      commodity_type: "cannabis",
      grower_wallet: body.grower_wallet,
      grower_name: body.grower_name || null,
      grower_location: body.grower_location || null,
      grower_type: body.grower_type || null,
      description: body.description || null,
      hero_image: body.hero_image || null,
      region: body.region || null,
      harvest_date: body.harvest_date || null,
      funding_target: body.funding_target || null,
      funding_raised: 0,
      investor_count: 0,
      price_per_token: body.price_per_token || null,
      token_symbol: body.token_symbol || null,
      insurance_coverage: body.insurance_coverage || false,
      contracted_buyer: body.contracted_buyer || false,
      contracted_buyer_name: body.contracted_buyer_name || null,
      // Cannabis fields
      strain: body.strain || null,
      yield_kg: body.yield_kg || null,
      thc_percent: body.thc_percent || null,
      cbd_percent: body.cbd_percent || null,
      grow_method: body.grow_method || null,
      lighting: body.lighting || null,
      nutrients: body.nutrients || null,
      facility_certification: body.facility_certification || null,
      lab_testing_provider: body.lab_testing_provider || null,
      expected_terpene_profile: body.expected_terpene_profile || null,
      // Oracle scores
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
