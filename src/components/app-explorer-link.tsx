import { ArrowUpRightFromSquare } from 'lucide-react'

type ExplorerLinkType = 'address' | 'tx' | 'block'

interface AppExplorerLinkProps {
  className?: string
  label: string
  path: string
  type?: ExplorerLinkType
}

export function AppExplorerLink({
  className,
  label = '',
  path,
  type = 'address',
}: AppExplorerLinkProps) {
  const cluster = process.env.NEXT_PUBLIC_RPC_ENDPOINT && process.env.NEXT_PUBLIC_RPC_ENDPOINT.includes('devnet') ? 'devnet' : 'mainnet-beta'
  const baseUrl = 'https://explorer.solana.com'
  const href = `${baseUrl}/${type}/${path}?cluster=${cluster}`
  
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `link font-mono inline-flex gap-1`}
    >
      {label}
      <ArrowUpRightFromSquare size={12} />
    </a>
  )
}