# Issue 0001: First Runnable Slice

## Summary

Stand up the first runnable MBTI MVP slice:

`create agent -> view profile -> change privacy defaults`

## Technical Function

Application Engineering owns delivery, with Platform and QA as required partners.

## CTO Priority

P0 for MVP kickoff. No additional product surfaces should start before this slice is executable locally and covered by baseline tests.

## Scope

- Bootstrap the web application and local development environment
- Persist private and restricted identity data in Postgres
- Render agent profile views with privacy-aware field handling
- Record privacy-default changes as append-only events
- Keep chain output behind an adapter boundary and off the critical path

## Acceptance Criteria

- An agent can be created and persisted successfully.
- The created agent profile can be viewed with correct visibility handling.
- Privacy defaults can be changed and remain persisted on reload.
- No restricted or private fields are exposed in chain payloads, logs, or client responses outside approved visibility rules.
- One end-to-end test covers the full happy path.

## Delegated Owners

- Senior Staff Full-Stack Lead, 12+ years
  - Own app bootstrap, domain model, workflow implementation, and UI slice delivery.
- Senior Platform/DevEx Lead, 12+ years
  - Own repo setup, local Postgres, env validation, CI, secret handling, and deployment baseline.
- Senior QA Lead, 10+ years
  - Own test matrix, privacy leakage checks, and release gates for the slice.

## Planned Task Order

1. Bootstrap `Next.js` + `TypeScript` + `pnpm` + lint/type/test scripts.
2. Add Postgres, Prisma, migrations, and seed data for the first slice.
3. Implement `Agent`, `Profile`, `PrivacySettings`, and `ActivityEvent` domain workflows.
4. Ship the create/view/change vertical path.
5. Add unit, integration, contract, and E2E coverage.
6. Gate testnet commitment publishing behind a stable server-side adapter.

## Blockers

- Hosting target not yet selected.
- Managed Postgres provider not yet selected.
- Avalanche L1 testnet RPC access and wallet/key management not yet defined.

## Notes

Reference architecture: [docs/technical-direction/mvp-architecture.md](C:\Users\Lee\.paperclip\instances\default\workspaces\6d7932eb-36f4-4ae8-890b-deb9a39d7ef7\MBTI\docs\technical-direction\mvp-architecture.md)
