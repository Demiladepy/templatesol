'use client'

import { createSolanaRpc, address } from '@solana/kit'
import { useConnectedStandardWallets } from '@privy-io/react-auth/solana'
import { useState, useEffect } from 'react'
import { truncateAddress } from '@/lib/utils'
import { SOLANA_RPC_URL, SOLANA_NETWORK, getExplorerUrl } from '@/lib/solana-rpc'
import { cn } from '@/lib/utils'

const LAMPORTS_PER_SOL = 1_000_000_000n

function formatSol(lamports: bigint): string {
  const sol = Number(lamports) / Number(LAMPORTS_PER_SOL)
  return sol.toFixed(4)
}

/**
 * Shows SOL balance, copy address, and View on Explorer for the primary (embedded or first) wallet.
 * Displays network badge (mainnet/devnet).
 */
export function WalletBalance() {
  const { wallets, ready } = useConnectedStandardWallets()
  const [balanceLamports, setBalanceLamports] = useState<bigint | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const wallet = wallets[0] ?? null

  useEffect(() => {
    if (!wallet || !ready) {
      setLoading(!ready)
      setBalanceLamports(null)
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    const rpc = createSolanaRpc(SOLANA_RPC_URL)
    rpc
      .getBalance(address(wallet.address))
      .send()
      .then((res) => {
        if (!cancelled) {
          setBalanceLamports(res.value)
          setError(null)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [wallet?.address, ready])

  const copyAddress = async () => {
    if (!wallet) return
    try {
      await navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Copy failed')
    }
  }

  if (!ready) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <p className="text-sm text-gray-400">Loading wallet...</p>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <p className="text-sm text-gray-400">No wallet connected</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Wallet</h2>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-medium',
            SOLANA_NETWORK === 'devnet' ? 'bg-amber-900/50 text-amber-400' : 'bg-gray-700 text-gray-300',
          )}
        >
          {SOLANA_NETWORK}
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Balance</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {loading ? '...' : error ? '—' : `${formatSol(balanceLamports ?? 0n)} SOL`}
          </p>
          {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Address</p>
          <p className="mt-1 break-all font-mono text-sm text-gray-300">{wallet.address}</p>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={copyAddress}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-200 transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {copied ? 'Copied!' : `Copy ${truncateAddress(wallet.address)}`}
          </button>
          <a
            href={getExplorerUrl(wallet.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-200 transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            View on Explorer
          </a>
        </div>
      </div>
    </div>
  )
}
