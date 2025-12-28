'use client'

import { useState, useEffect } from 'react'
import {
  Search, Filter, Bell, TrendingDown, Clock, ExternalLink,
  Star, Hotel, Plane, Car, Ticket, Utensils, Gift, MapPin,
  ChevronDown, RefreshCw, Heart, Share2, AlertCircle, CheckCircle,
  Sparkles, Crown, Zap, Calendar, DollarSign, Percent
} from 'lucide-react'

interface Deal {
  id: string
  title: string
  description: string
  category: 'hotel' | 'ticket' | 'dining' | 'package' | 'flight' | 'car' | 'experience'
  source: string
  sourceUrl: string
  originalPrice: number
  dealPrice: number
  savings: number
  savingsPercent: number
  validFrom: string
  validUntil: string
  restrictions?: string[]
  code?: string
  isHot: boolean
  isExpiring: boolean
  postedAt: string
  votes: number
  verified: boolean
  tags: string[]
}

interface DealSource {
  name: string
  icon: string
  dealsCount: number
  lastUpdated: string
}

const DEAL_SOURCES: DealSource[] = [
  { name: 'MouseSavers', icon: '🐭', dealsCount: 45, lastUpdated: '5 min ago' },
  { name: 'AllEars.net', icon: '👂', dealsCount: 32, lastUpdated: '12 min ago' },
  { name: 'Disney Tourist Blog', icon: '🏰', dealsCount: 28, lastUpdated: '1 hour ago' },
  { name: 'Reddit r/WaltDisneyWorld', icon: '📱', dealsCount: 67, lastUpdated: '3 min ago' },
  { name: 'DIS Boards', icon: '💬', dealsCount: 41, lastUpdated: '30 min ago' },
  { name: 'ThemeParkInsider', icon: '🎢', dealsCount: 19, lastUpdated: '2 hours ago' },
]

const AGGREGATED_DEALS: Deal[] = [
  {
    id: '1', title: 'Disney World Summer Room Discount - Up to 25% Off',
    description: 'Save up to 25% on rooms at select Disney Resort hotels for arrivals most nights May 28 through August 28, 2025.',
    category: 'hotel', source: 'Disney', sourceUrl: 'https://disneyworld.disney.go.com',
    originalPrice: 450, dealPrice: 338, savings: 112, savingsPercent: 25,
    validFrom: '2025-05-28', validUntil: '2025-08-28',
    restrictions: ['Minimum 2-night stay', 'Excludes suites', 'Subject to availability'],
    isHot: true, isExpiring: false, postedAt: '2 hours ago', votes: 234, verified: true,
    tags: ['Summer', 'Hotel', 'Official']
  },
  {
    id: '2', title: 'Universal Orlando 3-Day 3-Park Pass - Save $75',
    description: 'Get 3-day admission to all Universal theme parks including Volcano Bay for less than the price of 2 days!',
    category: 'ticket', source: 'Undercover Tourist', sourceUrl: 'https://www.undercovertourist.com',
    originalPrice: 499, dealPrice: 424, savings: 75, savingsPercent: 15,
    validFrom: '2025-01-01', validUntil: '2025-06-30',
    code: 'UCTSAVE75', isHot: true, isExpiring: false, postedAt: '4 hours ago', votes: 189, verified: true,
    tags: ['Universal', 'Multi-day', 'Verified']
  },
  {
    id: '3', title: 'Swan & Dolphin 30% Off + $50 Daily Credit',
    description: 'Book direct and save 30% on Deluxe Swan & Dolphin rooms plus get $50 daily resort credit for dining.',
    category: 'hotel', source: 'Marriott', sourceUrl: 'https://www.swandolphin.com',
    originalPrice: 389, dealPrice: 272, savings: 117, savingsPercent: 30,
    validFrom: '2025-01-15', validUntil: '2025-03-31',
    code: 'MAGIC30', restrictions: ['Advance booking required', 'Non-refundable'],
    isHot: false, isExpiring: true, postedAt: '1 day ago', votes: 156, verified: true,
    tags: ['Marriott', 'Dining Credit', 'Limited']
  },
  {
    id: '4', title: 'Free Dining Plan with 5-Night Package',
    description: 'Book a 5-night/6-day Magic Your Way package and get the Quick Service Dining Plan FREE!',
    category: 'package', source: 'Disney', sourceUrl: 'https://disneyworld.disney.go.com',
    originalPrice: 3200, dealPrice: 2800, savings: 400, savingsPercent: 12,
    validFrom: '2025-02-01', validUntil: '2025-04-15',
    restrictions: ['5-night minimum', 'Select dates', 'Must book by Feb 15'],
    isHot: true, isExpiring: true, postedAt: '6 hours ago', votes: 312, verified: true,
    tags: ['Dining Plan', 'Package', 'Family']
  },
  {
    id: '5', title: 'Alamo Rent A Car - 20% Off Orlando Rentals',
    description: 'Save 20% on weekly rentals at Orlando International Airport with Alamo.',
    category: 'car', source: 'Alamo', sourceUrl: 'https://www.alamo.com',
    originalPrice: 350, dealPrice: 280, savings: 70, savingsPercent: 20,
    validFrom: '2025-01-01', validUntil: '2025-12-31',
    code: 'ORLANDO20', isHot: false, isExpiring: false, postedAt: '3 days ago', votes: 89, verified: true,
    tags: ['Car Rental', 'Airport', 'Year-round']
  },
  {
    id: '6', title: 'Character Dining - Kids Eat Free at Select Locations',
    description: 'Children ages 3-9 dine free with each paying adult at select character dining locations.',
    category: 'dining', source: 'MouseSavers', sourceUrl: 'https://www.mousesavers.com',
    originalPrice: 65, dealPrice: 45, savings: 20, savingsPercent: 31,
    validFrom: '2025-01-10', validUntil: '2025-02-28',
    restrictions: ['One free child per adult', 'Reservations required', 'Select restaurants only'],
    isHot: false, isExpiring: true, postedAt: '12 hours ago', votes: 178, verified: false,
    tags: ['Character Dining', 'Kids', 'Limited Time']
  },
]

