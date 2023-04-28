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

      // Make sure users do not go over their Instance limit
      const numInstances = await ctx.client.instance.count({
        where: { userId: ctx.session.user.id }
      });
      if (numInstances >= 2000 && input.cost >= 0) {
        return {
          error:
            "You have reached your limit. Sell Pokémon if you want to buy more."
        };
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
      select: { balance: true, claimedDaily: true, totalYield: true }
    });
    if (!currUser) {
      throw new Error("Not authorized to make this request");
    }
    if (currUser.claimedDaily) {
      throw new Error("Daily reward already claimed");
    }
    let reward = 25;
    if (currUser.totalYield >= 10000) {
      reward = 1000;
    } else if (currUser.totalYield >= 1000) {
      reward = 100;
    }
    const user = await ctx.client.user.update({
      where: { id: ctx.session.user.id },
      data: { balance: currUser.balance + reward, claimedDaily: true }
    });
    return {
      user: user
    };
  }),

  getJohto: protectedProcedure.mutation(async ({ ctx }) => {
    const currUser = await ctx.client.user.findFirst({
      where: { id: ctx.session.user.id },
      select: { balance: true, claimedDaily: true }
    });
    if (!currUser) {
      throw new Error("Not authorized to make this request");
    }
    const user = await ctx.client.user.update({
      where: { id: ctx.session.user.id },
      data: { johtoStarter: true }
    });
    return {
      user: user
    };
  })
});
