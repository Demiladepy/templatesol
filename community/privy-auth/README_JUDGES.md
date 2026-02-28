# Privy Auth Template — For Judges

**Template name:** privy-auth  
**Category:** Auth  
**Stack:** Next.js 15, React 19, TypeScript, Privy, Solana (@solana/kit)

---

## 1. Summary

This is a **community template** for the [Solana Templates](https://github.com/solana-foundation/templates) repo. It provides a production-ready **Privy + Solana** auth flow in a Next.js app: social login, embedded Solana wallet, protected routes, SOL balance, send SOL, optional Devnet airdrop, and message signing. It is intended for use with `pnpm create solana-dapp --template privy-auth` and aligns with the [Community Template Contributor Guide](https://github.com/solana-foundation/templates/blob/main/COMMUNITY_TEMPLATE_GUIDE.md).

---

## 2. What Was Delivered

| Deliverable | Status |
|-------------|--------|
| Privy authentication (social + embedded wallet) | ✅ |
| Protected routes & auth status UI | ✅ |
| SOL balance display + copy address + Explorer link | ✅ |
| Send SOL (mainnet/devnet) | ✅ |
| Devnet-only airdrop button | ✅ |
| Sign message demo | ✅ |
| TypeScript, strict types, JSDoc on exports | ✅ |
| Unit tests (Vitest + React Testing Library) | ✅ |
| ESLint + Prettier, passing build | ✅ |
| `.env.example` and README documentation | ✅ |
| Template metadata (displayName, usecase, keywords, og-image) | ✅ |

---

## 3. How to Evaluate

### 3.1 Prerequisites

- **Node.js 20+**
- **pnpm 10.5.2+** (or npm/yarn)
- A **Privy App ID** (free at [dashboard.privy.io](https://dashboard.privy.io))

### 3.2 Run the app (from this directory)

```bash
# Install dependencies (from repo root: pnpm install; or here: pnpm install)
pnpm install

# Copy env and set Privy App ID (required for login)
cp .env.example .env.local
# Edit .env.local: set NEXT_PUBLIC_PRIVY_APP_ID=<your-app-id>

# Optional: use Devnet for airdrop
# In .env.local set NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Start dev server
pnpm dev
```

Then open **http://localhost:3000** → click **Sign in with Privy** → complete login → you are redirected to the dashboard with profile, balance, Send SOL, airdrop (if devnet), and sign-message demo.

**Privy setup (one-time):** In [Privy Dashboard](https://dashboard.privy.io): enable Embedded Wallets (Create on login: All users), add `http://localhost:3000` to Allowed domains, and enable desired login methods (email, Google, etc.).

### 3.3 Run tests and build

```bash
# Unit tests (17 tests: utils, solana-rpc, AuthStatus component)
pnpm run test

# Lint
pnpm run lint

# Production build (includes typecheck and lint)
pnpm run build

# Format check
pnpm run format:check
```

**Full CI (single command):**

```bash
pnpm run ci
```

All of the above should pass with no errors.

### 3.4 Verify as a template (from templates repo root)

```bash
# From repository root (templates repo)
pnpm install
pnpm run generate
pnpm --filter privy-auth run build
pnpm --filter privy-auth run test
```

---

## 4. Architecture and Technical Notes

- **App structure:** Next.js App Router (`src/app/`), `src/components/` (auth + solana), `src/lib/` (utils, solana-rpc), `src/hooks/`, `src/types/`.
- **Auth:** Root layout wrapped with `PrivyProvider` (`src/components/providers.tsx`). Uses Privy v2 API: `usePrivy()`, `useConnectedStandardWallets()`, `useStandardSignMessage()`, `useStandardSignAndSendTransaction()`.
- **Solana:** RPC and network from env (`NEXT_PUBLIC_SOLANA_NETWORK`, `NEXT_PUBLIC_SOLANA_RPC_URL`). Balance and transfers use `@solana/kit`; transfer instruction uses `@solana-program/system` with `createNoopSigner` for the source account. Signatures are encoded with `bs58` for explorer links.
- **Tests:** Vitest, jsdom, React Testing Library. Tests cover `truncateAddress`, `cn`, `toBase64`, `getExplorerUrl` / network exports, and `AuthStatus` with mocked `usePrivy`.
- **Quality:** ESLint (Next.js config via FlatCompat), Prettier, TypeScript strict. See `MAINTENANCE.md` for a recent maintenance run.

---

## 5. File Map for Judges

| Path | Purpose |
|------|--------|
| `README.md` | User-facing docs (setup, features, troubleshooting) |
| `README_JUDGES.md` | This document |
| `MAINTENANCE.md` | Last maintenance check and how to re-run |
| `.env.example` | Required/optional env vars |
| `package.json` | Metadata (displayName, usecase, keywords), scripts, deps |
| `src/components/providers.tsx` | PrivyProvider and Solana RPC config |
| `src/components/auth/*` | Login, logout, ProtectedRoute, UserProfile, AuthStatus |
| `src/components/solana/*` | WalletBalance, SendSolCard, AirdropButton, SignMessageDemo |
| `src/lib/utils.ts` | truncateAddress, cn, toBase64 |
| `src/lib/solana-rpc.ts` | RPC URL, network, getExplorerUrl |
| `src/app/dashboard/page.tsx` | Protected dashboard assembling all blocks |
| `vitest.config.ts` + `vitest.setup.ts` | Test config and React global for JSX |
| `src/**/*.test.ts(x)` | Unit and component tests |

---

## 6. Criteria Checklist (suggested)

- **Functionality:** Login/logout, protected route, profile, balance, send SOL, airdrop (devnet), sign message all work with a real Privy app and embedded wallet.
- **Code quality:** TypeScript strict, no lint errors, formatted with Prettier, tests pass.
- **Documentation:** README and .env.example clear; README_JUDGES.md gives a reproducible evaluation path.
- **Template compliance:** Fits community template requirements (structure, package.json metadata, og-image, works with `create-solana-dapp` when template is selected).

---

## 7. Contact and License

- **License:** MIT  
- **Upstream:** [Solana Templates](https://github.com/solana-foundation/templates) / [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp)  
- **Privy:** [docs.privy.io](https://docs.privy.io) | [Privy + Solana](https://docs.privy.io/recipes/solana/getting-started-with-privy-and-solana)
