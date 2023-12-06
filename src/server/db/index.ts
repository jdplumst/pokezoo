import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";
import * as schema from "./schema";
import { env } from "@/src/env";

export const db = drizzle(new Client({ url: env.DATABASE_URL }).connection(), {
  schema,
  logger: true
});
