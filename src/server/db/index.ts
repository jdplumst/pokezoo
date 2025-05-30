import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "~/server/db/schema";
import { env } from "~/env";

const client = postgres(env.DATABASE_URL, { prepare: false });
export const db = drizzle(client, {
  schema,
  // logger: env.NODE_ENV === "development",
});
