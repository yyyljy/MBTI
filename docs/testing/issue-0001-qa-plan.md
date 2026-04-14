# Issue 0001 QA Plan

Scope: `create agent -> view profile -> change privacy defaults`

## Acceptance Criteria

| ID | Criterion | Pass Condition |
| --- | --- | --- |
| AC-1 | Agent creation persists | A new agent can be created and reloaded from Postgres with a stable identifier. |
| AC-2 | Profile view respects visibility | Public, private, and restricted fields render according to privacy settings and are not exposed outside approved surfaces. |
| AC-3 | Privacy defaults persist | Updating privacy defaults survives reload and does not destroy prior history. |
| AC-4 | Append-only history | A privacy change produces a new event; existing events remain immutable. |
| AC-5 | No restricted data leakage | Restricted/private fields never appear in client responses, logs, or chain payloads. |
| AC-6 | Happy path E2E passes | One end-to-end test covers create -> view -> change privacy defaults. |

## Privacy Leakage Checks

| Surface | Check |
| --- | --- |
| API responses | Assert private and restricted fields are absent unless explicitly authorized. |
| Client state | Assert hydration data and rendered HTML omit restricted fields. |
| Server logs | Assert logs never serialize sensitive fields, secrets, or raw private payloads. |
| Chain adapter payloads | Assert only public-safe versioned commitments are emitted. |
| Error paths | Assert validation and runtime errors do not echo private values. |

## Append-Only Invariants

| ID | Invariant | Expected Result |
| --- | --- | --- |
| AO-1 | Privacy updates create new events | Each update appends an `ActivityEvent` instead of overwriting history. |
| AO-2 | Prior events are immutable | Historical entries are not edited in place. |
| AO-3 | Timeline order is stable | Reads return events in deterministic append order. |
| AO-4 | Corrections are new events | Any correction or reversal is represented as a new event. |
| AO-5 | History survives reload | Reloading from persistence reconstructs the same event stream. |

## Execution-Ready Test Matrix

| Case | Type | Preconditions | Steps | Expected Result |
| --- | --- | --- | --- | --- |
| QA-01 | Integration | Empty local DB | Create an agent through the service boundary. | Agent record is persisted and retrievable. |
| QA-02 | Integration | Existing agent | Read the agent profile with default privacy settings. | Only allowed fields are returned and rendered. |
| QA-03 | Integration | Existing agent | Update privacy defaults. | A new append-only event is stored and defaults change on reload. |
| QA-04 | Negative | Existing agent with private data | Request profile through an unauthorized surface. | Private and restricted fields remain hidden. |
| QA-05 | Negative | Logging enabled | Trigger create/view/update flows. | Logs contain no private values or secrets. |
| QA-06 | Contract | Chain adapter stub active | Publish the privacy state through the adapter boundary. | Payload contains only public-safe commitment data. |
| QA-07 | E2E | App, DB, and test runner available | Create agent -> view profile -> change privacy defaults -> reload. | Full happy path succeeds end to end. |
| QA-08 | Regression | Existing timeline | Re-run profile read after multiple privacy changes. | Earlier events remain intact and ordered. |

## Execution Note

QA-07 is only considered release-valid when it passes through the documented default workflow, with no manual shell env overrides needed to make `pnpm build` or the E2E runner succeed.

## Exit Rule

Do not release Issue 0001 until QA-07 passes through the documented default workflow and QA-04, QA-05, and QA-06 all pass.
