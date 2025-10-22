'use client'

import React from 'react'
import { TrendingUp, Trophy, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  trend?: 'up' | 'down'
  trendValue?: string
  gradient: string
}

function StatCard({ icon, label, value, trend, trendValue, gradient }: StatCardProps) {
  return (
    <div className="group relative p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      {/* Background gradient */}
      <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity', gradient)} />
      
      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <div className={cn('p-2 rounded-lg', gradient, 'bg-opacity-10')}>
            {icon}
          </div>
          {trend && trendValue && (
            <span className={cn(
              'text-xs font-semibold flex items-center gap-1',
              trend === 'up' ? 'text-emerald-400' : 'text-red-400'
            )}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm text-slate-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
      </div>
    </div>
  )
}

export function ProfileStats() {
  // Demo data - replace with real data later
  const stats = [
    {
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
      label: 'Total Bets',
      value: 42,
      trend: 'up' as const,
      trendValue: '+12%',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      icon: <Trophy className="w-5 h-5 text-emerald-400" />,
      label: 'Won Bets',
      value: 28,
      trend: 'up' as const,
      trendValue: '+8%',
      gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    {
      icon: <DollarSign className="w-5 h-5 text-purple-400" />,
      label: 'Total Winnings',
      value: '$1,234',
      trend: 'up' as const,
      trendValue: '+15%',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}