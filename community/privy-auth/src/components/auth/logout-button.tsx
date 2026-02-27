'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

/**
 * Calls Privy logout and redirects to home (/).
 */
export function LogoutButton() {
  const { logout } = usePrivy()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.replace('/')
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
    >
      Sign out
    </button>
  )
}
