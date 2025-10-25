'use client'

import React, { useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useShortx } from '@/components/solana/useDepredict'
import { CreateMarketCreatorFlow } from './create-market-creator-flow'
import { MarketCreatorDashboard } from './market-creator-dashboard'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useMarketCreator, MarketCreatorStatus } from '@/hooks/use-market-creator'
import Link from 'next/link'

export default function AdminPage() {
  const wallet = useWallet()
  const { connection } = useConnection()
  const { marketCreatorStatus } = useShortx()
  
  const handleMarketCreatorCreated = (pda: string) => {
    // Trigger a refresh of the market creator status
    window.location.reload()
  }

  if (marketCreatorStatus.isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Checking market creator status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">
            {marketCreatorStatus.exists 
              ? 'Manage your markets and resolve outcomes'
              : 'Set up your market creator to start creating prediction markets'
            }
          </p>
        </div>

        {!marketCreatorStatus.exists ? (
          <CreateMarketCreatorFlow onCreated={handleMarketCreatorCreated} />
        ) : (
          <MarketCreatorDashboard marketCreatorPda={marketCreatorStatus.pda!} />
        )}
      </div>
    </div>
  )
}