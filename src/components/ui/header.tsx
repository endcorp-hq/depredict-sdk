'use client'

import { WalletDropdown } from '@/components/wallet-dropdown'
import { ProfileButton } from '@/components/profile/profile-button'
import { ProfileSidebar } from '@/components/profile/profile-sidebar'
import { useState } from 'react'
import { useSolana } from '@/components/solana/use-solana'
import Link from 'next/link'

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { connected, account, disconnect } = useSolana()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
          {/* Logo on the left */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25 transition-all duration-300 group-hover:shadow-purple-500/40 group-hover:scale-105 group-hover:rotate-3">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                <span className="text-white font-bold text-xl relative z-10">D</span>
              </div>
              <span className="hidden font-bold text-lg sm:inline-block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                Depredict
              </span>
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