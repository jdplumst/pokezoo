import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { env } from '#/env'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: env.NODE_ENV !== "production",
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    },
    twitch: {
      clientId: env.TWITCH_CLIENT_ID,
      clientSecret: env.TWITCH_CLIENT_SECRET
    }
  },
  plugins: [tanstackStartCookies()],
})
