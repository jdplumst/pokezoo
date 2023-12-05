import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  HabitatList,
  MAX_BALANCE,
  MAX_YIELD,
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
} from "@/types/zod";
import { instance, profile, species } from "../../db/schema";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  lte,
  notInArray,
  or
} from "drizzle-orm";

export const instanceRouter = router({
  getInstanceSpecies: protectedProcedure.query(async ({ ctx }) => {
    const instances = await ctx.db
      .select({
        instanceId: instance.id,
        speciesId: species.id,
        region: species.region,
        shiny: species.shiny,
        rarity: species.rarity,
        habitat: species.habitat,
        typeOne: species.typeOne,
        typeTwo: species.typeTwo,
        name: species.name,
        img: species.img
      })
      .from(instance)
      .innerJoin(species, eq(instance.speciesId, species.id))
      .where(and(eq(instance.userId, ctx.session.user.id)))
      .orderBy(
        asc(species.pokedexNumber),
        asc(species.name),
        desc(species.shiny)
      );

    return { instances: instances };
  }),

  // Instances shown on Game page
  getGame: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.any().nullish(),
        order: ZodSort,
        shiny: z.boolean(),
        regions: z.array(ZodRegion),
        rarities: z.array(ZodRarity),
        types: z.array(ZodSpeciesType),
        habitats: z.array(ZodHabitat)
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;

      const instances = await ctx.db
        .select()
        .from(instance)
        .innerJoin(species, eq(instance.speciesId, species.id))
        .where(
          and(
            eq(instance.userId, ctx.session.user.id),
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
            input.order === "Oldest"
              ? gte(
                  instance.modifyDate,
                  input.cursor ?? new Date("2020-12-03 17:20:11.049")
                )
              : input.order === "Newest"
              ? lte(
                  instance.modifyDate,
                  input.cursor ?? new Date("2050-12-03 17:20:11.049")
                )
              : input.order === "Pokedex"
              ? gte(species.pokedexNumber, input.cursor ?? "")
              : input.order === "PokedexDesc"
              ? lte(species.pokedexNumber, input.cursor ?? "10000")
              : input.order === "Rarity"
              ? and(
                  gte(
                    species.pokedexNumber,
                    input.cursor && input.cursor.pokedexNumber
                      ? input.cursor.pokedexNumber
                      : ""
                  ),
                  gte(
                    species.rarity,
                    input.cursor && input.cursor.rarity
                      ? input.cursor.rarity
                      : ""
                  )
                )
              : input.order === "RarityDesc"
              ? lte(species.pokedexNumber, input.cursor ?? "")
              : undefined
          )
        )
        .orderBy(
          input.order === "Oldest"
            ? asc(instance.modifyDate)
            : input.order === "Newest"
            ? desc(instance.modifyDate)
            : input.order === "Pokedex"
            ? (asc(species.name), asc(species.pokedexNumber))
            : input.order === "PokedexDesc"
            ? (asc(species.name), desc(species.pokedexNumber))
            : input.order === "Rarity"
            ? (asc(species.name),
              asc(species.pokedexNumber),
              asc(species.rarity))
            : input.order === "RarityDesc"
            ? (asc(species.name),
              asc(species.pokedexNumber),
              desc(species.rarity))
            : asc(instance.id)
        )
        .limit(limit + 1);

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (instances.length > limit) {
        const nextItem = instances.pop();
        nextCursor =
          input.order === "Oldest" || input.order === "Newest"
            ? nextItem?.Instance.modifyDate
            : input.order === "Pokedex" || input.order === "PokedexDesc"
            ? nextItem?.Species.pokedexNumber
            : input.order === "Rarity" || input.order === "RarityDesc"
            ? {
                rarity: nextItem?.Species.rarity,
                pokedexNumber: nextItem?.Species.pokedexNumber
              }
            : nextItem?.Instance.id;
      }

      return { instances, nextCursor };
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
            totalYield: profile.totalYield,
            balance: profile.balance,
            instanceCount: profile.instanceCount
          })
          .from(profile)
          .where(eq(profile.userId, ctx.session.user.id))
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

      if (currUser.instanceCount >= 2000) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "You have reached your limit. Sell Pokémon if you want to buy more."
        });
      }
      const newYield =
        currUser.totalYield + speciesData.yield > MAX_YIELD
          ? MAX_YIELD
          : currUser.totalYield + speciesData.yield;

      await ctx.db
        .update(profile)
        .set({
          totalYield: newYield,
          balance: currUser.balance - input.cost,
          instanceCount: currUser.instanceCount + 1
        })
        .where(eq(profile.userId, ctx.session.user.id));

      await ctx.db
        .insert(instance)
        .values({ userId: ctx.session.user.id, speciesId: input.speciesId });

      const instanceData = (
        await ctx.db
          .select()
          .from(instance)
          .where(
            and(
              eq(instance.userId, ctx.session.user.id),
              eq(instance.speciesId, input.speciesId)
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
            totalYield: profile.totalYield,
            instanceCount: profile.instanceCount,
            commonCards: profile.commonCards,
            rareCards: profile.rareCards,
            epicCards: profile.epicCards,
            legendaryCards: profile.legendaryCards
          })
          .from(profile)
          .where(eq(profile.userId, ctx.session.user.id))
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
          .where(eq(species.id, input.speciesId))
      )[0];

      if (!speciesData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Species does not exist."
        });
      }

      if (
        (speciesData.rarity === "Common" &&
          !speciesData.shiny &&
          currUser.commonCards < WILDCARD_COST) ||
        (speciesData.rarity === "Common" &&
          speciesData.shiny &&
          currUser.commonCards < SHINY_WILDCARD_COST) ||
        (speciesData.rarity === "Rare" &&
          !speciesData.shiny &&
          currUser.rareCards < WILDCARD_COST) ||
        (speciesData.rarity === "Rare" &&
          speciesData.shiny &&
          currUser.rareCards < SHINY_WILDCARD_COST) ||
        (speciesData.rarity === "Epic" &&
          !speciesData.shiny &&
          currUser.epicCards < WILDCARD_COST) ||
        (speciesData.rarity === "Epic" &&
          speciesData.shiny &&
          currUser.epicCards < SHINY_WILDCARD_COST) ||
        (speciesData.rarity === "Legendary" &&
          !speciesData.shiny &&
          currUser.legendaryCards < WILDCARD_COST) ||
        (speciesData.rarity === "Legendary" &&
          speciesData.shiny &&
          currUser.legendaryCards < SHINY_WILDCARD_COST)
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You cannot afford this Pokémon."
        });
      }

      if (currUser.instanceCount >= 2000) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "You have reached your limit. Sell Pokémon if you want to buy more."
        });
      }

      const newYield =
        currUser.totalYield + speciesData.yield > MAX_YIELD
          ? MAX_YIELD
          : currUser.totalYield + speciesData.yield;

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(profile)
          .set({
            totalYield: newYield,
            commonCards:
              speciesData.rarity === "Common" && !speciesData.shiny
                ? currUser.commonCards - WILDCARD_COST
                : speciesData.rarity === "Common" && speciesData.shiny
                ? currUser.commonCards - SHINY_WILDCARD_COST
                : currUser.commonCards,
            rareCards:
              speciesData.rarity === "Rare" && !speciesData.shiny
                ? currUser.rareCards - WILDCARD_COST
                : speciesData.rarity === "Rare" && speciesData.shiny
                ? currUser.rareCards - SHINY_WILDCARD_COST
                : currUser.rareCards,
            epicCards:
              speciesData.rarity === "Epic" && !speciesData.shiny
                ? currUser.epicCards - WILDCARD_COST
                : speciesData.rarity === "Epic" && speciesData.shiny
                ? currUser.epicCards - SHINY_WILDCARD_COST
                : currUser.epicCards,
            legendaryCards:
              speciesData.rarity === "Legendary" && !speciesData.shiny
                ? currUser.legendaryCards - WILDCARD_COST
                : speciesData.rarity === "Legendary" && speciesData.shiny
                ? currUser.legendaryCards - SHINY_WILDCARD_COST
                : currUser.legendaryCards,
            instanceCount: currUser.instanceCount + 1
          })
          .where(eq(profile.userId, ctx.session.user.id));

        await tx
          .insert(instance)
          .values({ userId: ctx.session.user.id, speciesId: input.speciesId });
      });

      const instanceData = await ctx.db
        .select()
        .from(instance)
        .where(
          and(
            eq(instance.userId, ctx.session.user.id),
            eq(instance.speciesId, input.speciesId)
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
      for (let i of input.ids) {
        await ctx.db.transaction(async (tx) => {
          const exists = (
            await tx
              .select({ speciesId: instance.speciesId })
              .from(instance)
              .where(eq(instance.id, i))
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

          await tx.delete(instance).where(eq(instance.id, i));

          const currUser = (
            await tx
              .select()
              .from(profile)
              .where(eq(profile.userId, ctx.session.user.id))
          )[0];

          if (!currUser) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Not authorized to make this request"
            });
          }

          await tx
            .update(profile)
            .set({
              totalYield: currUser.totalYield - speciesData.yield,
              balance:
                currUser.balance + speciesData.sellPrice > MAX_BALANCE
                  ? MAX_BALANCE
                  : currUser.balance + speciesData.sellPrice,
              instanceCount: currUser.instanceCount - 1
            })
            .where(eq(profile.userId, ctx.session.user.id));
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
            totalYield: profile.totalYield,
            balance: profile.balance,
            instanceCount: profile.instanceCount,
            johtoStarter: profile.johtoStarter,
            hoennStarter: profile.hoennStarter,
            sinnohStarter: profile.sinnohStarter,
            unovaStarter: profile.unovaStarter
          })
          .from(profile)
          .where(eq(profile.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }

      if (input.region === "Johto" && currUser.johtoStarter) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have already received a Johto starter."
        });
      } else if (input.region === "Hoenn" && currUser.hoennStarter) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have already received a Hoenn starter."
        });
      } else if (input.region === "Sinnoh" && currUser.sinnohStarter) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have already received a Sinnoh starter."
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

      if (speciesData.region !== input.region) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Species does not come from ${input.region}`
        });
      }

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(profile)
          .set({
            totalYield: currUser.totalYield + speciesData.yield,
            instanceCount: currUser.instanceCount + 1,
            johtoStarter:
              input.region === "Johto" ? true : currUser.johtoStarter,
            hoennStarter:
              input.region === "Hoenn" ? true : currUser.hoennStarter,
            sinnohStarter:
              input.region === "Sinnoh" ? true : currUser.sinnohStarter,
            unovaStarter:
              input.region === "Unova" ? true : currUser.unovaStarter
          })
          .where(eq(profile.userId, ctx.session.user.id));

        await tx
          .insert(instance)
          .values({ userId: ctx.session.user.id, speciesId: input.speciesId });
      });

      return { message: "Successfully obtained starter" };
    })
});
