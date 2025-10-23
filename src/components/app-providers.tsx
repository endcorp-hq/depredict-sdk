'use client'

import { ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

// Your existing providers
import { SolanaProvider } from './solana/solana-provider'
import { ReactQueryProvider } from './react-query-provider'
import { ThemeProvider } from './theme-provider'
import { ShortxProvider } from './solana/useDepredict'
import { Toaster } from 'sonner'

export function AppProviders({ children }: { children: ReactNode }) {
  // You can also use custom RPC
  const endpoint = useMemo(() => 
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet'), 
    []
  )

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <ReactQueryProvider>
              <SolanaProvider>
                <ShortxProvider>
                  <Toaster position="top-right" richColors />
                  {children}
                </ShortxProvider>
              </SolanaProvider>
            </ReactQueryProvider>
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
