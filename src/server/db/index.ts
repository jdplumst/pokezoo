import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";
import * as schema from "./schema";

export const db = drizzle(
  new Client({ url: process.env.DATABASE_URL }).connection(),
  { schema, logger: true }
);
