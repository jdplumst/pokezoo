import { z } from "zod";
import { adminProcedure, protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  HabitatList,
  MAX_BALANCE,
  RaritiesList,
  RegionsList,
  SHINY_WILDCARD_COST,
  TypesList,
  WILDCARD_COST,
} from "@/src/constants";
import {
  ZodHabitat,
  ZodRarity,
  ZodRegion,
  ZodSort,
  ZodSpeciesType,
  ZodTime,
} from "@/src/zod";
import {
  balls,
  habitats,
  instances,
  profiles,
  rarities,
  regions,
  species,
  trades,
  types,
  userCharms,
} from "../../db/schema";
import { and, asc, desc, eq, inArray, notInArray, or, sql } from "drizzle-orm";
import { calcNewYield } from "@/src/utils/calcNewYield";
import { withinInstanceLimit } from "@/src/utils/withinInstanceLimit";
import { alias } from "drizzle-orm/pg-core";
import { env } from "@/src/env";
import { updateUserQuest } from "@/src/utils/updateUserQuest";

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
        img: species.img,
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
        desc(species.shiny),
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
          message: "Invalid cursor name",
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
                  inArray(typeTwo.name, input.types),
                )
              : notInArray(typeOne.name, TypesList),
            input.habitats.length > 0
              ? inArray(habitats.name, input.habitats)
              : notInArray(habitats.name, HabitatList),
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
                  : input.order === "PokedexDesc"
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
                      : input.order === "RarityDesc"
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
                : input.order === "PokedexDesc"
                  ? sql`${species.pokedexNumber} desc, ${rarities.id} desc, ${species.name} desc, ${instances.modifyDate} desc`
                  : input.order === "Rarity"
                    ? sql`${rarities.id} asc, ${species.pokedexNumber} asc, ${species.name} asc, ${instances.modifyDate} asc`
                    : input.order === "RarityDesc"
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

  purchaseInstanceWithBall: protectedProcedure
    .input(
      z.object({
        ballId: z.string(),
        regionId: z.number().nullish(),
        time: ZodTime,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const catchingCharm = alias(userCharms, "catchingCharm");
      const currUser = (
        await ctx.db
          .select({
            totalYield: profiles.totalYield,
            balance: profiles.balance,
            instanceCount: profiles.instanceCount,
            catchingCharm: catchingCharm.charmId,
          })
          .from(profiles)
          .leftJoin(
            catchingCharm,
            and(
              eq(profiles.userId, catchingCharm.userId),
              eq(catchingCharm.charmId, 1),
            ),
          )
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request",
        });
      }

      const currBall = (
        await ctx.db.select().from(balls).where(eq(balls.id, input.ballId))
      )[0];

      if (!currBall) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Ball with id ${input.ballId} does not exist`,
        });
      }

      if (currUser.balance < currBall.cost) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You cannot afford this ball.",
        });
      }

      if (
        !withinInstanceLimit(currUser.instanceCount, !!currUser.catchingCharm)
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "You have reached your limit. Sell Pokémon if you want to buy more.",
        });
      }

      if (currBall.name === "Premier" && !input.regionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must send a valid region id for Premier Ball",
        });
      }

      if (currBall.name === "Premier" && input.regionId) {
        const currRegion = (
          await ctx.db
            .select()
            .from(regions)
            .where(eq(regions.id, input.regionId))
        )[0];

        if (!currRegion) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Region with id ${input.regionId} does not exist`,
          });
        }
      }

      // Determine if shiny
      const shinyRandomizer = Math.floor(Math.random() * 4096) + 1;
      let shiny = false;
      if (shinyRandomizer === 8) {
        shiny = true;
      }

      // Variables to keep track of which species to filter
      let habitats = [3, 4, 6, 7, 8, 8]; // Habitats found both day and night
      let types = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
      ];

      // Filter species based on time
      if (input.time === "day") {
        habitats.push(1);
      } else if (input.time === "night") {
        habitats.push(2, 5);
      }

      // Filter species based on ball
      if (currBall.name === "Net") {
        types = types.filter((t) => t === 3 || t === 7);
      } else if (currBall.name === "Dusk") {
        types = types.filter((t) => t === 12 || t === 15);
      } else if (currBall.name === "Dive") {
        habitats = habitats.filter((h) => h === 3 || h === 4);
      } else if (currBall.name === "Safari") {
        habitats = habitats.filter((h) => h === 6 || h === 7);
      }

      // Determine rarity
      const randomizer = [];
      for (let i = 0; i < currBall.commonChance; i++) {
        randomizer.push(1);
      }
      for (let i = 0; i < currBall.rareChance; i++) {
        randomizer.push(2);
      }
      for (let i = 0; i < currBall.epicChance; i++) {
        randomizer.push(3);
      }
      for (let i = 0; i < currBall.legendaryChance; i++) {
        randomizer.push(4);
      }
      for (let i = 0; i < currBall.megaChance; i++) {
        randomizer.push(5);
      }
      for (let i = 0; i < currBall.ubChance; i++) {
        randomizer.push(6);
      }
      const rarity = randomizer[Math.floor(Math.random() * 100)];

      // Determine the new species the user gets
      const currSpecies = (
        await ctx.db
          .select()
          .from(species)
          .where(
            and(
              eq(species.rarityId, rarity),
              inArray(species.habitatId, habitats),
              or(
                inArray(species.typeOneId, types),
                inArray(species.typeTwoId, types),
              ),
              eq(species.shiny, shiny),
              currBall.name === "Premier"
                ? eq(species.regionId, input.regionId!)
                : undefined,
            ),
          )
          .orderBy(sql`RANDOM()`)
      )[0];

      if (!currSpecies) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong trying to select species",
        });
      }

      // Update userQuest count field
      try {
        await updateUserQuest(
          currSpecies,
          ctx.db,
          ctx.session.user.id,
          currBall,
        );
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error trying to update userQuests",
        });
      }

      const newYield = calcNewYield(currUser.totalYield, currSpecies.yield);

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(profiles)
          .set({
            totalYield: newYield,
            balance: currUser.balance - currBall.cost,
            instanceCount: currUser.instanceCount + 1,
          })
          .where(eq(profiles.userId, ctx.session.user.id));

        await tx
          .insert(instances)
          .values({ userId: ctx.session.user.id, speciesId: currSpecies.id });
      });

      const instanceData = (
        await ctx.db
          .select()
          .from(instances)
          .where(
            and(
              eq(instances.userId, ctx.session.user.id),
              eq(instances.speciesId, currSpecies.id),
            ),
          )
      )[0];

      return { instance: instanceData };
    }),

  purchaseInstanceWithWildcards: protectedProcedure
    .input(
      z.object({
        speciesId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const catchingCharm = alias(userCharms, "catchingCharm");

      const currUser = (
        await ctx.db
          .select({
            totalYield: profiles.totalYield,
            instanceCount: profiles.instanceCount,
            commonCards: profiles.commonCards,
            rareCards: profiles.rareCards,
            epicCards: profiles.epicCards,
            legendaryCards: profiles.legendaryCards,
            catchingCharm: catchingCharm.charmId,
          })
          .from(profiles)
          .leftJoin(
            catchingCharm,
            and(
              eq(profiles.userId, catchingCharm.userId),
              eq(catchingCharm.charmId, 1),
            ),
          )
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request",
        });
      }

      const currSpecies = (
        await ctx.db
          .select()
          .from(species)
          .leftJoin(rarities, eq(species.rarityId, rarities.id))
          .where(eq(species.id, input.speciesId))
      )[0];

      if (!currSpecies) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Species does not exist.",
        });
      }

      if (
        (currSpecies.rarity?.name === "Common" &&
          !currSpecies.species.shiny &&
          currUser.commonCards < WILDCARD_COST) ||
        (currSpecies.rarity?.name === "Common" &&
          currSpecies.species.shiny &&
          currUser.commonCards < SHINY_WILDCARD_COST) ||
        (currSpecies.rarity?.name === "Rare" &&
          !currSpecies.species.shiny &&
          currUser.rareCards < WILDCARD_COST) ||
        (currSpecies.rarity?.name === "Rare" &&
          currSpecies.species.shiny &&
          currUser.rareCards < SHINY_WILDCARD_COST) ||
        (currSpecies.rarity?.name === "Epic" &&
          !currSpecies.species.shiny &&
          currUser.epicCards < WILDCARD_COST) ||
        (currSpecies.rarity?.name === "Epic" &&
          currSpecies.species.shiny &&
          currUser.epicCards < SHINY_WILDCARD_COST) ||
        (currSpecies.rarity?.name === "Legendary" &&
          !currSpecies.species.shiny &&
          currUser.legendaryCards < WILDCARD_COST) ||
        (currSpecies.rarity?.name === "Legendary" &&
          currSpecies.species.shiny &&
          currUser.legendaryCards < SHINY_WILDCARD_COST)
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You cannot afford this Pokémon.",
        });
      }

      if (
        !withinInstanceLimit(currUser.instanceCount, !!currUser.catchingCharm)
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "You have reached your limit. Sell Pokémon if you want to buy more.",
        });
      }

      // Update userQuest count field
      try {
        await updateUserQuest(currSpecies.species, ctx.db, ctx.session.user.id);
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error trying to update userQuests",
        });
      }

      const newYield = calcNewYield(
        currUser.totalYield,
        currSpecies.species.yield,
      );

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(profiles)
          .set({
            totalYield: newYield,
            commonCards:
              currSpecies.rarity?.name === "Common" &&
              !currSpecies.species.shiny
                ? currUser.commonCards - WILDCARD_COST
                : currSpecies.rarity?.name === "Common" &&
                    currSpecies.species.shiny
                  ? currUser.commonCards - SHINY_WILDCARD_COST
                  : currUser.commonCards,
            rareCards:
              currSpecies.rarity?.name === "Rare" && !currSpecies.species.shiny
                ? currUser.rareCards - WILDCARD_COST
                : currSpecies.rarity?.name === "Rare" &&
                    currSpecies.species.shiny
                  ? currUser.rareCards - SHINY_WILDCARD_COST
                  : currUser.rareCards,
            epicCards:
              currSpecies.rarity?.name === "Epic" && !currSpecies.species.shiny
                ? currUser.epicCards - WILDCARD_COST
                : currSpecies.rarity?.name === "Epic" &&
                    currSpecies.species.shiny
                  ? currUser.epicCards - SHINY_WILDCARD_COST
                  : currUser.epicCards,
            legendaryCards:
              currSpecies.rarity?.name === "Legendary" &&
              !currSpecies.species.shiny
                ? currUser.legendaryCards - WILDCARD_COST
                : currSpecies.rarity?.name === "Legendary" &&
                    currSpecies.species.shiny
                  ? currUser.legendaryCards - SHINY_WILDCARD_COST
                  : currUser.legendaryCards,
            instanceCount: currUser.instanceCount + 1,
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
            eq(instances.speciesId, input.speciesId),
          ),
        );

      return {
        instance: instanceData,
      };
    }),

  sellInstances: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      for (const i of input.ids) {
        await ctx.db.transaction(async (tx) => {
          const exists = (
            await tx
              .select({ id: instances.id, speciesId: instances.speciesId })
              .from(instances)
              .where(eq(instances.id, i))
          )[0];

          if (!exists) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Instance does not exist.",
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
              message: "Species does not exist.",
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
              message: "Not authorized to make this request",
            });
          }

          await tx
            .update(trades)
            .set({ offererId: null, offererInstanceId: null })
            .where(eq(trades.offererInstanceId, exists.id));

          await tx
            .delete(trades)
            .where(eq(trades.initiatorInstanceId, exists.id));

          await tx
            .update(profiles)
            .set({
              totalYield: currUser.totalYield - speciesData.yield,
              balance:
                currUser.balance + speciesData.sellPrice > MAX_BALANCE
                  ? MAX_BALANCE
                  : currUser.balance + speciesData.sellPrice,
              instanceCount: currUser.instanceCount - 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
        });
      }
      return {
        message: "Delete successful",
      };
    }),

  claimStarter: protectedProcedure
    .input(
      z.object({
        speciesId: z.string(),
        region: z.string(),
      }),
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
            kalosStarter: profiles.kalosStarter,
            alolaStarter: profiles.alolaStarter,
          })
          .from(profiles)
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request",
        });
      }

      if (input.region === "Johto" && currUser.johtoStarter) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already received a Johto starter.",
        });
      } else if (input.region === "Hoenn" && currUser.hoennStarter) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already received a Hoenn starter.",
        });
      } else if (input.region === "Sinnoh" && currUser.sinnohStarter) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already received a Sinnoh starter.",
        });
      } else if (input.region === "Unova" && currUser.unovaStarter) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already received a Unova starter.",
        });
      } else if (input.region === "Kalos" && currUser.kalosStarter) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already received a Kalos starter.",
        });
      } else if (input.region === "Alola" && currUser.alolaStarter) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already received an Alola starter.",
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
          message: "Species does not exist.",
        });
      }

      if (speciesData.region?.name !== input.region) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Species does not come from ${input.region}`,
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
              input.region === "Kalos" ? true : currUser.kalosStarter,
            alolaStarter:
              input.region === "Alola" ? true : currUser.alolaStarter,
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
          claimedEvent: profiles.claimedEvent,
        })
        .from(profiles)
        .where(eq(profiles.userId, ctx.session.user.id))
    )[0];

    if (!currUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized to make this request",
      });
    }

    if (currUser.claimedEvent) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Event reward already claimed",
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
          region: regions.name,
        })
        .from(species)
        .innerJoin(regions, eq(species.regionId, regions.id))
        .innerJoin(rarities, eq(species.rarityId, rarities.id))
        .innerJoin(habitats, eq(species.habitatId, habitats.id))
        .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
        .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
        .where(eq(species.shiny, true))
        .orderBy(sql`RANDOM()`)
        .limit(1)
    )[0];

    const newYield = calcNewYield(currUser.totalYield, reward.yield);

    await ctx.db.transaction(async (tx) => {
      await tx
        .update(profiles)
        .set({
          totalYield: newYield,
          instanceCount: currUser.instanceCount + 1,
          claimedEvent: true,
        })
        .where(eq(profiles.userId, ctx.session.user.id));

      await tx
        .insert(instances)
        .values({ userId: ctx.session.user.id, speciesId: reward.id });
    });

    return { reward };
  }),

  seedInstances: adminProcedure.query(async ({ ctx }) => {
    await ctx.db.transaction(async (tx) => {
      await tx.insert(instances).values([
        { userId: ctx.session.user.id, speciesId: "clfyshzqj0004nsk4chot6pqs" }, // venusaur
        { userId: ctx.session.user.id, speciesId: "pe6bkapnh3epk8lamm66f09x" }, // mega venusaur
        { userId: ctx.session.user.id, speciesId: "clfysi0v0000insk4eftjqexl" }, // caterpie
        { userId: ctx.session.user.id, speciesId: "clfysi8xi0036nsk4ibiscs84" }, // growlithe
        { userId: ctx.session.user.id, speciesId: "clfysinxa007ynsk4zjeg92np" }, // articuno
        { userId: ctx.session.user.id, speciesId: "clfysip03008ansk4z1ydgeig" }, // mewtwo
        { userId: ctx.session.user.id, speciesId: "yjeup9ivefukn1ksdperh61j" }, // mega mewtwo x
        { userId: ctx.session.user.id, speciesId: "oz37qaolixehlv3w9g7jfjuk" }, // mega mewtwo y
        { userId: ctx.session.user.id, speciesId: "clgz4r0ug000ons60pauizq8x" }, // totodile
        { userId: ctx.session.user.id, speciesId: "clgz4sf630004nszczb8by3l4" }, // furret
        { userId: ctx.session.user.id, speciesId: "clgz4sj81001knszcs677k3ql" }, // togepi
        { userId: ctx.session.user.id, speciesId: "clgz4smhb002onszckmvcc5bh" }, // sudowoodo
        { userId: ctx.session.user.id, speciesId: "clgz4sq9d0040nszc87ar6163" }, // umbreon
        { userId: ctx.session.user.id, speciesId: "vwzl4l5v77gqa4xgq6tducpd" }, // heracross
        { userId: ctx.session.user.id, speciesId: "clgz4t5o50094nszcg9krd8rv" }, // raikou
        { userId: ctx.session.user.id, speciesId: "clgz4t7b9009onszcvjth7bn1" }, // tyranitar
        { userId: ctx.session.user.id, speciesId: "clgz4t7l5009snszcrw2g3dvt" }, // lugia
        { userId: ctx.session.user.id, speciesId: "clhu77xl20004ns4yybjj0na6" }, // grovyle
        { userId: ctx.session.user.id, speciesId: "clhu784as003cns4y0hhame7z" }, // gardevoir
        { userId: ctx.session.user.id, speciesId: "mdhkisuwk4l62nzqpu7cbpkx" }, // mega mawile
        { userId: ctx.session.user.id, speciesId: "clhu78ka900b0ns4y2rp3rcaf" }, // castform
        { userId: ctx.session.user.id, speciesId: "cljwyppdl0000nsivbl8z6gpi" }, // castform sunny
        { userId: ctx.session.user.id, speciesId: "cljwyppdm0004nsivbpl1e6z8" }, // castform rainy
        { userId: ctx.session.user.id, speciesId: "cljwyppdm0008nsivni2547jo" }, // castform snowy
        { userId: ctx.session.user.id, speciesId: "clhu78np000ckns4ykjs1ybng" }, // walrein
        { userId: ctx.session.user.id, speciesId: "clhu78qa100dsns4yc0cgleqf" }, // metagross
        { userId: ctx.session.user.id, speciesId: "clhu78roo00egns4ykypkl78c" }, // kyogre
        { userId: ctx.session.user.id, speciesId: "k7njnnlah5nb25enytqc11x4" }, // primal kyogre
        { userId: ctx.session.user.id, speciesId: "cljuwt6yd002onsqrwj0exw05" }, // shellos west
        { userId: ctx.session.user.id, speciesId: "cljuxq2ib000kns1uca337dhg" }, // shellos east
        { userId: ctx.session.user.id, speciesId: "cln3kqfj10004nsmbge4ngd2j" }, // hippowdon female
        { userId: ctx.session.user.id, speciesId: "cljuwthiu005snsqrndwfocxc" }, // hippowdon male
        { userId: ctx.session.user.id, speciesId: "cljuwtr8q0090nsqrhbw3nxkz" }, // rotom
        { userId: ctx.session.user.id, speciesId: "cljuy74dd000sns1uenpabxgy" }, // rotom heat
        { userId: ctx.session.user.id, speciesId: "cljuy74dd000wns1ujwvalfj1" }, // rotom wash
        { userId: ctx.session.user.id, speciesId: "cljuy74dd0010ns1uk68ntzpx" }, // rotom frost
        { userId: ctx.session.user.id, speciesId: "cljuy74dd0014ns1ub2q2pyio" }, // rotom fan
        { userId: ctx.session.user.id, speciesId: "cljuy74de0018ns1uncx14ovw" }, // rotom mow
        { userId: ctx.session.user.id, speciesId: "cln26ctib0000ns4rsdmmdzu1" }, // vicitini
        { userId: ctx.session.user.id, speciesId: "cln26dfjv0068ns4rgq5n2epn" }, // basculin red striped
        { userId: ctx.session.user.id, speciesId: "cln26sao60000nshsau8x5snh" }, // basculin blue striped
        { userId: ctx.session.user.id, speciesId: "cln26dr7g009kns4r2czei6wo" }, // ducklett
        { userId: ctx.session.user.id, speciesId: "yuhe8mlzn1zthu5c6j82dg1z" }, // greninja
        { userId: ctx.session.user.id, speciesId: "g30cbiomlk2c9xjhofwrzo5s" }, // ash greninja
        { userId: ctx.session.user.id, speciesId: "c1fgrigg5jypq4q31mh801ce" }, // meowstic female
        { userId: ctx.session.user.id, speciesId: "ltczoemho73745k9w44k4u5b" }, // meowstic male])
      ]);

      await tx
        .update(profiles)
        .set({ instanceCount: 46 })
        .where(eq(profiles.username, env.TEST_UNAME1));
    });
    return { message: "Instances seeded successfully" };
  }),
});
