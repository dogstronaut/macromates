# macromates

A two-person calorie and protein tracker for me and Skyler — fast logging,
per-user accent colors, and a daily protein leaderboard built around two
overlapping progress rings.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth + Storage)
- Vercel hosting
- Open Food Facts (barcode) + USDA FoodData Central (search) + Claude vision
  (photo macro estimation) for food data

## Getting started

1. Copy `.env.local.example` to `.env.local` and fill in your Supabase
   project URL/anon key (create a free project at supabase.com).
2. Run the migration in `supabase/migrations/0001_init.sql` against your
   Supabase project (SQL editor, or `supabase db push` with the CLI).
3. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). First login sends a
   Supabase magic link; new users land on `/onboarding` to start or join a
   household and set initial goals.

## Build phases

1. **Core logging** (current) — auth, manual food entry, daily totals,
   editable goals
2. **Barcode scanning** — Open Food Facts integration
3. **Photo estimation** — camera capture → Claude vision → editable estimate
4. **Social layer** — household dashboard, leaderboard rings, streaks
5. **Nudges + polish** — notifications, weekly recap, final visual pass

## Project structure

- `app/(auth)` — login, onboarding
- `app/(app)` — dashboard, log, history, goals, settings (authenticated shell)
- `app/api/food` — barcode/search/photo-estimate route handlers (Phase 2/3)
- `app/api/nudges` — nudge send/list (Phase 5)
- `components/rings` — the two-ring brand mark / leaderboard widget
- `lib/supabase` — browser, server, and middleware Supabase clients
- `lib/macros` — macro total + progress calculations
- `supabase/migrations` — SQL schema and RLS policies
