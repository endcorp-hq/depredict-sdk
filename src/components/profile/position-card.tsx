'use client'

import React from 'react'
import { Clock, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Position {
  id: string
  question: string
  direction: 'yes' | 'no'
  amount: number
  probability: number
  status: 'active' | 'won' | 'lost' | 'pending'
  timestamp: string
}

interface PositionCardProps {
  position: Position
}

export function PositionCard({ position }: PositionCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'won':
        return {
          label: 'Won',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/20',
          icon: CheckCircle,
        }
      case 'lost':
        return {
          label: 'Lost',
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          icon: XCircle,
        }
      case 'active':
        return {
          label: 'Active',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          icon: TrendingUp,
        }
      default:
        return {
          label: 'Pending',
          color: 'text-slate-400',
          bgColor: 'bg-slate-500/10',
          borderColor: 'border-slate-500/20',
          icon: Clock,
        }
    }
  }

  const statusConfig = getStatusConfig(position.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="group p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.01]">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-white line-clamp-2 flex-1 group-hover:text-purple-400 transition-colors">
            {position.question}
          </p>
          <div className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-semibold whitespace-nowrap',
            statusConfig.bgColor,
            statusConfig.borderColor,
            statusConfig.color
          )}>
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </div>
        </div>

        {/* Bet Direction */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Your bet:</span>
          <span className={cn(
            'px-2 py-0.5 rounded text-xs font-bold',
            position.direction === 'yes' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          )}>
            {position.direction.toUpperCase()}
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-400">Amount: </span>
              <span className="text-white font-semibold">${position.amount}</span>
            </div>
            <div>
              <span className="text-slate-400">Odds: </span>
              <span className="text-white font-semibold">{position.probability}%</span>
            </div>
          </div>
          <span className="text-slate-500">{position.timestamp}</span>
        </div>
      </div>
    </div>
  )
}