import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const instanceRouter = router({
  createInstance: protectedProcedure
    .input(
      z.object({
        speciesId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const instance = await ctx.client.instance.create({
        data: { userId: ctx.session.user.id, speciesId: input.speciesId }
      });
      return {
        instance: instance
      };
    }),

  deleteInstance: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const numInstances = await ctx.client.instance.count({
        where: { userId: ctx.session.user.id }
      });
      if (numInstances <= 1) {
        return { error: "You must keep at least one species." };
      }
      const instance = await ctx.client.instance.delete({
        where: { id: input.id }
      });
      return { instance: instance };
    })
});
