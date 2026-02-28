# Privy Auth · Solana Template

A complete **Next.js + Tailwind + TypeScript** template that demonstrates **Privy** authentication in a Solana dApp: social login, embedded Solana wallet, protected routes, and message signing. Use it via `pnpm create solana-dapp --template privy-auth`.

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

---

## Privy account setup

1. **Create an account** at [dashboard.privy.io](https://dashboard.privy.io) (free tier).
2. **Create an app** in the dashboard and copy the **App ID**.
3. In the project root, copy `.env.example` to `.env.local` and set:
   ```bash
   NEXT_PUBLIC_PRIVY_APP_ID=your-app-id-here
   ```
4. Restart the dev server after changing env vars.

See [Privy setup guide](https://docs.privy.io/guide/react/installation) for details.

---

## Dashboard configuration

In the [Privy Dashboard](https://dashboard.privy.io):

| Setting | What to do |
|--------|------------|
| **Login methods** | Enable the methods you want: Email, Wallet, Google, Twitter/X, Discord, GitHub (and others as needed). |
| **Embedded Wallets** | Turn on **Embedded Wallets** and set **Create on login** to **All users** so every user gets a Solana wallet on first login. |
| **Allowed domains** | Add `http://localhost:3000` for local dev; add your production domain when you deploy. |
| **Session** | Optionally adjust session length and security under Dashboard settings. |

The template config in `src/components/providers.tsx` uses `loginMethods: ['email', 'wallet', 'google', 'twitter', 'discord', 'github']` and `embeddedWallets.createOnLogin: 'all-users'` to match the dashboard.

---

## Embedded wallet features

- **Automatic creation** — A Solana embedded wallet is created on first login (no extra step).
- **Same API as external wallets** — Use `useConnectedStandardWallets()` from `@privy-io/react-auth/solana`; the first wallet is used for balance, send, airdrop, and sign message.
- **Dashboard demo** — The protected dashboard shows SOL balance, copy address, “View on Explorer”, Send SOL (with simulation), Devnet airdrop, and a sign-message demo. All use the embedded (or first connected) wallet.

---

## Session management approach

- **Cookie-based sessions** — Privy uses cookies; no manual token storage in the app.
- **Persistence** — Users stay logged in across refreshes until they log out or the session expires.
- **Config** — Session length and security are configured in the [Privy Dashboard](https://dashboard.privy.io), not in code.
- **State in app** — Use `usePrivy()` for `ready`, `authenticated`, `user`, and `logout`; use `useConnectedStandardWallets()` for wallet list and signing.

---

## Authentication components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Login button / modal** | `src/components/auth/login-button.tsx` | Opens the Privy login modal; redirects to `/dashboard` on success. Uses `useLogin()` and `usePrivy().ready`. |
| **Social login provider config** | `src/components/providers.tsx` | `PrivyProvider` config: `loginMethods: ['email', 'wallet', 'google', 'twitter', 'discord', 'github']`. Enable/disable providers in the Dashboard to match. |
| **User profile with wallet info** | `src/components/auth/user-profile.tsx` | Shows Privy user ID, linked accounts (email, social), and Solana wallet address(es) from `useConnectedStandardWallets()`. |
| **Logout** | `src/components/auth/logout-button.tsx` | Calls `usePrivy().logout()` and redirects to `/`. |

All auth components are re-exported from `src/components/auth/index.ts`.

---

## Protected routes example

Unauthenticated users are redirected to `/` when they hit a protected page. Example (used in the dashboard):

```tsx
import { ProtectedRoute } from '@/components/auth'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content — only visible when authenticated.</div>
    </ProtectedRoute>
  )
}
```

`ProtectedRoute` lives in `src/components/auth/protected-route.tsx` and uses `usePrivy().authenticated` and `ready` with a redirect to `/` when not authenticated.

---

## Wallet connection state and auth status indicators

- **Auth status** — `src/components/auth/auth-status.tsx` shows a green dot + “Authenticated”, gray + “Not signed in”, or pulsing + “Loading...” using `usePrivy()`.
- **Wallet connection state** — `useConnectedStandardWallets()` returns `{ ready, wallets }`. The dashboard uses this for balance, send, airdrop, and sign message; when `!ready` or no wallet, the UI shows “Loading...” or “No wallet connected”.
- **Hook** — `src/hooks/use-auth-status.ts` exposes a simple `useAuthStatus()` that returns `{ isAuthenticated, isLoading, user }` for use in custom UIs.

---

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
│   │   ├── auth/                 # LoginButton, LogoutButton, ProtectedRoute, UserProfile, AuthStatus
│   │   ├── solana/               # WalletBalance, SendSolCard, AirdropButton, SignMessageDemo
│   │   └── providers.tsx        # PrivyProvider + Solana RPC config
│   ├── hooks/
│   │   └── use-auth-status.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── solana-rpc.ts        # RPC URL, network, getExplorerUrl
│   │   ├── simulate-transaction.ts
│   │   └── priority-fee.ts
│   └── types/
│       └── privy.ts            # Privy user, session, linked account, wallet types
├── docs/
│   └── ZK_LOGIN.md             # ZK login overview and options
├── .env.example
├── og-image.png
├── package.json                # create-solana-dapp instructions included
├── vitest.config.ts
├── vitest.setup.ts
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
| `pnpm test`   | Run Vitest unit tests        |

**Building from the templates repo:** From the repo root run `pnpm install`, then `pnpm --filter privy-auth run build` (or `cd community/privy-auth && pnpm run build` after install).

## Troubleshooting

| Issue                       | Solution                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------- |
| "Privy App ID required"     | Set `NEXT_PUBLIC_PRIVY_APP_ID` in `.env.local` and restart dev server                  |
| Login modal does not open   | Check Allowed domains in Privy Dashboard; add `http://localhost:3000`                  |
| Embedded wallet not created | In Dashboard, enable Embedded Wallets and set Create on login to "All users"           |
| Sign message fails          | Ensure you’re using the embedded or a connected external wallet; check browser console |
| Redirect loop on /dashboard | Clear cookies for localhost and sign in again                                          |

## Setup guide and best practices

- **Scaffolding** — The template is registered in the Solana Templates repo (`templates.json`). Use `pnpm create solana-dapp --template privy-auth my-app` for end-to-end scaffolding; after install, follow the `create-solana-dapp` instructions in `package.json` (Privy app, `.env.local`, dashboard config, then `pnpm run dev`).
- **Auth state** — Use `usePrivy()` for `ready`, `authenticated`, `user`, `logout`; use `useConnectedStandardWallets()` from `@privy-io/react-auth/solana` for wallet list; use `useStandardSignMessage()` and `useStandardSignAndSendTransaction()` for signing.
- **Protected routes** — Add more protected pages by wrapping the page component with `<ProtectedRoute>`.
- **Solana program interactions** — Use the same RPC and wallet from Privy; build transactions with `@solana/kit` and `@solana-program/system` (or other program packages).
- **Session** — Session timeout and security options are configurable in the Privy Dashboard.

## ZK Login

This template uses **Privy’s standard auth** (OAuth + embedded wallet), not **ZK login** (OAuth + zero-knowledge proof → deterministic wallet). Privy does not currently offer ZK login.

If you want to explore ZK login or ZK identity on Solana, see **[docs/ZK_LOGIN.md](docs/ZK_LOGIN.md)** for what ZK login is, how it differs from this setup, and options (zkID, zkPass, zkRune, Sui zkLogin, Solayer).

## Developer helpers

- **Transaction simulation** (`src/lib/simulate-transaction.ts`) — Simulate a transaction before sending. The Send SOL flow uses this by default so failed simulations block send and show a clear error.
- **Priority fee** (`src/lib/priority-fee.ts`) — `getSuggestedPriorityFee(rpcUrl)` returns recent prioritization fee (e.g. for use with `setComputeUnitPrice` on complex transactions). SOL transfers do not require priority fee.

## Resources and Privy documentation

- [Privy Docs](https://docs.privy.io) — Main documentation
- [Privy Dashboard](https://dashboard.privy.io) — App and login method config
- [Privy + Solana guide](https://docs.privy.io/recipes/solana/getting-started-with-privy-and-solana)
- [Privy React installation](https://docs.privy.io/guide/react/installation)
- [Solana Docs](https://docs.solana.com)
- [create-solana-dapp](https://github.com/solana-foundation/templates) — Template registry

## License

MIT
