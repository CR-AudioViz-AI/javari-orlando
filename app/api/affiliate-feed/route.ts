// app/api/affiliate-feed/route.ts — the affiliate roster, pulled live
//
// Orlando's affiliate config was a hardcoded object: Viator, GetYourGuide,
// Klook, DiscoverCars, Squaremouth. Every new AWIN approval needed a code change
// and a deploy before it could earn anything, so approvals sat unused.
//
// Measured before writing this: merchant_feeds holds 26 travel and tourism
// merchants — 2 joined, 19 pending, 5 rejected. Only Klook actually appears on
// the live site. The moment one of those 19 is approved it should start earning
// without anyone touching the code.
//
// This route reads the joined merchants from the database and merges them with
// the direct network relationships, so the roster grows on approval rather than
// on deploy.
//
// Rejected and pending merchants are never returned. Sending a customer to a
// merchant we are not approved with earns nothing and looks broken.
//
// CR AudioViz AI, LLC · EIN 39-3646201 · August 2026
import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const CACHE_TTL_MS = 15 * 60 * 1000
let cached: { at: number; body: unknown } | null = null

let _db: SupabaseClient | null = null
function db(): SupabaseClient | null {
  if (_db) return _db
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  _db = createClient(url, key, { auth: { persistSession: false } })
  return _db
}

/** Direct network relationships that do not live in merchant_feeds. */
const DIRECT = [
  { name: 'Klook', slug: 'klook', category: 'Attractions & Tickets',
    url: 'https://www.klook.com/en-US/city/17-orlando-things-to-do/', param: 'aid', id: '106921' },
  { name: 'Viator', slug: 'viator', category: 'Tours & Experiences',
    url: 'https://www.viator.com/Orlando/d662-ttd', param: 'pid', id: '' },
  { name: 'GetYourGuide', slug: 'getyourguide', category: 'Tours & Experiences',
    url: 'https://www.getyourguide.com/orlando-l190/', param: 'partner_id', id: '' },
  { name: 'DiscoverCars', slug: 'discovercars', category: 'Car Rental',
    url: 'https://www.discovercars.com/united-states/florida/orlando', param: 'a_aid', id: '' },
  { name: 'Squaremouth', slug: 'squaremouth', category: 'Travel Insurance',
    url: 'https://www.squaremouth.com/', param: 'utm_source', id: '' },
]

// The sectors AWIN actually uses for travel. Named rather than pattern-matched,
// because '%car%' silently matched 'Pets & Pet Care'.
const TRAVEL_SECTORS = [
  'Travel',
  'Travel Agencies',
  'Tourism & Attraction',
  'Tourism & Attractions',
  'Airlines',
  'Hotels & Accommodation',
  'Car Rental',
  'Cruises',
  'Travel Insurance',
]

interface Row {
  advertiser_name: string
  advertiser_id: string | null
  sector: string | null
  feed_url: string | null
  maps_to_category: string | null
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const fresh = request.nextUrl.searchParams.get('fresh') === '1'
  if (!fresh && cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json({ ...(cached.body as object), cached: true })
  }

  const sb = db()
  let joined: Row[] = []
  let pending = 0
  // A roster that returns nothing looks the same whether the database is
  // unreachable, the query is wrong, or there genuinely are no approvals.
  // Say which, so the next person does not spend an hour guessing.
  let diagnostic: string | null = sb ? null : 'Supabase not configured on this project'

  if (sb) {
    // Only merchants we are actually approved with. A pending or rejected
    // merchant sends the customer somewhere that earns nothing.
    const { data, error } = await sb
      .from('merchant_feeds')
      .select('advertiser_name, advertiser_id, sector, feed_url, maps_to_category')
      .eq('relationship', 'joined')
      // '%car%' matched 'Pets & Pet Care' and pulled twelve pet merchants into
      // a travel roster. Sectors are named explicitly instead of pattern-matched.
      .in('sector', TRAVEL_SECTORS)
      .limit(200)
    if (error) diagnostic = `merchant query failed: ${error.message}`
    joined = (data as Row[] | null) ?? []

    const { count } = await sb
      .from('merchant_feeds')
      .select('advertiser_id', { count: 'exact', head: true })
      .eq('relationship', 'pending')
      .in('sector', TRAVEL_SECTORS)
    pending = count ?? 0
  }

  const network = joined.map((m) => ({
    name: m.advertiser_name,
    slug: String(m.advertiser_name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    category: m.maps_to_category ?? m.sector ?? 'Travel',
    network: 'AWIN',
    advertiserId: m.advertiser_id,
    hasProductFeed: Boolean(m.feed_url),
  }))

  const body = {
    success: true,
    // Direct relationships and network approvals, in one roster.
    direct: DIRECT.filter((d) => d.id !== '' || d.slug === 'klook'),
    network,
    counts: {
      direct: DIRECT.length,
      network: network.length,
      // Surfaced so the pipeline is visible rather than silent — 19 pending
      // approvals are 19 revenue lines waiting on someone clicking accept.
      awaitingApproval: pending,
    },
    note:
      pending > 0
        ? `${pending} travel merchants are awaiting AWIN approval. They appear here automatically once approved — no deploy needed.`
        : undefined,
    diagnostic,
    generatedAt: new Date().toISOString(),
  }

  cached = { at: Date.now(), body }
  return NextResponse.json(body)
}
