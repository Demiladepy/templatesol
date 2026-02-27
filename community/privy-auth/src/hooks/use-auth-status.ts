import { usePrivy } from '@privy-io/react-auth'
import type { AuthStatus } from '@/types'

/** Convenience hook: isAuthenticated, isLoading, user. */
export function useAuthStatus(): AuthStatus {
  const { ready, authenticated, user } = usePrivy()
  return {
    isAuthenticated: authenticated,
    isLoading: !ready,
    user: user ? { id: user.id, linkedAccounts: user.linkedAccounts } : null,
  }
}
