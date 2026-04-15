import Fastify from "fastify";
import "dotenv/config";
import { db } from "./db.js";

const app = Fastify({ logger: true });

app.get("/health", async () => {
  const [rows] = await db.query("SELECT 1 AS ok");
  return { status: "ok", db: rows[0]?.ok === 1 };
});

app.get("/", async () => {
  return { message: "Cyber Dogg API" };
});

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

app.listen({ port, host }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});

