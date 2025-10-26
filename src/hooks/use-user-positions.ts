'use client'

import { useState, useEffect } from 'react'
import { useSolana } from '@/components/solana/use-solana'

interface Asset {
  id: string
  burnt: boolean
  interface: string
  content: {
    $schema: string
    json_uri: string
    metadata: {
      name: string
      symbol?: string
      [key: string]: any
    }
  }
  ownership: {
    frozen: boolean
    non_transferable: boolean
    delegated: boolean
    delegate?: string | null
  }
  grouping?: Array<{
    group_key: string
    group_value: string
  }>
  [key: string]: any
}

interface DasApiResponse {
  result: {
    total: number
    limit: number
    page: number
    items: Asset[]
  }
}

interface ParsedAsset {
  assetId: string
  marketId: number
  positionId: number
  name: string
}

export function useUserPositions() {
  const { account, cluster } = useSolana()
  const [assets, setAssets] = useState<Asset[]>([])
  const [parsedAssets, setParsedAssets] = useState<ParsedAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Parse NFT name to extract market_id and position_id
  // Format: "DEPREDICT-{market_id}-{position_id}"
  const parseAssetName = (asset: Asset): ParsedAsset | null => {
    try {
      const name = asset.content?.metadata?.name
      
      if (!name) {
        console.warn(`Asset ${asset.id} has no name`)
        return null
      }

      const match = name.match(/^DEPREDICT-(\d+)-(\d+)$/)
      
      if (!match) {
        console.warn(`Asset ${asset.id} has invalid name format: ${name}`)
        return null
      }

      return {
        assetId: asset.id,
        marketId: parseInt(match[1], 10),
        positionId: parseInt(match[2], 10),
        name,
      }
    } catch (err) {
      console.error(`Error parsing asset ${asset.id}:`, err)
      return null
    }
  }

  const fetchUserAssets = async (ownerAddress: string, page = 1, limit = 100) => {
    try {
      setLoading(true)
      setError(null)

      const collectionAddress = process.env.NEXT_PUBLIC_SHORTX_COLLECTION_ADDRESS
      if (!collectionAddress) {
        throw new Error('Collection address not configured')
      }

      // Get RPC endpoint from cluster
      const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT!

      const dasResponse = await fetch(rpcEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: '1',
          method: 'searchAssets',
          params: {
            ownerAddress,
            grouping: ['collection', collectionAddress],
            page,
            limit,
            options: {
              showCollectionMetadata: true,
              showUnverifiedCollections: true,
            },
          },
        }),
      })

      if (!dasResponse.ok) {
        throw new Error('Failed to fetch assets from DAS API')
      }

      const data: DasApiResponse = await dasResponse.json()
      
      // Filter out burnt assets
      const validAssets = data.result.items.filter(asset => {
        if (asset.burnt) {
          console.log(`Filtering out burnt asset: ${asset.id}`)
          return false
        }
        return true
      })
      
      setAssets(validAssets)
      
      // Parse asset names to extract market IDs and position IDs
      const parsed = validAssets
        .map(parseAssetName)
        .filter((asset): asset is ParsedAsset => asset !== null)
      
      setParsedAssets(parsed)
      
      console.log(`Found ${validAssets.length} valid assets (${data.result.items.length - validAssets.length} burnt)`)
      console.log(`Parsed ${parsed.length} position assets`)
      
      return parsed
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching assets')
      setError(error)
      console.error('Error fetching user positions:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Fetch assets when account changes
  useEffect(() => {
    if (account?.address) {
      fetchUserAssets(account.address)
    } else {
      setAssets([])
      setParsedAssets([])
    }
  }, [account?.address, cluster])

  return {
    assets,
    parsedAssets,
    loading,
    error,
    refetch: () => account?.address ? fetchUserAssets(account.address) : Promise.resolve([]),
  }
}