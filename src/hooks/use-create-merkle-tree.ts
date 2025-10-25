'use client'

import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createTreeV2, setTreeDelegate } from '@metaplex-foundation/mpl-bubblegum'
import { generateSigner } from '@metaplex-foundation/umi'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useShortx } from '@/components/solana/useDepredict'
import { toast } from 'sonner'

export function useCreateMerkleTree() {
  const [isCreating, setIsCreating] = useState(false)
  const wallet = useWallet()
  const { connection } = useConnection()
  const { client } = useShortx()

  const createTree = async (authorityAddress: string, marketCreatorPda: string) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected')
    }

    if (!client) {
      throw new Error('Client not initialized')
    }

    setIsCreating(true)

    try {
      // Create UMI instance with wallet adapter identity
      const umi = createUmi(connection.rpcEndpoint)
      umi.use(walletAdapterIdentity(wallet))

      // Generate merkle tree keypair
      const merkleTree = generateSigner(umi)

      // Create tree
      const builder = await createTreeV2(umi, {
        merkleTree,
        maxDepth: 16,
        canopyDepth: 8,
        maxBufferSize: 64,
        public: false,
        treeCreator: umi.identity,
      })

      await builder.sendAndConfirm(umi)

      console.log('Merkle tree created:', merkleTree.publicKey.toString())

      // Wait for the account to be fully propagated on-chain
      await new Promise((resolve) => setTimeout(resolve, 5000))

      // Verify the account exists and can be fetched
      const treePubkey = new PublicKey(merkleTree.publicKey.toString())
      
      try {
        const treeAccountInfo = await connection.getAccountInfo(treePubkey)
        console.log('Tree account info:', treeAccountInfo)

        if (!treeAccountInfo) {
          throw new Error(`Merkle tree account ${treePubkey.toString()} not found after creation`)
        }

        // Delegate tree authority to the market creator PDA
        const adminPubkey = new PublicKey(authorityAddress)
        const [derivedMarketCreatorPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('market_creator'), adminPubkey.toBytes()],
          client.program.programId
        )

        console.log('Delegating tree to market creator PDA:', derivedMarketCreatorPda.toString())

        // Retry delegation up to 3 times with delays
        let delegated = false
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            if (attempt > 1) {
              toast.loading(`Retrying tree delegation (attempt ${attempt}/3)...`, { id: 'tree-delegate' })
            }
            
            await setTreeDelegate(umi, {
              merkleTree: merkleTree.publicKey,
              treeCreator: umi.identity,
              newTreeDelegate: fromWeb3JsPublicKey(derivedMarketCreatorPda),
            }).sendAndConfirm(umi)
            
            delegated = true
            console.log('✅ Tree delegation successful')
            if (attempt > 1) {
              toast.success('Tree delegation successful!', { id: 'tree-delegate' })
            }
            break
          } catch (e) {
            console.log(
              `setTreeDelegate attempt ${attempt} failed. ${attempt < 3 ? 'Retrying in 4s...' : 'No more retries.'}`
            )
            if (attempt < 3) {
              toast.loading(`Tree delegation failed, retrying in 4 seconds... (attempt ${attempt}/3)`, { 
                id: 'tree-delegate' 
              })
              await new Promise((resolve) => setTimeout(resolve, 4000))
            } else {
              toast.dismiss('tree-delegate')
              throw e
            }
          }
        }

        if (!delegated) {
          throw new Error('Failed to delegate tree after 3 attempts')
        }
      } catch (error) {
        console.error('❌ Failed to verify/delegate merkle tree:', error)
        throw error
      }

      return {
        publicKey: treePubkey.toString(),
      }
    } catch (error) {
      console.error('Create merkle tree error:', error)
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createTree,
    isCreating,
  }
}