'use client'

import {
  createSolanaRpc,
  address,
  lamports,
  createNoopSigner,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
  compileTransaction,
  getTransactionEncoder,
  pipe,
} from '@solana/kit'
import { getTransferSolInstruction } from '@solana-program/system'
import { useStandardSignAndSendTransaction, useConnectedStandardWallets } from '@privy-io/react-auth/solana'
import { useState } from 'react'
import bs58 from 'bs58'
import { SOLANA_RPC_URL, getExplorerUrl } from '@/lib/solana-rpc'
import { simulateTransaction } from '@/lib/simulate-transaction'
import { cn } from '@/lib/utils'

/**
 * Send SOL form: destination address, amount in SOL. Builds transfer tx, signs and sends via Privy.
 */
export function SendSolCard() {
  const { signAndSendTransaction } = useStandardSignAndSendTransaction()
  const { wallets, ready } = useConnectedStandardWallets()
  const [destination, setDestination] = useState('')
  const [amountSol, setAmountSol] = useState('')
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const simulateBeforeSend = true

  const wallet = wallets[0] ?? null

  async function handleSend() {
    if (!wallet) {
      setError('No wallet available')
      return
    }
    const dest = destination.trim()
    if (!dest) {
      setError('Enter destination address')
      return
    }
    const amount = parseFloat(amountSol)
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid amount (SOL)')
      return
    }
    setError(null)
    setSignature(null)
    setSending(true)
    try {
      const rpc = createSolanaRpc(SOLANA_RPC_URL)
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()
      const lamportsAmount = BigInt(Math.floor(amount * 1_000_000_000))
      const sourceSigner = createNoopSigner(address(wallet.address))
      const transferIx = getTransferSolInstruction({
        source: sourceSigner,
        destination: address(dest),
        amount: lamports(lamportsAmount),
      })
      const message = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayer(address(wallet.address), tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstruction(transferIx, tx),
      )
      const compiled = compileTransaction(message)
      const encoded = new Uint8Array(getTransactionEncoder().encode(compiled))

      if (simulateBeforeSend) {
        const sim = await simulateTransaction(SOLANA_RPC_URL, encoded)
        if (!sim.success) {
          setError(`Simulation failed: ${sim.message}`)
          setSending(false)
          return
        }
      }

      const { signature: sigBytes } = await signAndSendTransaction({
        transaction: encoded,
        wallet,
      })
      setSignature(bs58.encode(sigBytes))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSending(false)
    }
  }

  if (!ready) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <p className="text-sm text-gray-400">Loading...</p>
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
      <h2 className="mb-4 text-lg font-semibold text-white">Send SOL</h2>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Destination address</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. 7xKX..."
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 font-mono text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            disabled={sending}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Amount (SOL)</label>
          <input
            type="text"
            inputMode="decimal"
            value={amountSol}
            onChange={(e) => setAmountSol(e.target.value)}
            placeholder="0.01"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            disabled={sending}
          />
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className={cn(
            'w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50',
          )}
        >
          {sending ? 'Sending…' : 'Send SOL'}
        </button>
      </div>
      {signature && (
        <div className="mt-4 rounded-lg border border-emerald-800 bg-emerald-950/30 p-3">
          <p className="text-xs font-medium text-emerald-400">Transaction sent</p>
          <a
            href={getExplorerUrl(signature, 'tx')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-all font-mono text-sm text-gray-300 underline hover:text-white"
          >
            {signature}
          </a>
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
