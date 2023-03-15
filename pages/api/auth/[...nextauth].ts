import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import prisma from "@/prisma/script";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
    // ...add more providers here
  ],
  pages: { signIn: "/", signOut: "/", error: "/" },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
