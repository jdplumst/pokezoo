import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { ZodHabitat, ZodRarity, ZodRegion, ZodSpeciesType } from "@/types/zod";
import { instance, species } from "../../db/schema";
import {
  and,
  asc,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  notInArray,
  or
} from "drizzle-orm";
import {
  HabitatList,
  RaritiesList,
  RegionsList,
  TypesList
} from "@/src/constants";

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
        regions: z.array(ZodRegion),
        rarities: z.array(ZodRarity),
        types: z.array(ZodSpeciesType),
        habitats: z.array(ZodHabitat)
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;

      const i = ctx.db
        .selectDistinct({ speciesId: instance.speciesId })
        .from(instance)
        .where(eq(instance.userId, ctx.session.user.id))
        .as("i");

      const pokemon = await ctx.db
        .select()
        .from(species)
        .leftJoin(i, eq(species.id, i.speciesId))
        .where(
          and(
            eq(species.shiny, input.shiny),
            input.regions.length > 0
              ? inArray(species.region, input.regions)
              : notInArray(species.region, RegionsList),
            input.rarities.length > 0
              ? inArray(species.rarity, input.rarities)
              : notInArray(species.rarity, RaritiesList),
            input.types.length > 0
              ? or(
                  inArray(species.typeOne, input.types),
                  inArray(species.typeTwo, input.types)
                )
              : notInArray(species.typeOne, TypesList),
            input.habitats.length > 0
              ? inArray(species.habitat, input.habitats)
              : notInArray(species.habitat, HabitatList),
            input.caught.Caught && !input.caught.Uncaught
              ? isNotNull(i.speciesId)
              : !input.caught.Caught && input.caught.Uncaught
              ? isNull(i.speciesId)
              : undefined,
            gte(species.id, input.cursor ?? "")
          )
        )
        .limit(limit + 1)
        .orderBy(asc(species.pokedexNumber));

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (pokemon.length > limit) {
        const nextItem = pokemon.pop();
        nextCursor = nextItem?.Species.id;
      }

      return { pokemon, nextCursor };
    }),

  getStarters: protectedProcedure
    .input(
      z.object({
        region: ZodRegion
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
