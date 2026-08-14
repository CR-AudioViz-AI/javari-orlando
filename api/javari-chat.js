// Javari AI Chat API - Orlando Vacation Planning Expert
// Connects to Javari AI with Orlando-specific context
// December 5, 2025

export default async function handler(req, res) {
  // CORS headers
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
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Orlando-specific system prompt
    const ORLANDO_SYSTEM_PROMPT = `You are Javari, an expert AI assistant for Orlando vacation planning. You specialize in:

- Walt Disney World: All 4 theme parks, water parks, Disney Springs, and 25+ resorts
- Universal Orlando: Universal Studios, Islands of Adventure, Volcano Bay, and the upcoming Epic Universe
- SeaWorld Parks: SeaWorld Orlando, Aquatica, Discovery Cove, Busch Gardens Tampa
- Orlando area: LEGOLAND, Kennedy Space Center, I-Drive attractions

Your personality:
- Friendly, enthusiastic, and genuinely helpful
- You give honest advice, including when NOT to do something
- You share insider tips and money-saving tricks
- You personalize advice based on the guest's situation (family size, budget, dates, interests)
- You're concise but thorough

Key knowledge areas:
- Crowd levels and best times to visit
- Lightning Lane and Genie+ strategies
- Dining reservations and restaurant recommendations
- Resort comparisons and which to choose
- Budget planning and money-saving tips
- Ride height requirements for kids
- Special events (Mickey's Not-So-Scary, Food & Wine, etc.)
- Transportation options
- Current deals and discounts

Important rules:
- Always provide accurate, up-to-date information
- Be honest about downsides (crowds, costs, waits)
- Suggest alternatives when appropriate
- Never make up prices - say "prices vary" if unsure
- Recommend checking official sites for current pricing
- Keep responses helpful but concise (2-4 paragraphs max)

Current date context: December 2025`;

    // Try to connect to Javari AI backend first
    const JAVARI_API_URL = process.env.JAVARI_API_URL || 'https://javari-javari.vercel.app/api/chat';
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    // Try Javari API first
    try {
      const javariResponse = await fetch(JAVARI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          systemPrompt: ORLANDO_SYSTEM_PROMPT,
          context: 'orlando-planning',
          maxTokens: 500
        })
      });

      if (javariResponse.ok) {
        const data = await javariResponse.json();
        if (data.response || data.message) {
          return res.status(200).json({ 
            response: data.response || data.message,
            source: 'javari'
          });
        }
      }
    } catch (javariError) {
      console.log('Javari API not available, trying fallback...');
    }

    // Fallback to OpenAI if available
    if (OPENAI_API_KEY) {
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: ORLANDO_SYSTEM_PROMPT },
              { role: 'user', content: message }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });

        if (openaiResponse.ok) {
          const data = await openaiResponse.json();
          return res.status(200).json({ 
            response: data.choices[0].message.content,
            source: 'openai'
          });
        }
      } catch (openaiError) {
        console.log('OpenAI not available, trying Anthropic...');
      }
    }

    // Fallback to Anthropic if available
    if (ANTHROPIC_API_KEY) {
      try {
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 500,
            system: ORLANDO_SYSTEM_PROMPT,
            messages: [
              { role: 'user', content: message }
            ]
          })
        });

        if (anthropicResponse.ok) {
          const data = await anthropicResponse.json();
          return res.status(200).json({ 
            response: data.content[0].text,
            source: 'anthropic'
          });
        }
      } catch (anthropicError) {
        console.log('Anthropic not available...');
      }
    }

    // Smart fallback responses based on keywords
    const lowerMessage = message.toLowerCase();
    let fallbackResponse = '';

    if (lowerMessage.includes('crowd') || lowerMessage.includes('busy') || lowerMessage.includes('when to visit')) {
      fallbackResponse = `Great question about timing! 📆 Generally, the least crowded times at Disney World are:

• **January-February** (after MLK weekend)
• **Late August-September** (after kids go back to school)
• **Early December** (before Christmas rush)

The busiest times are spring break, summer, and Thanksgiving through New Year's. Check our Crowd Calendar tool for specific dates!`;
    }
    else if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('expensive') || lowerMessage.includes('money')) {
      fallbackResponse = `Let me help you budget! 💰 A typical Disney World trip for a family of 4 costs:

• **Budget Trip**: $3,000-4,500 (value resort, 4 days)
• **Mid-Range**: $5,000-7,500 (moderate resort, 5-6 days)
• **Deluxe**: $8,000-15,000+ (deluxe resort, full week)

Save money by: visiting off-peak, staying at Value resorts, bringing snacks, and using free transportation. Try our Budget Calculator for a personalized estimate!`;
    }
    else if (lowerMessage.includes('resort') || lowerMessage.includes('hotel') || lowerMessage.includes('stay')) {
      fallbackResponse = `Here's my quick resort guide! 🏨

• **Value Resorts** ($130-250/night): All-Star Movies, Pop Century, Art of Animation - great for budget-focused trips
• **Moderate Resorts** ($250-400/night): Caribbean Beach, Port Orleans - nice theming, better pools
• **Deluxe Resorts** ($450-1200/night): Grand Floridian, Polynesian - premium locations, amazing amenities

My top picks: Pop Century for value, Port Orleans Riverside for moderate, Wilderness Lodge for deluxe. What's your budget?`;
    }
    else if (lowerMessage.includes('lightning lane') || lowerMessage.includes('genie') || lowerMessage.includes('fast pass') || lowerMessage.includes('skip line')) {
      fallbackResponse = `Lightning Lane tips! ⚡

**Individual Lightning Lane** ($15-35/ride): Worth it for top rides like Flight of Passage, Guardians, Tron. Book at 7am!

**Lightning Lane Multi Pass** ($15-35/day): Skip lines on many attractions. Best for busy days.

**Strategy**: Rope drop for popular rides, use LL for ones with long afternoon waits. Check our Lightning Lane Guide for park-specific strategies!`;
    }
    else if (lowerMessage.includes('kid') || lowerMessage.includes('toddler') || lowerMessage.includes('child') || lowerMessage.includes('family')) {
      fallbackResponse = `Family tips! 👨‍👩‍👧‍👦

For toddlers & young kids:
• Magic Kingdom has the most rides for little ones
• Consider a stroller (rental available or bring your own)
• Plan for nap time - afternoon break at the hotel helps!
• Rider Switch lets adults take turns on thrill rides

Height requirements vary - use our Height Checker tool to see which rides your kids can enjoy. Character dining is magical for little ones too!`;
    }
    else if (lowerMessage.includes('dining') || lowerMessage.includes('restaurant') || lowerMessage.includes('eat') || lowerMessage.includes('food')) {
      fallbackResponse = `Dining tips! 🍽️

**Must-Try Restaurants:**
• Be Our Guest (Magic Kingdom) - stunning theming
• Space 220 (EPCOT) - out of this world views
• Ohana (Polynesian) - amazing family-style dinner

**Tips**: Book 60 days out for popular spots, mobile order at quick service saves time, bring snacks to save money!

Character dining is great for meeting characters without long lines. Prices range from $15-60+ per person.`;
    }
    else {
      fallbackResponse = `Thanks for your question! 🏰 I'm Javari, your Orlando planning expert.

I can help you with:
• **Timing**: When to visit, crowd calendars
• **Budget**: Cost estimates, money-saving tips
• **Hotels**: Resort comparisons, recommendations
• **Parks**: Ride tips, Lightning Lane strategy
• **Dining**: Restaurant reservations, character meals
• **Family**: Kid-friendly activities, height requirements

What specific aspect of your trip would you like help with?`;
    }

    return res.status(200).json({ 
      response: fallbackResponse,
      source: 'fallback'
    });

  } catch (error) {
    console.error('Javari chat error:', error);
    return res.status(500).json({ 
      error: 'I had trouble processing that. Please try again!',
      response: "I'm having a moment! 😅 Please try asking your question again, or browse our guides and tools for helpful Orlando planning info."
    });
  }
}
