'use client'

import { useState } from 'react'
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey as umiPublicKey } from '@metaplex-foundation/umi'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'sonner'

export function useBurnNft() {
  const [isBurning, setIsBurning] = useState(false)
  const wallet = useWallet()

  const burnNft = async (assetId: string, coreCollection?: string) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected')
    }

    setIsBurning(true)
    
    try {
      // Get RPC endpoint
      const rpcEndpoint = "https://devnet.helius-rpc.com/?api-key=c7c71360-ee3b-437a-bc8d-0c2931d673df"
      
      // Create umi instance with DAS API plugin and wallet adapter
      const umi = createUmi(rpcEndpoint)
        .use(dasApi()) // Critical: enables getAssetWithProof and DAS queries
        .use(walletAdapterIdentity(wallet)) // Standard wallet adapter integration
      
      // Convert asset ID to umi public key
      const assetPublicKey = umiPublicKey(assetId)
      
      toast.loading('Fetching asset metadata...', { id: 'burn' })
      
      // CRITICAL: Fetch current owner and delegate from DAS API first (matching backend)
      let currentOwnerStr: string | undefined
      let currentDelegateStr: string | undefined
      let detectedCoreCollection: string | undefined
      
      try {
        // Use DAS API to get the asset's current ownership info
        const dasAsset: any = await (umi as any).rpc.getAsset(assetId)
        
        console.log('DAS Asset:', dasAsset)
        
        // Extract current owner
        currentOwnerStr = dasAsset?.ownership?.owner?.toString() || 
                         dasAsset?.ownership?.owner
        
        // Extract current delegate (if exists)
        const delegate = dasAsset?.ownership?.delegate?.toString() || 
                        dasAsset?.ownership?.delegate
        currentDelegateStr = typeof delegate === 'string' && delegate.length > 0 ? delegate : undefined
        
        // Extract collection (for core collections)
        const groupingArr: any[] = dasAsset?.grouping || 
                                   dasAsset?.group || 
                                   dasAsset?.content?.grouping || 
                                   []
        const coll = groupingArr.find?.(
          (g: any) => (g?.group_key || g?.groupKey) === 'collection'
        )
        const value = coll?.group_value ?? coll?.groupValue
        if (typeof value === 'string' && value.length > 0) {
          detectedCoreCollection = value
        }
        
        // Check if already burned
        const compression = dasAsset?.compression || {}
        const stateStr = (compression?.state || dasAsset?.content?.state || '')
          .toString()
          .toLowerCase()
        const dasBurned = Boolean(
          dasAsset?.burned === true ||
          compression?.compressed === false ||
          stateStr.includes('burn')
        )
        
        if (dasBurned) {
          throw new Error('ASSET_ALREADY_BURNED')
        }
        
        console.log('Current Owner:', currentOwnerStr)
        console.log('Current Delegate:', currentDelegateStr)
        console.log('Wallet:', wallet.publicKey.toBase58())
        
        // Verify the connected wallet is authorized (owner or delegate)
        const requester = wallet.publicKey.toBase58()
        const allowed = new Set<string>(
          [
            ...(currentOwnerStr ? [currentOwnerStr] : []),
            ...(currentDelegateStr ? [currentDelegateStr] : []),
          ].map((s) => s?.toString() ?? String(s))
        )
        
        if (allowed.size > 0 && !allowed.has(requester)) {
          throw new Error('LEAF_OWNER_NOT_AUTHORIZED')
        }
      } catch (error: any) {
        if (error.message === 'ASSET_ALREADY_BURNED') {
          toast.error('NFT is already burned', { id: 'burn' })
          throw error
        }
        if (error.message === 'LEAF_OWNER_NOT_AUTHORIZED') {
          toast.error('You are not authorized to burn this NFT', { id: 'burn' })
          throw error
        }
        // If DAS fetch fails, log but continue with wallet address
        console.warn('Failed to fetch DAS asset:', error)
      }
      
      toast.loading('Fetching asset proof...', { id: 'burn' })
      
      // Get asset with proof
      const assetWithProof = await getAssetWithProof(umi as any, assetPublicKey, {
        truncateCanopy: true,
      })
      
      // Use ACTUAL on-chain owner/delegate from DAS (matching backend logic exactly)
      const leafOwner = currentOwnerStr 
        ? umiPublicKey(currentOwnerStr) 
        : umiPublicKey(wallet.publicKey.toBase58())
      
      const leafDelegate = currentDelegateStr
        ? umiPublicKey(currentDelegateStr)
        : leafOwner // Default to owner if no delegate
      
      console.log('Using leafOwner:', leafOwner.toString())
      console.log('Using leafDelegate:', leafDelegate.toString())
      
      toast.loading('Preparing burn transaction...', { id: 'burn' })
      
      // Build burn instruction with ACTUAL owner/delegate (matching backend)
      const burnBuilder = burnV2(umi, {
        ...assetWithProof,
        leafOwner,
        leafDelegate,
        // Use detected or provided collection
        ...(coreCollection || detectedCoreCollection 
          ? { coreCollection: umiPublicKey(coreCollection || detectedCoreCollection!) } 
          : {}
        ),
      })
      
      toast.loading('Burning NFT...', { id: 'burn' })
      
      // Send and confirm transaction
      await burnBuilder.sendAndConfirm(umi)
      
      toast.success('NFT burned successfully!', { id: 'burn' })
      return true
    } catch (error: any) {
      console.error('Burn error:', error)
      
      // Enhanced error handling based on backend patterns
      const errorMsg = error?.message || String(error)
      const errorLower = errorMsg.toLowerCase()
      
      if (errorLower.includes('user rejected') || errorLower.includes('user denied')) {
        toast.error('Transaction rejected', { id: 'burn' })
      } else if (errorLower.includes('proof') || errorLower.includes('invalid root')) {
        toast.error('Invalid proof - please try again', { id: 'burn' })
      } else if (errorLower.includes('already burned') || errorLower.includes('burnt')) {
        toast.error('NFT is already burned', { id: 'burn' })
      } else if (errorLower.includes('not authorized')) {
        toast.error('Not authorized to burn this NFT', { id: 'burn' })
      } else if (errorLower.includes('429') || errorLower.includes('rate limit')) {
        toast.error('Rate limited - please try again in a moment', { id: 'burn' })
      } else if (!errorLower.includes('asset_already_burned')) {
        toast.error(`Failed to burn NFT: ${errorMsg.slice(0, 100)}`, { id: 'burn' })
      }
      throw error
    } finally {
      setIsBurning(false)
    }
  }

  return {
    burnNft,
    isBurning,
  }
}