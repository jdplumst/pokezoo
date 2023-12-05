import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import TwitchProvider from "next-auth/providers/twitch";
import GoogleProvider from "next-auth/providers/google";
import { AdapterUser } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/src/server/db/index";
import {
  user,
  account,
  session,
  verificationToken,
  profile
} from "@/src/server/db/schema";
import { MySqlTableFn, mysqlTable } from "drizzle-orm/mysql-core";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/src/server/db";
import { eq } from "drizzle-orm";

//@ts-ignore
const myTableHijack: MySqlTableFn = (name, columns, extraConfig) => {
  switch (name) {
    case "user":
      return user;
    case "account":
      return account;
    case "session":
      return session;
    case "verification_token":
      return verificationToken;
    default:
      return mysqlTable(name, columns, extraConfig);
  }
};

export const authOptions: NextAuthOptions = {
  //@ts-ignore
  // adapter: DrizzleAdapter(db),
  adapter: PrismaAdapter(prisma),
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
    async signIn({ user }) {
      const profileExists = (
        await db.select().from(profile).where(eq(profile.userId, user.id))
      )[0];
      if (!profileExists) {
        await db.insert(profile).values({ userId: user.id });
      }
      return true;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id
      }
    })
  },
  pages: { signIn: "/", signOut: "/", error: "/" },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
