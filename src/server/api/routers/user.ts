import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { MAX_BALANCE } from "@/src/constants";
import { user } from "../../db/schema";
import { ZodTime } from "@/types/zod";
import { eq } from "drizzle-orm";

export const userRouter = router({
  claimReward: protectedProcedure
    .input(z.object({ time: ZodTime }))
    .mutation(async ({ ctx, input }) => {
      const currUser = (
        await ctx.db
          .select({
            balance: user.balance,
            claimedDaily: user.claimedDaily,
            claimedNightly: user.claimedNightly,
            totalYield: user.totalYield,
            commonCards: user.commonCards,
            rareCards: user.rareCards,
            epicCards: user.epicCards,
            legendaryCards: user.legendaryCards
          })
          .from(user)
          .where(eq(user.id, ctx.session.user.id))
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

      type Card = "Common" | "Rare" | "Epic" | "Legendary";
      const random = Math.random();
      let card: Card = "Common";
      if (random < 0.5) {
        card = "Common";
      } else if (random < 0.85) {
        card = "Rare";
      } else if (random < 0.99) {
        card = "Epic";
      } else {
        card = "Legendary";
      }

      if (input.time === "day") {
        if (currUser.claimedDaily) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Daily reward already claimed"
          });
        }
        await ctx.db
          .update(user)
          .set({
            balance: currUser.balance + newBalance,
            claimedDaily: true,
            commonCards:
              card === "Common"
                ? currUser.commonCards + 1
                : currUser.commonCards,
            rareCards:
              card === "Rare" ? currUser.rareCards + 1 : currUser.rareCards,
            epicCards:
              card === "Epic" ? currUser.epicCards + 1 : currUser.epicCards,
            legendaryCards:
              card === "Legendary"
                ? currUser.legendaryCards + 1
                : currUser.legendaryCards
          })
          .where(eq(user.id, ctx.session.user.id));
      } else {
        if (currUser.claimedNightly) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Nightly reward already claimed"
          });
        }
        await ctx.db
          .update(user)
          .set({
            balance: currUser.balance + newBalance,
            claimedNightly: true,
            commonCards:
              card === "Common"
                ? currUser.commonCards + 1
                : currUser.commonCards,
            rareCards:
              card === "Rare" ? currUser.rareCards + 1 : currUser.rareCards,
            epicCards:
              card === "Epic" ? currUser.epicCards + 1 : currUser.epicCards,
            legendaryCards:
              card === "Legendary"
                ? currUser.legendaryCards + 1
                : currUser.legendaryCards
          })
          .where(eq(user.id, ctx.session.user.id));
      }

      return {
        reward: reward,
        card: card
      };
    }),

  selectUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currUser = (
        await ctx.db
          .select({ username: user.username })
          .from(user)
          .where(eq(user.id, ctx.session.user.id))
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
          .select({ username: user.username })
          .from(user)
          .where(eq(user.username, input.username))
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
        .update(user)
        .set({ username: input.username })
        .where(eq(user.id, ctx.session.user.id));

      return { message: "Username set successfully" };
    })
});
