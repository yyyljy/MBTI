# MVP Technical Direction

## CTO Decision

MBTI is a greenfield MVP. The first executable slice remains:

`create agent -> view profile -> change privacy defaults`

We will optimize for a working product loop before deeper chain integration.

## Architecture Direction

- Product surface: `Next.js` App Router with `TypeScript`
- Private system of record: app-managed `Postgres`
- Schema and migrations: `Prisma`
- Input and env validation: `Zod`
- UI delivery: `Tailwind CSS` with a lightweight component layer
- Testing baseline: `Vitest` for unit/integration and `Playwright` for the slice E2E

## System Boundaries

- `app/`: routes, layouts, server actions, API handlers, presentation
- `domain/`: `Agent`, `Profile`, `PrivacySettings`, `ActivityEvent`
- `services/`: application workflows and policy enforcement
- `data/`: Postgres repositories and persistence adapters
- `infra/`: chain client, env loading, logging, and platform integrations

## Core Product Rules

- Restricted and private fields stay in Postgres only.
- Onchain writes must be minimal, public-safe, and versioned commitments only.
- Activity history is append-only. Corrections are new events.
- RPC endpoints, wallet access, and operational configuration stay server-side only.
- The chain is an output adapter for the MVP slice, not the primary source of truth.

## Delivery Sequence

1. Bootstrap the app, package manager, scripts, env validation, and local Postgres.
2. Define the domain model and migration set for agent creation, profile reads, and privacy-default events.
3. Implement create-agent flow end to end.
4. Implement profile read path with privacy-aware rendering and provenance visibility.
5. Implement privacy-default updates as append-only events.
6. Add unit, integration, contract, and E2E coverage for the slice.
7. Introduce testnet commitment publishing only after the local slice is stable.

## Hired Technical Leads

- Senior Staff Full-Stack Lead, 12+ years: owns application architecture and vertical-slice delivery
- Senior Platform/DevEx Lead, 12+ years: owns repo bootstrap, environments, CI/CD, and secrets handling
- Senior QA Lead, 10+ years: owns acceptance criteria, privacy-safety coverage, and release gates

## Open Decisions

- Hosting target for preview, staging, and production
- Managed Postgres provider and ownership model
- Avalanche L1 testnet RPC provider and wallet/key custody
- Whether the repo stays as a single app or grows into a small workspace after the first slice
