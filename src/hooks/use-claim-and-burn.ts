'use client'

import { useState } from 'react'
import { PublicKey, Transaction, TransactionInstruction, VersionedTransaction } from '@solana/web3.js'
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey as umiPublicKey } from '@metaplex-foundation/umi'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { useShortx } from '@/components/solana/useDepredict'
import { toast } from 'sonner'

export function useClaimAndBurn() {
  const [isProcessing, setIsProcessing] = useState(false)
  const wallet = useWallet()
  const { connection } = useConnection()
  const { client } = useShortx()

  const claimAndBurn = async (assetId: string, marketId: number, coreCollection?: string) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected')
    }

    if (!client) {
      throw new Error('SDK not initialized')
    }

    setIsProcessing(true)

    try {
      const rpcEndpoint = 'https://devnet.helius-rpc.com/?api-key=c7c71360-ee3b-437a-bc8d-0c2931d673df'
      const assetPublicKey = new PublicKey(assetId)
      const payerPubkey = wallet.publicKey

      toast.loading('Preparing claim and burn...', { id: 'claim-burn' })

      // Step 1: Get payout instructions from SDK
      const payoutResult = await client.trade.payoutPosition({
        marketId,
        payer: payerPubkey,
        assetId: assetPublicKey,
      })

      // Extract instructions from payout result
      // Extract instructions from payout result
      let payoutInstructions: TransactionInstruction[] = []
      if (payoutResult) {
        if (Array.isArray(payoutResult)) {
          payoutInstructions = payoutResult as TransactionInstruction[]
        } else if ('instructions' in payoutResult) {
          payoutInstructions = (payoutResult as any).instructions as TransactionInstruction[]
        } else if (payoutResult instanceof VersionedTransaction) {
          throw new Error('Versioned transaction returned - need to handle separately')
        }
      }

      if (payoutInstructions.length === 0) {
        throw new Error('No payout instructions received from SDK')
      }

      // Step 2: Create UMI and get burn instructions
      const umi = createUmi(rpcEndpoint).use(dasApi()).use(walletAdapterIdentity(wallet))

      const assetUmiKey = umiPublicKey(assetId)

      toast.loading('Fetching asset metadata...', { id: 'claim-burn' })

      // Fetch current owner and delegate from DAS
      let currentOwnerStr: string | undefined
      let currentDelegateStr: string | undefined
      let detectedCoreCollection: string | undefined

      try {
        const dasAsset: any = await (umi as any).rpc.getAsset(assetId)

        currentOwnerStr = dasAsset?.ownership?.owner?.toString() || dasAsset?.ownership?.owner
        const delegate = dasAsset?.ownership?.delegate?.toString() || dasAsset?.ownership?.delegate
        currentDelegateStr = typeof delegate === 'string' && delegate.length > 0 ? delegate : undefined

        // Extract collection
        const groupingArr: any[] = dasAsset?.grouping || dasAsset?.group || dasAsset?.content?.grouping || []
        const coll = groupingArr.find?.((g: any) => (g?.group_key || g?.groupKey) === 'collection')
        const value = coll?.group_value ?? coll?.groupValue
        if (typeof value === 'string' && value.length > 0) {
          detectedCoreCollection = value
        }
      } catch (error) {
        console.warn('Failed to fetch DAS asset:', error)
      }

      toast.loading('Fetching asset proof...', { id: 'claim-burn' })

      // Get asset with proof
      const assetWithProof = await getAssetWithProof(umi as any, assetUmiKey, {
        truncateCanopy: true,
      })

      // Use actual on-chain owner/delegate
      const leafOwner = currentOwnerStr ? umiPublicKey(currentOwnerStr) : umiPublicKey(wallet.publicKey.toBase58())

      const leafDelegate = currentDelegateStr ? umiPublicKey(currentDelegateStr) : leafOwner

      // Build burn instructions
      const burnBuilder = burnV2(umi, {
        ...assetWithProof,
        leafOwner,
        leafDelegate,
        ...(coreCollection || detectedCoreCollection
          ? { coreCollection: umiPublicKey(coreCollection || detectedCoreCollection!) }
          : {}),
      })

      // Get UMI instructions and convert to web3.js format
      const umiInstructions = burnBuilder.getInstructions()
      const burnInstructions: TransactionInstruction[] = umiInstructions.map((ix: any) => {
        const programId = new PublicKey(ix.programId.toString())
        const keys = ix.keys.map((k: any) => ({
          pubkey: new PublicKey(k.pubkey.toString()),
          isSigner: k.isSigner,
          isWritable: k.isWritable,
        }))
        const data = Buffer.from(ix.data)
        return new TransactionInstruction({ programId, keys, data })
      })

      toast.loading('Building transaction...', { id: 'claim-burn' })

      // Step 3: Combine instructions into single transaction
      const transaction = new Transaction()

      // Add payout instructions first
      payoutInstructions.forEach((ix) => transaction.add(ix))

      // Then add burn instructions
      burnInstructions.forEach((ix) => transaction.add(ix))

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = payerPubkey

      toast.loading('Waiting for signature...', { id: 'claim-burn' })

      // Step 4: Sign transaction
      const signedTx = await wallet.signTransaction(transaction)

      toast.loading('Claiming and burning...', { id: 'claim-burn' })

      // Step 5: Send transaction
      const signature = await connection.sendRawTransaction(signedTx.serialize())

      // Wait for confirmation
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      })

      toast.success('Successfully claimed and burned NFT!', { id: 'claim-burn' })
      return { signature, success: true }
    } catch (error: any) {
      console.error('Claim and burn error:', error)

      const errorMsg = error?.message || String(error)
      const errorLower = errorMsg.toLowerCase()

      if (errorLower.includes('user rejected') || errorLower.includes('user denied')) {
        toast.error('Transaction rejected', { id: 'claim-burn' })
      } else if (errorLower.includes('proof') || errorLower.includes('invalid root')) {
        toast.error('Invalid proof - please try again', { id: 'claim-burn' })
      } else {
        toast.error(`Failed: ${errorMsg.slice(0, 100)}`, { id: 'claim-burn' })
      }
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    claimAndBurn,
    isProcessing,
  }
}
