'use client'

import { WalletDropdown } from '@/components/wallet-dropdown'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-transparent backdrop-blur supports-[backdrop-filter]:bg-background/60 px-10 py-2">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo on the left */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              Depredict
            </span>
          </Link>
        </div>

        {/* Connect wallet button on the right */}
        <div className="flex items-center">
          <WalletDropdown />
        </div>
      </div>
    </header>
  )
}