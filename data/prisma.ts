import { PrismaClient } from "@prisma/client";
import { getServerEnv } from "@/infra/env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient() {
  const { DATABASE_URL } = getServerEnv();

  return new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL
      }
    },
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"]
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
