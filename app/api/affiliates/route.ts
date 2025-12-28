/**
 * AFFILIATE TRACKING API
 * Orlando Trip Deal - CR AudioViz AI
 * 
 * Generates affiliate links with tracking
 * Logs clicks for analytics
 * Supports: Viator, GetYourGuide, Klook, Discover Cars, Squaremouth
 */

import { NextRequest, NextResponse } from "next/server";

// Affiliate configurations
const AFFILIATES = {
  viator: {
    baseUrl: "https://www.viator.com",
    param: "pid",
    id: process.env.VIATOR_PARTNER_ID || "P00280339",
    commission: 0.08,
    categories: ["tours", "attractions", "experiences"]
  },
  getyourguide: {
    baseUrl: "https://www.getyourguide.com",
    param: "partner_id",
    id: process.env.GETYOURGUIDE_PARTNER_ID || "VZYKZYE",
    commission: 0.08,
    categories: ["tours", "activities", "day-trips"]
  },
  klook: {
    baseUrl: "https://www.klook.com",
    param: "aid",
    id: process.env.KLOOK_AFFILIATE_ID || "106921",
    commission: 0.05,
    categories: ["theme-parks", "attractions", "transfers"]
  },
  discovercars: {
    baseUrl: "https://www.discovercars.com",
    param: "a_aid",
    id: process.env.DISCOVER_CARS_AFFILIATE || "royhenders",
    commission: 0.03,
    categories: ["car-rental"]
  },
  squaremouth: {
    baseUrl: "https://www.squaremouth.com",
    param: "affid",
    id: process.env.SQUAREMOUTH_AFFILIATE_ID || "23859",
    commission: 0.15,
    categories: ["travel-insurance"]
  }
};

// Orlando attractions with affiliate product IDs
const ORLANDO_PRODUCTS = {
  "disney-world": {
    viator: "d828-2425P100",
    getyourguide: "orlando-l171",
    klook: "15342"
  },
  "universal-studios": {
    viator: "d828-3526P27",
    getyourguide: "orlando-l171",
    klook: "15343"
  },
  "seaworld": {
    viator: "d828-3929SEA",
    getyourguide: "orlando-l171",
    klook: "15344"
  },
  "kennedy-space-center": {
    viator: "d828-5043P24",
    getyourguide: "orlando-l171",
    klook: "15345"
  },
  "legoland": {
    viator: "d828-16242P1",
    getyourguide: "orlando-l171",
    klook: "15346"
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const affiliate = searchParams.get("affiliate");
  const product = searchParams.get("product");
  const destination = searchParams.get("destination");

  switch (action) {
    case "link": {
      // Generate affiliate link
      if (!affiliate || !AFFILIATES[affiliate as keyof typeof AFFILIATES]) {
        return NextResponse.json({ error: "Invalid affiliate" }, { status: 400 });
      }

      const config = AFFILIATES[affiliate as keyof typeof AFFILIATES];
      let url = config.baseUrl;
      
      // Add product path if specified
      if (product && ORLANDO_PRODUCTS[product as keyof typeof ORLANDO_PRODUCTS]) {
        const productId = ORLANDO_PRODUCTS[product as keyof typeof ORLANDO_PRODUCTS][affiliate as keyof typeof ORLANDO_PRODUCTS["disney-world"]];
        if (productId) {
          url = `${url}/tours/${productId}`;
        }
      } else if (destination) {
        url = `${url}/${destination}`;
      }

      // Add affiliate tracking
      const separator = url.includes("?") ? "&" : "?";
      const affiliateUrl = `${url}${separator}${config.param}=${config.id}`;

      return NextResponse.json({
        affiliate,
        url: affiliateUrl,
        commission: `${config.commission * 100}%`,
        product
      });
    }

    case "compare": {
      // Get all affiliate links for a product
      if (!product) {
        return NextResponse.json({ error: "Product required" }, { status: 400 });
      }

      const links = Object.entries(AFFILIATES).map(([name, config]) => {
        let url = config.baseUrl;
        const productConfig = ORLANDO_PRODUCTS[product as keyof typeof ORLANDO_PRODUCTS];
        
        if (productConfig && productConfig[name as keyof typeof productConfig]) {
          url = `${url}/tours/${productConfig[name as keyof typeof productConfig]}`;
        } else {
          url = `${url}/orlando-attractions`;
        }

        const separator = url.includes("?") ? "&" : "?";
        return {
          provider: name,
          url: `${url}${separator}${config.param}=${config.id}`,
          commission: `${config.commission * 100}%`
        };
      });

      return NextResponse.json({ product, providers: links });
    }

    case "stats": {
      return NextResponse.json({
        affiliates: Object.keys(AFFILIATES),
        products: Object.keys(ORLANDO_PRODUCTS),
        commissions: Object.fromEntries(
          Object.entries(AFFILIATES).map(([k, v]) => [k, `${v.commission * 100}%`])
        )
      });
    }

    default:
      return NextResponse.json({
        message: "Orlando Trip Deal Affiliate API",
        actions: {
          "link": "?action=link&affiliate=viator&product=disney-world",
          "compare": "?action=compare&product=disney-world",
          "stats": "?action=stats"
        },
        affiliates: Object.keys(AFFILIATES)
      });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, affiliate, product, user_id, session_id } = body;

    switch (action) {
      case "click": {
        // Log affiliate click for analytics
        // This would be logged to Supabase in production
        console.log("Affiliate click:", { affiliate, product, user_id, session_id, timestamp: new Date().toISOString() });
        
        return NextResponse.json({ 
          success: true, 
          message: "Click tracked",
          affiliate,
          product
        });
      }

      case "conversion": {
        // Log conversion (would be called by webhook)
        console.log("Affiliate conversion:", { affiliate, product, user_id, timestamp: new Date().toISOString() });
        
        return NextResponse.json({ 
          success: true, 
          message: "Conversion tracked"
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

