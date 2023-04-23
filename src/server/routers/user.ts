import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  updateBalance: protectedProcedure
    .input(
      z.object({
        speciesYield: z.number(),
        cost: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currUser = await ctx.client.user.findFirst({
        where: { id: ctx.session.user.id },
        select: { totalYield: true, balance: true }
      });
      if (!currUser) {
        return { error: "Not authorized to make this request" };
      }
      if (currUser.balance < input.cost) {
        return { error: "You cannot afford this ball." };
      }
      const user = await ctx.client.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield + input.speciesYield,
          balance: currUser.balance - input.cost
        }
      });
      return {
        user: user
      };
    }),

  claimDaily: protectedProcedure.mutation(async ({ ctx }) => {
    const currUser = await ctx.client.user.findFirst({
      where: { id: ctx.session.user.id },
      select: { balance: true, claimedDaily: true }
    });
    if (!currUser) {
      throw new Error("Not authorized to make this request");
    }
    if (currUser.claimedDaily) {
      throw new Error("Daily reward already claimed");
    }
    const user = await ctx.client.user.update({
      where: { id: ctx.session.user.id },
      data: { balance: currUser.balance + 25, claimedDaily: true }
    });
    return {
      user: user
    };
  })
});
