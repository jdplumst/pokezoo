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
      let reward = 25;
      if (currUser.totalYield >= 10000) {
        reward = 1000;
      } else if (currUser.totalYield >= 1000) {
        reward = 100;
      }
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
    })
});
