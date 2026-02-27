/**
 * Utility to truncate a Solana address for display.
 * @param address - Full address string
 * @param chars - Number of characters to show at start and end (default 4)
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length <= chars * 2) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

/**
 * Merge class names; useful for conditional Tailwind classes.
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Encode bytes to base64 string. Uses btoa in browser; Buffer in Node (SSR/build).
 * @param bytes - Uint8Array to encode
 */
export function toBase64(bytes: Uint8Array): string {
  if (typeof btoa !== 'undefined') {
    let binary = ''
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]!)
    }
    return btoa(binary)
  }
  return Buffer.from(bytes).toString('base64')
}
