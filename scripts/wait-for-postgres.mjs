import net from "node:net";

const databaseUrl = process.env.DATABASE_URL || "postgresql://mbti:mbti@localhost:5433/mbti?schema=public";

const url = new URL(databaseUrl);
const host = url.hostname || "localhost";
const port = Number(url.port || 5432);
const timeoutMs = 60_000;
const startedAt = Date.now();

async function waitForPort() {
  while (Date.now() - startedAt < timeoutMs) {
    const ready = await new Promise((resolve) => {
      const socket = net.createConnection({ host, port });
      socket.setTimeout(1_000);
      socket.on("connect", () => {
        socket.end();
        resolve(true);
      });
      socket.on("timeout", () => {
        socket.destroy();
        resolve(false);
      });
      socket.on("error", () => {
        socket.destroy();
        resolve(false);
      });
    });

    if (ready) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(`Timed out waiting for Postgres at ${host}:${port}`);
}

await waitForPort();
