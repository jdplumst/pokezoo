import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import TwitchProvider from "next-auth/providers/twitch";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/src/server/db/index";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/src/server/db/schema";
import { env } from "@/src/env";
import type { Adapter } from "next-auth/adapters";
import { pgTable } from "drizzle-orm/pg-core";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// @ts-expect-error for drizzle table prefix
const mapAdapter = (name, columns, extraConfig) => {
  switch (name) {
    case "user":
      return users;
    case "account":
      return accounts;
    case "session":
      return sessions;
    case "verification_token":
      return verificationTokens;
    default:
      // eslint-disable-next-line
      return pgTable(name, columns, extraConfig);
  }
};

export const authOptions = {
  // @ts-expect-error for drizzle table prefix
  adapter: DrizzleAdapter(db, mapAdapter) as Adapter,
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    TwitchProvider({
      clientId: env.TWITCH_CLIENT_ID,
      clientSecret: env.TWITCH_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: { signOut: "/" },
  secret: env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
