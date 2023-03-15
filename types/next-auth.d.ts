import NextAuth from "next-auth";

declare module "next-auth" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    user: {
      id: number | string;
      name: string | null;
      email: string | null;
      image: string;

      // Custom fields
      totalYield: number;
      dollars: number;
    };
  }

  interface User {
    id: number | string;
    name: string | null;
    email: string | null;
    image: string;

    // Custom fields
    totalYield: number;
    dollars: number;
  }
}
