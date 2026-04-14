import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globals: true
  },
  resolve: {
    alias: {
      "@": resolve(rootDir, ".")
    }
  }
});
