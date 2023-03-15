import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { Awaitable, Session, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import prisma from "@/prisma/script";
import { AdapterUser } from "next-auth/adapters";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile): Awaitable<User> {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          totalYield: 0,
          dollars: 0
        };
      }
    })
    // ...add more providers here
  ],
  callbacks: {
    session({ session, user }: { session: Session; user: User | AdapterUser }) {
      session.user.totalYield = user.totalYield;
      session.user.dollars = user.dollars;
      return session;
    }
  },
  pages: { signIn: "/", signOut: "/", error: "/" },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
