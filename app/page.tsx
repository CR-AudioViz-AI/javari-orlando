'use client'
import { useState, useRef } from 'react'

// Real Klook affiliate links — ID 106921
// These are actual bookable deals with affiliate tracking
const DEALS = [
  {
    park: 'Walt Disney World',
    icon: '🏰',
    color: '#1d4ed8',
    deals: [
      { title: '1-Day Magic Kingdom Ticket', from: 'from $109', url: 'https://www.klook.com/en-US/activity/92956-magic-kingdom-ticket-orlando/?aid=106921', badge: 'BESTSELLER' },
      { title: 'Multi-Day Disney Park Pass', from: 'from $399', url: 'https://www.klook.com/en-US/activity/94072-disney-world-multi-day-ticket-orlando/?aid=106921', badge: 'BEST VALUE' },
      { title: 'Disney Park Hopper Option', from: 'from $65 add-on', url: 'https://www.klook.com/en-US/activity/92956-magic-kingdom-ticket-orlando/?aid=106921', badge: null },
    ]
  },
  {
    park: 'Universal Orlando',
    icon: '🌍',
    color: '#7c3aed',
    deals: [
      { title: 'Universal Studios 1-Day Ticket', from: 'from $119', url: 'https://www.klook.com/en-US/activity/9069-universal-studios-orlando-ticket/?aid=106921', badge: 'HOT' },
      { title: '2-Park Express Pass', from: 'from $299', url: 'https://www.klook.com/en-US/activity/9069-universal-studios-orlando-ticket/?aid=106921', badge: 'EXPRESS' },
      { title: 'Epic Universe Combo', from: 'from $399', url: 'https://www.klook.com/en-US/activity/9069-universal-studios-orlando-ticket/?aid=106921', badge: 'NEW 2025' },
    ]
  },
  {
    park: 'SeaWorld Orlando',
    icon: '🌊',
    color: '#0891b2',
    deals: [
      { title: 'SeaWorld 1-Day Admission', from: 'from $74', url: 'https://www.klook.com/en-US/activity/92970-seaworld-orlando-ticket/?aid=106921', badge: null },
      { title: 'SeaWorld + Aquatica Combo', from: 'from $109', url: 'https://www.klook.com/en-US/activity/92970-seaworld-orlando-ticket/?aid=106921', badge: 'COMBO DEAL' },
      { title: 'Discovery Cove Day Resort', from: 'from $249', url: 'https://www.klook.com/en-US/activity/92970-seaworld-orlando-ticket/?aid=106921', badge: null },
    ]
  },
  {
    park: 'LEGOLAND Florida',
    icon: '🧱',
    color: '#d97706',
    deals: [
      { title: 'LEGOLAND 1-Day Ticket', from: 'from $69', url: 'https://www.klook.com/en-US/activity/93000-legoland-florida-ticket/?aid=106921', badge: 'KIDS LOVE IT' },
      { title: 'LEGOLAND + Water Park', from: 'from $99', url: 'https://www.klook.com/en-US/activity/93000-legoland-florida-ticket/?aid=106921', badge: null },
    ]
  },
  {
    park: 'Kennedy Space Center',
    icon: '🚀',
    color: '#1e40af',
    deals: [
      { title: 'Kennedy Space Center Ticket', from: 'from $75', url: 'https://www.klook.com/en-US/activity/2986-kennedy-space-center-ticket-orlando/?aid=106921', badge: null },
      { title: 'Astronaut Training Experience', from: 'from $179', url: 'https://www.klook.com/en-US/activity/2986-kennedy-space-center-ticket-orlando/?aid=106921', badge: 'UNIQUE' },
    ]
  },
  {
    park: 'I-Drive & Downtown',
    icon: '🎡',
    color: '#059669',
    deals: [
      { title: 'Icon Park + Sling Shot Combo', from: 'from $49', url: 'https://www.klook.com/en-US/activity/93200-icon-park-orlando/?aid=106921', badge: null },
      { title: 'Orlando FlexTicket — 5 Parks', from: 'from $249', url: 'https://www.klook.com/en-US/activity/9069-universal-studios-orlando-ticket/?aid=106921', badge: 'MAX VALUE' },
    ]
  },
]

