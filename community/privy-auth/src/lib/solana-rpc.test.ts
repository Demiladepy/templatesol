import { describe, it, expect } from 'vitest'
import { getExplorerUrl, SOLANA_NETWORK, SOLANA_RPC_URL } from './solana-rpc'

describe('solana-rpc', () => {
  it('exports SOLANA_NETWORK as mainnet or devnet', () => {
    expect(['mainnet', 'devnet']).toContain(SOLANA_NETWORK)
  })

  it('exports SOLANA_RPC_URL as non-empty string', () => {
    expect(typeof SOLANA_RPC_URL).toBe('string')
    expect(SOLANA_RPC_URL.length).toBeGreaterThan(0)
  })

  it('getExplorerUrl returns address URL with correct base', () => {
    const addr = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
    const url = getExplorerUrl(addr)
    expect(url).toContain('https://explorer.solana.com')
    expect(url).toContain('/address/')
    expect(url).toContain(addr)
  })

  it('getExplorerUrl with path tx returns tx URL', () => {
    const sig = '5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW'
    const url = getExplorerUrl(sig, 'tx')
    expect(url).toContain('https://explorer.solana.com/tx/')
    expect(url).toContain(sig)
  })

  it('getExplorerUrl devnet includes cluster param when SOLANA_NETWORK is devnet', () => {
    if (SOLANA_NETWORK !== 'devnet') return
    const url = getExplorerUrl('someaddr')
    expect(url).toContain('cluster=devnet')
  })
})
