'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

/**
 * Client route guard. Shows loading until Privy is ready; redirects to / when unauthenticated; renders children when authenticated.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { authenticated, ready } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (!ready) return
    if (!authenticated) {
      router.replace('/')
    }
  }, [ready, authenticated, router])

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
