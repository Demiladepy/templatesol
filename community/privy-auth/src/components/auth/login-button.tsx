'use client'

import { useLogin, usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

/**
 * Opens the Privy universal login modal. On success redirects to /dashboard; on error logs to console.
 */
export function LoginButton() {
  const router = useRouter()
  const { ready } = usePrivy()
  const { login } = useLogin({
    onComplete: () => router.replace('/dashboard'),
    onError: (err: unknown) => console.error('Privy login error:', err),
  })

  return (
    <button
      type="button"
      onClick={login}
      disabled={!ready}
      className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50"
    >
      {ready ? 'Sign in with Privy' : 'Loading...'}
    </button>
  )
}
