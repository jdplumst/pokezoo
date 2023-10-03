import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

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
          totalYield: true
        }
      });
      if (!currUser) {
        throw new Error("Not authorized to make this request");
      }
      if (input.time !== "day" && input.time !== "night") {
        throw new Error("Invalid input.");
      }
      const reward = Math.round(
        Math.random() *
          (0.125 * currUser.totalYield - 0.075 * currUser.totalYield) +
          0.075 * currUser.totalYield
      );
      let user;
      if (input.time === "day") {
        if (currUser.claimedDaily) {
          throw new Error("Daily reward already claimed");
        }
        user = await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: { balance: currUser.balance + reward, claimedDaily: true }
        });
      } else {
        if (currUser.claimedNightly) {
          throw new Error("Nightly reward already claimed");
        }
        user = await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: { balance: currUser.balance + reward, claimedNightly: true }
        });
      }

      return {
        user: user
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
        throw new Error("Not authorized to make this request");
      }
      if (input.username.length === 0 || input.username.length > 20) {
        throw new Error("Username must be between 1 and 20 characters long");
      }
      const exists = await ctx.prisma.user.findFirst({
        where: { username: input.username }
      });
      if (
        exists &&
        exists.username?.toLowerCase() === input.username.toLowerCase()
      ) {
        throw new Error("Username is already taken");
      }
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { username: input.username }
      });
      return { user: user };
    })
});
