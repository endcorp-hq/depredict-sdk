'use client'

import React, { useState, useMemo } from 'react'
import { useShortx } from '@/components/solana/useDepredict'
import { MarketCard } from '@/components/ui/market-card'
import { Search, Loader2, Shield, ArrowRight } from 'lucide-react'
import { MarketStates } from '@endcorp/depredict'
import { cn } from '@/lib/utils'
import { FeaturedMarketsBanner } from './featured-markets-banner'
import Link from 'next/link'

type FilterType = 'all' | 'active' | 'resolving' | 'resolved'

export function MarketsSection() {
  const { markets, loadingMarkets, error, marketCreatorStatus } = useShortx()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Filter and search markets
  const filteredMarkets = useMemo(() => {
    let filtered = markets

    // Apply filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter((market) => {
        switch (activeFilter) {
          case 'active':
            return market.marketState === MarketStates.ACTIVE
          case 'resolving':
            return market.marketState === MarketStates.RESOLVING
          case 'resolved':
            return market.marketState === MarketStates.RESOLVED
          default:
            return true
        }
      })
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (market) => market.question?.toLowerCase().includes(query) || market.marketId?.toString().includes(query),
      )
    }

    return filtered
  }, [markets, activeFilter, searchQuery])

  const filters: { value: FilterType; label: string; count?: number }[] = [
    {
      value: 'all',
      label: 'All Markets',
      count: markets.length,
    },
    {
      value: 'active',
      label: 'Active',
      count: markets.filter((m) => m.marketState === MarketStates.ACTIVE).length,
    },
    {
      value: 'resolving',
      label: 'Resolving',
      count: markets.filter((m) => m.marketState === MarketStates.RESOLVING).length,
    },
    {
      value: 'resolved',
      label: 'Resolved',
      count: markets.filter((m) => m.marketState === MarketStates.RESOLVED).length,
    },
  ]

  // Check if market creator is checking
  if (marketCreatorStatus.isChecking) {
    return (
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FeaturedMarketsBanner />
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-slate-400">Checking platform status...</p>
        </div>
      </section>
    )
  }

  // Check if market creator doesn't exist
  if (!marketCreatorStatus.hasEnvKey || !marketCreatorStatus.exists) {
    return (
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FeaturedMarketsBanner />
        
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/10 border-2 border-blue-500/20 mb-6">
            <Shield className="w-10 h-10 text-blue-400" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Platform Setup Required</h2>
          
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            {!marketCreatorStatus.hasEnvKey ? (
              <>
                No market creator has been configured for this platform. 
                Please set up the <code className="px-2 py-1 bg-slate-800/50 rounded text-sm text-purple-400">NEXT_PUBLIC_CREATOR_PUBLIC_ADMIN_KEY</code> environment variable.
              </>
            ) : (
              <>
                The market creator account needs to be initialized on-chain before markets can be created and displayed.
              </>
            )}
          </p>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
          >
            Go to Admin Setup
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="mt-12 p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 text-left">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">What you'll need to do:</h3>
            <ul className="text-sm text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Create a Market Creator account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Set up Core Collection for NFT positions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Create a Merkle Tree for compressed NFTs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Verify the setup to start creating markets</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    )
  }

  // Check if market creator is not verified
  if (!marketCreatorStatus.isVerified) {
    return (
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FeaturedMarketsBanner />
        
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-yellow-500/10 border-2 border-yellow-500/20 mb-6">
            <Shield className="w-10 h-10 text-yellow-400" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Verification Required</h2>
          
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Your market creator account exists but hasn't been verified yet. 
            Complete the verification process to start creating and displaying markets.
          </p>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
          >
            Complete Verification
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
     <FeaturedMarketsBanner />

      {/* Search and Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4 lg:justify-between">
          {/* Search Bar - Smaller and on left */}
          <div className="relative w-full md:w-80 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>

          {/* Filter Buttons - Take remaining space */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  'px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300',
                  activeFilter === filter.value
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-purple-500/50 hover:text-white',
                )}
              >
                {filter.label}
                {filter.count !== undefined && (
                  <span
                    className={cn(
                      'ml-1.5 px-2 py-0.5 rounded-full text-xs font-semibold',
                      activeFilter === filter.value ? 'bg-white/20' : 'bg-slate-700/50',
                    )}
                  >
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Markets Grid */}
      {loadingMarkets ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="text-slate-400">Loading markets...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Markets</h3>
          <p className="text-slate-400">{error.message}</p>
        </div>
      ) : filteredMarkets.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700/50 mb-4">
            <Search className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No Markets Found</h3>
          <p className="text-slate-400">
            {searchQuery ? 'Try adjusting your search query' : markets.length === 0 ? (
              <>No markets have been created yet. <Link href="/admin" className="text-purple-400 hover:text-purple-300 underline">Create one</Link></>
            ) : 'No markets match the selected filter'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => (
              <MarketCard
                key={market.marketId}
                market={market}
                onClick={() => {
                  // Handle market click - could navigate to detail page
                  console.log('Market clicked:', market.marketId)
                }}
              />
            ))}
          </div>

          {/* Results count */}
          <div className="text-center mt-8 text-sm text-slate-400">
            Showing {filteredMarkets.length} of {markets.length} markets
          </div>
        </>
      )}
    </section>
  )
}
