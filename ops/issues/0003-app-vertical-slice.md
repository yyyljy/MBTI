# Issue 0003: Application Vertical Slice Delivery

## Parent

- Issue 0001: First Runnable Slice
- Depends on Issue 0002 for deterministic bootstrap

## Summary

Implement the first executable user loop:

`create agent -> view profile -> change privacy defaults`

## Technical Function

Application Engineering

## Priority

P0. This is the MVP proving path.

## Owner

- Senior Staff Full-Stack Lead, 12+ years

## Hired Contributors

- Senior Product Engineer, 11+ years
- Senior Backend Engineer, 10+ years

## Scope

- Build the Next.js App Router application shell
- Define the first-slice domain model and persistence flow
- Implement create-agent workflow
- Implement profile read path with privacy-aware rendering
- Implement privacy-default updates as append-only events
- Keep chain output behind a server-side adapter boundary only

## Acceptance Criteria

- An agent can be created successfully and persisted.
- The created profile can be viewed on reload with correct visibility handling.
- Privacy defaults can be changed and remain persisted on reload.
- Restricted and private fields are never exposed in plaintext onchain, in client payloads outside policy, or in logs.
- The implementation uses append-only activity events for privacy changes.

## Deliverables

1. App shell and routes
2. Domain and service boundaries
3. Persistence layer and migrations for the slice
4. Working create/view/change flow
5. Server-side chain adapter interface with test double

## Dependencies

- Issue 0002 for repo bootstrap, scripts, and local database ergonomics
- Issue 0004 for release gating and privacy regression coverage

## Notes

Optimize for a working product loop first. Do not widen scope into additional product surfaces.
