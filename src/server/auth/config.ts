import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitchProvider from "next-auth/providers/twitch";
import { env } from "~/env";
import { db } from "~/server/db/index";
import {
	accounts,
	sessions,
	users,
	verificationTokens,
} from "~/server/db/schema";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
		} & DefaultSession["user"];
	}
}

export const authOptions = {
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
	}),
	providers: [
		GithubProvider({
			clientId: env.GITHUB_ID,
			clientSecret: env.GITHUB_SECRET,
		}),
		TwitchProvider({
			clientId: env.TWITCH_CLIENT_ID,
			clientSecret: env.TWITCH_CLIENT_SECRET,
		}),
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
	],
	pages: { signOut: "/" },
	secret: env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
