'use client'

import { useState, useEffect } from 'react'
import { PublicKey } from '@solana/web3.js'
import DepredictClient from '@endcorp/depredict'

export interface MarketCreatorStatus {
  exists: boolean
  pda: string | null
  isChecking: boolean
  error: string | null
  hasEnvKey: boolean
  isVerified: boolean
}

export function useMarketCreator(client: DepredictClient | null, isInitialized: boolean) {
  const [status, setStatus] = useState<MarketCreatorStatus>({
    exists: false,
    pda: null,
    isChecking: true,
    error: null,
    hasEnvKey: false,
    isVerified: false,
  })

  console.log('market creator status', status)

  useEffect(() => {
    const checkMarketCreator = async () => {
      setStatus(prev => ({ ...prev, isChecking: true }))

      try {
        const envAdminKey = process.env.NEXT_PUBLIC_CREATOR_PUBLIC_ADMIN_KEY
        let storedDetails: {
          marketCreator?: string
          adminKey?: string
          verified?: boolean
        } | null = null

        if (typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem('marketCreatorDetails')
            if (raw) {
              storedDetails = JSON.parse(raw)
            }
          } catch (storageError) {
            console.warn('Failed to read marketCreatorDetails from localStorage', storageError)
          }
        }

        const storedMarketCreator = storedDetails?.marketCreator ?? null
        const storedAdminKey = storedDetails?.adminKey ?? null
        const hasKeySource = Boolean(envAdminKey || storedMarketCreator || storedAdminKey)

        if (!hasKeySource) {
          console.log('No market creator configuration found in environment or local storage')
          setStatus({
            exists: false,
            pda: null,
            isChecking: false,
            error: null,
            hasEnvKey: false,
            isVerified: false,
          })
          return
        }

        if (!client || !isInitialized) {
          return // Wait for SDK to initialize
        }

        let targetPda: PublicKey | null = null

        if (envAdminKey) {
          const adminPubkey = new PublicKey(envAdminKey)
          ;[targetPda] = PublicKey.findProgramAddressSync(
            [Buffer.from('market_creator'), adminPubkey.toBytes()],
            client.program.programId,
          )
        }

        try {
          if (!targetPda && storedMarketCreator) {
            targetPda = new PublicKey(storedMarketCreator)
          }

          if (!targetPda && storedAdminKey) {
            const adminPubkey = new PublicKey(storedAdminKey)
            ;[targetPda] = PublicKey.findProgramAddressSync(
              [Buffer.from('market_creator'), adminPubkey.toBytes()],
              client.program.programId,
            )
          }

          if (!targetPda) {
            throw new Error('Unable to determine market creator PDA')
          }

          const marketCreatorAccount = client.program.account.marketCreator as {
            fetchNullable?: (pubkey: PublicKey) => Promise<unknown | null>
            fetch: (pubkey: PublicKey) => Promise<unknown>
          }
          const account = marketCreatorAccount.fetchNullable
            ? await marketCreatorAccount.fetchNullable(targetPda)
            : await (async () => {
                try {
                  return await marketCreatorAccount.fetch(targetPda)
                } catch {
                  return null
                }
              })()

          if (account) {
            const verified = Boolean((account as any).verified)
            console.log('Market creator found on-chain:', targetPda.toBase58())
            console.log('Verified:', verified)

            setStatus({
              exists: true,
              pda: targetPda.toBase58(),
              isChecking: false,
              error: null,
              hasEnvKey: hasKeySource,
              isVerified: verified,
            })
          } else {
            console.log('Market creator not found for admin key')
            setStatus({
              exists: false,
              pda: null,
              isChecking: false,
              error: null,
              hasEnvKey: hasKeySource,
              isVerified: false,
            })
          }
        } catch (error) {
          console.log('Error fetching market creators:', error)
          setStatus({
            exists: false,
            pda: null,
            isChecking: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            hasEnvKey: hasKeySource,
            isVerified: false,
          })
        }
      } catch (error) {
        console.error('Error checking market creator:', error)
        setStatus({
          exists: false,
          pda: null,
          isChecking: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          hasEnvKey: false,
          isVerified: false,
        })
      }
    }

    checkMarketCreator()
  }, [client, isInitialized])

  return status
}
