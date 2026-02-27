'use client'

import { usePrivy } from '@privy-io/react-auth'
import { cn } from '@/lib/utils'

type Status = 'loading' | 'authenticated' | 'unauthenticated'

/**
 * Auth status indicator: green dot when authenticated, gray when not, pulsing when loading. Shows "Authenticated" / "Not signed in" / "Loading...".
 */
export function AuthStatus({ className }: { className?: string }) {
  const { ready, authenticated } = usePrivy()

  const status: Status = !ready ? 'loading' : authenticated ? 'authenticated' : 'unauthenticated'

  const label = status === 'loading' ? 'Loading...' : status === 'authenticated' ? 'Authenticated' : 'Not signed in'

  return (
    <span className={cn('inline-flex items-center gap-2 text-sm text-gray-400', className)}>
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          status === 'loading' && 'animate-pulse bg-gray-500',
          status === 'authenticated' && 'bg-emerald-400',
          status === 'unauthenticated' && 'bg-gray-600',
        )}
      />
      {label}
    </span>
  )
}
