import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const speciesRouter = router({
  getSpecies: protectedProcedure
    .input(
      z.object({
        order: z.union([z.string(), z.null()])
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
    }),

  // Species shown on Pokedex page
  getPokedex: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        caught: z.object({ Caught: z.boolean(), Uncaught: z.boolean() }),
        shiny: z.boolean(),
        regions: z.array(
          z.enum(["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova"])
        ),
        rarities: z.array(z.enum(["Common", "Rare", "Epic", "Legendary"])),
        types: z.array(
          z.enum([
            "Normal",
            "Grass",
            "Bug",
            "Fire",
            "Electric",
            "Ground",
            "Water",
            "Fighting",
            "Poison",
            "Rock",
            "Ice",
            "Ghost",
            "Psychic",
            "Fairy",
            "Dark",
            "Dragon",
            "Steel",
            "Flying"
          ])
        ),
        habitats: z.array(
          z.enum([
            "Grassland",
            "Forest",
            "WatersEdge",
            "Sea",
            "Cave",
            "Mountain",
            "RoughTerrain",
            "Urban",
            "Rare"
          ])
        )
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;

      const pokemon = await ctx.prisma.species.findMany({
        take: limit + 1,
        include: {
          instances: {
            distinct: ["speciesId"],
            where: { userId: ctx.session.user.id }
          }
        },
        where: {
          shiny: input.shiny,
          region: { in: input.regions },
          rarity: { in: input.rarities },
          OR: [
            { typeOne: { in: input.types } },
            { typeTwo: { in: input.types } }
          ],
          habitat: { in: input.habitats },
          instances:
            input.caught.Caught && !input.caught.Uncaught
              ? { some: { userId: ctx.session.user.id } }
              : !input.caught.Caught && input.caught.Uncaught
              ? { none: { userId: ctx.session.user.id } }
              : undefined
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { pokedexNumber: "asc" }
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (pokemon.length > limit) {
        const nextItem = pokemon.pop();
        nextCursor = nextItem?.id;
      }

      return { pokemon, nextCursor };
    }),

  getStarters: protectedProcedure
    .input(
      z.object({
        region: z.enum(["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova"])
      })
    )
    .query(async ({ ctx, input }) => {
      const starters = await ctx.prisma.species.findMany({
        take: 9,
        where: {
          shiny: false,
          region: input.region
        },
        orderBy: { pokedexNumber: "asc" }
      });

      return { starters };
    })
});
