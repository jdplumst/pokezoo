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
  trades,
  types,
  userCharms
} from "../../db/schema";
import { and, asc, desc, eq, inArray, notInArray, or, sql } from "drizzle-orm";
import { calcNewYield } from "@/src/utils/calcNewYield";
import { withinInstanceLimit } from "@/src/utils/withinInstanceLimit";
import { alias } from "drizzle-orm/pg-core";
import { env } from "@/src/env";

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

      let rarityCursor;
      switch (input.cursor?.rarity) {
        case "Common":
          rarityCursor = 1
          break
        case "Rare":
          rarityCursor = 2
          break
        case "Epic":
          rarityCursor = 3
          break
        case "Legendary":
          rarityCursor = 4
          break
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
              ? sql`${instances.modifyDate} >= ${input.cursor?.modifyDate ??
                new Date("2020-12-03 17:20:11.049")
                }`
              : input.order === "Newest"
                ? sql`${instances.modifyDate} <= ${input.cursor?.modifyDate ??
                  new Date("2050-12-03 17:20:11.049")
                  }`
                : input.order === "Pokedex"
                  ? sql`(${species.pokedexNumber}, ${rarities.id} ,${species.name}, ${instances.modifyDate
                    }) >= (${input.cursor?.pokedexNumber ?? 0}, ${rarityCursor ?? 0}, ${input.cursor?.name ?? ""
                    }, ${input.cursor?.modifyDate ??
                    new Date("2020-12-03 17:20:11.049")
                    })`
                  : input.order === "PokedexDesc"
                    ? sql`(${species.pokedexNumber}, ${rarities.id}, ${species.name}, ${instances.modifyDate
                      }) <= (${input.cursor?.pokedexNumber ?? 10000}, ${rarityCursor ?? 10}, ${input.cursor?.name ?? "{"
                      }, ${input.cursor?.modifyDate ??
                      new Date("2050-12-03 17:20:11.049")
                      })`
                    : input.order === "Rarity"
                      ? sql`(${rarities.id}, ${species.pokedexNumber}, ${species.name
                        }, ${instances.modifyDate}) >= (${rarityCursor ?? 0}, ${input.cursor?.pokedexNumber ?? 0
                        }, ${input.cursor?.name ?? ""}, ${input.cursor?.modifyDate ??
                        new Date("2020-12-03 17:20:11.049")
                        })`
                      : input.order === "RarityDesc"
                        ? sql`(${rarities.id}, ${species.pokedexNumber}, ${species.name
                          }, ${instances.modifyDate}) <= (${rarityCursor ?? 10}, ${input.cursor?.pokedexNumber ?? 10000
                          }, ${input.cursor?.name ?? "{"}, ${input.cursor?.modifyDate ??
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
                ? sql`${species.pokedexNumber} asc, ${rarities.id} asc, ${species.name} asc, ${instances.modifyDate} asc`
                : input.order === "PokedexDesc"
                  ? sql`${species.pokedexNumber} desc, ${rarities.id} desc, ${species.name} desc, ${instances.modifyDate} desc`
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
            : {
              modifyDate: nextItem.instance.modifyDate,
              name: nextItem.name,
              pokedexNumber: nextItem.pokedexNumber,
              rarity: nextItem.rarity
            }
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
      const catchingCharm = alias(userCharms, "catchingCharm");
      const currUser = (
        await ctx.db
          .select({
            totalYield: profiles.totalYield,
            balance: profiles.balance,
            instanceCount: profiles.instanceCount,
            catchingCharm: catchingCharm.charmId
          })
          .from(profiles)
          .leftJoin(
            catchingCharm,
            and(eq(profiles.userId, catchingCharm.userId), eq(catchingCharm.charmId, 1))
          )
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

      if (!withinInstanceLimit(currUser.instanceCount, !!currUser.catchingCharm)) {
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
            catchingCharm: catchingCharm.charmId
          })
          .from(profiles)
          .leftJoin(
            catchingCharm,
            and(eq(profiles.userId, catchingCharm.userId), eq(catchingCharm.charmId, 1))
          )
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

      if (!withinInstanceLimit(currUser.instanceCount, !!currUser.catchingCharm)) {
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
              .select({ id: instances.id, speciesId: instances.speciesId })
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

          await tx.update(trades)
            .set({ offererId: null, offererInstanceId: null })
            .where(eq(trades.offererInstanceId, exists.id))

          await tx.delete(trades).where(eq(trades.initiatorInstanceId, exists.id))

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
          claimedEvent: true
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

      await tx.insert(instances)
        .values([{ userId: ctx.session.user.id, speciesId: "clfyshzqj0004nsk4chot6pqs" }, // venusaur
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
        { userId: ctx.session.user.id, speciesId: "ltczoemho73745k9w44k4u5b" } // meowstic male])
        ])

      await tx.update(profiles)
        .set({ instanceCount: 46 })
        .where(eq(profiles.username, env.TEST_UNAME1))
    })
    return { message: "Instances seeded successfully" };
  })
})
