import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { Awaitable, Session, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import TwitchProvider from "next-auth/providers/twitch";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/prisma/script";
import { AdapterUser } from "next-auth/adapters";

export const authOptions = {
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
          totalYield: 0,
          balance: 500
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
          totalYield: 0,
          balance: 500
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
          totalYield: 0,
          balance: 500
        };
      }
    })
  ],
  callbacks: {
    session({ session, user }: { session: Session; user: User | AdapterUser }) {
      session.user.id = user.id.toString();
      session.user.name = user.name;
      session.user.email = user.email;
      session.user.emailVerified = user.emailVerified;
      session.user.image = user.image;
      session.user.totalYield = user.totalYield;
      session.user.balance = user.balance;
      return session;
    }
  },
  pages: { signIn: "/", signOut: "/", error: "/" },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
