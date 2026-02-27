'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AuthStatus, LoginButton } from '@/components/auth'

export default function HomePage() {
  const { ready, authenticated } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && authenticated) {
      router.replace('/dashboard')
    }
  }, [ready, authenticated, router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (authenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Privy Auth</h1>
          <p className="mt-2 text-gray-400">Sign in with email, wallet, or social. Get an embedded Solana wallet.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 text-left">
            <p className="font-medium text-white">Social login</p>
            <p className="text-sm text-gray-400">Google, Twitter, Discord, GitHub</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 text-left">
            <p className="font-medium text-white">Embedded wallet</p>
            <p className="text-sm text-gray-400">Created on first login</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 text-left">
            <p className="font-medium text-white">Protected routes</p>
            <p className="text-sm text-gray-400">/dashboard requires auth</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 text-left">
            <p className="font-medium text-white">Message signing</p>
            <p className="text-sm text-gray-400">Sign with embedded or external wallet</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <LoginButton />
          <AuthStatus />
        </div>
      </div>
    </div>
  )
}
