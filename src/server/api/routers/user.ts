import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { MAX_BALANCE } from "@/src/constants";

export const userRouter = router({
  claimReward: protectedProcedure
    .input(z.object({ time: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currUser = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
        select: {
          balance: true,
          claimedDaily: true,
          claimedNightly: true,
          totalYield: true,
          commonCards: true,
          rareCards: true,
          epicCards: true,
          legendaryCards: true
        }
      });
      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }
      if (input.time !== "day" && input.time !== "night") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid input." });
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

      let user;
      if (input.time === "day") {
        if (currUser.claimedDaily) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Daily reward already claimed"
          });
        }
        user = await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: {
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
          }
        });
      } else {
        if (currUser.claimedNightly) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Nightly reward already claimed"
          });
        }
        user = await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: {
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
          }
        });
      }

      return {
        user: user,
        reward: reward,
        card: card
      };
    }),

  selectUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currUser = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
        select: {
          balance: true,
          claimedDaily: true,
          claimedNightly: true,
          totalYield: true
        }
      });
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
      const exists = await ctx.prisma.user.findFirst({
        where: { username: input.username }
      });
      if (
        exists &&
        exists.username?.toLowerCase() === input.username.toLowerCase()
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username is already taken"
        });
      }
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { username: input.username }
      });
      return { user: user };
    })
});
