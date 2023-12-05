import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import TwitchProvider from "next-auth/providers/twitch";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/src/server/db/index";
import { profiles } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
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
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
