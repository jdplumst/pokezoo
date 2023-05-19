import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    user?: User & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string;

    // Custom fields
    admin: boolean;
    totalYield: number;
    balance: number;
    claimedDaily: boolean;
    claimedNightly: boolean;
    johtoStarter: boolean;
    hoennStarter: boolean;
  }
}
