'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  DollarSign,
  Info,
  ArrowLeft,
  Sparkles,
  Trophy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Activity,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

export default function MarketDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const marketId = params?.marketId || 'mk_001'

  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no'>('yes')
  const [betAmount, setBetAmount] = useState('')
  const [isPlacingBet, setIsPlacingBet] = useState(false)

  // Mock market data - replace with actual API call
  const market = {
    id: marketId,
    title: 'Will ETH reach $5000 by end of 2025?',
    description:
      'This market will resolve to YES if Ethereum (ETH) reaches or exceeds $5000 USD on any major exchange (Coinbase, Binance, Kraken) at any point before December 31, 2025 11:59 PM UTC.',
    status: 'active',
    createdAt: 'Oct 1, 2025',
    endTime: 'Dec 31, 2025',
    resolutionTime: 'Jan 1, 2026',
    category: 'Crypto',
    yesPrice: 0.65,
    noPrice: 0.35,
    totalVolume: 45230.5,
    totalBets: 1247,
    uniqueTraders: 834,
    liquidityPool: 125000,
    creatorAddress: '7xKX...9mPq',
    oracleType: 'Manual',
  }

  // Mock price history data
  const priceHistory = [
    { time: 'Oct 1', yes: 0.45, no: 0.55 },
    { time: 'Oct 5', yes: 0.48, no: 0.52 },
    { time: 'Oct 10', yes: 0.52, no: 0.48 },
    { time: 'Oct 15', yes: 0.58, no: 0.42 },
    { time: 'Oct 20', yes: 0.62, no: 0.38 },
    { time: 'Oct 22', yes: 0.65, no: 0.35 },
  ]

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      user: '7xKX...9mPq',
      action: 'bought',
      outcome: 'YES',
      amount: 50.0,
      shares: 76.92,
      timestamp: '2 min ago',
    },
    {
      id: 2,
      user: '4aBC...3xYz',
      action: 'sold',
      outcome: 'NO',
      amount: 25.0,
      shares: 71.43,
      timestamp: '15 min ago',
    },
    {
      id: 3,
      user: '9pQR...7wVu',
      action: 'bought',
      outcome: 'YES',
      amount: 100.0,
      shares: 153.85,
      timestamp: '1 hour ago',
    },
  ]

  const calculatePotentialReturn = () => {
    if (!betAmount || isNaN(parseFloat(betAmount))) return 0
    const amount = parseFloat(betAmount)
    const price = selectedOutcome === 'yes' ? market.yesPrice : market.noPrice
    return amount / price
  }

  const calculatePotentialProfit = () => {
    const potentialReturn = calculatePotentialReturn()
    const amount = parseFloat(betAmount) || 0
    return potentialReturn - amount
  }

  const handlePlaceBet = async () => {
    setIsPlacingBet(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsPlacingBet(false)
    setBetAmount('')
    // Show success message or redirect
  }

  const getStatusBadge = () => {
    switch (market.status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
            <Activity className="w-4 h-4" />
            Active
          </span>
        )
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-sm font-medium">
            <Clock className="w-4 h-4" />
            Closed
          </span>
        )
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Resolved
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-10 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Markets</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {getStatusBadge()}
                <span className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-xs font-medium">
                  {market.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{market.title}</h1>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">{market.description}</p>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Volume
              </div>
              <div className="text-xl font-bold">${market.totalVolume.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Users className="w-4 h-4" />
                Traders
              </div>
              <div className="text-xl font-bold">{market.uniqueTraders}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Activity className="w-4 h-4" />
                Total Bets
              </div>
              <div className="text-xl font-bold">{market.totalBets}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Clock className="w-4 h-4" />
                Ends
              </div>
              <div className="text-xl font-bold">{market.endTime}</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Chart & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Probability Chart */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-6">Market Probability</h2>

              {/* Current Odds Display */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-400">YES</span>
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-4xl font-bold text-purple-400 mb-1">{(market.yesPrice * 100).toFixed(1)}%</div>
                  <div className="text-sm text-slate-400">${market.yesPrice.toFixed(2)} per share</div>
                </div>

                <div className="p-6 rounded-xl bg-slate-700/30 border border-slate-600/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">NO</span>
                    <TrendingDown className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="text-4xl font-bold text-slate-300 mb-1">{(market.noPrice * 100).toFixed(1)}%</div>
                  <div className="text-sm text-slate-400">${market.noPrice.toFixed(2)} per share</div>
                </div>
              </div>

              {/* Simple Line Chart */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-400">Price History</h3>
                <div className="relative h-64">
                  <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="0" x2="600" y2="0" stroke="#334155" strokeWidth="1" opacity="0.3" />
                    <line x1="0" y1="50" x2="600" y2="50" stroke="#334155" strokeWidth="1" opacity="0.3" />
                    <line x1="0" y1="100" x2="600" y2="100" stroke="#334155" strokeWidth="1" opacity="0.3" />
                    <line x1="0" y1="150" x2="600" y2="150" stroke="#334155" strokeWidth="1" opacity="0.3" />
                    <line x1="0" y1="200" x2="600" y2="200" stroke="#334155" strokeWidth="1" opacity="0.3" />

                    {/* YES line */}
                    <polyline
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="3"
                      points={priceHistory
                        .map((point, i) => `${(i * 600) / (priceHistory.length - 1)},${200 - point.yes * 200}`)
                        .join(' ')}
                    />

                    {/* NO line */}
                    <polyline
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      points={priceHistory
                        .map((point, i) => `${(i * 600) / (priceHistory.length - 1)},${200 - point.no * 200}`)
                        .join(' ')}
                    />
                  </svg>

                  {/* X-axis labels */}
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    {priceHistory.map((point, i) => (
                      <span key={i}>{point.time}</span>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-purple-500"></div>
                    <span className="text-slate-400">YES</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-slate-500 border-dashed border-t-2 border-slate-500"></div>
                    <span className="text-slate-400">NO</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.action === 'bought' ? 'bg-green-400' : 'bg-red-400'
                        }`}
                      ></div>
                      <div>
                        <div className="text-sm">
                          <span className="font-mono text-slate-400">{activity.user}</span>{' '}
                          <span className="text-slate-500">{activity.action}</span>{' '}
                          <span
                            className={`font-semibold ${
                              activity.outcome === 'YES' ? 'text-purple-400' : 'text-slate-300'
                            }`}
                          >
                            {activity.outcome}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">{activity.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${activity.amount.toFixed(2)}</div>
                      <div className="text-xs text-slate-500">{activity.shares.toFixed(2)} shares</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Info */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4">Market Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Created</span>
                  <span className="font-medium">{market.createdAt}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Trading Ends</span>
                  <span className="font-medium">{market.endTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Resolution Time</span>
                  <span className="font-medium">{market.resolutionTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Oracle Type</span>
                  <span className="font-medium">{market.oracleType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Liquidity Pool</span>
                  <span className="font-medium">${market.liquidityPool.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Creator</span>
                  <span className="font-mono text-xs">{market.creatorAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-bold">Place Your Bet</h2>
                </div>

                {/* Outcome Selection */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Select Outcome</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedOutcome('yes')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedOutcome === 'yes'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                          : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-lg mb-1">YES</div>
                      <div className="text-xs">{(market.yesPrice * 100).toFixed(1)}%</div>
                    </button>
                    <button
                      onClick={() => setSelectedOutcome('no')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedOutcome === 'no'
                          ? 'bg-slate-700/50 border-slate-500 text-slate-200'
                          : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-lg mb-1">NO</div>
                      <div className="text-xs">{(market.noPrice * 100).toFixed(1)}%</div>
                    </button>
                  </div>
                </div>

                {/* Bet Amount */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Bet Amount (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[10, 25, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setBetAmount(amount.toString())}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Summary */}
                {betAmount && !isNaN(parseFloat(betAmount)) && (
                  <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Shares to receive</span>
                      <span className="font-semibold text-purple-400">{calculatePotentialReturn().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Potential profit</span>
                      <span className="font-semibold text-green-400">+${calculatePotentialProfit().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Average price</span>
                      <span className="font-semibold">
                        ${(selectedOutcome === 'yes' ? market.yesPrice : market.noPrice).toFixed(3)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Place Bet Button */}
                <button
                  onClick={handlePlaceBet}
                  disabled={!betAmount || isNaN(parseFloat(betAmount)) || parseFloat(betAmount) <= 0 || isPlacingBet}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    !betAmount || isNaN(parseFloat(betAmount)) || parseFloat(betAmount) <= 0 || isPlacingBet
                      ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                  }`}
                >
                  {isPlacingBet ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Placing Bet...
                    </span>
                  ) : (
                    `Buy ${selectedOutcome.toUpperCase()} Shares`
                  )}
                </button>

                {/* Info Box */}
                <div className="mt-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                  <div className="flex items-start gap-2 text-xs text-slate-400">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                      You'll receive shares that can be sold anytime or redeemed for $1 each if your prediction is
                      correct.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