export default function DealAggregator() {
  const [deals, setDeals] = useState(AGGREGATED_DEALS)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'savings' | 'recent' | 'popular' | 'expiring'>('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyVerified, setShowOnlyVerified] = useState(false)
  const [showOnlyHot, setShowOnlyHot] = useState(false)

  const categories = ['all', 'hotel', 'ticket', 'dining', 'package', 'flight', 'car', 'experience']

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hotel': return <Hotel className="w-4 h-4" />
      case 'ticket': return <Ticket className="w-4 h-4" />
      case 'dining': return <Utensils className="w-4 h-4" />
      case 'package': return <Gift className="w-4 h-4" />
      case 'flight': return <Plane className="w-4 h-4" />
      case 'car': return <Car className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const filteredDeals = deals
    .filter(d => categoryFilter === 'all' || d.category === categoryFilter)
    .filter(d => !showOnlyVerified || d.verified)
    .filter(d => !showOnlyHot || d.isHot)
    .filter(d => !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'savings') return b.savingsPercent - a.savingsPercent
      if (sortBy === 'popular') return b.votes - a.votes
      if (sortBy === 'expiring') return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime()
      return 0 // recent - already sorted
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Deal Aggregator</h1>
              <p className="text-green-200">Best Orlando deals from {DEAL_SOURCES.length} sources</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg">
            <Bell className="w-4 h-4" /> Set Alert
          </button>
        </div>

        {/* Sources Status */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {DEAL_SOURCES.map(source => (
            <div key={source.name} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg whitespace-nowrap">
              <span>{source.icon}</span>
              <div>
                <p className="text-xs font-medium">{source.name}</p>
                <p className="text-xs text-green-200">{source.dealsCount} deals • {source.lastUpdated}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl"
          >
            <option value="recent">Most Recent</option>
            <option value="savings">Highest Savings</option>
            <option value="popular">Most Popular</option>
            <option value="expiring">Expiring Soon</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Pills */}
          <div className="flex gap-1 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm capitalize ${
                  categoryFilter === cat ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {cat !== 'all' && getCategoryIcon(cat)}
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Quick Filters */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyVerified}
              onChange={(e) => setShowOnlyVerified(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-400">Verified Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyHot}
              onChange={(e) => setShowOnlyHot(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-400">🔥 Hot Deals</span>
          </label>
        </div>
      </div>

      {/* Deals List */}
      <div className="space-y-4">
        {filteredDeals.map(deal => (
          <div key={deal.id} className={`bg-gray-900 rounded-xl border p-4 transition-all hover:border-green-500/50 ${
            deal.isHot ? 'border-orange-500/50' : deal.isExpiring ? 'border-yellow-500/50' : 'border-gray-700'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                deal.category === 'hotel' ? 'bg-blue-500/20 text-blue-400' :
                deal.category === 'ticket' ? 'bg-purple-500/20 text-purple-400' :
                deal.category === 'dining' ? 'bg-orange-500/20 text-orange-400' :
                deal.category === 'package' ? 'bg-pink-500/20 text-pink-400' :
                deal.category === 'car' ? 'bg-cyan-500/20 text-cyan-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {getCategoryIcon(deal.category)}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {deal.isHot && <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">🔥 HOT</span>}
                      {deal.isExpiring && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">⏰ EXPIRING</span>}
                      {deal.verified && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>}
                    </div>
                    <h3 className="font-semibold text-lg">{deal.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">{deal.savingsPercent}% OFF</p>
                    <p className="text-sm text-gray-400">Save ${deal.savings}</p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-3">{deal.description}</p>

                {deal.restrictions && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {deal.restrictions.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                {deal.code && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg mb-3">
                    <span className="text-xs text-gray-400">Code:</span>
                    <span className="font-mono font-bold text-green-400">{deal.code}</span>
                    <button className="text-xs text-blue-400 hover:text-blue-300">Copy</button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> {deal.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {deal.postedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Valid until {new Date(deal.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm">
                      <Heart className="w-4 h-4" /> {deal.votes}
                    </button>
                    <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <a
                      href={deal.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
                    >
                      Get Deal
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4" /> Load More Deals
      </button>
    </div>
  )
}
