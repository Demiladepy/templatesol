# Privy Auth · Solana Template

A [Next.js](https://nextjs.org) template that demonstrates **Privy** authentication in a Solana dApp: social login, embedded Solana wallet, protected routes, and message signing. Use it via `pnpm create solana-dapp --template privy-auth`.

## Features

- **Privy SDK** — Universal login (email, wallet, Google, Twitter, Discord, GitHub)
- **Embedded wallets** — Solana wallet created on first login
- **Protected routes** — Client-side guard with redirect
- **Message signing** — Sign with embedded or external wallet (Phantom, Solflare)
- **Wallet & balance** — View SOL balance, copy address, link to Explorer
- **Send SOL** — Transfer SOL to any address (mainnet or devnet)
- **Request airdrop** — Devnet-only 1 SOL airdrop for testing
- **Dark theme** — Tailwind CSS v4, Inter font
- **TypeScript** — Strict types and JSDoc

## Prerequisites

1. **Node.js 20+**
2. **pnpm 10.5.2+** (or npm/yarn)
3. **Privy account** — [dashboard.privy.io](https://dashboard.privy.io) (free tier)

## Quick Start

### 1. Create the app

```bash
pnpm create solana-dapp --template privy-auth my-app
cd my-app
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure Privy

1. Copy the env example: `cp .env.example .env.local`
2. Create an app at [dashboard.privy.io](https://dashboard.privy.io)
3. Copy your **App ID** into `.env.local` as `NEXT_PUBLIC_PRIVY_APP_ID`

### 4. Privy Dashboard setup

1. In **Login methods**, enable: Email, Wallet, Google, Twitter, Discord, GitHub (as needed)
2. In **Embedded Wallets**, enable and set **Create on login** to **All users**
3. Under **Allowed domains**, add `http://localhost:3000` for local dev

### 5. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Click **Sign in with Privy**, complete login, and you’ll be redirected to the dashboard with your profile and embedded wallet.

## Project structure

```text
community/privy-auth/
├── src/
│   ├── app/
│   │   ├── dashboard/page.tsx   # Protected dashboard
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx             # Home / login
│   ├── components/
│   │   ├── auth/                 # Login, logout, protected route, profile, status
│   │   ├── solana/               # Wallet balance, Send SOL, airdrop, sign message
│   │   └── providers.tsx        # PrivyProvider wrapper
│   ├── hooks/
│   │   └── use-auth-status.ts
│   ├── lib/
│   │   └── utils.ts
│   └── types/
│       └── privy.ts
├── .env.example
├── og-image.png
├── package.json
└── README.md
```

## Key concepts

### Privy provider

The app wraps the root layout with `PrivyProvider` in `src/components/providers.tsx`. Configuration includes:

- `loginMethods`: email, wallet, google, twitter, discord, github
- `embeddedWallets.createOnLogin: 'all-users'`
- `externalWallets.solana.connectors: toSolanaWalletConnectors()`
- `appearance.theme: 'dark'`, `walletChainType: 'solana-only'`
- Optional RPC via `NEXT_PUBLIC_SOLANA_RPC_URL`

If `NEXT_PUBLIC_PRIVY_APP_ID` is missing, the app shows setup instructions instead of crashing.

### Protected routes

Wrap any page with `ProtectedRoute` so unauthenticated users are redirected to `/`:

```tsx
import { ProtectedRoute } from '@/components/auth'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  )
}
```

### Embedded wallets

Use `useConnectedStandardWallets()` from `@privy-io/react-auth/solana` to get the list of connected wallets. Use `useStandardSignMessage()` and `useStandardSignAndSendTransaction()` from the same package to sign messages and send transactions. The dashboard shows SOL balance (via `@solana/kit`), Send SOL, and an optional Devnet airdrop; explorer links use `getExplorerUrl()` from `@/lib/solana-rpc`.

### Session management

Privy uses cookie-based sessions. Users stay logged in across refreshes until they sign out or the session expires. Configure session length and security in the Privy Dashboard.

## Environment variables

| Variable                     | Required | Description                                                         |
| ---------------------------- | -------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_PRIVY_APP_ID`   | Yes      | Privy App ID from dashboard.privy.io                                |
| `NEXT_PUBLIC_SOLANA_NETWORK` | No       | `mainnet` (default) or `devnet` (enables airdrop, explorer cluster) |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | No       | Solana RPC URL (default: public mainnet/devnet by network)          |

## Scripts

| Command       | Description                  |
| ------------- | ---------------------------- |
| `pnpm dev`    | Start dev server (Turbopack) |
| `pnpm build`  | Production build             |
| `pnpm start`  | Start production server      |
| `pnpm lint`   | Run ESLint                   |
| `pnpm format` | Format with Prettier         |

**Building from the templates repo:** From the repo root run `pnpm install`, then `pnpm --filter privy-auth run build` (or `cd community/privy-auth && pnpm run build` after install).

## Troubleshooting

| Issue                       | Solution                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------- |
| "Privy App ID required"     | Set `NEXT_PUBLIC_PRIVY_APP_ID` in `.env.local` and restart dev server                  |
| Login modal does not open   | Check Allowed domains in Privy Dashboard; add `http://localhost:3000`                  |
| Embedded wallet not created | In Dashboard, enable Embedded Wallets and set Create on login to "All users"           |
| Sign message fails          | Ensure you’re using the embedded or a connected external wallet; check browser console |
| Redirect loop on /dashboard | Clear cookies for localhost and sign in again                                          |

## Best practices

- Use `usePrivy()` for auth state (`ready`, `authenticated`, `user`, `logout`); use `useConnectedStandardWallets()` from `@privy-io/react-auth/solana` for wallet list; use `useStandardSignMessage()` and `useStandardSignAndSendTransaction()` for signing.
- Add more protected routes by wrapping their page component with `<ProtectedRoute>`.
- For Solana program interactions, use the same RPC and wallet from Privy; build transactions with `@solana/kit` and `@solana-program/system` (or other program packages).
- Session timeout and security options are configurable in the Privy Dashboard.

## Resources

- [Privy Docs](https://docs.privy.io)
- [Privy Dashboard](https://dashboard.privy.io)
- [Privy + Solana guide](https://docs.privy.io/recipes/solana/getting-started-with-privy-and-solana)
- [Solana Docs](https://docs.solana.com)
- [create-solana-dapp](https://github.com/solana-foundation/templates)

## License

MIT
