import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  HabitatList,
  MAX_BALANCE,
  RaritiesList,
  RegionsList,
  SHINY_WILDCARD_COST,
  TypesList,
  WILDCARD_COST
} from "@/src/constants";
import {
  ZodHabitat,
  ZodRarity,
  ZodRegion,
  ZodSort,
  ZodSpeciesType
} from "@/src/zod";
import {
  habitats,
  instances,
  profiles,
  rarities,
  regions,
  species,
  types
} from "../../db/schema";
import { and, asc, desc, eq, inArray, notInArray, or, sql } from "drizzle-orm";
import { calcNewYield } from "@/src/utils/calcNewYield";
import { withinInstanceLimit } from "@/src/utils/withinInstanceLimit";
import { alias } from "drizzle-orm/pg-core";

export const instanceRouter = router({
  getInstanceSpecies: protectedProcedure.query(async ({ ctx }) => {
    const typeOne = alias(types, "typeOne");
    const typeTwo = alias(types, "typeTwo");

    const instancesData = await ctx.db
      .select({
        instanceId: instances.id,
        speciesId: species.id,
        region: regions.name,
        shiny: species.shiny,
        rarity: rarities.name,
        habitat: habitats.name,
        typeOne: typeOne.name,
        typeTwo: typeTwo.name,
        name: species.name,
        img: species.img
      })
      .from(instances)
      .innerJoin(species, eq(instances.speciesId, species.id))
      .innerJoin(regions, eq(species.regionId, regions.id))
      .innerJoin(rarities, eq(species.rarityId, rarities.id))
      .innerJoin(habitats, eq(species.habitatId, habitats.id))
      .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
      .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
      .where(and(eq(instances.userId, ctx.session.user.id)))
      .orderBy(
        asc(species.pokedexNumber),
        asc(species.name),
        desc(species.shiny)
      );

    return { instances: instancesData };
  }),

  // Instances shown on Game page
  getGame: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z
          .object({
            modifyDate: z.date(),
            name: z.string().nullish(),
            pokedexNumber: z.number().nullish(),
            rarity: z.string().nullish()
          })
          .nullish(),
        order: ZodSort,
        shiny: z.boolean(),
        regions: z.array(ZodRegion),
        rarities: z.array(ZodRarity),
        types: z.array(ZodSpeciesType),
        habitats: z.array(ZodHabitat)
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.cursor?.name?.includes(" ")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid cursor name"
        });
      }

      const rarityCursor =
        input.cursor?.rarity === "Common"
          ? 1
          : input.cursor?.rarity === "Rare"
            ? 2
            : input.cursor?.rarity === "Epic"
              ? 3
              : input.cursor?.rarity === "Legendary"
                ? 4
                : null;

      const limit = input.limit ?? 50;

      const typeOne = alias(types, "typeOne");
      const typeTwo = alias(types, "typeTwo");

      const instancesData = await ctx.db
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
        .where(
          and(
            eq(instances.userId, ctx.session.user.id),
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
            input.order === "Oldest"
              ? sql`${instances.modifyDate} >= ${
                  input.cursor?.modifyDate ??
                  new Date("2020-12-03 17:20:11.049")
                }`
              : input.order === "Newest"
                ? sql`${instances.modifyDate} <= ${
                    input.cursor?.modifyDate ??
                    new Date("2050-12-03 17:20:11.049")
                  }`
                : input.order === "Pokedex"
                  ? sql`(${species.pokedexNumber}, ${species.name}, ${
                      instances.modifyDate
                    }) >= (${input.cursor?.pokedexNumber ?? 0}, ${
                      input.cursor?.name ?? ""
                    }, ${
                      input.cursor?.modifyDate ??
                      new Date("2020-12-03 17:20:11.049")
                    })`
                  : input.order === "PokedexDesc"
                    ? sql`(${species.pokedexNumber}, ${species.name}, ${
                        instances.modifyDate
                      }) <= (${input.cursor?.pokedexNumber ?? 10000}, ${
                        input.cursor?.name ?? "{"
                      }, ${
                        input.cursor?.modifyDate ??
                        new Date("2050-12-03 17:20:11.049")
                      })`
                    : input.order === "Rarity"
                      ? sql`(${rarities.id}, ${species.pokedexNumber}, ${
                          species.name
                        }, ${instances.modifyDate}) >= (${rarityCursor ?? 0}, ${
                          input.cursor?.pokedexNumber ?? 0
                        }, ${input.cursor?.name ?? ""}, ${
                          input.cursor?.modifyDate ??
                          new Date("2020-12-03 17:20:11.049")
                        })`
                      : input.order === "RarityDesc"
                        ? sql`(${rarities.id}, ${species.pokedexNumber}, ${
                            species.name
                          }, ${instances.modifyDate}) <= (${rarityCursor ?? 4}, ${
                            input.cursor?.pokedexNumber ?? 10000
                          }, ${input.cursor?.name ?? "{"}, ${
                            input.cursor?.modifyDate ??
                            new Date("2050-12-03 17:20:11.049")
                          })`
                        : undefined
          )
        )
        .orderBy(
          input.order === "Oldest"
            ? asc(instances.modifyDate)
            : input.order === "Newest"
              ? desc(instances.modifyDate)
              : input.order === "Pokedex"
                ? sql`${species.pokedexNumber} asc, ${species.name} asc, ${instances.modifyDate} asc`
                : input.order === "PokedexDesc"
                  ? sql`${species.pokedexNumber} desc, ${species.name} desc, ${instances.modifyDate} desc`
                  : input.order === "Rarity"
                    ? sql`${rarities.id} asc, ${species.pokedexNumber} asc, ${species.name} asc, ${instances.modifyDate} asc`
                    : input.order === "RarityDesc"
                      ? sql`${rarities.id} desc, ${species.pokedexNumber} desc, ${species.name} desc, ${instances.modifyDate} desc`
                      : asc(instances.modifyDate)
        )
        .limit(limit + 1);

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (instancesData.length > limit) {
        const nextItem = instancesData.pop()!;
        nextCursor =
          input.order === "Oldest" || input.order === "Newest"
            ? {
                modifyDate: nextItem.instance.modifyDate,
                name: null,
                pokedexNumber: null,
                rarity: null
              }
            : input.order === "Pokedex" || input.order === "PokedexDesc"
              ? {
                  modifyDate: nextItem.instance.modifyDate,
                  name: nextItem.name,
                  pokedexNumber: nextItem.pokedexNumber,
                  rarity: null
                }
              : input.order === "Rarity" || input.order === "RarityDesc"
                ? {
                    modifyDate: nextItem.instance.modifyDate,
                    name: nextItem.name,
                    pokedexNumber: nextItem.pokedexNumber,
                    rarity: nextItem.rarity
                  }
                : {
                    modifyDate: nextItem.instance.modifyDate,
                    name: null,
                    pokedexNumber: null,
                    rarity: null
                  };
      }

      return { instancesData, nextCursor };
    }),

  purchaseInstanceWithBall: protectedProcedure
    .input(
      z.object({
        speciesId: z.string(),
        cost: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currUser = (
        await ctx.db
          .select({
            totalYield: profiles.totalYield,
            balance: profiles.balance,
            instanceCount: profiles.instanceCount
          })
          .from(profiles)
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }

      if (currUser.balance < input.cost) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You cannot afford this ball."
        });
      }

      const speciesData = (
        await ctx.db
          .select()
          .from(species)
          .where(eq(species.id, input.speciesId))
      )[0];

      if (!speciesData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Species does not exist."
        });
      }

      if (!withinInstanceLimit(currUser.instanceCount)) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "You have reached your limit. Sell Pokémon if you want to buy more."
        });
      }
      const newYield = calcNewYield(currUser.totalYield, speciesData.yield);

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(profiles)
          .set({
            totalYield: newYield,
            balance: currUser.balance - input.cost,
            instanceCount: currUser.instanceCount + 1
          })
          .where(eq(profiles.userId, ctx.session.user.id));

        await tx
          .insert(instances)
          .values({ userId: ctx.session.user.id, speciesId: input.speciesId });
      });

      const instanceData = (
        await ctx.db
          .select()
          .from(instances)
          .where(
            and(
              eq(instances.userId, ctx.session.user.id),
              eq(instances.speciesId, input.speciesId)
            )
          )
      )[0];

      return { instance: instanceData };
    }),

  purchaseInstanceWithWildcards: protectedProcedure
    .input(
      z.object({
        speciesId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currUser = (
        await ctx.db
          .select({
            totalYield: profiles.totalYield,
            instanceCount: profiles.instanceCount,
            commonCards: profiles.commonCards,
            rareCards: profiles.rareCards,
            epicCards: profiles.epicCards,
            legendaryCards: profiles.legendaryCards
          })
          .from(profiles)
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }

      const speciesData = (
        await ctx.db
          .select()
          .from(species)
          .leftJoin(rarities, eq(species.rarityId, rarities.id))
          .where(eq(species.id, input.speciesId))
      )[0];

      if (!speciesData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Species does not exist."
        });
      }

      if (
        (speciesData.rarity?.name === "Common" &&
          !speciesData.species.shiny &&
          currUser.commonCards < WILDCARD_COST) ||
        (speciesData.rarity?.name === "Common" &&
          speciesData.species.shiny &&
          currUser.commonCards < SHINY_WILDCARD_COST) ||
        (speciesData.rarity?.name === "Rare" &&
          !speciesData.species.shiny &&
          currUser.rareCards < WILDCARD_COST) ||
        (speciesData.rarity?.name === "Rare" &&
          speciesData.species.shiny &&
          currUser.rareCards < SHINY_WILDCARD_COST) ||
        (speciesData.rarity?.name === "Epic" &&
          !speciesData.species.shiny &&
          currUser.epicCards < WILDCARD_COST) ||
        (speciesData.rarity?.name === "Epic" &&
          speciesData.species.shiny &&
          currUser.epicCards < SHINY_WILDCARD_COST) ||
        (speciesData.rarity?.name === "Legendary" &&
          !speciesData.species.shiny &&
          currUser.legendaryCards < WILDCARD_COST) ||
        (speciesData.rarity?.name === "Legendary" &&
          speciesData.species.shiny &&
          currUser.legendaryCards < SHINY_WILDCARD_COST)
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You cannot afford this Pokémon."
        });
      }

      if (!withinInstanceLimit(currUser.instanceCount)) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "You have reached your limit. Sell Pokémon if you want to buy more."
        });
      }

      const newYield = calcNewYield(
        currUser.totalYield,
        speciesData.species.yield
      );

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(profiles)
          .set({
            totalYield: newYield,
            commonCards:
              speciesData.rarity?.name === "Common" &&
              !speciesData.species.shiny
                ? currUser.commonCards - WILDCARD_COST
                : speciesData.rarity?.name === "Common" &&
                    speciesData.species.shiny
                  ? currUser.commonCards - SHINY_WILDCARD_COST
                  : currUser.commonCards,
            rareCards:
              speciesData.rarity?.name === "Rare" && !speciesData.species.shiny
                ? currUser.rareCards - WILDCARD_COST
                : speciesData.rarity?.name === "Rare" &&
                    speciesData.species.shiny
                  ? currUser.rareCards - SHINY_WILDCARD_COST
                  : currUser.rareCards,
            epicCards:
              speciesData.rarity?.name === "Epic" && !speciesData.species.shiny
                ? currUser.epicCards - WILDCARD_COST
                : speciesData.rarity?.name === "Epic" &&
                    speciesData.species.shiny
                  ? currUser.epicCards - SHINY_WILDCARD_COST
                  : currUser.epicCards,
            legendaryCards:
              speciesData.rarity?.name === "Legendary" &&
              !speciesData.species.shiny
                ? currUser.legendaryCards - WILDCARD_COST
                : speciesData.rarity?.name === "Legendary" &&
                    speciesData.species.shiny
                  ? currUser.legendaryCards - SHINY_WILDCARD_COST
                  : currUser.legendaryCards,
            instanceCount: currUser.instanceCount + 1
          })
          .where(eq(profiles.userId, ctx.session.user.id));

        await tx
          .insert(instances)
          .values({ userId: ctx.session.user.id, speciesId: input.speciesId });
      });

      const instanceData = await ctx.db
        .select()
        .from(instances)
        .where(
          and(
            eq(instances.userId, ctx.session.user.id),
            eq(instances.speciesId, input.speciesId)
          )
        );

      return {
        instance: instanceData
      };
    }),

  sellInstances: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string())
      })
    )
    .mutation(async ({ ctx, input }) => {
      for (const i of input.ids) {
        await ctx.db.transaction(async (tx) => {
          const exists = (
            await tx
              .select({ speciesId: instances.speciesId })
              .from(instances)
              .where(eq(instances.id, i))
          )[0];

          if (!exists) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Instance does not exist."
            });
          }

          const speciesData = (
            await tx
              .select()
              .from(species)
              .where(eq(species.id, exists.speciesId))
          )[0];

          if (!speciesData) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Species does not exist."
            });
          }

          await tx.delete(instances).where(eq(instances.id, i));

          const currUser = (
            await tx
              .select()
              .from(profiles)
              .where(eq(profiles.userId, ctx.session.user.id))
          )[0];

          if (!currUser) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Not authorized to make this request"
            });
          }

          await tx
            .update(profiles)
            .set({
              totalYield: currUser.totalYield - speciesData.yield,
              balance:
                currUser.balance + speciesData.sellPrice > MAX_BALANCE
                  ? MAX_BALANCE
                  : currUser.balance + speciesData.sellPrice,
              instanceCount: currUser.instanceCount - 1
            })
            .where(eq(profiles.userId, ctx.session.user.id));
        });
      }
      return {
        message: "Delete successful"
      };
    }),

  claimStarter: protectedProcedure
    .input(
      z.object({
        speciesId: z.string(),
        region: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currUser = (
        await ctx.db
          .select({
            totalYield: profiles.totalYield,
            balance: profiles.balance,
            instanceCount: profiles.instanceCount,
            johtoStarter: profiles.johtoStarter,
            hoennStarter: profiles.hoennStarter,
            sinnohStarter: profiles.sinnohStarter,
            unovaStarter: profiles.unovaStarter,
            kalosStarter: profiles.kalosStarter
          })
          .from(profiles)
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }

      if (input.region === "Johto" && currUser.johtoStarter) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already received a Johto starter."
        });
      } else if (input.region === "Hoenn" && currUser.hoennStarter) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already received a Hoenn starter."
        });
      } else if (input.region === "Sinnoh" && currUser.sinnohStarter) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already received a Sinnoh starter."
        });
      } else if (input.region === "Unova" && currUser.unovaStarter) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already received a Unova starter."
        });
      } else if (input.region === "Kalos" && currUser.kalosStarter) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already received a Kalos starter."
        });
      }

      const speciesData = (
        await ctx.db
          .select()
          .from(species)
          .leftJoin(regions, eq(species.regionId, regions.id))
          .where(eq(species.id, input.speciesId))
      )[0];

      if (!speciesData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Species does not exist."
        });
      }

      if (speciesData.region?.name !== input.region) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Species does not come from ${input.region}`
        });
      }

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(profiles)
          .set({
            totalYield: currUser.totalYield + speciesData.species.yield,
            instanceCount: currUser.instanceCount + 1,
            johtoStarter:
              input.region === "Johto" ? true : currUser.johtoStarter,
            hoennStarter:
              input.region === "Hoenn" ? true : currUser.hoennStarter,
            sinnohStarter:
              input.region === "Sinnoh" ? true : currUser.sinnohStarter,
            unovaStarter:
              input.region === "Unova" ? true : currUser.unovaStarter,
            kalosStarter:
              input.region === "Kalos" ? true : currUser.kalosStarter
          })
          .where(eq(profiles.userId, ctx.session.user.id));

        await tx
          .insert(instances)
          .values({ userId: ctx.session.user.id, speciesId: input.speciesId });
      });

      return { message: "Successfully obtained starter" };
    }),

  claimEvent: protectedProcedure.mutation(async ({ ctx }) => {
    const currUser = (
      await ctx.db
        .select({
          totalYield: profiles.totalYield,
          instanceCount: profiles.instanceCount,
          claimedEvent: profiles.claimedEvent
        })
        .from(profiles)
        .where(eq(profiles.userId, ctx.session.user.id))
    )[0];

    if (!currUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized to make this request"
      });
    }

    if (currUser.claimedEvent) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Event reward already claimed"
      });
    }

    const typeOne = alias(types, "typeOne");
    const typeTwo = alias(types, "typeTwo");

    const reward = (
      await ctx.db
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
        .innerJoin(rarities, eq(species.rarityId, rarities.name))
        .innerJoin(habitats, eq(species.habitatId, habitats.id))
        .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
        .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
        .where(eq(species.shiny, true))
        .orderBy(sql`RAND()`)
        .limit(1)
    )[0];

    const newYield = calcNewYield(currUser.totalYield, reward.yield);

    await ctx.db.transaction(async (tx) => {
      await tx
        .update(profiles)
        .set({
          totalYield: newYield,
          instanceCount: currUser.instanceCount + 1,
          claimedEvent: true
        })
        .where(eq(profiles.userId, ctx.session.user.id));

      await tx
        .insert(instances)
        .values({ userId: ctx.session.user.id, speciesId: reward.id });
    });

    return { reward };
  })
});
