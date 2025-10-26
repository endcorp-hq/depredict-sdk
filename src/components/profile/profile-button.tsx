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
      <User className="relative w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
      
      
    </button>
  )
}