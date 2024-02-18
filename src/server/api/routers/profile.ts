import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { MAX_BALANCE } from "@/src/constants";
import { profiles, userCharms } from "../../db/schema";
import { ZodTime } from "@/src/zod";
import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const profileRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const ovalCharm = alias(userCharms, "ovalCharm");

    const profileData = (
      await ctx.db
        .select({
          id: profiles.id,
          username: profiles.username,
          admin: profiles.admin,
          totalYield: profiles.totalYield,
          balance: profiles.balance,
          instanceCount: profiles.instanceCount,
          claimedDaily: profiles.claimedDaily,
          claimedNightly: profiles.claimedNightly,
          claimedEvent: profiles.claimedEvent,
          commonCards: profiles.commonCards,
          rareCards: profiles.rareCards,
          epicCards: profiles.epicCards,
          legendaryCards: profiles.legendaryCards,
          johtoStarter: profiles.johtoStarter,
          hoennStarter: profiles.hoennStarter,
          sinnohStarter: profiles.sinnohStarter,
          unovaStarter: profiles.unovaStarter,
          kalosStarter: profiles.kalosStarter,
          ovalCharm: ovalCharm.charmId
        })
        .from(profiles)
        .leftJoin(
          ovalCharm,
          and(eq(profiles.userId, ovalCharm.userId), eq(ovalCharm.charmId, 1))
        )
        .where(eq(profiles.userId, ctx.session.user.id))
    )[0];

    return profileData;
  }),

  claimReward: protectedProcedure
    .input(z.object({ time: ZodTime }))
    .mutation(async ({ ctx, input }) => {
      const markCharm = alias(userCharms, "markCharm");

      const currUser = (
        await ctx.db
          .select({
            balance: profiles.balance,
            claimedDaily: profiles.claimedDaily,
            claimedNightly: profiles.claimedNightly,
            totalYield: profiles.totalYield,
            commonCards: profiles.commonCards,
            rareCards: profiles.rareCards,
            epicCards: profiles.epicCards,
            legendaryCards: profiles.legendaryCards,
            markCharm: markCharm.charmId
          })
          .from(profiles)
          .leftJoin(markCharm, eq(profiles.userId, markCharm.userId))
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }

      const reward = Math.round(
        Math.random() *
        (0.125 * currUser.totalYield - 0.075 * currUser.totalYield) +
        0.075 * currUser.totalYield
      );
      const newBalance = reward > MAX_BALANCE ? MAX_BALANCE : reward;

      const loopNum = currUser.markCharm ? 3 : 1;
      const cards = { "Common": 0, "Rare": 0, "Epic": 0, "Legendary": 0 }
      for (let i = 0; i < loopNum; i++) {
        const random = Math.random();
        if (random < 0.5) {
          cards.Common += 1;
        } else if (random < 0.85) {
          cards.Rare += 1;
        } else if (random < 0.99) {
          cards.Epic += 1;
        } else {
          cards.Legendary += 1;
        }
      }

      if (input.time === "day") {
        if (currUser.claimedDaily) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Daily reward already claimed"
          });
        }
        await ctx.db
          .update(profiles)
          .set({
            balance: currUser.balance + newBalance,
            claimedDaily: true,
            commonCards: currUser.commonCards + cards.Common,
            rareCards: currUser.rareCards + cards.Rare,
            epicCards: currUser.epicCards + cards.Epic,
            legendaryCards: currUser.legendaryCards + cards.Legendary
          })
          .where(eq(profiles.userId, ctx.session.user.id));
      } else {
        if (currUser.claimedNightly) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Nightly reward already claimed"
          });
        }
        await ctx.db
          .update(profiles)
          .set({
            balance: currUser.balance + newBalance,
            claimedNightly: true,
            commonCards: currUser.commonCards + cards.Common,
            rareCards: currUser.rareCards + cards.Rare,
            epicCards: currUser.epicCards + cards.Epic,
            legendaryCards: currUser.legendaryCards + cards.Legendary
          })
          .where(eq(profiles.userId, ctx.session.user.id));
      }

      return {
        reward: reward,
        cards: cards
      };
    }),

  selectUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currUser = (
        await ctx.db
          .select({ username: profiles.username })
          .from(profiles)
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }

      if (input.username.length === 0 || input.username.length > 20) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username must be between 1 and 20 characters long"
        });
      }

      const exists = (
        await ctx.db
          .select({ username: profiles.username })
          .from(profiles)
          .where(eq(profiles.username, input.username))
      )[0];
      if (
        exists &&
        exists.username?.toLowerCase() === input.username.toLowerCase()
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username is already taken"
        });
      }

      await ctx.db
        .update(profiles)
        .set({ username: input.username })
        .where(eq(profiles.userId, ctx.session.user.id));

      return { message: "Username set successfully" };
    })
});
