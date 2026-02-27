'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit'
import type { ReactNode } from 'react'
import { SOLANA_RPC_URL } from '@/lib/solana-rpc'

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
const wssUrl = SOLANA_RPC_URL.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:')

/**
 * Root providers wrapper: Privy only. Renders setup instructions when App ID is missing.
 */
export function Providers({ children }: { children: ReactNode }) {
  if (!appId || appId.trim() === '') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-6 text-gray-200">
        <div className="max-w-md rounded-xl border border-gray-800 bg-gray-900 p-8">
          <h1 className="mb-2 text-xl font-semibold text-white">Privy App ID required</h1>
          <p className="mb-4 text-sm text-gray-400">This template uses Privy for authentication. To run it locally:</p>
          <ol className="list-inside list-decimal space-y-2 text-sm text-gray-300">
            <li>Create an app at dashboard.privy.io</li>
            <li>
              Copy <code className="rounded bg-gray-800 px-1">.env.example</code> to{' '}
              <code className="rounded bg-gray-800 px-1">.env.local</code>
            </li>
            <li>
              Set <code className="rounded bg-gray-800 px-1">NEXT_PUBLIC_PRIVY_APP_ID</code> in{' '}
              <code className="rounded bg-gray-800 px-1">.env.local</code>
            </li>
            <li>Add http://localhost:3000 to Allowed Domains in the Privy Dashboard</li>
          </ol>
          <a
            href="https://docs.privy.io/guide/react/installation"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-indigo-400 hover:text-indigo-300"
          >
            Privy setup guide →
          </a>
        </div>
      </div>
    )
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ['email', 'wallet', 'google', 'twitter', 'discord', 'github'],
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
        appearance: {
          theme: 'dark',
          walletChainType: 'solana-only',
        },
        solana: {
          rpcs: {
            'solana:mainnet': {
              rpc: createSolanaRpc(SOLANA_RPC_URL),
              rpcSubscriptions: createSolanaRpcSubscriptions(wssUrl),
            },
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
