# Code maintenance check

Last run: dependency and tooling checks on the privy-auth template.

## Results

| Check            | Status |
|------------------|--------|
| ESLint           | Pass (0 errors, 0 warnings) |
| Tests (Vitest)   | Pass (17 tests, 3 files) |
| Build (Next.js)  | Pass |
| Prettier         | Pass |
| Templates generate | Pass (from repo root) |

## Changes made

1. **ESLint**
   - Switched to `FlatCompat` from `@eslint/eslintrc` so the Next config loads on Windows (avoids `Cannot find module ... core-web-vitals`).
   - Turned off `@typescript-eslint/no-unsafe-declaration-merging` to avoid ESLint 9 / typescript-eslint compatibility issues.
   - Added devDependency: `@eslint/eslintrc@^3.3.1`.

2. **Lint**
   - Resolved `react-hooks/exhaustive-deps` in `wallet-balance.tsx` by using `wallet` in the `useEffect` dependency array instead of only `wallet?.address`.

## How to run

From `templates/community/privy-auth`:

```bash
pnpm run lint       # ESLint
pnpm run test       # Vitest
pnpm run build      # Next.js (includes typecheck + lint)
pnpm run format:check  # Prettier
```

Or from `templates`:

```bash
pnpm run generate
pnpm --filter privy-auth run ci
```

## Notes

- Peer dependency warnings (e.g. `@privy-io/react-auth` vs `@solana/kit` / React 19) are from upstream and do not block build or tests.
- Next.js 15.3.6 is deprecated for security; consider upgrading when the rest of the stack allows.
