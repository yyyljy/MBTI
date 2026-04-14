import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { createRequire } from "node:module";

const localDatabaseUrl = "postgresql://mbti:mbti@localhost:5433/mbti?schema=public";
const require = createRequire(import.meta.url);
const env = {
  ...process.env,
  NODE_ENV: "production",
  DATABASE_URL: process.env.DATABASE_URL || localDatabaseUrl
};
const prismaBin = require.resolve("prisma/build/index.js");
const nextBin = require.resolve("next/dist/bin/next");

rmSync(".next", { force: true, recursive: true });

const steps = [
  [process.execPath, [prismaBin, "generate"]],
  [process.execPath, [nextBin, "build"]]
];

for (const [command, args] of steps) {
  const result = spawnSync(command, args, {
    env,
    stdio: "inherit"
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
