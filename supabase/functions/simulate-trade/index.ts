import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BOT_ALPHA = "00000000-0000-0000-0000-00000000bb01";
const BOT_BETA = "00000000-0000-0000-0000-00000000bb02";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { market_id, tick_count = 0 } = await req.json();
    if (!market_id) {
      return new Response(JSON.stringify({ error: "market_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Read current ticker
    const { data: ticker, error: tickerErr } = await supabase
      .from("market_tickers")
      .select("*")
      .eq("market_id", market_id)
      .single();

    if (tickerErr || !ticker) {
      return new Response(JSON.stringify({ error: "Ticker not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lastPrice = Number(ticker.last_price);

    // 2. Read market symbol for commodity-aware volatility
    const { data: market } = await supabase
      .from("markets")
      .select("symbol")
      .eq("id", market_id)
      .single();

    const symbol = market?.symbol || "";

    // Commodity-aware volatility and trade sizes
    // Soybeans: tighter moves (real commodity), larger lots
    // Cannabis tokens: wider moves (speculative), smaller lots
    const isSoybean = symbol.startsWith("SOY");
    const volatility = isSoybean ? 0.002 : 0.006; // ±0.1% vs ±0.3%
    const minQty = isSoybean ? 5 : 1;
    const maxQty = isSoybean ? 200 : 50;
    const spreadBps = isSoybean ? 0.003 : 0.002; // 0.3% vs 0.2%

    const change = (Math.random() - 0.5) * volatility;
    const newPrice = Math.max(0.01, +(lastPrice * (1 + change)).toFixed(4));
    const quantity = Math.floor(Math.random() * (maxQty - minQty)) + minQty;
    const isBuy = Math.random() > 0.5;
    const buyerId = isBuy ? BOT_ALPHA : BOT_BETA;
    const sellerId = isBuy ? BOT_BETA : BOT_ALPHA;
    const now = new Date().toISOString();

    // 3. Insert paired buy + sell orders (filled)
    const { data: buyOrder } = await supabase
      .from("orders")
      .insert({
        user_id: buyerId,
        market_id,
        side: "buy",
        order_type: "market",
        status: "filled",
        price: newPrice,
        quantity,
        filled_quantity: quantity,
        remaining_quantity: 0,
        time_in_force: "ioc",
      })
      .select("id")
      .single();

    const { data: sellOrder } = await supabase
      .from("orders")
      .insert({
        user_id: sellerId,
        market_id,
        side: "sell",
        order_type: "market",
        status: "filled",
        price: newPrice,
        quantity,
        filled_quantity: quantity,
        remaining_quantity: 0,
        time_in_force: "ioc",
      })
      .select("id")
      .single();

    // 4. Insert trade record
    await supabase.from("trades").insert({
      market_id,
      buy_order_id: buyOrder?.id,
      sell_order_id: sellOrder?.id,
      buyer_id: buyerId,
      seller_id: sellerId,
      price: newPrice,
      quantity,
      is_maker_buy: isBuy,
      executed_at: now,
    });

    // 5. Update market_ticker
    const volume24h = Number(ticker.volume_24h || 0) + quantity;
    const high24h = Math.max(Number(ticker.high_24h || newPrice), newPrice);
    const low24h = Math.min(Number(ticker.low_24h || newPrice), newPrice);
    const spread = +(newPrice * spreadBps).toFixed(4);
    const bid = +(newPrice - spread / 2).toFixed(4);
    const ask = +(newPrice + spread / 2).toFixed(4);

    await supabase
      .from("market_tickers")
      .update({
        last_price: newPrice,
        best_bid: bid,
        best_ask: ask,
        volume_24h: volume24h,
        high_24h: high24h,
        low_24h: low24h,
        last_trade_at: now,
        updated_at: now,
      })
      .eq("market_id", market_id);

    // 6. Upsert current 1h candle
    const hourStart = new Date();
    hourStart.setMinutes(0, 0, 0);
    const openTime = hourStart.toISOString();

    const { data: existingCandle } = await supabase
      .from("market_candles")
      .select("*")
      .eq("market_id", market_id)
      .eq("interval", "1h")
      .eq("open_time", openTime)
      .single();

    if (existingCandle) {
      await supabase
        .from("market_candles")
        .update({
          high: Math.max(Number(existingCandle.high), newPrice),
          low: Math.min(Number(existingCandle.low), newPrice),
          close: newPrice,
          volume: Number(existingCandle.volume) + quantity,
          trade_count: (existingCandle.trade_count || 0) + 1,
        })
        .eq("id", existingCandle.id);
    } else {
      await supabase.from("market_candles").insert({
        market_id,
        interval: "1h",
        open_time: openTime,
        open: newPrice,
        high: newPrice,
        low: newPrice,
        close: newPrice,
        volume: quantity,
        trade_count: 1,
      });
    }

    // 7. Every 5th tick: refresh orderbook depth
    if (tick_count % 5 === 0) {
      // Delete old bot limit orders
      await supabase
        .from("orders")
        .delete()
        .eq("market_id", market_id)
        .eq("status", "open")
        .eq("order_type", "limit")
        .in("user_id", [BOT_ALPHA, BOT_BETA]);

      // Insert 15 bid levels + 15 ask levels
      const orderRows = [];
      for (let i = 1; i <= 15; i++) {
        const bidPrice = +(newPrice * (1 - i * 0.001)).toFixed(4);
        const askPrice = +(newPrice * (1 + i * 0.001)).toFixed(4);
        const bidQty = Math.floor(Math.random() * 80) + 10;
        const askQty = Math.floor(Math.random() * 80) + 10;

        orderRows.push({
          user_id: BOT_ALPHA,
          market_id,
          side: "buy",
          order_type: "limit",
          status: "open",
          price: bidPrice,
          quantity: bidQty,
          filled_quantity: 0,
          remaining_quantity: bidQty,
          time_in_force: "gtc",
        });
        orderRows.push({
          user_id: BOT_BETA,
          market_id,
          side: "sell",
          order_type: "limit",
          status: "open",
          price: askPrice,
          quantity: askQty,
          filled_quantity: 0,
          remaining_quantity: askQty,
          time_in_force: "gtc",
        });
      }

      await supabase.from("orders").insert(orderRows);
    }

    return new Response(
      JSON.stringify({ price: newPrice, quantity, side: isBuy ? "buy" : "sell" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
