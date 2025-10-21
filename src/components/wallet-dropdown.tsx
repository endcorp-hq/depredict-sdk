'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import * as React from 'react'
import { ellipsify, UiWallet, useWalletUi, useWalletUiWallet } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Copy, LogOut, Wallet, ExternalLink, Sparkles } from 'lucide-react'

function WalletAvatar({ className, wallet }: { className?: string; wallet: UiWallet }) {
  return (
    <Avatar className={cn('rounded-lg h-7 w-7 ring-2 ring-background shadow-sm', className)}>
      <AvatarImage src={wallet.icon} alt={wallet.name} />
      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-semibold">
        {wallet.name[0]}
      </AvatarFallback>
    </Avatar>
  )
}

function WalletDropdownItem({ wallet }: { wallet: UiWallet }) {
  const { connect } = useWalletUiWallet({ wallet })

  return (
    <DropdownMenuItem
      className="cursor-pointer group py-2.5 rounded-lg transition-all hover:scale-[1.02]"
      key={wallet.name}
      onClick={() => {
        return connect()
      }}
    >
      {wallet.icon ? <WalletAvatar wallet={wallet} className="group-hover:ring-purple-500/50" /> : null}
      <span className="font-medium">{wallet.name}</span>
    </DropdownMenuItem>
  )
}

function WalletDropdown() {
  const { account, connected, copy, disconnect, wallet, wallets } = useWalletUi()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={connected ? "default" : "outline"} 
          className={cn(
            "cursor-pointer group relative overflow-hidden transition-all duration-300",
            connected 
              ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40" 
              : "hover:border-purple-500/50 hover:bg-purple-500/5"
          )}
        >
          {connected && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          )}
          {wallet?.icon ? <WalletAvatar wallet={wallet} /> : <Wallet className="h-4 w-4" />}
          <span className="font-semibold">
            {connected ? (account ? ellipsify(account.address) : wallet?.name) : 'Connect Wallet'}
          </span>
          {connected && <Sparkles className="h-3.5 w-3.5 animate-pulse" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
        {account ? (
          <>
            <div className="px-2 py-2 mb-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Connected</p>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                {wallet?.icon && <WalletAvatar wallet={wallet} />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{wallet?.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{ellipsify(account.address, 8)}</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="my-2 bg-border/50" />
            <DropdownMenuItem 
              className="cursor-pointer py-2.5 rounded-lg transition-all hover:bg-purple-500/10 hover:scale-[1.02] group" 
              onClick={copy}
            >
              <Copy className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
              <span className="font-medium">Copy Address</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer py-2.5 rounded-lg transition-all hover:bg-red-500/10 hover:scale-[1.02] group" 
              onClick={disconnect}
            >
              <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
              <span className="font-medium">Disconnect</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2 bg-border/50" />
          </>
        ) : (
          <div className="px-2 py-2 mb-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Available Wallets</p>
          </div>
        )}
        {wallets.length ? (
          <div className="space-y-1">
            {wallets.map((wallet) => <WalletDropdownItem key={wallet.name} wallet={wallet} />)}
          </div>
        ) : (
          <DropdownMenuItem className="cursor-pointer py-3 rounded-lg hover:bg-purple-500/10 transition-all group" asChild>
            <a 
              href="https://solana.com/solana-wallets" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
              <div className="flex-1">
                <p className="font-medium">Get a Solana Wallet</p>
                <p className="text-xs text-muted-foreground">Choose from many options</p>
              </div>
            </a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { WalletDropdown }