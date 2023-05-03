import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const instanceRouter = router({
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
    }),

  sellInstance: protectedProcedure
    .input(
      z.object({
        id: z.string()
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
      const exists = await ctx.prisma.instance.findUnique({
        where: { id: input.id },
        select: { speciesId: true }
      });
      if (!exists) {
        throw Error("Instance does not exist.");
      }
      const species = await ctx.prisma.species.findUnique({
        where: { id: exists.speciesId }
      });
      if (!species) {
        throw Error("Species does not exist.");
      }
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield - species.yield,
          balance: currUser.balance + species.sellPrice
        }
      });
      const instance = await ctx.prisma.instance.delete({
        where: { id: input.id }
      });
      return {
        instance: instance,
        user: user
      };
    }),

  getJohto: protectedProcedure
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
        select: { totalYield: true, balance: true, johtoStarter: true }
      });
      if (!currUser) {
        throw Error("Not authorized to make this request");
      }
      if (currUser.johtoStarter) {
        throw Error("You have already received a Johto starter.");
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
          balance: currUser.balance - input.cost,
          johtoStarter: true
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
