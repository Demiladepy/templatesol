/**
 * Solana RPC and network config from env. Used for balance, send, airdrop.
 */

const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? 'mainnet'
const urlOverride = process.env.NEXT_PUBLIC_SOLANA_RPC_URL

const DEFAULT_RPC: Record<string, string> = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
}

export const SOLANA_RPC_URL = urlOverride ?? DEFAULT_RPC[network] ?? DEFAULT_RPC.mainnet
export const SOLANA_NETWORK = network === 'devnet' ? 'devnet' : 'mainnet'

export const SOLANA_WSS_URL = SOLANA_RPC_URL.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:')

const EXPLORER_BASE: Record<string, string> = {
  mainnet: 'https://explorer.solana.com',
  devnet: 'https://explorer.solana.com',
}

export function getExplorerUrl(address: string, path = 'address'): string {
  const base = EXPLORER_BASE[SOLANA_NETWORK]
  const cluster = SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : ''
  return `${base}/${path}/${address}${cluster}`
}
