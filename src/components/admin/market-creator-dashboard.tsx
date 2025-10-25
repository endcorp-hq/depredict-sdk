'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarketCreatorStats } from './market-creator-stats'
import { CreateMarketSection } from './create-market-section'
import { ResolveMarketSection } from './resolve-market-section'
import { BarChart3, Plus, CheckCircle } from 'lucide-react'

interface MarketCreatorDashboardProps {
  marketCreatorPda: string
}

export function MarketCreatorDashboard({ marketCreatorPda }: MarketCreatorDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Market Creator Info */}
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-semibold text-green-400">Market Creator Active</span>
        </div>
        <p className="text-xs text-slate-400 font-mono break-all">{marketCreatorPda}</p>
      </div>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Market
          </TabsTrigger>
          <TabsTrigger value="resolve" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Resolve Markets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <MarketCreatorStats marketCreatorPda={marketCreatorPda} />
        </TabsContent>

        <TabsContent value="create">
          <CreateMarketSection />
        </TabsContent>

        <TabsContent value="resolve">
          <ResolveMarketSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}