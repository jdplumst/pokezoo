import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string;

    // Custom fields
    admin: boolean;
    username: string | null;
    totalYield: number;
    balance: number;
    instanceCount: number;
    claimedDaily: boolean;
    claimedNightly: boolean;
    commonCards: number;
    rareCards: number;
    epicCards: number;
    legendaryCards: number;
    johtoStarter: boolean;
    hoennStarter: boolean;
    sinnohStarter: boolean;
    unovaStarter: boolean;
  }
}
