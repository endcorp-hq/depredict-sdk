'use client'

import React from 'react'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileButtonProps {
  onClick: () => void
  className?: string
}

export function ProfileButton({ onClick, className }: ProfileButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative p-2.5 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20',
        'hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-500/40',
        'transition-all duration-300 hover:scale-105',
        className
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <User className="relative w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
      
      {/* Active indicator dot */}
      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
    </button>
  )
}