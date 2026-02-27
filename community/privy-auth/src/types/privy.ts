/**
 * Type definitions for Privy user and auth objects used across the template.
 * These mirror the shapes from @privy-io/react-auth where needed for component props.
 */

/** Supported linked account types from Privy (email, wallet, social). */
export type LinkedAccountType =
  | 'email'
  | 'wallet'
  | 'google'
  | 'twitter'
  | 'discord'
  | 'github'
  | 'apple'
  | 'farcaster'
  | 'telegram'

/** A single linked account on the Privy user. */
export interface LinkedAccount {
  type: LinkedAccountType
  address?: string
  email?: string
  username?: string
}

/** Minimal Privy user info used in UI (ID and linked accounts). */
export interface PrivyUserInfo {
  id: string
  linkedAccounts?: unknown[]
}

/** Auth state exposed by useAuthStatus. */
export interface AuthStatus {
  isAuthenticated: boolean
  isLoading: boolean
  user: PrivyUserInfo | null
}

/** Solana wallet info for display (address and wallet type). */
export interface SolanaWalletInfo {
  address: string
  walletClientType: string
  isEmbedded?: boolean
}
