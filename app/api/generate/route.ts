// app/api/generate/route.ts — javari-orlando
// AI Orlando trip planner — powered by free models
// CR AudioViz AI · May 2026
import { NextRequest, NextResponse } from 'next/server'

async function callGemini(text: string): Promise<string> {
  const key = process.env.GOOGLE_GEMINI_API_KEY ?? process.env.GEMINI_API_KEY ?? ''
  if (!key) return ''
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text }] }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
        }),
      },
    )
    if (!res.ok) return ''
    const d = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
    return d.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  } catch {
    return ''
  }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

const GROQ = process.env.GROQ_API_KEY || ''
const OR = process.env.OPENROUTER_API_KEY || ''

const SYSTEM = `You are an expert Orlando vacation planner with deep knowledge of Disney World, Universal Orlando, SeaWorld, LEGOLAND, and all Orlando attractions. You know crowd patterns, best times to visit, insider tips, money-saving strategies, dining reservations, and how to maximize each park. Give specific, actionable advice.`

async function gen(prompt: string): Promise<string> {
  if (OR) {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OR}`, 'HTTP-Referer': 'https://craudiovizai.com' },
        body: JSON.stringify({ model: 'deepseek/deepseek-v4-flash:free', max_tokens: 2048, temperature: 0.7, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: prompt }] })
      })
      if (r.ok) { const d = await r.json() as any; const t = d.choices?.[0]?.message?.content ?? ''; if (t.length > 50) return t }
    } catch { /* fall through */ }
  }
  if (!GROQ) throw new Error('AI unavailable')
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ}` },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', max_tokens: 2048, temperature: 0.7, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: prompt }] })
  })
  // 2026-08-15: Gemini was missing from the cascade entirely, so a Groq 429
  // became a 500 the customer saw. Free tier two of the COST LAW.
  const gem = await callGemini(prompt)
  if (gem.length > 20) return gem

  if (!r.ok) throw new Error(`AI error ${r.status}`)
  const d = await r.json() as any
  return d.choices?.[0]?.message?.content ?? ''
}

export async function GET() {
  return NextResponse.json({ app: 'Javari Orlando', actions: ['trip_planner', 'itinerary', 'budget', 'dining', 'tips'] })
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json() as { action: string; input: string; context?: any }
    const result = await gen(b.input)
    return NextResponse.json({ result, credits_used: 3 })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
