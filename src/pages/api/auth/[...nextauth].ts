import NextAuth, { Awaitable, NextAuthOptions, Session, User } from "next-auth";
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
  verificationToken
} from "@/src/server/db/schema";
import { MySqlTableFn, mysqlTable } from "drizzle-orm/mysql-core";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/src/server/db";

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
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile): Awaitable<User> {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          emailVerified: null,
          image: profile.avatar_url,
          admin: false,
          username: null,
          totalYield: 0,
          balance: 500,
          instanceCount: 0,
          claimedDaily: false,
          claimedNightly: false,
          commonCards: 0,
          rareCards: 0,
          epicCards: 0,
          legendaryCards: 0,
          johtoStarter: true,
          hoennStarter: true,
          sinnohStarter: true,
          unovaStarter: true
        };
      }
    }),
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      profile(profile): Awaitable<User> {
        return {
          id: profile.sub,
          name: profile.preferred_username,
          email: profile.email,
          emailVerified: null,
          image: profile.picture,
          admin: false,
          username: null,
          totalYield: 0,
          balance: 500,
          instanceCount: 0,
          claimedDaily: false,
          claimedNightly: false,
          commonCards: 0,
          rareCards: 0,
          epicCards: 0,
          legendaryCards: 0,
          johtoStarter: true,
          hoennStarter: true,
          sinnohStarter: true,
          unovaStarter: true
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile): Awaitable<User> {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          emailVerified: null,
          image: profile.picture,
          admin: false,
          username: null,
          totalYield: 0,
          balance: 500,
          instanceCount: 0,
          claimedDaily: false,
          claimedNightly: false,
          commonCards: 0,
          rareCards: 0,
          epicCards: 0,
          legendaryCards: 0,
          johtoStarter: true,
          hoennStarter: true,
          sinnohStarter: true,
          unovaStarter: true
        };
      }
    })
  ],
  callbacks: {
    session({ session, user }: { session: Session; user: User | AdapterUser }) {
      if (session.user) {
        session.user.id = user.id.toString();
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.emailVerified = user.emailVerified;
        session.user.image = user.image;
        session.user.admin = user.admin;
        session.user.username = user.username;
        session.user.totalYield = user.totalYield;
        session.user.balance = user.balance;
        session.user.instanceCount = user.instanceCount;
        session.user.claimedDaily = user.claimedDaily;
        session.user.claimedNightly = user.claimedNightly;
        session.user.commonCards = user.commonCards;
        session.user.rareCards = user.rareCards;
        session.user.epicCards = user.epicCards;
        session.user.legendaryCards = user.legendaryCards;
        session.user.johtoStarter = user.johtoStarter;
        session.user.hoennStarter = user.hoennStarter;
        session.user.sinnohStarter = user.sinnohStarter;
        session.user.unovaStarter = user.unovaStarter;
      }
      return session;
    }
  },
  pages: { signIn: "/", signOut: "/", error: "/" },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
