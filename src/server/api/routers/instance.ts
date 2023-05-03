import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const instanceRouter = router({
  deleteInstance: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const instance = await ctx.prisma.instance.delete({
        where: { id: input.id }
      });
      return { instance: instance };
    }),

  purchaseInstance: protectedProcedure
    .input(
      z.object({
        speciesId: z.string(),
        userId: z.string(),
        cost: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { totalYield: true, balance: true }
      });
      if (!currUser) {
        throw Error("Not authorized to make this request");
      }
      if (currUser.balance < input.cost) {
        throw Error("You cannot afford this ball.");
      }
      const species = await ctx.prisma.species.findUnique({
        where: {
          id: input.speciesId
        }
      });
      if (!species) {
        throw Error("Species does not exist.");
      }
      const numInstances = await ctx.prisma.instance.count({
        where: { userId: ctx.session.user.id }
      });
      if (numInstances >= 2000) {
        throw Error(
          "You have reached your limit. Sell Pokémon if you want to buy more."
        );
      }
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield + species.yield,
          balance: currUser.balance - input.cost
        }
      });
      const instance = await ctx.prisma.instance.create({
        data: { userId: ctx.session.user.id, speciesId: input.speciesId }
      });
      return {
        instance: instance,
        user: user
      };
    })
});
