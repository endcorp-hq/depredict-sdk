'use client'

import React from 'react'
import { TrendingUp, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FeaturedMarketsBanner() {
  // Demo featured markets
  const featuredMarkets = [
    {
      id: 1,
      question: "Will Bitcoin reach $100k by end of 2025?",
      volume: "$12,450",
      probability: 67,
      trend: "up",
      badge: "🔥 Hot"
    },
    {
      id: 2,
      question: "Will Ethereum flip Bitcoin this year?",
      volume: "$8,320",
      probability: 23,
      trend: "down",
      badge: "⏱️ Ending Soon"
    },
    {
      id: 3,
      question: "Will Solana reach $500 by Q2 2026?",
      volume: "$15,890",
      probability: 45,
      trend: "up",
      badge: "📈 Trending"
    }
  ]

  return (
    <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20 border border-purple-500/20 p-6">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-pulse" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Flame className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Featured Markets</h3>
              <p className="text-sm text-slate-400">High volume & trending predictions</p>
            </div>
          </div>
          
        </div>

        {/* Featured Markets Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {featuredMarkets.map((market) => (
            <div
              key={market.id}
              className="group relative p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
            >
              {/* Badge */}
              <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs font-semibold text-purple-300">
                {market.badge}
              </div>

              <div className="space-y-3">
                {/* Question */}
                <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {market.question}
                </p>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="font-medium">{market.volume}</span>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 font-bold",
                    market.trend === 'up' ? "text-emerald-400" : "text-red-400"
                  )}>
                    <span>{market.probability}% YES</span>
                    <span className="text-xs">{market.trend === 'up' ? '↑' : '↓'}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${market.probability}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}