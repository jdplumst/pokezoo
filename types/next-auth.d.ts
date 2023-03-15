import NextAuth from "next-auth";

declare module "next-auth" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    user: {
      id: number;
      email: string;
      image: string;

      // Custom fields
      totalYield: number;
      dollars: number;
    };
  }

  interface User {
    id: number;
    email: string | null;
    image: string;

    // Custom fields
    totalYield: number;
    dollars: number;
  }
}
