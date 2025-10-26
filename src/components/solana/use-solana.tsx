'use client'

import { useWallet, useConnection } from '@solana/wallet-adapter-react'

export function useSolana() {
  const {
    connected,
    connecting,
    disconnecting,
    publicKey,
    wallet,
    wallets,
    select,
    connect,
    disconnect,
    signTransaction,
    signAllTransactions,
  } = useWallet()
  const { connection } = useConnection()


  return {
    connected,
    connecting,
    disconnecting,
    publicKey,
    wallet,
    wallets,
    account: publicKey ? { address: publicKey.toBase58() } : null,
    select,
    connect,
    disconnect,
    signTransaction,
    signAllTransactions,
    connection,
  }
}