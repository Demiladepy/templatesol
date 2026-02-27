import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = config.externals || {}
    config.externals['@solana/kit'] = 'commonjs @solana/kit'
    config.externals['@solana-program/system'] = 'commonjs @solana-program/system'
    return config
  },
}

export default nextConfig
