# Phase 0 — Community Template Requirements Checklist

Extracted from `COMMUNITY_TEMPLATE_GUIDE.md` and `CONTRIBUTING.md`.

## Directory & structure

- [x] Template lives in `community/<template-name>/` (e.g. `community/privy-auth/`)
- [x] Root contains at least: `package.json`, `og-image.png`
- [x] Any structure allowed under that (e.g. `src/`, `app/`, etc.)

## package.json (required fields)

- [x] `name` — unique, kebab-case (e.g. `privy-auth`)
- [x] `displayName` — human-readable (e.g. `Privy Auth`)
- [x] `description` — clear, under ~100 chars
- [x] `usecase` — one of: Starter, Payments, Airdrop, DeFi, NFT, Gaming, Auth, etc.
- [x] `keywords` — array of searchable terms

## Optional create-solana-dapp block

- [x] `instructions` — array of post-create steps (can use `+{pm} run dev`, etc.)
- [ ] `rename` — optional text replacements (e.g. `project-name` → `{{name}}`)

## og-image.png

- [x] Filename exactly `og-image.png` (lowercase)
- [x] Dimensions 1200 x 630 pixels
- [x] Format PNG
- [x] File size under 500 KB (enforced by repo lint)
- Can be generated with: `pnpm create-image "<Text>" community/privy-auth`

## Repo-level checks

- [x] `pnpm generate` — template appears in `templates.json` and `TEMPLATES.md`
- [ ] `pnpm lint` — passes (requires root `pnpm install` first; validates package.json + og-image)
- [ ] `pnpm format` — Prettier check passes
- [ ] Test with: `pnpm create solana-dapp --template privy-auth my-app`

## CONTRIBUTING.md notes

- Branch prefix with GitHub username (e.g. `yourname/privy-auth`)
- Run `pnpm format` before PR
- Conventional commits: `feat:`, `fix:`, etc.

## Summary

Template is in place with all required metadata and og-image. After running `pnpm install` at the **repo root** (templates/), run `pnpm generate` and `pnpm lint` to confirm. Scaffolding can be tested with `pnpm create solana-dapp --template privy-auth my-app` from a directory outside the repo.
