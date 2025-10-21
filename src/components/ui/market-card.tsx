'use client'

import React from 'react'
import { Market, MarketStates, MarketType, WinningDirection } from '@endcorp/depredict'
import { Clock, TrendingUp, Users, Calendar, Radio, PlayCircle, Gavel, CheckCircle, XCircle, MinusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarketCardProps {
  market: Market
  onClick?: () => void
}

export function MarketCard({ market, onClick }: MarketCardProps) {
  // Calculate percentage for yes votes
  const yesLiquidity = parseFloat(market.yesLiquidity || '0')
  const noLiquidity = parseFloat(market.noLiquidity || '0')
  const totalLiquidity = yesLiquidity + noLiquidity
  
  // Calculate probability (ratio doesn't need conversion)
  let probability = 0.5
  if (totalLiquidity > 0) {
    probability = yesLiquidity / totalLiquidity
  }
  const yesPercentage = Math.round(probability * 100)
  const noPercentage = 100 - yesPercentage
  
  // Format volume in USDC (convert from base units)
  const volume = parseFloat(market.volume || '0') / 1e6
  const formattedVolume = volume.toFixed(2)

  // Determine if this is a live market
  const isLive = market.marketType === MarketType.LIVE
  
  // Check if market is resolved
  const isResolved = market.winningDirection !== WinningDirection.NONE

  // Get market status and styling
  const getMarketStatus = () => {
    if (isResolved) {
      // Return the winning direction
      if (market.winningDirection === WinningDirection.YES) {
        return {
          text: 'YES',
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20',
          icon: CheckCircle,
          barColor: 'from-purple-500 to-purple-600',
        }
      } else if (market.winningDirection === WinningDirection.NO) {
        return {
          text: 'NO',
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20',
          icon: XCircle,
          barColor: 'from-purple-500 to-purple-600',
        }
      } else if (market.winningDirection === WinningDirection.DRAW) {
        return {
          text: 'DRAW',
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20',
          icon: MinusCircle,
          barColor: 'from-purple-500 to-purple-600',
        }
      } else {
        return {
          text: 'RESOLVED',
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20',
          icon: CheckCircle,
          barColor: 'from-purple-500 to-purple-600',
        }
      }
    } else {
      const now = Date.now()
      const marketStart = parseInt(market.marketStart) * 1000
      const marketEnd = parseInt(market.marketEnd) * 1000

      if (isLive) {
        // Live market - betting happens during market interval
        return {
          text: 'LIVE',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          icon: Radio,
          barColor: 'from-blue-500 to-blue-600',
        }
      } else {
        // Future market
        if (now >= marketStart && now <= marketEnd) {
          // Market is currently running (active/observing)
          return {
            text: 'Observing',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            icon: PlayCircle,
            barColor: 'from-blue-500 to-blue-600',
          }
        } else if (now < marketStart) {
          // Betting period (predicting)
          return {
            text: 'Predicting',
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            icon: Gavel,
            barColor: 'from-emerald-500 to-emerald-600',
          }
        } else {
          // Market has ended but not resolved
          return {
            text: 'Observing',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            icon: PlayCircle,
            barColor: 'from-blue-500 to-blue-600',
          }
        }
      }
    }
  }

  const status = getMarketStatus()
  const StatusIcon = status.icon

  // Time helper functions
  const getTimeLeft = (endTimestamp: string) => {
    const now = Date.now()
    const end = parseInt(endTimestamp) * 1000
    const diff = end - now
    if (diff <= 0) return 'market ended'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) return `${hours}h ${minutes}m left`
    if (minutes > 0) return `${minutes}m left`
    return 'ending soon'
  }

  const getBettingTimeLeft = (startTimestamp: string) => {
    const now = Date.now()
    const start = parseInt(startTimestamp) * 1000
    const diff = start - now
    if (diff <= 0) return 'betting ended'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) return `betting ends in ${hours}h ${minutes}m`
    if (minutes > 0) return `betting ends in ${minutes}m`
    return 'betting ends soon'
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-xl bg-slate-800/30 border border-slate-700/50 p-6 space-y-4 transition-all duration-300',
        'hover:border-purple-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-purple-500/10',
        onClick && 'cursor-pointer hover:scale-[1.02]'
      )}
    >
      {/* Header with status badge and volume */}
      <div className="flex items-center justify-between">
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full border',
          status.bgColor,
          status.borderColor
        )}>
          <StatusIcon className={cn('w-4 h-4', status.color)} />
          <span className={cn('text-xs font-semibold', status.color)}>
            {status.text}
          </span>
        </div>
        <span className="text-white text-base font-bold">
          ${formattedVolume}
        </span>
      </div>

      {/* Question */}
      <h3 className="font-semibold text-lg leading-tight line-clamp-3 min-h-[4.5rem] group-hover:text-purple-400 transition-colors">
        {market.question || `Market #${market.marketId}`}
      </h3>

      {/* Time Range */}
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <Clock className="w-4 h-4 text-slate-400" />
        <span>
          {formatTime(market.marketStart)} to {formatTime(market.marketEnd)}
        </span>
      </div>

      {/* Probability Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-white text-lg font-bold">
            {noPercentage}/{yesPercentage}
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={cn('h-full bg-gradient-to-r transition-all duration-500', status.barColor)}
            style={{ width: `${yesPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>NO</span>
          <span>YES</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {isLive 
              ? getTimeLeft(market.marketEnd)
              : getBettingTimeLeft(market.marketStart)
            }
          </span>
        </div>
        <span className="text-xs text-slate-500">
          {formatDate(market.marketStart)}
        </span>
      </div>

      {/* Market ID indicator (bottom-right corner) */}
      <div className="absolute right-3 bottom-3 text-[10px] text-slate-500/50">
        {market.marketId ?? 'none'}
      </div>
    </div>
  )
}