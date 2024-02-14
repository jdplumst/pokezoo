import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { ZodHabitat, ZodRarity, ZodRegion, ZodSpeciesType } from "@/src/zod";
import {
  habitats,
  instances,
  rarities,
  regions,
  species,
  types
} from "../../db/schema";
import {
  and,
  asc,
  eq,
  inArray,
  isNotNull,
  isNull,
  min,
  notInArray,
  or,
  sql
} from "drizzle-orm";
import {
  HabitatList,
  RaritiesList,
  RegionsList,
  TypesList
} from "@/src/constants";
import { alias } from "drizzle-orm/pg-core";

export const speciesRouter = router({
  getSpecies: protectedProcedure
    .input(
      z.object({
        order: z.union([z.string(), z.null()])
      })
    )
    .query(async ({ ctx, input }) => {
      let speciesData;

      const typeOne = alias(types, "typeOne");
      const typeTwo = alias(types, "typeTwo");

      if (input.order === "pokedex") {
        speciesData = await ctx.db
          .select({
            id: species.id,
            pokedexNumber: species.pokedexNumber,
            name: species.name,
            rarity: rarities.name,
            yield: species.yield,
            img: species.img,
            sellPrice: species.sellPrice,
            shiny: species.shiny,
            typeOne: typeOne.name,
            typeTwo: typeTwo.name,
            generation: species.generation,
            habitat: habitats.name,
            region: regions.name
          })
          .from(species)
          .innerJoin(regions, eq(species.regionId, regions.id))
          .innerJoin(rarities, eq(species.rarityId, rarities.id))
          .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
          .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
          .innerJoin(habitats, eq(species.habitatId, habitats.id))
          .orderBy(asc(species.pokedexNumber));
      } else {
        speciesData = await ctx.db
          .select({
            id: species.id,
            pokedexNumber: species.pokedexNumber,
            name: species.name,
            rarity: rarities.name,
            yield: species.yield,
            img: species.img,
            sellPrice: species.sellPrice,
            shiny: species.shiny,
            typeOne: typeOne.name,
            typeTwo: typeTwo.name,
            generation: species.generation,
            habitat: habitats.name,
            region: regions.name
          })
          .from(species)
          .innerJoin(regions, eq(species.regionId, regions.id))
          .innerJoin(rarities, eq(species.rarityId, rarities.id))
          .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
          .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
          .innerJoin(habitats, eq(species.habitatId, habitats.id));
      }

      return { species: speciesData };
    }),

  // Species shown on Pokedex page
  getPokedex: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z
          .object({ pokedexNumber: z.number(), name: z.string() })
          .nullish(),
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

      const typeOne = alias(types, "typeOne");
      const typeTwo = alias(types, "typeTwo");

      const pokemon = await ctx.db
        .select({
          id: species.id,
          pokedexNumber: species.pokedexNumber,
          name: species.name,
          rarity: rarities.name,
          yield: species.yield,
          img: species.img,
          sellPrice: species.sellPrice,
          shiny: species.shiny,
          typeOne: typeOne.name,
          typeTwo: typeTwo.name,
          generation: species.generation,
          habitat: habitats.name,
          region: regions.name,
          instance: i.speciesId
        })
        .from(species)
        .leftJoin(i, eq(species.id, i.speciesId))
        .innerJoin(regions, eq(species.regionId, regions.id))
        .innerJoin(rarities, eq(species.rarityId, rarities.id))
        .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
        .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
        .innerJoin(habitats, eq(species.habitatId, habitats.id))
        .where(
          and(
            eq(species.shiny, input.shiny),
            input.regions.length > 0
              ? inArray(regions.name, input.regions)
              : notInArray(regions.name, RegionsList),
            input.rarities.length > 0
              ? inArray(rarities.name, input.rarities)
              : notInArray(rarities.name, RaritiesList),
            input.types.length > 0
              ? or(
                  inArray(typeOne.name, input.types),
                  inArray(typeTwo.name, input.types)
                )
              : notInArray(typeOne.name, TypesList),
            input.habitats.length > 0
              ? inArray(habitats.name, input.habitats)
              : notInArray(habitats.name, HabitatList),
            input.caught.Caught && !input.caught.Uncaught
              ? isNotNull(i.speciesId)
              : !input.caught.Caught && input.caught.Uncaught
                ? isNull(i.speciesId)
                : undefined,
            sql`(${species.pokedexNumber}, ${species.name}) >= (${
              input.cursor?.pokedexNumber ?? 0
            }, ${input.cursor?.name ?? ""})`
          )
        )
        .limit(limit + 1)
        .orderBy(
          asc(species.pokedexNumber),
          asc(rarities.id),
          asc(species.name)
        );

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (pokemon.length > limit) {
        const nextItem = pokemon.pop()!;
        nextCursor = {
          pokedexNumber: nextItem?.pokedexNumber,
          name: nextItem?.name
        };
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
      const typeOne = alias(types, "typeOne");
      const typeTwo = alias(types, "typeTwo");

      const starters = await ctx.db
        .select({
          id: species.id,
          pokedexNumber: species.pokedexNumber,
          name: species.name,
          rarity: rarities.name,
          yield: species.yield,
          img: species.img,
          sellPrice: species.sellPrice,
          shiny: species.shiny,
          typeOne: typeOne.name,
          typeTwo: typeTwo.name,
          generation: species.generation,
          habitat: habitats.name,
          region: regions.name,
          instance: instances
        })
        .from(instances)
        .innerJoin(species, eq(instances.speciesId, species.id))
        .innerJoin(regions, eq(species.regionId, regions.id))
        .innerJoin(rarities, eq(species.rarityId, rarities.id))
        .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
        .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
        .innerJoin(habitats, eq(species.habitatId, habitats.id))
        .where(and(eq(species.shiny, false), eq(regions.name, input.region)))
        .orderBy(asc(species.pokedexNumber))
        .limit(15);

      return { starters };
    }),

  getCaughtSpecies: protectedProcedure.query(async ({ ctx }) => {
    const typeOne = alias(types, "typeOne");
    const typeTwo = alias(types, "typeTwo");

    const i = ctx.db
      .select({ speciesId: min(instances.speciesId).as("speciesId") })
      .from(instances)
      .where(eq(instances.userId, ctx.session.user.id))
      .groupBy(instances.speciesId)
      .as("i");

    const speciesData = await ctx.db
      .select({
        id: species.id,
        pokedexNumber: species.pokedexNumber,
        name: species.name,
        rarity: rarities.name,
        yield: species.yield,
        img: species.img,
        sellPrice: species.sellPrice,
        shiny: species.shiny,
        typeOne: typeOne.name,
        typeTwo: typeTwo.name,
        generation: species.generation,
        habitat: habitats.name,
        region: regions.name,
        instance: i.speciesId
      })
      .from(species)
      .innerJoin(regions, eq(species.regionId, regions.id))
      .innerJoin(rarities, eq(species.rarityId, rarities.id))
      .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
      .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
      .innerJoin(habitats, eq(species.habitatId, habitats.id))
      .innerJoin(i, eq(species.id, i.speciesId));

    return speciesData;
  })
});
