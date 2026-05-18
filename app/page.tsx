// app/page.tsx — Orlando Trip Deal
export const dynamic = 'force-dynamic'
export default function Home() {
  const C = '#f59e0b'
  const deals = [
    { e:'🏰', t:'Walt Disney World', d:'Multi-day passes, character dining, resort deals' },
    { e:'🌍', t:'Universal Orlando', d:'Express passes, themed hotel packages, EPIC Universe' },
    { e:'🌊', t:'SeaWorld & Aquatica', d:'Discovery Cove, Antarctica, Halloween Spooktacular' },
    { e:'🐊', t:'Busch Gardens Tampa', d:'Day trips, multi-park passes, animal experiences' },
    { e:'✈️', t:'Flights & Hotels', d:'Best rates on Orlando hotels and flights via Klook' },
    { e:'🍽️', t:'Dining Deals', d:'Restaurant weeks, character dining, discount gift cards' },
  ]
  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(7,7,16,0.97)', borderBottom: '1px solid rgba(255,255,255,0.06)', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <a href="https://craudiovizai.com" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span>🏰</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#f59e0b' }}>Orlando Trip Deal</span>
        </a>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="https://craudiovizai.com/pricing" style={{ color: '#6b7280', fontSize: 13, textDecoration: 'none', padding: '5px 10px' }}>Pricing</a>
          <a href="https://craudiovizai.com/auth/signin" style={{ color: '#9ca3af', fontSize: 13, textDecoration: 'none', padding: '5px 10px' }}>Sign In</a>
          <a href="https://craudiovizai.com/auth/signup" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Get Started Free →</a>
        </div>
      </nav>
      <div style={{ height: 58 }} />
      <section style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏰</div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, margin: '0 0 16px' }}>
          Best Orlando Vacation Deals
        </h1>
        <p style={{ fontSize: 17, color: '#9ca3af', margin: '0 auto 32px', maxWidth: 520 }}>
          AI-curated deals on Disney, Universal, SeaWorld, flights, and hotels. Plan your perfect Orlando trip with Javari AI.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          <a href="https://craudiovizai.com/auth/signup" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', borderRadius: 12, padding: '14px 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
            Get Trip Deals Free →
          </a>
          <a href="https://javaritravel.com" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 24px', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
            ✈️ Full Travel Planner
          </a>
        </div>
        <p style={{ color: '#374151', fontSize: 13 }}>✓ Free · ✓ AI-powered · ✓ Klook affiliate savings</p>
      </section>
      <section style={{ padding: '0 24px 80px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {deals.map(d => (
            <div key={d.t} style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{d.e}</div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{d.t}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>{d.d}</div>
            </div>
          ))}
        </div>
      </section>
      <footer style={{ background: '#030308', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '24px', textAlign: 'center', color: '#374151', fontSize: 12 }}>
        <p style={{ margin: 0 }}>© 2026 CR AudioViz AI, LLC — EIN: 39-3646201 | orlandotripdeal.com | Powered by Javari</p>
      </footer>
    </div>
  )
}
