import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthStatus } from './auth-status'
import { usePrivy } from '@privy-io/react-auth'

vi.mock('@privy-io/react-auth', () => ({
  usePrivy: vi.fn(),
}))

describe('AuthStatus', () => {
  it('shows Loading when not ready', () => {
    vi.mocked(usePrivy).mockReturnValue({
      ready: false,
      authenticated: false,
    } as ReturnType<typeof usePrivy>)
    render(<AuthStatus />)
    expect(screen.getByText('Loading...')).toBeDefined()
  })

  it('shows Authenticated when ready and authenticated', () => {
    vi.mocked(usePrivy).mockReturnValue({
      ready: true,
      authenticated: true,
    } as ReturnType<typeof usePrivy>)
    render(<AuthStatus />)
    expect(screen.getByText('Authenticated')).toBeDefined()
  })

  it('shows Not signed in when ready and not authenticated', () => {
    vi.mocked(usePrivy).mockReturnValue({
      ready: true,
      authenticated: false,
    } as ReturnType<typeof usePrivy>)
    render(<AuthStatus />)
    expect(screen.getByText('Not signed in')).toBeDefined()
  })
})
