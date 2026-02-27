'use client'

import { AuthStatus, LogoutButton, ProtectedRoute, UserProfile } from '@/components/auth'
import { AirdropButton, SendSolCard, SignMessageDemo, WalletBalance } from '@/components/solana'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-950 px-4 py-12">
        <div className="mx-auto max-w-2xl space-y-8">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-6">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <div className="flex items-center gap-4">
              <AuthStatus />
              <LogoutButton />
            </div>
          </header>

          <UserProfile />

          <WalletBalance />

          <SendSolCard />

          <AirdropButton />

          <SignMessageDemo />

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">Protected content</h2>
            <p className="text-sm text-gray-400">
              This page is wrapped in ProtectedRoute. Unauthenticated users are redirected to the home page.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
