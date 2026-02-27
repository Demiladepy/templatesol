'use client'

import { useStandardSignMessage, useConnectedStandardWallets } from '@privy-io/react-auth/solana'
import { useState } from 'react'
import { toBase64 } from '@/lib/utils'

const MESSAGE = 'Hello from Privy Auth Solana template!'

/**
 * Signs a hardcoded message with the embedded (or first) wallet and shows base64-truncated signature.
 * Uses useSignMessage and useWallets from @privy-io/react-auth/solana.
 */
export function SignMessageDemo() {
  const { signMessage } = useStandardSignMessage()
  const { wallets, ready } = useConnectedStandardWallets()
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const wallet = wallets[0] ?? null

  async function handleSign() {
    if (!wallet) {
      setError('No wallet available')
      return
    }
    setError(null)
    setSignature(null)
    setLoading(true)
    try {
      const msgBytes = new TextEncoder().encode(MESSAGE)
      const { signature: sigBytes } = await signMessage({ message: msgBytes, wallet })
      setSignature(toBase64(sigBytes).slice(0, 32) + '...')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  if (!ready) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <p className="text-sm text-gray-400">Loading wallets...</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">Sign message (embedded wallet)</h2>
      <p className="mb-4 text-sm text-gray-400">Message: &quot;{MESSAGE}&quot;</p>
      <button
        type="button"
        onClick={handleSign}
        disabled={!wallet || loading}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Signing...' : 'Sign message'}
      </button>
      {signature && (
        <div className="mt-4 rounded-lg border border-emerald-800 bg-emerald-950/30 p-3">
          <p className="text-xs font-medium text-emerald-400">Signature (base64 truncated)</p>
          <p className="mt-1 break-all font-mono text-sm text-gray-300">{signature}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-lg border border-red-800 bg-red-950/30 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