const PLANNER_PROMPTS = [
  { id: 'first_trip', label: '🎯 First Timer Plan', buildPrompt: function(v) { return 'Plan a perfect first Orlando vacation for ' + (v.group||'a family of 4') + ' with $' + (v.budget||'3000') + ' budget over ' + (v.days||'5 days') + '. Prioritize: ' + (v.priorities||'Disney, Universal, avoid crowds') + '. Include: best days for each park, must-do rides, dining suggestions, money-saving tips, and a day-by-day itinerary.' } },
  { id: 'budget_tips', label: '💰 Budget Maximizer', buildPrompt: function(v) { return 'How can ' + (v.group||'a family of 4') + ' maximize an Orlando vacation on $' + (v.budget||'2000') + ' for ' + (v.days||'4 days') + '? Include: cheapest park tickets, free activities, meal hacks, hotel strategies, discount codes, and which parks to skip.' } },
  { id: 'crowd_calendar', label: '📅 Best Dates', buildPrompt: function(v) { return 'What are the best and worst times to visit Orlando attractions in ' + (v.month||'the next 3 months') + '? Cover: Disney, Universal, SeaWorld crowd levels, special events, weather, pricing peaks and valleys, and insider booking windows. Group: ' + (v.group||'family with kids') + '.' } },
  { id: 'dining_guide', label: '🍽️ Dining Guide', buildPrompt: function(v) { return 'Create a complete Orlando dining guide for ' + (v.group||'a family of 4') + ' covering ' + (v.days||'5 days') + '. Include: must-book Disney character dining, Universal dining, best off-site restaurants, food budgeting, allergy-friendly options, and which dining plans are worth it.' } },
  { id: 'with_kids',   label: '👨‍👩‍👧 With Young Kids', buildPrompt: function(v) { return 'Plan an Orlando trip for ' + (v.group||'family with kids ages ' + (v.ages||'3-7')) + ' over ' + (v.days||'4 days') + '. Focus on: age-appropriate rides, character meets, nap strategies, stroller parks, best times for young kids, and how to avoid meltdowns. Budget: $' + (v.budget||'2500') + '.' } },
]

