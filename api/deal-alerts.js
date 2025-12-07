// Deal Alerts API - Uses notifications table workaround
// December 2025 - CR AudioViz AI

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, resort, targetPrice, travelDates, source } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const SUPABASE_URL = 'https://kteobfyferrukqeolofj.supabase.co';
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcyNjYsImV4cCI6MjA3NzU1NzI2Nn0.uy-jlF_z6qVb8qogsNyGDLHqT4HhmdRhLrW7zPv3qhY';

    const alertData = {
      email,
      resort: resort || 'any',
      target_price: targetPrice || null,
      travel_dates: travelDates || null,
      source: source || 'orlando-deals',
      signed_up_at: new Date().toISOString()
    };

    const notificationPayload = {
      type: 'deal_alert_signup',
      title: `Deal Alert: ${email}`,
      message: JSON.stringify(alertData),
      is_read: false,
      is_sent_email: false
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(notificationPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error:', errorText);
      throw new Error('Failed to save alert');
    }

    const result = await response.json();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Deal alert created successfully',
      id: result[0]?.id 
    });

  } catch (error) {
    console.error('Deal alert error:', error);
    return res.status(500).json({ error: 'Failed to create deal alert' });
  }
}
