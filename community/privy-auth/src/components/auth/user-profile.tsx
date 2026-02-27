'use client'

import { useConnectedStandardWallets } from '@privy-io/react-auth/solana'
import { usePrivy } from '@privy-io/react-auth'
import { truncateAddress } from '@/lib/utils'
import type { LinkedAccountType } from '@/types'

const accountTypeLabels: Record<string, string> = {
  email: 'Email',
  wallet: 'Wallet',
  google: 'Google',
  twitter: 'Twitter',
  discord: 'Discord',
  github: 'GitHub',
  apple: 'Apple',
  farcaster: 'Farcaster',
  telegram: 'Telegram',
}

/**
 * Displays Privy user ID, linked accounts, and embedded + external Solana wallets.
 */
export function UserProfile() {
  const { user } = usePrivy()
  const { wallets } = useConnectedStandardWallets()

  if (!user) return null

  const embeddedWallet = wallets[0]
  const externalWallets = wallets.slice(1)

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">Profile</h2>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">User ID</p>
          <p className="mt-1 break-all font-mono text-sm text-gray-300">{user.id}</p>
        </div>

        {user.linkedAccounts && user.linkedAccounts.length > 0 && (
          <div className="border-t border-gray-800 pt-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Linked accounts</p>
            <ul className="mt-2 space-y-1">
              {user.linkedAccounts.map((acc, i) => {
                const type = (acc.type as LinkedAccountType) || 'wallet'
                const label = accountTypeLabels[type] ?? type
                const value =
                  'address' in acc && acc.address
                    ? truncateAddress(acc.address)
                    : 'email' in acc && acc.email
                      ? acc.email
                      : label
                return (
                  <li key={`${type}-${i}`} className="text-sm text-gray-300">
                    {label}: {String(value)}
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {embeddedWallet && (
          <div className="border-t border-gray-800 pt-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Wallet</p>
            <p className="mt-1 font-mono text-sm text-gray-300 break-all">{embeddedWallet.address}</p>
            <p className="mt-0.5 text-xs text-gray-500">{truncateAddress(embeddedWallet.address)}</p>
          </div>
        )}

        {externalWallets.length > 0 && (
          <div className="border-t border-gray-800 pt-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Other wallets</p>
            <ul className="mt-2 space-y-1">
              {externalWallets.map((w) => (
                <li key={w.address} className="text-sm text-gray-300 break-all">
                  {truncateAddress(w.address)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
