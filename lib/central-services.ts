/**
 * CR AudioViz AI - Central Services Integration
 * 
 * This file connects crav-orlando-deals to the centralized services
 * hosted at craudiovizai.com per the Henderson Standard.
 * 
 * ALL shared functionality goes through these APIs:
 * - Email alerts
 * - AI predictions
 * - Payments
 * - Authentication
 * - Cross-sell
 * 
 * @author CR AudioViz AI
 * @created December 25, 2025
 */

const CENTRAL_API = process.env.NEXT_PUBLIC_CENTRAL_API || 'https://craudiovizai.com/api';

// ============================================================
// EMAIL ALERTS (Central Service)
// ============================================================

export interface DealAlertData {
  dealType: 'hotel' | 'ticket' | 'package' | 'dvc' | 'flight';
  destination?: string;
  originalPrice: number;
  newPrice: number;
  savings: number;
  savingsPercent: number;
  dealUrl: string;
  expiresAt?: string;
  provider?: string;
}

export async function sendDealAlert(
  to: string | string[],
  dealData: DealAlertData,
  userId?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(`${CENTRAL_API}/email/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'deal_alert',
        to,
        data: dealData,
        userId,
        appId: 'orlando-deals',
      }),
    });
    return response.json();
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function sendPricePredictionAlert(
  to: string | string[],
  predictionData: {
    destination: string;
    currentPrice: number;
    predictedPrice: number;
    predictedDate: string;
    confidence: number;
    recommendation: 'book_now' | 'wait' | 'uncertain';
    explanation: string;
  },
  userId?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(`${CENTRAL_API}/email/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'price_prediction',
        to,
        data: predictionData,
        userId,
        appId: 'orlando-deals',
      }),
    });
    return response.json();
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getEmailPreferences(userId: string) {
  try {
    const response = await fetch(`${CENTRAL_API}/email/alerts?userId=${userId}`);
    return response.json();
  } catch (error) {
    return { error: String(error) };
  }
}

export async function updateEmailPreferences(userId: string, preferences: Record<string, boolean>) {
  try {
    const response = await fetch(`${CENTRAL_API}/email/alerts`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, preferences }),
    });
    return response.json();
  } catch (error) {
    return { error: String(error) };
  }
}

// ============================================================
// AI PREDICTIONS (Central Service)
// ============================================================

export type PredictionType = 
  | 'price_forecast'
  | 'demand_forecast'
  | 'sentiment'
  | 'recommendation'
  | 'trend_analysis';

export async function getPricePrediction(data: {
  currentPrice: number;
  historicalPrices?: { date: string; price: number }[];
  itemType: string;
  destination?: string;
  checkInDate?: string;
  checkOutDate?: string;
  provider?: string;
}, userId?: string) {
  try {
    const response = await fetch(`${CENTRAL_API}/ai/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'price_forecast',
        domain: 'travel',
        data,
        userId,
        appId: 'orlando-deals',
      }),
    });
    return response.json();
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getDemandForecast(data: {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  historicalOccupancy?: number[];
}, userId?: string) {
  try {
    const response = await fetch(`${CENTRAL_API}/ai/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'demand_forecast',
        domain: 'travel',
        data,
        userId,
        appId: 'orlando-deals',
      }),
    });
    return response.json();
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getRecommendations(data: {
  userPreferences: Record<string, any>;
  budget?: { min: number; max: number };
  travelDates?: { start: string; end: string };
  partySize?: number;
}, userId?: string) {
  try {
    const response = await fetch(`${CENTRAL_API}/ai/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'recommendation',
        domain: 'travel',
        data,
        userId,
        appId: 'orlando-deals',
      }),
    });
    return response.json();
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================================
// PAYMENTS (Central Service)
// ============================================================

export async function createCheckout(items: {
  priceId: string;
  quantity?: number;
}[], userId?: string, successUrl?: string, cancelUrl?: string) {
  try {
    const response = await fetch(`${CENTRAL_API}/checkout/create-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        userId,
        successUrl: successUrl || `${window.location.origin}/success`,
        cancelUrl: cancelUrl || `${window.location.origin}/cancel`,
        appId: 'orlando-deals',
      }),
    });
    return response.json();
  } catch (error) {
    return { error: String(error) };
  }
}

// ============================================================
// CREDITS (Central Service)
// ============================================================

export async function getCreditsBalance(userId: string) {
  try {
    const response = await fetch(`${CENTRAL_API}/credits/balance?userId=${userId}`);
    return response.json();
  } catch (error) {
    return { error: String(error) };
  }
}

export async function spendCredits(userId: string, amount: number, description: string) {
  try {
    const response = await fetch(`${CENTRAL_API}/credits/spend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        amount,
        description,
        appId: 'orlando-deals',
      }),
    });
    return response.json();
  } catch (error) {
    return { error: String(error) };
  }
}

// ============================================================
// CROSS-SELL (Shows related CR AudioViz AI products)
// ============================================================

export const RELATED_PRODUCTS = [
  {
    id: 'market-oracle',
    name: 'Market Oracle',
    description: 'AI stock & crypto analysis',
    url: 'https://craudiovizai.com/tools/market-oracle',
    icon: '📈',
  },
  {
    id: 'games-hub',
    name: 'Games Hub',
    description: '1200+ free browser games',
    url: 'https://cravgameshub.com',
    icon: '🎮',
  },
  {
    id: 'crav-barrels',
    name: 'CravBarrels',
    description: 'Discover 37K+ spirits',
    url: 'https://cravbarrels.com',
    icon: '🥃',
  },
];

export default {
  sendDealAlert,
  sendPricePredictionAlert,
  getEmailPreferences,
  updateEmailPreferences,
  getPricePrediction,
  getDemandForecast,
  getRecommendations,
  createCheckout,
  getCreditsBalance,
  spendCredits,
  RELATED_PRODUCTS,
};
