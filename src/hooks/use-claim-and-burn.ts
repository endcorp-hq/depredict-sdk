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
    if (!wallet.publicKey || !wallet.signAllTransactions) {
      throw new Error('Wallet not connected or does not support signing multiple transactions')
    }

    if (!client) {
      throw new Error('SDK not initialized')
    }

    setIsProcessing(true)

    try {
      const rpcEndpoint = 'https://devnet.helius-rpc.com/?api-key=c7c71360-ee3b-437a-bc8d-0c2931d673df'
      const assetPublicKey = new PublicKey(assetId)
      const payerPubkey = wallet.publicKey

      toast.loading('Preparing transactions...', { id: 'claim-burn' })

      // Step 1: Get payout instructions from SDK
      const payoutResult = await client.trade.payoutPosition({
        marketId,
        payer: payerPubkey,
        assetId: assetPublicKey,
        rpcEndpoint,
      })

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

      const assetWithProof = await getAssetWithProof(umi as any, assetUmiKey, {
        truncateCanopy: true,
      })

      const leafOwner = currentOwnerStr ? umiPublicKey(currentOwnerStr) : umiPublicKey(wallet.publicKey.toBase58())
      const leafDelegate = currentDelegateStr ? umiPublicKey(currentDelegateStr) : leafOwner

      const burnBuilder = burnV2(umi, {
        ...assetWithProof,
        leafOwner,
        leafDelegate,
        ...(coreCollection || detectedCoreCollection
          ? { coreCollection: umiPublicKey(coreCollection || detectedCoreCollection!) }
          : {}),
      })

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

      toast.loading('Building transactions...', { id: 'claim-burn' })

      // Step 3: Build TWO separate transactions
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

      // Payout transaction
      const payoutTx = new Transaction()
      payoutInstructions.forEach((ix) => payoutTx.add(ix))
      payoutTx.recentBlockhash = blockhash
      payoutTx.feePayer = payerPubkey

      // Burn transaction
      const burnTx = new Transaction()
      burnInstructions.forEach((ix) => burnTx.add(ix))
      burnTx.recentBlockhash = blockhash
      burnTx.feePayer = payerPubkey

      toast.loading('Waiting for signatures...', { id: 'claim-burn' })

      // Step 4: Sign BOTH transactions at once
      const signedTxs = await wallet.signAllTransactions([payoutTx, burnTx])
      const [signedPayoutTx, signedBurnTx] = signedTxs

      toast.loading('Claiming winnings...', { id: 'claim-burn' })

      // Step 5: Send payout transaction and confirm
      toast.loading('Claiming winnings...', { id: 'claim-burn' })

      // Step 5: Send payout transaction and confirm - MUST succeed before burn
      let payoutSignature: string
      try {
        payoutSignature = await connection.sendRawTransaction(signedPayoutTx.serialize())

        const payoutConfirmation = await connection.confirmTransaction(
          {
            signature: payoutSignature,
            blockhash,
            lastValidBlockHeight,
          },
          'confirmed',
        )

        // Check if payout actually succeeded
        if (payoutConfirmation.value.err) {
          throw new Error(`Payout failed: ${JSON.stringify(payoutConfirmation.value.err)}`)
        }

        console.log('Payout confirmed successfully:', payoutSignature)
      } catch (error: any) {
        console.error('Payout transaction failed:', error)
        toast.error('Payout failed - NFT not burned', { id: 'claim-burn' })
        throw new Error(`Payout failed, burn aborted: ${error.message}`)
      }

      // Wait 2 seconds for state to propagate
      toast.loading('Waiting for state update...', { id: 'claim-burn' })
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.loading('Burning NFT...', { id: 'claim-burn' })

      // Step 6: Only burn if payout confirmed successfully
      let burnSignature: string
      try {
        burnSignature = await connection.sendRawTransaction(signedBurnTx.serialize())

        const burnConfirmation = await connection.confirmTransaction(
          {
            signature: burnSignature,
            blockhash,
            lastValidBlockHeight,
          },
          'confirmed',
        )

        if (burnConfirmation.value.err) {
          console.error('Burn failed but payout succeeded:', burnConfirmation.value.err)
          toast.warning('Claimed successfully but burn failed', { id: 'claim-burn' })
          return { payoutSignature, burnSignature: null, success: 'partial' }
        }

        console.log('Burn confirmed successfully:', burnSignature)
      } catch (error: any) {
        console.error('Burn transaction failed:', error)
        toast.warning('Claimed successfully but burn failed', { id: 'claim-burn' })
        return { payoutSignature, burnSignature: null, success: 'partial' }
      }

      toast.success('Successfully claimed and burned NFT!', { id: 'claim-burn' })
      return { payoutSignature, burnSignature, success: true }
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
