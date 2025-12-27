import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Affiliate networks configuration
const AFFILIATE_NETWORKS = {
  getyourguide: {
    baseUrl: "https://www.getyourguide.com",
    trackingParam: "partner_id",
    partnerId: process.env.GETYOURGUIDE_PARTNER_ID
  },
  viator: {
    baseUrl: "https://www.viator.com",
    trackingParam: "pid",
    partnerId: process.env.VIATOR_PID
  },
  booking: {
    baseUrl: "https://www.booking.com",
    trackingParam: "aid",
    partnerId: process.env.BOOKING_AID
  },
  expedia: {
    baseUrl: "https://www.expedia.com",
    trackingParam: "affcid",
    partnerId: process.env.EXPEDIA_AFFCID
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "track_click": {
        const { dealId, userId, network, destinationUrl } = body;
        const sessionId = request.headers.get("x-session-id") || crypto.randomUUID();

        // Log click
        await supabase.from("affiliate_clicks").insert({
          deal_id: dealId,
          user_id: userId,
          session_id: sessionId,
          network,
          destination_url: destinationUrl,
          user_agent: request.headers.get("user-agent"),
          ip_hash: await hashIP(request.headers.get("x-forwarded-for") || ""),
          created_at: new Date().toISOString()
        });

        // Build affiliate URL
        const networkConfig = AFFILIATE_NETWORKS[network as keyof typeof AFFILIATE_NETWORKS];
        let affiliateUrl = destinationUrl;
        
        if (networkConfig?.partnerId) {
          const url = new URL(destinationUrl);
          url.searchParams.set(networkConfig.trackingParam, networkConfig.partnerId);
          url.searchParams.set("utm_source", "crav-orlando-deals");
          url.searchParams.set("utm_medium", "affiliate");
          url.searchParams.set("utm_campaign", dealId);
          affiliateUrl = url.toString();
        }

        return NextResponse.json({ 
          affiliateUrl,
          clickId: sessionId
        });
      }

      case "record_conversion": {
        // Called by affiliate network postback
        const { clickId, orderId, amount, commission, network } = body;

        // Verify click exists
        const { data: click } = await supabase
          .from("affiliate_clicks")
          .select("*")
          .eq("session_id", clickId)
          .single();

        if (!click) {
          return NextResponse.json({ error: "Click not found" }, { status: 404 });
        }

        // Record conversion
        await supabase.from("affiliate_conversions").insert({
          click_id: click.id,
          deal_id: click.deal_id,
          user_id: click.user_id,
          network,
          order_id: orderId,
          order_amount: amount,
          commission_amount: commission,
          status: "pending",
          created_at: new Date().toISOString()
        });

        // Credit user if they have an account (referral bonus)
        if (click.user_id) {
          const referralBonus = Math.round(commission * 0.1); // 10% of commission as credits
          if (referralBonus > 0) {
            await supabase.rpc("add_user_credits", {
              p_user_id: click.user_id,
              p_amount: referralBonus,
              p_reason: `Affiliate referral bonus: ${network}`
            });
          }
        }

        return NextResponse.json({ success: true });
      }

      case "get_deals": {
        const { category, location, priceRange, sortBy } = body;

        let query = supabase
          .from("deals")
          .select(`
            *,
            deal_images(url, alt),
            deal_reviews(rating, count)
          `)
          .eq("status", "active")
          .gte("expires_at", new Date().toISOString());

        if (category) query = query.eq("category", category);
        if (location) query = query.ilike("location", `%${location}%`);
        if (priceRange) {
          query = query.gte("price", priceRange.min).lte("price", priceRange.max);
        }

        const sortOptions: Record<string, any> = {
          price_low: { column: "price", ascending: true },
          price_high: { column: "price", ascending: false },
          rating: { column: "avg_rating", ascending: false },
          popular: { column: "click_count", ascending: false },
          newest: { column: "created_at", ascending: false }
        };

        const sort = sortOptions[sortBy] || sortOptions.popular;
        query = query.order(sort.column, { ascending: sort.ascending });

        const { data: deals, error } = await query.limit(50);
        if (error) throw error;

        return NextResponse.json({ deals });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + process.env.IP_SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

// GET endpoint for deal aggregation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";

    let query = supabase
      .from("deals")
      .select("*")
      .eq("status", "active")
      .gte("expires_at", new Date().toISOString());

    if (category) query = query.eq("category", category);
    if (featured) query = query.eq("is_featured", true);

    const { data, error } = await query
      .order("click_count", { ascending: false })
      .limit(featured ? 10 : 50);

    if (error) throw error;

    return NextResponse.json({
      deals: data,
      categories: ["theme-parks", "dining", "hotels", "tours", "experiences", "golf"]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
