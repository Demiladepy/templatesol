import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import React from 'react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Privy Auth · Solana',
  description: 'Privy authentication with embedded Solana wallet — create-solana-dapp template',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`min-h-screen font-sans ${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