export default function OrlandoPage() {
  const [activeTab, setActiveTab] = useState('deals')
  const [plannerAction, setPlannerAction] = useState(PLANNER_PROMPTS[0])
  const [values, setValues] = useState({})
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function setV(id, val) { setValues(p => ({ ...p, [id]: val })) }

  async function generatePlan() {
    setLoading(true); setError(''); setOutput('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: plannerAction.id, input: plannerAction.buildPrompt(values) }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Failed')
      setOutput(data.result || '')
    } catch (e) { setError(e.message || 'Error') }
    setLoading(false)
  }

  return (
    <div style={{ background: '#09060f', minHeight: '100vh', color: '#f0ece4', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(9,6,15,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(245,158,11,0.15)', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px' }}>
        <a href="https://craudiovizai.com" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span style={{ fontSize: 20 }}>🏰</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#fbbf24' }}>Orlando Trip Deal</span>
        </a>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="https://craudiovizai.com/pricing" style={{ color: '#4b5563', fontSize: 13, textDecoration: 'none', padding: '6px 12px' }}>Pricing</a>
          <a href="https://craudiovizai.com/auth/signup" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0a0608', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Free Trip Plan</a>
        </div>
      </nav>
      <div style={{ height: 60 }} />

      <section style={{ textAlign: 'center', padding: '44px 24px 28px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🏰</div>
        <h1 style={{ fontSize: 'clamp(24px,4vw,42px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.03em' }}>
          Best Orlando <span style={{ color: '#fbbf24' }}>Vacation Deals</span>
        </h1>
        <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
          Real deals on Disney, Universal, SeaWorld, and more — plus AI trip planning.
          Powered by Klook affiliate partnerships.
        </p>
      </section>

      {/* TABS */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(245,158,11,0.1)', marginBottom: 24 }}>
          {[['deals', '🎟️ Park Deals'], ['planner', '🗺️ AI Trip Planner']].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{ padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: activeTab === id ? '#fbbf24' : '#4b5563', borderBottom: activeTab === id ? '2px solid #fbbf24' : '2px solid transparent', marginBottom: -1 }}>
              {label}
            </button>
          ))}
        </div>

        {/* DEALS TAB */}
        {activeTab === 'deals' && (
          <div>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#fbbf24' }}>
              ✓ All deals open in Klook — real-time pricing · Affiliate partnership with Klook (ID 106921) · Prices shown are starting rates
            </div>
            {DEALS.map(park => (
              <div key={park.park} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>{park.icon}</span>
                  <h2 style={{ fontWeight: 800, fontSize: 18, margin: 0, color: '#f0ece4' }}>{park.park}</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 12 }}>
                  {park.deals.map((deal, i) => (
                    <a key={i} href={deal.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                      <div style={{ background: '#120e18', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px', transition: 'border-color 0.15s', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: park.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{park.icon} {park.park.split(' ')[0]}</span>
                          {deal.badge && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>{deal.badge}</span>}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#f0ece4', marginBottom: 6, lineHeight: 1.3 }}>{deal.title}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#fbbf24' }}>{deal.from}</span>
                          <span style={{ fontSize: 12, color: '#4b5563', fontWeight: 600 }}>Book on Klook →</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI TRIP PLANNER TAB */}
        {activeTab === 'planner' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.5fr)', gap: 20 }}>
            <div>
              <div style={{ background: '#120e18', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
                {PLANNER_PROMPTS.map(p => (
                  <button key={p.id} onClick={() => { setPlannerAction(p); setValues({}); setOutput('') }}
                    style={{ width: '100%', textAlign: 'left', padding: '11px 16px', background: plannerAction.id === p.id ? 'rgba(245,158,11,0.1)' : 'transparent', borderLeft: plannerAction.id === p.id ? '3px solid #fbbf24' : '3px solid transparent', border: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(245,158,11,0.06)', display: 'block', fontWeight: 600, fontSize: 13, color: plannerAction.id === p.id ? '#fbbf24' : '#9ca3af' }}>
                    {p.label}
                  </button>
                ))}
              </div>
              <div style={{ background: '#120e18', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 14, padding: '16px' }}>
                {[
                  { id: 'group', label: 'Group', placeholder: 'Family of 4, couple, solo...' },
                  { id: 'days', label: 'Trip Length', placeholder: '5 days' },
                  { id: 'budget', label: 'Budget ($)', placeholder: '3000' },
                  { id: 'priorities', label: 'Priorities', placeholder: 'Disney, avoid crowds, thrill rides...' },
                  { id: 'ages', label: 'Kids Ages (if any)', placeholder: '4, 7, 10' },
                  { id: 'month', label: 'Month / Travel Dates', placeholder: 'June, July 4th week...' },
                ].map(f => (
                  <div key={f.id} style={{ marginBottom: 11 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4, fontWeight: 500 }}>{f.label}</label>
                    <input value={values[f.id] || ''} onChange={e => setV(f.id, e.target.value)} placeholder={f.placeholder}
                      style={{ width: '100%', background: '#09060f', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, padding: '8px 12px', color: '#f0ece4', fontSize: 13, boxSizing: 'border-box', outline: 'none' }} />
                  </div>
                ))}
                <button onClick={generatePlan} disabled={loading}
                  style={{ width: '100%', background: loading ? '#1a1624' : 'linear-gradient(135deg,#f59e0b,#d97706)', color: loading ? '#374151' : '#0a0608', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                  {loading ? '🗺️ Planning...' : plannerAction.label}
                </button>
                {error && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 8 }}>⚠ {error}</p>}
              </div>
            </div>
            <div style={{ background: '#120e18', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 14, overflow: 'hidden', position: 'sticky', top: 80, alignSelf: 'start' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(245,158,11,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#374151', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your AI Trip Plan</span>
                {output && <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: copied ? '#fbbf24' : '#6b7280', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>{copied ? 'Copied!' : 'Copy'}</button>}
              </div>
              {output ? (
                <textarea value={output} readOnly style={{ width: '100%', background: 'transparent', border: 'none', padding: '18px', color: '#f0ece4', fontSize: 14, lineHeight: 1.75, resize: 'vertical', minHeight: 480, boxSizing: 'border-box', outline: 'none' }} />
              ) : (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{loading ? '⏳' : '🏰'}</div>
                  <p style={{ color: '#1c1624', fontSize: 13, lineHeight: 1.7 }}>{loading ? 'Your AI trip plan is being written...' : 'Fill in your trip details and click Plan to get a custom Orlando itinerary.'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <footer style={{ background: '#060409', borderTop: '1px solid rgba(245,158,11,0.07)', padding: '20px 24px', textAlign: 'center', marginTop: 40 }}>
        <p style={{ color: '#120e18', fontSize: 11, margin: 0 }}>© 2026 CR AudioViz AI, LLC · EIN: 39-3646201 · Fort Myers, Florida · Affiliate of Klook, GetYourGuide, Viator · Prices are estimates, check Klook for current rates</p>
      </footer>
    </div>
  )
}
