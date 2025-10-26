'use client'

import React from 'react'
import { TrendingUp, Flame, Trophy, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FeaturedMarketsBanner() {
  // Sports betting featured markets
  const featuredMarkets = [
    {
      id: 1,
      question: "Will Manchester United beat Liverpool?",
      sport: "⚽ Premier League",
      matchTime: "Tomorrow 3:00 PM",
      volume: "$45,230",
      probability: 58,
      trend: "up",
      badge: "🔥 Hot",
      color: "emerald"
    },
    {
      id: 2,
      question: "Will India score 300+ runs vs Australia?",
      sport: "🏏 Test Cricket",
      matchTime: "Today 10:00 AM",
      volume: "$32,840",
      probability: 67,
      trend: "up",
      badge: "⚡ Live",
      color: "orange"
    },
    {
      id: 3,
      question: "Will Real Madrid win Champions League?",
      sport: "⚽ UCL Final",
      matchTime: "June 1, 2025",
      volume: "$78,950",
      probability: 42,
      trend: "down",
      badge: "🏆 Finals",
      color: "blue"
    }
  ]

  return (
    <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-green-950/40 to-teal-950/40 border border-emerald-500/20 p-6">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 animate-pulse" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
              <Flame className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Featured Matches
                <Trophy className="w-4 h-4 text-yellow-500" />
              </h3>
              <p className="text-sm text-emerald-400/70">High stakes & trending bets</p>
            </div>
          </div>
          
        </div>

        {/* Featured Markets Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {featuredMarkets.map((market) => (
            <div
              key={market.id}
              className="group relative p-5 rounded-xl bg-slate-900/70 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/10"
            >
              {/* Badge */}
              <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-300 shadow-lg">
                {market.badge}
              </div>

              <div className="space-y-3">
                {/* Sport & Time */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400">{market.sport}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {market.matchTime}
                  </span>
                </div>

                {/* Question */}
                <p className="text-sm font-bold text-white line-clamp-2 group-hover:text-emerald-400 transition-colors min-h-[40px]">
                  {market.question}
                </p>

                {/* Stats Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-white">{market.volume}</span>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 font-bold text-sm",
                    market.trend === 'up' ? "text-emerald-400" : "text-orange-400"
                  )}>
                    <span>{market.probability}%</span>
                    <span className="text-base">{market.trend === 'up' ? '↑' : '↓'}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500 shadow-lg shadow-emerald-500/50"
                    style={{ width: `${market.probability}%` }}
                  />
                </div>

                {/* Quick Bet Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 text-xs font-semibold transition-all">
                    Bet YES
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-slate-400 hover:text-white text-xs font-semibold transition-all">
                    Bet NO
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}