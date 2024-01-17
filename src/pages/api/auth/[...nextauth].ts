import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import TwitchProvider from "next-auth/providers/twitch";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/src/server/db/index";
import { profiles } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/src/env";
import type { Adapter } from "next-auth/adapters";
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
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
