import { z } from "zod";

const localDatabaseUrl = "postgresql://mbti:mbti@localhost:5433/mbti?schema=public";

const serverEnvSchema = z.object({
  DATABASE_URL: z.preprocess((value) => {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }

    if (process.env.NODE_ENV !== "production") {
      return localDatabaseUrl;
    }

    return value;
  }, z.string().min(1))
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = serverEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL
  });

  if (!parsed.success) {
    throw new Error(`Invalid server environment: ${parsed.error.message}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
