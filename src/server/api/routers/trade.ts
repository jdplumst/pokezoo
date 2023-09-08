import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const tradeRouter = router({
  initiateTrade: protectedProcedure
    .input(
      z.object({ speciesId: z.string(), description: z.string().nullish() })
    )
    .mutation(async ({ ctx, input }) => {
      const initiatorId = ctx.session.user.id;
      const trade = await ctx.prisma.trade.create({
        data: {
          initiatorId: initiatorId,
          initiatorSpeciesId: input.speciesId,
          description: input.description
        }
      });
      return { trade: trade };
    })
});
