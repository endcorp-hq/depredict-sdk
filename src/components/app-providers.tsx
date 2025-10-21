'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { ReactQueryProvider } from './react-query-provider'
import { SolanaProvider } from '@/components/solana/solana-provider'
import React from 'react'
import { ShortxProvider } from './solana/useDepredict'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <ShortxProvider>
        <SolanaProvider>{children}</SolanaProvider>
        </ShortxProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
