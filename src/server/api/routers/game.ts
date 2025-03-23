import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  habitats,
  instances,
  rarities,
  regions,
  species,
  types,
} from "~/server/db/schema";
import {
  HabitatValues,
  RarityValues,
  RegionValues,
  SpeciesTypeValues,
  ZodHabitat,
  ZodRarity,
  ZodRegion,
  ZodSort,
  ZodSpeciesType,
} from "~/lib/types";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, inArray, notInArray, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";

export const gameRouter = createTRPCRouter({
  getPokemon: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z
          .object({
            modifyDate: z.string(),
            name: z.string().nullish(),
            pokedexNumber: z.number().nullish(),
            rarity: z.string().nullish(),
          })
          .nullish(),
        order: ZodSort,
        shiny: z.boolean(),
        regions: z.array(ZodRegion),
        rarities: z.array(ZodRarity),
        types: z.array(ZodSpeciesType),
        habitats: z.array(ZodHabitat),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.cursor?.name?.includes(" ")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something went wrong. Please try again.",
        });
      }

      let rarityCursor;
      switch (input.cursor?.rarity) {
        case "Common":
          rarityCursor = 1;
          break;
        case "Rare":
          rarityCursor = 2;
          break;
        case "Epic":
          rarityCursor = 3;
          break;
        case "Legendary":
          rarityCursor = 4;
          break;
      }

      const limit = input.limit ?? 50;

      const typeOne = alias(types, "typeOne");
      const typeTwo = alias(types, "typeTwo");

      const instancesData = await ctx.db
        .select({
          id: instances.id,
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
          instance: instances,
        })
        .from(instances)
        .innerJoin(species, eq(instances.speciesId, species.id))
        .innerJoin(regions, eq(species.regionId, regions.id))
        .innerJoin(rarities, eq(species.rarityId, rarities.id))
        .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
        .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
        .innerJoin(habitats, eq(species.habitatId, habitats.id))
        .where(
          and(
            eq(instances.box, 0),
            eq(instances.userId, ctx.session.user.id),
            eq(species.shiny, input.shiny),
            input.regions.length > 0
              ? inArray(regions.name, input.regions)
              : notInArray(regions.name, Object.values(RegionValues)),
            input.rarities.length > 0
              ? inArray(rarities.name, input.rarities)
              : notInArray(rarities.name, Object.values(RarityValues)),
            input.types.length > 0
              ? or(
                  inArray(typeOne.name, input.types),
                  inArray(typeTwo.name, input.types),
                )
              : notInArray(typeOne.name, Object.values(SpeciesTypeValues)),
            input.habitats.length > 0
              ? inArray(habitats.name, input.habitats)
              : notInArray(habitats.name, Object.values(HabitatValues)),
            input.order === "Oldest"
              ? sql`${instances.modifyDate} >= ${
                  input.cursor?.modifyDate ??
                  new Date("2020-12-03 17:20:11.049").toISOString()
                }`
              : input.order === "Newest"
                ? sql`${instances.modifyDate} <= ${
                    input.cursor?.modifyDate ??
                    new Date("2050-12-03 17:20:11.049").toISOString()
                  }`
                : input.order === "Pokedex"
                  ? sql`(${species.pokedexNumber}, ${rarities.id} ,${species.name}, ${
                      instances.modifyDate
                    }) >= (${input.cursor?.pokedexNumber ?? 0}, ${rarityCursor ?? 0}, ${
                      input.cursor?.name ?? ""
                    }, ${
                      input.cursor?.modifyDate ??
                      new Date("2020-12-03 17:20:11.049").toISOString()
                    })`
                  : input.order === "Pokedex Desc."
                    ? sql`(${species.pokedexNumber}, ${rarities.id}, ${species.name}, ${
                        instances.modifyDate
                      }) <= (${input.cursor?.pokedexNumber ?? 10000}, ${rarityCursor ?? 10}, ${
                        input.cursor?.name ?? "{"
                      }, ${
                        input.cursor?.modifyDate ??
                        new Date("2050-12-03 17:20:11.049").toISOString()
                      })`
                    : input.order === "Rarity"
                      ? sql`(${rarities.id}, ${species.pokedexNumber}, ${
                          species.name
                        }, ${instances.modifyDate}) >= (${rarityCursor ?? 0}, ${
                          input.cursor?.pokedexNumber ?? 0
                        }, ${input.cursor?.name ?? ""}, ${
                          input.cursor?.modifyDate ??
                          new Date("2020-12-03 17:20:11.049").toISOString()
                        })`
                      : input.order === "Rarity Desc."
                        ? sql`(${rarities.id}, ${species.pokedexNumber}, ${
                            species.name
                          }, ${instances.modifyDate}) <= (${rarityCursor ?? 10}, ${
                            input.cursor?.pokedexNumber ?? 10000
                          }, ${input.cursor?.name ?? "{"}, ${
                            input.cursor?.modifyDate ??
                            new Date("2050-12-03 17:20:11.049").toISOString()
                          })`
                        : undefined,
          ),
        )
        .orderBy(
          input.order === "Oldest"
            ? asc(instances.modifyDate)
            : input.order === "Newest"
              ? desc(instances.modifyDate)
              : input.order === "Pokedex"
                ? sql`${species.pokedexNumber} asc, ${rarities.id} asc, ${species.name} asc, ${instances.modifyDate} asc`
                : input.order === "Pokedex Desc."
                  ? sql`${species.pokedexNumber} desc, ${rarities.id} desc, ${species.name} desc, ${instances.modifyDate} desc`
                  : input.order === "Rarity"
                    ? sql`${rarities.id} asc, ${species.pokedexNumber} asc, ${species.name} asc, ${instances.modifyDate} asc`
                    : input.order === "Rarity Desc."
                      ? sql`${rarities.id} desc, ${species.pokedexNumber} desc, ${species.name} desc, ${instances.modifyDate} desc`
                      : asc(instances.modifyDate),
        )
        .limit(limit + 1);

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (instancesData.length > limit) {
        const nextItem = instancesData.pop()!;
        nextCursor =
          input.order === "Oldest" || input.order === "Newest"
            ? {
                modifyDate: nextItem.instance.modifyDate.toISOString(),
                name: null,
                pokedexNumber: null,
                rarity: null,
              }
            : {
                modifyDate: nextItem.instance.modifyDate.toISOString(),
                name: nextItem.name,
                pokedexNumber: nextItem.pokedexNumber,
                rarity: nextItem.rarity,
              };
      }

      return { instancesData, nextCursor };
    }),

  getStarters: protectedProcedure
    .input(z.object({ regionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const starters = await ctx.db
        .select({
          id: species.id,
          name: species.name,
          img: species.img,
        })
        .from(species)
        .innerJoin(regions, eq(species.regionId, regions.id))
        .where(
          and(eq(species.regionId, input.regionId), eq(species.starter, true)),
        )
        .orderBy(asc(species.pokedexNumber));

      return { starters };
    }),
});
