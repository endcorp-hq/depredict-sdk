'use client'

import React, { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useShortx } from '@/components/solana/useDepredict'
import { toast } from 'sonner'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useCreateCoreCollection } from '@/hooks/use-create-core-collection'
import { useCreateMerkleTree } from '@/hooks/use-create-merkle-tree'

export function MarketCreatorSection() {
  const wallet = useWallet()
  const { connection } = useConnection()
  const { createMarketCreator, verifyMarketCreator } = useShortx()
  const { createCollection } = useCreateCoreCollection()
  const { createTree } = useCreateMerkleTree()

  const [step, setStep] = useState<'create' | 'verify' | 'complete'>('create')
  const [creatorName, setCreatorName] = useState('DePredict Market Creator')
  const [feeVault, setFeeVault] = useState('')
  const [marketCreatorPda, setMarketCreatorPda] = useState<string>('')
  const [coreCollection, setCoreCollection] = useState<string>('')
  const [merkleTree, setMerkleTree] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Step 1: Create Market Creator (Unverified)
  const handleCreateMarketCreator = async () => {
    if (!wallet.publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    if (!feeVault) {
      toast.error('Please enter a fee vault address')
      return
    }

    setIsProcessing(true)

    try {
      toast.loading('Creating market creator...', { id: 'create-mc' })

      const feeVaultPubkey = new PublicKey(feeVault)
      
      // Call SDK method
      const result = await createMarketCreator()
      
      if (!result) {
        throw new Error('Failed to create market creator')
      }

      const { marketCreator } = result
      
      setMarketCreatorPda(marketCreator.toBase58())
      setStep('verify')
      
      toast.success('Market creator created (unverified)!', { id: 'create-mc' })
      
    } catch (error: any) {
      console.error('Create market creator error:', error)
      toast.error(`Failed: ${error.message}`, { id: 'create-mc' })
    } finally {
      setIsProcessing(false)
    }
  }

  // Step 2: Verify Market Creator
  const handleVerifyMarketCreator = async () => {
    if (!wallet.publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    if (!marketCreatorPda) {
      toast.error('No market creator to verify')
      return
    }

    setIsProcessing(true)

    try {
      // 2a. Create Core Collection
      toast.loading('Creating core collection...', { id: 'verify-mc' })
      
      const collectionResult = await createCollection(wallet.publicKey.toBase58(), marketCreatorPda)
      
      if (!collectionResult) {
        throw new Error('Failed to create collection')
      }
      
      setCoreCollection(collectionResult.publicKey)
      
      // 2b. Create Merkle Tree
      toast.loading('Creating merkle tree...', { id: 'verify-mc' })
      
      const treeResult = await createTree(wallet.publicKey.toBase58(), marketCreatorPda)
      
      if (!treeResult) {
        throw new Error('Failed to create merkle tree')
      }
      
      setMerkleTree(treeResult.publicKey)
      
      // 2c. Verify Market Creator
      toast.loading('Verifying market creator...', { id: 'verify-mc' })
      
      const verifyResult = await verifyMarketCreator({
        signer: wallet.publicKey,
        coreCollection: new PublicKey(collectionResult.publicKey),
        merkleTree: new PublicKey(treeResult.publicKey),
      })
      
      if (!verifyResult) {
        throw new Error('Failed to verify market creator')
      }
      
      setStep('complete')
      toast.success('Market creator verified successfully!', { id: 'verify-mc' })
      
      // Save to localStorage for future reference
      localStorage.setItem('marketCreatorDetails', JSON.stringify({
        marketCreator: marketCreatorPda,
        coreCollection: collectionResult.publicKey,
        merkleTree: treeResult.publicKey,
        verified: true,
      }))
      
    } catch (error: any) {
      console.error('Verify market creator error:', error)
      toast.error(`Failed: ${error.message}`, { id: 'verify-mc' })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Create */}
      {step === 'create' && (
        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <h2 className="text-2xl font-bold mb-4">Step 1: Create Market Creator</h2>
          <p className="text-slate-400 mb-6">
            Create an unverified market creator account. You'll verify it in the next step.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Creator Name</label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Market Creator Name"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Fee Vault Address</label>
              <input
                type="text"
                value={feeVault}
                onChange={(e) => setFeeVault(e.target.value)}
                placeholder="Enter fee vault public key"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono text-sm"
              />
            </div>

            <button
              onClick={handleCreateMarketCreator}
              disabled={!wallet.publicKey || !feeVault || isProcessing}
              className="w-full py-4 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </span>
              ) : (
                'Create Market Creator'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Verify */}
      {step === 'verify' && (
        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold">Step 2: Verify Market Creator</h2>
          </div>
          
          <p className="text-slate-400 mb-4">
            Market creator created successfully! Now let's verify it with a collection and merkle tree.
          </p>

          <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/30 mb-6">
            <p className="text-sm text-slate-400">Market Creator PDA:</p>
            <p className="font-mono text-sm text-purple-400 break-all">{marketCreatorPda}</p>
          </div>

          <button
            onClick={handleVerifyMarketCreator}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying... (This may take a while)
              </span>
            ) : (
              'Verify Market Creator'
            )}
          </button>
        </div>
      )}

      {/* Step 3: Complete */}
      {step === 'complete' && (
        <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-green-400">Market Creator Verified!</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="p-4 rounded-lg bg-slate-900/50">
              <p className="text-slate-400 mb-1">Market Creator:</p>
              <p className="font-mono text-purple-400 break-all">{marketCreatorPda}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50">
              <p className="text-slate-400 mb-1">Core Collection:</p>
              <p className="font-mono text-purple-400 break-all">{coreCollection}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50">
              <p className="text-slate-400 mb-1">Merkle Tree:</p>
              <p className="font-mono text-purple-400 break-all">{merkleTree}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setStep('create')
              setMarketCreatorPda('')
              setCoreCollection('')
              setMerkleTree('')
            }}
            className="w-full mt-4 py-3 rounded-xl font-semibold bg-slate-700 hover:bg-slate-600 transition-all"
          >
            Create Another
          </button>
        </div>
      )}
    </div>
  )
}