'use client'

import React, { useState } from 'react'
import { X, LogOut, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ProfileStats } from './profile-stats'
import { PositionsList } from './position-list'

interface ProfileSidebarProps {
  isOpen: boolean
  onClose: () => void
  walletAddress?: string
  onDisconnect?: () => void
}

export function ProfileSidebar({
  isOpen,
  onClose,
  walletAddress = 'Not Connected',
  onDisconnect,
}: ProfileSidebarProps) {
  const handleCopyAddress = () => {
    if (walletAddress && walletAddress !== 'Not Connected') {
      navigator.clipboard.writeText(walletAddress)
      toast.success('Address copied to clipboard!', {
        description: walletAddress,
        duration: 2000,
      })
    }
  }

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect()
      toast.info('Wallet disconnected')
    }
  }

  // Helper to ellipsify address
  const ellipsifyAddress = (address: string) => {
    if (address === 'Not Connected' || !address) return address
    if (address.length <= 12) return address
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-[480px] bg-slate-900 border-l border-slate-700/50 z-50',
          'transform transition-transform duration-300 ease-out',
          'flex flex-col overflow-hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-slate-700/50 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Profile</h2>
              <p className="text-sm text-slate-400 mt-1">Manage your account</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors group">
              <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Wallet Address */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">Connected Wallet</p>
            <button
              onClick={handleCopyAddress}
              className="group w-full text-left"
              disabled={!walletAddress || walletAddress === 'Not Connected'}
            >
              <span className="text-white font-mono text-base group-hover:text-purple-400 transition-colors group-hover:underline decoration-purple-400 decoration-2 underline-offset-4 cursor-pointer">
                {ellipsifyAddress(walletAddress)}
              </span>
            </button>
          </div>


          {/* Positions */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Active Positions</h3>
            <PositionsList />
          </div>
        </div>

        {/* Footer - Logout Button */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
          <button
            onClick={handleDisconnect}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300 font-semibold group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Disconnect Wallet
          </button>
        </div>
      </div>
    </>
  )
}
