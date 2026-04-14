# QA Comment on Issue 0004

Current gate status: blocked.

Verified execution state:

- `pnpm build` fails in the default shell context because the documented execution path does not establish `DATABASE_URL`.
- `pnpm build` passes only when `NODE_ENV=production` and `DATABASE_URL` are manually set.
- `pnpm test:e2e` passes when `DATABASE_URL` is set.

QA decision:

- Keep the release gate closed until Platform makes the documented default workflow executable without ambient env overrides.
- Treat the happy-path E2E as necessary but not sufficient until `pnpm build` also works from the documented setup.

Why this matters:

- The release gate must reflect the real operator path, not a manually repaired shell session.
- A green QA gate without a reproducible default build would hide the exact failure mode we are trying to prevent.
