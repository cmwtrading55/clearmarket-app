import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Try to extract user from JWT
    let userId = MOCK_USER_ID;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      // Try to get user from the token (won't work for anon key, which is fine)
      const supabaseUser = createClient(
        Deno.env.get("SUPABASE_URL")!,
        token
      );
      const { data: { user } } = await supabaseUser.auth.getUser(token);
      if (user?.id) {
        userId = user.id;
      }
    }

    const { market_id, side, order_type, price, quantity } = await req.json();

    if (!market_id || !side || !order_type || !quantity) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: market_id, side, order_type, quantity" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        market_id,
        side,
        order_type,
        status: "open",
        price: order_type === "limit" ? price : null,
        quantity,
        filled_quantity: 0,
        remaining_quantity: quantity,
        time_in_force: "gtc",
      })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ order }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
