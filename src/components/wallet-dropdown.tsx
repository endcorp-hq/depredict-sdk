'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import * as React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Copy, LogOut, Wallet, ExternalLink, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

function ellipsify(str: string = '', len: number = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '...' + str.substring(str.length - len, str.length)
  }
  return str
}

function WalletAvatar({ className, icon, name }: { className?: string; icon?: string; name: string }) {
  return (
    <Avatar className={cn('rounded-lg h-7 w-7 ring-2 ring-background shadow-sm', className)}>
      {icon && <AvatarImage src={icon} alt={name} />}
      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-500 text-white text-xs font-semibold">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}

function WalletDropdownItem({ wallet }: { wallet: any }) {
  const { select } = useWallet()

  return (
    <DropdownMenuItem
      className="cursor-pointer group py-2.5 rounded-lg transition-all hover:scale-[1.02]"
      key={wallet.adapter.name}
      onClick={() => select(wallet.adapter.name)}
    >
      {wallet.adapter.icon && (
        <WalletAvatar
          icon={wallet.adapter.icon}
          name={wallet.adapter.name}
          className="group-hover:ring-emerald-500/50"
        />
      )}
      <span className="font-medium">{wallet.adapter.name}</span>
    </DropdownMenuItem>
  )
}

function WalletDropdown() {
  const { publicKey, wallet, wallets, disconnect, connected } = useWallet()
  const [mounted, setMounted] = React.useState(false)

  // Only render wallet-specific content after client-side mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58())
      toast.success('Address copied to clipboard!')
    }
  }

  const availableWallets = wallets.filter(
    (w) => w.readyState === WalletReadyState.Installed || w.readyState === WalletReadyState.Loadable
  )

  // Show a static button during SSR
  if (!mounted) {
    return (
      <Button variant="outline" className="hover:border-emerald-500/50 hover:bg-emerald-500/5">
        <Wallet className="h-4 w-4" />
        <span className="font-semibold">Connect Wallet</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={connected ? 'default' : 'outline'}
          className={cn(
            'cursor-pointer group relative overflow-hidden transition-all duration-300',
            connected
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
              : 'hover:border-emerald-500/50 hover:bg-emerald-500/5'
          )}
        >
          {connected && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          )}
          {wallet?.adapter.icon ? (
            <WalletAvatar icon={wallet.adapter.icon} name={wallet.adapter.name} />
          ) : (
            <Wallet className="h-4 w-4" />
          )}
          <span className="font-semibold">
            {connected ? (publicKey ? ellipsify(publicKey.toBase58()) : wallet?.adapter.name) : 'Connect Wallet'}
          </span>
          {connected && <Sparkles className="h-3.5 w-3.5 animate-pulse" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
        {connected && publicKey ? (
          <>
            <div className="px-2 py-2 mb-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Connected</p>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                {wallet?.adapter.icon && (
                  <WalletAvatar icon={wallet.adapter.icon} name={wallet.adapter.name} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{wallet?.adapter.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{ellipsify(publicKey.toBase58(), 8)}</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="my-2 bg-border/50" />
            <DropdownMenuItem
              className="cursor-pointer py-2.5 rounded-lg transition-all hover:bg-emerald-500/10 hover:scale-[1.02] group"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
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
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
              Available Wallets
            </p>
          </div>
        )}
        {availableWallets.length ? (
          <div className="space-y-1">
            {availableWallets.map((wallet) => (
              <WalletDropdownItem key={wallet.adapter.name} wallet={wallet} />
            ))}
          </div>
        ) : (
          <DropdownMenuItem
            className="cursor-pointer py-3 rounded-lg hover:bg-emerald-500/10 transition-all group"
            asChild
          >
            <a
              href="https://solana.com/ecosystem/explore?categories=wallet"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
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