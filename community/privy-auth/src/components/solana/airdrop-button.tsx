'use client'

import { createSolanaRpc, createSolanaRpcSubscriptions, address, lamports, airdropFactory } from '@solana/kit'
import { useConnectedStandardWallets } from '@privy-io/react-auth/solana'
import { useState } from 'react'
import { SOLANA_RPC_URL, SOLANA_WSS_URL, SOLANA_NETWORK } from '@/lib/solana-rpc'

const LAMPORTS_PER_SOL = 1_000_000_000n
const AIRDROP_AMOUNT = 1_000_000_000n // 1 SOL

/**
 * Request airdrop on Devnet only. Shows warning and disabled state on mainnet.
 */
export function AirdropButton() {
  const { wallets, ready } = useConnectedStandardWallets()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const wallet = wallets[0] ?? null

  const isDevnet = SOLANA_NETWORK === 'devnet'

  async function handleAirdrop() {
    if (!wallet || !isDevnet) return
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const rpc = createSolanaRpc(SOLANA_RPC_URL)
      const rpcSubscriptions = createSolanaRpcSubscriptions(SOLANA_WSS_URL)
      const airdrop = airdropFactory({ rpc, rpcSubscriptions })
      await airdrop({
        commitment: 'confirmed',
        recipientAddress: address(wallet.address),
        lamports: lamports(AIRDROP_AMOUNT),
      })
      setSuccess(`Airdropped ${Number(AIRDROP_AMOUNT) / Number(LAMPORTS_PER_SOL)} SOL`)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  if (!ready || !wallet) return null

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-2 text-lg font-semibold text-white">Request airdrop</h2>
      {!isDevnet ? (
        <p className="text-sm text-gray-400">
          Only available on Devnet. Set{' '}
          <code className="rounded bg-gray-800 px-1">NEXT_PUBLIC_SOLANA_NETWORK=devnet</code> to test.
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm text-gray-400">Devnet only. Request 1 SOL to your wallet for testing.</p>
          <button
            type="button"
            onClick={handleAirdrop}
            disabled={loading}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-50"
          >
            {loading ? 'Requesting…' : 'Request 1 SOL'}
          </button>
          {success && <p className="mt-3 text-sm text-emerald-400">{success}</p>}
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </>
      )}
    </div>
  )
}
