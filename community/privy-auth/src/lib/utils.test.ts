import { describe, it, expect } from 'vitest'
import { truncateAddress, cn, toBase64 } from './utils'

describe('truncateAddress', () => {
  it('truncates a long address with default chars', () => {
    const addr = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
    expect(truncateAddress(addr)).toBe('7xKX...gAsU')
  })

  it('truncates with custom chars', () => {
    const addr = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
    expect(truncateAddress(addr, 6)).toBe('7xKXtg...osgAsU')
  })

  it('returns short address unchanged', () => {
    expect(truncateAddress('abc')).toBe('abc')
    expect(truncateAddress('12345678', 4)).toBe('12345678')
  })

  it('returns empty string unchanged', () => {
    expect(truncateAddress('')).toBe('')
  })
})

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('filters falsy values', () => {
    expect(cn('a', undefined, 'b', false, 'c')).toBe('a b c')
  })

  it('returns empty string when all falsy', () => {
    expect(cn(undefined, false)).toBe('')
  })
})

describe('toBase64', () => {
  it('encodes Uint8Array to base64', () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
    expect(toBase64(bytes)).toBe('SGVsbG8=')
  })

  it('encodes empty array', () => {
    expect(toBase64(new Uint8Array(0))).toBe('')
  })
})
