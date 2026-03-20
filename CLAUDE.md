# CLAUDE.md — ClearMarket App

## What This Is

ClearMarket Labs is a cannabis investment platform on Solana. Growers list cannabis grows, investors fund them with USDC via escrow, and an oracle system scores and verifies each grow. Crypto-native, DeFi-adjacent. "Back the Plant. Bank the Return."

**Brand**: Cannabis Purple (#7C3AED) on near-black (#0A0A0F). Sharp DeFi voice. Cannabis-only (soybeans removed).

**PARALLEL WORK WARNING**: A rebrand is running in a separate Claude Code session. Check `claude-progress.txt` for which files are safe to edit.

## Stack

- **Framework**: Next.js (static export via `output: "export"`)
- **Styling**: Tailwind CSS v4
- **Blockchain**: Solana (SPL tokens, escrow program, wallet adapter)
- **Backend**: Supabase (auth, database, edge functions)
- **Indexing**: Helius (Solana RPC, webhooks, DAS API)
- **Charts**: Recharts + Lightweight Charts
- **Animation**: Framer Motion + Lottie
- **Deploy**: Cloudflare Pages via Wrangler (`npm run deploy`)

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build (static export)
npm run lint         # ESLint
npm run deploy       # Build + deploy to Cloudflare Pages
```

## Architecture

```
app/                    # Next.js app router (static export)
  page.tsx              # Landing page
  dashboard/            # Portfolio dashboard
  growers/              # Grower profiles, comparison, verification
  launchpad/            # Commodity listings, invest flow, submit new
  portfolio/            # User portfolio view
  settlement/           # Settlement tracking
  verification/         # Grower verification flow
  account/              # User account settings
  auth/callback/        # Supabase auth callback
  contact/              # Contact page
  team/                 # Team page
  privacy/ terms/ cookies/  # Legal pages
components/
  Navbar.tsx            # Main navigation
  Footer.tsx            # Site footer
  ClientProviders.tsx   # Wallet + Supabase provider wrapper
  ConnectWalletModal.tsx
  landing/              # Landing page sections
  launchpad/            # InvestModal, LaunchpadCard, OracleScorePanel, SubmissionForm
  growers/              # GrowerCard, GrowerFilters
  portfolio/            # Portfolio components
lib/
  config.ts             # Centralised Supabase URL + anon key
  constants.ts          # Market pairs, mock user ID, intervals
  supabase.ts           # Supabase client
  solana.ts             # Solana connection + helpers
  wallet.ts             # Wallet utilities
  escrow.ts             # Solana escrow program
  helius.ts             # Helius API integration
  oracle.ts             # Oracle pricing
  growerVerification.ts # Grower verification logic
  auth.ts               # Auth utilities
  usdc.ts               # USDC token helpers
supabase/
  functions/            # Edge functions (helius-webhook, submit-listing, update-soybean-oracle)
  config.toml           # Supabase project config (sealcisjhqlrpmuescsu)
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anon key (read-only)
NEXT_PUBLIC_HELIUS_API_KEY     # Helius RPC API key
```

## Key Conventions

- **Static export**: No server-side rendering. All pages must work as static HTML. No `getServerSideProps`, no API routes in Next.js (use Supabase edge functions instead).
- **Wallet-first auth**: Users connect Solana wallets, not email/password. Supabase auth is secondary.
- **Component naming**: PascalCase files, one component per file.
- **Imports**: Use `@/` alias for project root imports.
- **No mock data in production**: All `MOCK_` constants are dev-only. Real data comes from Supabase.

## Security

- NEVER commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` in client code.
- The anon key in `lib/config.ts` has a hardcoded fallback. This is intentional for the static build but should be read-only scoped.
- All state-changing operations go through Supabase edge functions, not client-side.

## Testing

No test framework configured yet. Run `/qa` to audit, use gstack `/qa` for test-fix-verify loop.

## Deployment

Push to GitHub, then `npm run deploy` runs `next build && wrangler pages deploy out --project-name clearmarket-app`. Live at clearmarket-app.pages.dev.
