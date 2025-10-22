import { PublicKey } from '@solana/web3.js'
import { UiWalletAccount } from '@wallet-ui/react'

export enum OracleType {
  SWITCHBOARD = 'switchboard',
  MANUAL = 'manual',
}
export enum MarketType {
  LIVE = 'live',
  FUTURE = 'future',
}
export type CreateMarketArgs = {
  bettingStartTime?: number
  startTime: number
  endTime: number
  question: string
  metadataUri: string
  payer: PublicKey | string
  feeVaultAccount: PublicKey
  mintAddress?: PublicKey
  oraclePubkey?: PublicKey
  oracleType: OracleType
  marketType: MarketType
}
