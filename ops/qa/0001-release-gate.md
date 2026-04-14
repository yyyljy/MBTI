# Issue 0001 Release Gate

Status: blocked until the documented execution baseline is green

## Gate Requirements

- `AC-1` through `AC-6` in [docs/testing/issue-0001-qa-plan.md](../../docs/testing/issue-0001-qa-plan.md) must pass.
- The implementation must keep private and restricted data server-side only.
- The chain adapter must emit public-safe versioned commitments only.
- The privacy history must remain append-only across reloads.
- The happy-path E2E must pass in a clean local environment.
- The documented commands must work in a default shell context without manual env overrides.

## Release Blockers

| Blocker | Why it matters |
| --- | --- |
| Any restricted field in client output | This is a privacy breach. |
| Any private value in logs or error messages | This leaks sensitive data outside the trust boundary. |
| Any in-place edit of history | This breaks append-only provenance. |
| Any chain payload containing private data | Onchain data is public and permanent. |
| No passing E2E for the vertical slice | The first runnable slice is not actually runnable. |
| Default `pnpm build` requires ambient env overrides | The release gate is not reproducible from the documented workflow. |

## Signoff

| Role | Required |
| --- | --- |
| QA Lead | Acceptance criteria validated and release gate approved. |
| Full-Stack Lead | Implementation and app-level tests complete. |
| Platform Lead | Local DB, env, and CI execution are stable in the documented default shell path. |

## Notes

This gate is intentionally strict because Issue 0001 establishes the privacy boundary for the product.
