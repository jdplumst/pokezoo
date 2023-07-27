import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const speciesRouter = router({
  getSpecies: protectedProcedure
    .input(
      z.object({
        order: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      let species;

      if (input.order === "pokedex") {
        species = await ctx.prisma.species.findMany({
          orderBy: [{ pokedexNumber: "asc" }]
        });
      } else {
        species = await ctx.prisma.species.findMany();
      }

      return { species: species };
    })
});
