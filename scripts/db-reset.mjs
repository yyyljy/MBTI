import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const localDatabaseUrl = "postgresql://mbti:mbti@localhost:5433/mbti?schema=public";
const require = createRequire(import.meta.url);
const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || localDatabaseUrl
};
const prismaBin = require.resolve("prisma/build/index.js");

const waitForPostgres = spawnSync(process.execPath, ["scripts/wait-for-postgres.mjs"], {
  env,
  stdio: "inherit"
});

if (waitForPostgres.error) {
  throw waitForPostgres.error;
}

if (waitForPostgres.status !== 0) {
  process.exit(waitForPostgres.status ?? 1);
}

const reset = spawnSync(process.execPath, [prismaBin, "migrate", "reset", "--force", "--skip-seed"], {
  env,
  stdio: "inherit"
});

if (reset.error) {
  throw reset.error;
}

if (reset.status !== 0) {
  process.exit(reset.status ?? 1);
}
