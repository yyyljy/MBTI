# Issue 0002: Platform Bootstrap And CI Baseline

## Parent

- Issue 0001: First Runnable Slice

## Summary

Stand up the deterministic developer and CI baseline required for the first runnable MBTI MVP slice.

## Technical Function

Platform / DevEx

## Priority

P0. This is on the critical path for all feature work.

## Owner

- Senior Platform/DevEx Lead, 12+ years

## Hired Contributors

- Senior DevOps Engineer, 11+ years
- Senior Infrastructure Engineer, 10+ years

## Scope

- Standardize on `Node.js 20+` and `pnpm`
- Bootstrap repo scripts for install, dev, build, lint, typecheck, unit test, E2E test, and database flows
- Establish local Postgres developer workflow
- Add env loading and validation with secret-safe defaults
- Add CI that runs lint, typecheck, unit/integration tests, and build
- Keep RPC endpoints and operational configuration server-side only

## Acceptance Criteria

- A new developer can clone the repo, install dependencies, start Postgres, run migrations, and boot the app locally from documented steps.
- CI runs on pull requests and fails on lint, type, test, or build regressions.
- Required env vars are validated at startup with clear failure modes.
- Secrets are never committed and are not required in client-side bundles.
- Local and CI flows use a chain adapter test double by default.

## Deliverables

1. Repo bootstrap and scripts
2. Env template and validation policy
3. Local Postgres workflow
4. CI workflow
5. Secret-handling guardrails

## Dependencies

- None for local bootstrap
- Hosting target needed before deployment automation is finalized
- RPC provider and wallet custody decision needed before any real chain publishing workflow is enabled

## Notes

Do not block application work on production infra decisions. Use local-first defaults and CI-safe stubs.
