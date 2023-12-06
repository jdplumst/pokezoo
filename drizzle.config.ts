import { type Config } from "drizzle-kit";
import { env } from "./src/env";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: env.DATABASE_URL as string
  }
} satisfies Config;
