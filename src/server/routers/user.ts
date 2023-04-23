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

  claimDaily: protectedProcedure
    .input(z.object({ balance: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.client.user.update({
        where: { id: ctx.session.user.id },
        data: { balance: input.balance + 25, claimedDaily: true }
      });
      return {
        user: user
      };
    })
});
