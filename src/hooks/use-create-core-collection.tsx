'use client'

import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore, createCollectionV2, pluginAuthorityPairV2 } from '@metaplex-foundation/mpl-core'
import { generateSigner } from '@metaplex-foundation/umi'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useShortx } from '@/components/solana/useDepredict'
import type { Pda } from '@metaplex-foundation/umi'

export function useCreateCoreCollection() {
  const [isCreating, setIsCreating] = useState(false)
  const wallet = useWallet()
  const { connection } = useConnection()
  const { client } = useShortx()

  const createCollection = async (authorityAddress: string, marketCreatorPda: string) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected')
    }

    if (!client) {
      throw new Error('Client not initialized')
    }

    setIsCreating(true)

    try {
      // Create UMI instance with wallet adapter identity
      const umi = createUmi(connection.rpcEndpoint).use(mplCore())
      
      // Use wallet adapter identity for signing
      umi.use(walletAdapterIdentity(wallet))

      // Generate collection keypair
      const collection = generateSigner(umi)

      // Derive market creator PDA for update authority
      const adminPubkey = new PublicKey(authorityAddress)
      const seeds = [Buffer.from('market_creator'), adminPubkey.toBytes()]
      const [pda, bump] = PublicKey.findProgramAddressSync(
        seeds,
        client.program.programId
      )

      const localMarketCreatorPda: Pda = [fromWeb3JsPublicKey(pda), bump] as Pda

      // Create collection with market creator PDA as update authority
      const tx_create = await createCollectionV2(umi, {
        collection,
        payer: umi.identity,
        updateAuthority: localMarketCreatorPda,
        name: 'Sports Betting Collection',
        uri: 'https://example.com/metadata.json',
        plugins: [
          pluginAuthorityPairV2({
            type: 'BubblegumV2',
          }),
        ],
      }).sendAndConfirm(umi)

      console.log('Collection created:', tx_create)

      return {
        ...collection,
        publicKey: collection.publicKey.toString(),
      }
    } catch (error) {
      console.error('Create collection error:', error)
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createCollection,
    isCreating,
  }
}