'use client'

import { WalletDropdown } from '@/components/wallet-dropdown'
import { ProfileButton } from '@/components/profile/profile-button'
import { ProfileSidebar } from '@/components/profile/profile-sidebar'
import { useState } from 'react'
import { useSolana } from '@/components/solana/use-solana'
import Link from 'next/link'
import { Trophy } from 'lucide-react'

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { connected, account, disconnect } = useSolana()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-emerald-900/20 bg-slate-950/95 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
          {/* Logo on the left */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all duration-300 group-hover:shadow-emerald-500/50 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                <Trophy className="w-5 h-5 text-white relative z-10" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-green-300 transition-all duration-300">
                  SportsBet
                </span>
                <span className="block text-[10px] text-emerald-500/70 -mt-1">POWERED BY DePREDICT</span>
              </div>
            </Link>
          </div>

          {/* Wallet/Profile button on the right */}
          <div className="flex items-center gap-4">
            {connected ? (
              <ProfileButton onClick={() => setIsProfileOpen(true)} />
            ) : (
              <WalletDropdown />
            )}
          </div>
        </div>
      </header>

      {/* Profile Sidebar */}
      <ProfileSidebar 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        walletAddress={account?.address}
        onDisconnect={() => {
          disconnect()
          setIsProfileOpen(false)
        }}
      />
    </>
  )
}