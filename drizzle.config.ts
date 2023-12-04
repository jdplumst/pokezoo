import { type Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DRIZZLE_DATABASE_URL as string
  }
} satisfies Config;
