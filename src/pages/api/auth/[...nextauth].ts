import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import TwitchProvider from "next-auth/providers/twitch";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/src/server/db/index";
import {
  accounts,
  profiles,
  sessions,
  users,
  verificationTokens
} from "@/src/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/src/env";
import type { Adapter } from "next-auth/adapters";
import { pgTable } from "drizzle-orm/pg-core";
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}
// @ts-expect-error
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
      return pgTable(name, columns, extraConfig);
  }
};

export const authOptions: NextAuthOptions = {
  // @ts-expect-error
  adapter: DrizzleAdapter(db, mapAdapter) as Adapter,
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET
    }),
    TwitchProvider({
      clientId: env.TWITCH_CLIENT_ID,
      clientSecret: env.TWITCH_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async session({ session, user }) {
      const profileExists = (
        await db.select().from(profiles).where(eq(profiles.userId, user.id))
      )[0];
      if (!profileExists) {
        await db.insert(profiles).values({ userId: user.id });
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id
        }
      };
    }
  },
  pages: { signOut: "/" },
  secret: env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
