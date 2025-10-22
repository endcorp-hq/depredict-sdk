'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  Wallet,
  Trophy,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Filter,
  Search,
  Sparkles,
} from 'lucide-react'

export default function ProfileBetsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Dummy user data
  const userData = {
    walletAddress: '7xKX...9mPq',
    totalBets: 24,
    activeBets: 8,
    wonBets: 12,
    lostBets: 4,
    totalWagered: 156.5,
    totalWinnings: 189.3,
    totalProfit: 32.8,
    unclaimedWinnings: 45.2,
  }

  // Dummy bets data
  const bets = [
    {
      id: 1,
      marketTitle: 'Will ETH reach $5000 by end of 2025?',
      status: 'active',
      prediction: 'YES',
      amount: 10.0,
      potentialWin: 18.5,
      odds: '65/35',
      timeRemaining: '2d 5h',
      createdAt: 'Oct 9, 2025',
      marketId: 'mk_001',
    },
    {
      id: 2,
      marketTitle: 'Will Bitcoin hit new ATH this month?',
      status: 'active',
      prediction: 'YES',
      amount: 25.0,
      potentialWin: 42.0,
      odds: '72/28',
      timeRemaining: '15d 3h',
      createdAt: 'Oct 8, 2025',
      marketId: 'mk_002',
    },
    {
      id: 3,
      marketTitle: 'Will it rain in San Francisco tomorrow?',
      status: 'won',
      prediction: 'NO',
      amount: 5.0,
      actualWin: 8.2,
      profit: 3.2,
      resolvedAt: 'Oct 8, 2025',
      marketId: 'mk_003',
      claimed: true,
    },
    {
      id: 4,
      marketTitle: 'Will Apple announce new MacBook in October?',
      status: 'lost',
      prediction: 'YES',
      amount: 15.0,
      actualLoss: 15.0,
      resolvedAt: 'Oct 7, 2025',
      marketId: 'mk_004',
    },
    {
      id: 5,
      marketTitle: 'Will S&P 500 close above 5800 this week?',
      status: 'won',
      prediction: 'YES',
      amount: 20.0,
      actualWin: 37.0,
      profit: 17.0,
      resolvedAt: 'Oct 6, 2025',
      marketId: 'mk_005',
      claimed: false,
    },
    {
      id: 6,
      marketTitle: 'Will Tesla stock reach $300 by end of Q4?',
      status: 'active',
      prediction: 'NO',
      amount: 12.0,
      potentialWin: 22.0,
      odds: '45/55',
      timeRemaining: '45d 12h',
      createdAt: 'Oct 5, 2025',
      marketId: 'mk_006',
    },
    {
      id: 7,
      marketTitle: 'Will there be a Fed rate cut in November?',
      status: 'observing',
      prediction: 'YES',
      amount: 8.0,
      potentialWin: 14.5,
      odds: '60/40',
      timeRemaining: 'Betting closed',
      createdAt: 'Oct 3, 2025',
      marketId: 'mk_007',
    },
    {
      id: 8,
      marketTitle: 'Will OpenAI release GPT-5 this year?',
      status: 'lost',
      prediction: 'YES',
      amount: 30.0,
      actualLoss: 30.0,
      resolvedAt: 'Oct 1, 2025',
      marketId: 'mk_008',
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
            <Clock className="w-3 h-3" />
            Active
          </span>
        )
      case 'won':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Won
          </span>
        )
      case 'lost':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Lost
          </span>
        )
      case 'observing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Observing
          </span>
        )
      default:
        return null
    }
  }

  const getPredictionBadge = (prediction) => {
    return prediction === 'YES' ? (
      <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-semibold">YES</span>
    ) : (
      <span className="px-2 py-1 rounded bg-slate-500/20 text-slate-400 text-xs font-semibold">NO</span>
    )
  }

  const filteredBets = bets
    .filter((bet) => {
      if (activeTab === 'all') return true
      if (activeTab === 'active') return bet.status === 'active' || bet.status === 'observing'
      if (activeTab === 'won') return bet.status === 'won'
      if (activeTab === 'lost') return bet.status === 'lost'
      return true
    })
    .filter((bet) => bet.marketTitle.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-2xl font-bold text-purple-400">{userData.totalBets}</div>
            <div className="text-sm text-slate-400 mt-1">Total Bets</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-2xl font-bold text-blue-400">{userData.activeBets}</div>
            <div className="text-sm text-slate-400 mt-1">Active</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-2xl font-bold text-green-400">{userData.wonBets}</div>
            <div className="text-sm text-slate-400 mt-1">Won</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-2xl font-bold text-red-400">{userData.lostBets}</div>
            <div className="text-sm text-slate-400 mt-1">Lost</div>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-sm text-slate-400 mb-2">Total Wagered</div>
            <div className="text-3xl font-bold">${userData.totalWagered.toFixed(2)}</div>
          </div>
          <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <div className="text-sm text-purple-400 mb-2">Total Winnings</div>
            <div className="text-3xl font-bold text-purple-400">${userData.totalWinnings.toFixed(2)}</div>
          </div>
          <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
            <div className="text-sm text-green-400 mb-2">Net Profit</div>
            <div className="text-3xl font-bold text-green-400">+${userData.totalProfit.toFixed(2)}</div>
          </div>
          <div className="p-6 rounded-2xl bg-pink-500/10 border border-pink-500/20">
            <div className="text-sm text-pink-400 mb-2 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Unclaimed
            </div>
            <div className="text-3xl font-bold text-pink-400">${userData.unclaimedWinnings.toFixed(2)}</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50 w-full sm:w-auto">
            {['all', 'active', 'won', 'lost'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>

        {/* Bets List */}
        <div className="space-y-4">
          {filteredBets.map((bet) => (
            <div
              key={bet.id}
              className="group p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 transition-all backdrop-blur-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    {getStatusBadge(bet.status)}
                    {bet.status === 'won' && !bet.claimed && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-medium animate-pulse">
                        <Trophy className="w-3 h-3" />
                        Claim Available
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold group-hover:text-purple-400 transition-colors">
                    {bet.marketTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>Your Bet:</span>
                      {getPredictionBadge(bet.prediction)}
                    </div>
                    {bet.odds && (
                      <div className="flex items-center gap-2">
                        <span>Odds: {bet.odds}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {bet.timeRemaining || bet.resolvedAt}
                    </div>
                  </div>
                </div>

                {/* Right Section - Stats */}
                <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
                  <div className="text-center">
                    <div className="text-xs text-slate-400 mb-1">Amount</div>
                    <div className="text-xl font-bold">${bet.amount.toFixed(2)}</div>
                  </div>

                  {bet.status === 'active' || bet.status === 'observing' ? (
                    <div className="text-center">
                      <div className="text-xs text-purple-400 mb-1">Potential Win</div>
                      <div className="text-xl font-bold text-purple-400">${bet.potentialWin.toFixed(2)}</div>
                    </div>
                  ) : bet.status === 'won' ? (
                    <>
                      <div className="text-center">
                        <div className="text-xs text-green-400 mb-1">Won</div>
                        <div className="text-xl font-bold text-green-400">${bet.actualWin.toFixed(2)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-green-400 mb-1">Profit</div>
                        <div className="text-xl font-bold text-green-400">+${bet.profit.toFixed(2)}</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="text-xs text-red-400 mb-1">Loss</div>
                      <div className="text-xl font-bold text-red-400">-${bet.actualLoss.toFixed(2)}</div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex items-center">
                    {bet.status === 'won' && !bet.claimed ? (
                      <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-pink-500/25">
                        <Trophy className="w-4 h-4" />
                        Claim
                      </button>
                    ) : (
                      <button className="px-6 py-2 bg-slate-700/50 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-500/30 border border-slate-700/50 rounded-xl font-semibold flex items-center gap-2 transition-all group">
                        View
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBets.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No bets found</h3>
            <p className="text-slate-500">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  )
}
