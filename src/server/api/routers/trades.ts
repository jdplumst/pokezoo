import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { instances, rarities, species, trades } from "~/server/db/schema";
import { and, eq, ilike, notInArray } from "drizzle-orm";
import { z } from "zod";

export const tradesRouter = createTRPCRouter({
  getPokemonForTrades: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const instancesInInitiatedTrades = ctx.db
        .select({ id: trades.initiatorInstanceId })
        .from(trades)
        .where(eq(trades.initiatorId, ctx.session.user.id));

      const instancesInOfferedTrades = ctx.db
        .select({ id: trades.offererInstanceId })
        .from(trades)
        .where(eq(trades.offererId, ctx.session.user.id));

      const instanceData = await ctx.db
        .select({
          id: instances.id,
          speciesId: instances.speciesId,
          name: species.name,
          img: species.img,
          shiny: species.shiny,
          rarity: rarities.name,
        })
        .from(instances)
        .innerJoin(species, eq(species.id, instances.speciesId))
        .innerJoin(rarities, eq(rarities.id, species.rarityId))
        .where(
          and(
            eq(instances.userId, ctx.session.user.id),
            ilike(species.name, "%" + input.name + "%"),
            notInArray(instances.id, instancesInInitiatedTrades),
            notInArray(instances.id, instancesInOfferedTrades),
          ),
        )
        .limit(30);

      return { pokemon: instanceData };
    }),
});
