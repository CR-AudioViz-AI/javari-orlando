// app/layout.tsx — Orlando Trip Deal
// Fortune 50 shell — auth, nav, Javari AI widget
// CR AudioViz AI, LLC · May 2026
import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Orlando Trip Deal | Best Orlando Theme Park Deals',
  description: 'AI-powered Orlando trip planning — best deals on Disney, Universal, SeaWorld and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#07080f' }}>
        {children}
      </body>
    </html>
  )
}
