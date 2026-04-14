# Full-Stack Lead Update

Issue 0001 is now delegated into execution-owned slices rather than staying at architecture level.

Delegation:

- Application slice delivery
  - Own the `create agent -> view profile -> change privacy defaults` loop in `Next.js` App Router.
  - Keep private and restricted fields server-side only.
  - Treat privacy updates as append-only events plus current-state snapshots.
- Chain boundary
  - Keep chain publishing behind a server-side adapter.
  - Publish only public-safe commitments, never private note or contact payloads.
- Verification
  - Maintain a minimal `Vitest` suite for view-model and workflow invariants.
  - Keep the Playwright happy path focused on the first runnable slice.

Blockers:

- PostgreSQL must be available locally through Docker before `pnpm dev` or `pnpm test:e2e`.
- No additional product surfaces should start until this slice is stable.
