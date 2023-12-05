import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { ZodHabitat, ZodRarity, ZodRegion, ZodSpeciesType } from "@/types/zod";
import { instances, species } from "../../db/schema";
import {
  and,
  asc,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  min,
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
      let speciesData;

      if (input.order === "pokedex") {
        speciesData = await ctx.db.select().from(species);
      } else {
        speciesData = await ctx.db.select().from(species);
      }

      return { species: speciesData };
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
        .selectDistinct({ speciesId: instances.speciesId })
        .from(instances)
        .where(eq(instances.userId, ctx.session.user.id))
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
        nextCursor = nextItem?.species.id;
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
      const starters = await ctx.db
        .select()
        .from(species)
        .where(and(eq(species.shiny, false), eq(species.region, input.region)))
        .orderBy(asc(species.pokedexNumber))
        .limit(9);

      return { starters };
    }),

  getCaughtSpecies: protectedProcedure.query(async ({ ctx }) => {
    const i = ctx.db
      .select({ speciesId: min(instances.speciesId).as("speciesId") })
      .from(instances)
      .where(eq(instances.userId, ctx.session.user.id))
      .groupBy(instances.speciesId)
      .as("i");

    const speciesData = await ctx.db
      .select()
      .from(species)
      .innerJoin(i, eq(species.id, i.speciesId));

    return speciesData;
  })
});
