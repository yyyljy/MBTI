# MBTI

MBTI is an onchain agent identity and life-record MVP.

## Runnable Slice

`create agent -> view profile -> change privacy defaults`

## Stack

- `Next.js` App Router
- `TypeScript`
- `Prisma` with `PostgreSQL`
- `Zod`
- `Tailwind CSS`
- `Vitest`
- `Playwright`

## Local Setup

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL with `pnpm db:up`.
3. Apply the migration with `pnpm db:migrate`.
4. Run the app with `pnpm dev`.

`DATABASE_URL` defaults to the local Docker Postgres URL when it is not set, so the copy step is optional for the first slice.

## Tests

- `pnpm test`
- `pnpm test:e2e`

`pnpm test:e2e` starts the database and applies migrations before launching Playwright.
The E2E command also resets the local database first so repeated runs stay deterministic.
