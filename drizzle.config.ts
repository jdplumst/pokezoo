import { type Config } from "drizzle-kit";
import { env } from "@/utils/env";

export default {
  schema: "@/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["pokezoo_*"],
} satisfies Config;
