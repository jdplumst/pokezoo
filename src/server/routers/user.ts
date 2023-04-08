import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  updateBalance: protectedProcedure
    .input(
      z.object({
        speciesYield: z.number(),
        userYield: z.number(),
        balance: z.number(),
        cost: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.balance < input.cost) {
        return { error: "You cannot afford this ball." };
      }
      const user = await ctx.client.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: input.userYield + input.speciesYield,
          balance: input.balance - input.cost
        }
      });
      return {
        user: user
      };
    })
});
