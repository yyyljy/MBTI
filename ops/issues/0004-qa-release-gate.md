# Issue 0004: QA Release Gate For First Runnable Slice

## Parent

- Issue 0001: First Runnable Slice
- Partners with Issue 0002 and Issue 0003

## Summary

Define and automate the release gate for the first runnable slice, with emphasis on privacy leakage prevention and append-only event integrity.

## Technical Function

Quality Engineering

## Priority

P0. This is required before the slice is considered executable for team use.

## Owner

- Senior QA Lead, 10+ years

## Hired Contributors

- Senior SDET, 11+ years
- Senior Security Test Engineer, 10+ years

## Scope

- Define the test matrix for unit, integration, contract, and E2E coverage
- Add privacy leakage checks for logs, responses, and chain payload adapters
- Add append-only invariant coverage for privacy-default changes
- Gate the happy path with one end-to-end test
- Document release criteria and known risk thresholds

## Acceptance Criteria

- The happy path E2E covers create agent, view profile, and change privacy defaults.
- Automated checks verify restricted/private data does not leak through unsupported channels.
- Tests fail if privacy-default changes mutate history instead of appending a new event.
- Release criteria are documented and executable locally and in CI.

## Deliverables

1. Test matrix and release gate definition
2. Privacy leakage regression suite
3. Append-only invariant coverage
4. Happy-path E2E

## Dependencies

- Issue 0002 for runnable test environments in CI
- Issue 0003 for the application slice under test

## Notes

QA is attached from day one because privacy and provenance errors are product failures, not polish bugs.
