import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  MAX_BALANCE,
  MAX_YIELD,
  SHINY_WILDCARD_COST,
  WILDCARD_COST
} from "@/src/constants";
import { ZodSort } from "@/types/zod";

export const instanceRouter = router({
  getInstances: protectedProcedure
    .input(
      z.object({
        distinct: z.boolean(),
        order: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const sort =
        input.order === "Oldest"
          ? { modifyDate: Prisma.SortOrder.asc }
          : input.order === "Newest"
          ? { modifyDate: Prisma.SortOrder.desc }
          : input.order === "Pokedex"
          ? [
              { species: { pokedexNumber: Prisma.SortOrder.asc } },
              { species: { name: Prisma.SortOrder.asc } }
            ]
          : [
              {
                species: {
                  rarity: Prisma.SortOrder.asc
                }
              },
              {
                species: {
                  pokedexNumber: Prisma.SortOrder.asc
                }
              },
              { species: { name: Prisma.SortOrder.asc } }
            ];
      const instances = await ctx.prisma.instance.findMany({
        where: { userId: ctx.session.user.id },
        distinct: input.distinct ? ["speciesId"] : undefined,
        orderBy: sort
      });

      return { instances: instances };
    }),

  getInstanceSpecies: protectedProcedure
    .input(z.object({ distinct: z.boolean() }))
    .query(async ({ ctx, input }) => {
      const instances = await ctx.prisma.instance.findMany({
        where: { userId: ctx.session.user.id.toString() },
        distinct: [input.distinct ? "speciesId" : "id"],
        include: {
          species: {
            select: {
              name: true,
              img: true,
              rarity: true,
              habitat: true,
              typeOne: true,
              typeTwo: true,
              generation: true,
              shiny: true,
              region: true
            }
          }
        },
        orderBy: [
          { species: { pokedexNumber: "asc" } },
          { species: { name: "asc" } },
          { species: { shiny: "desc" } }
        ]
      });

      return { instances: instances };
    }),

  // Instances shown on Game page
  getGame: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        order: ZodSort
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;

      const instances = await ctx.prisma.instance.findMany({
        take: limit + 1,
        include: { species: true },
        where: { userId: ctx.session.user.id },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy:
          input.order === "Oldest"
            ? { modifyDate: "asc" }
            : input.order === "Newest"
            ? { modifyDate: "desc" }
            : input.order === "Pokedex"
            ? [
                { species: { pokedexNumber: "asc" } },
                { species: { name: "asc" } }
              ]
            : input.order === "Rarity"
            ? [
                { species: { rarity: "asc" } },
                { species: { pokedexNumber: "asc" } },
                { species: { name: "asc" } }
              ]
            : undefined
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (instances.length > limit) {
        const nextItem = instances.pop();
        nextCursor = nextItem?.id;
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
      const currUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { totalYield: true, balance: true, instanceCount: true }
      });
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
      const species = await ctx.prisma.species.findUnique({
        where: {
          id: input.speciesId
        }
      });
      if (!species) {
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
        currUser.totalYield + species.yield > MAX_YIELD
          ? MAX_YIELD
          : currUser.totalYield + species.yield;
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: newYield,
          balance: currUser.balance - input.cost,
          instanceCount: currUser.instanceCount + 1
        }
      });
      const instance = await ctx.prisma.instance.create({
        data: { userId: ctx.session.user.id, speciesId: input.speciesId }
      });
      return {
        instance: instance,
        user: user
      };
    }),

  purchaseInstanceWithWildcards: protectedProcedure
    .input(
      z.object({
        speciesId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          totalYield: true,
          instanceCount: true,
          commonCards: true,
          rareCards: true,
          epicCards: true,
          legendaryCards: true
        }
      });
      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }
      const species = await ctx.prisma.species.findUnique({
        where: {
          id: input.speciesId
        }
      });
      if (!species) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Species does not exist."
        });
      }
      if (
        (species.rarity === "Common" &&
          !species.shiny &&
          currUser.commonCards < WILDCARD_COST) ||
        (species.rarity === "Common" &&
          species.shiny &&
          currUser.commonCards < SHINY_WILDCARD_COST) ||
        (species.rarity === "Rare" &&
          !species.shiny &&
          currUser.rareCards < WILDCARD_COST) ||
        (species.rarity === "Rare" &&
          species.shiny &&
          currUser.rareCards < SHINY_WILDCARD_COST) ||
        (species.rarity === "Epic" &&
          !species.shiny &&
          currUser.epicCards < WILDCARD_COST) ||
        (species.rarity === "Epic" &&
          species.shiny &&
          currUser.epicCards < SHINY_WILDCARD_COST) ||
        (species.rarity === "Legendary" &&
          !species.shiny &&
          currUser.legendaryCards < WILDCARD_COST) ||
        (species.rarity === "Legendary" &&
          species.shiny &&
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
        currUser.totalYield + species.yield > MAX_YIELD
          ? MAX_YIELD
          : currUser.totalYield + species.yield;
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: newYield,
          commonCards:
            species.rarity === "Common" && !species.shiny
              ? currUser.commonCards - WILDCARD_COST
              : species.rarity === "Common" && species.shiny
              ? currUser.commonCards - SHINY_WILDCARD_COST
              : currUser.commonCards,
          rareCards:
            species.rarity === "Rare" && !species.shiny
              ? currUser.rareCards - WILDCARD_COST
              : species.rarity === "Rare" && species.shiny
              ? currUser.rareCards - SHINY_WILDCARD_COST
              : currUser.rareCards,
          epicCards:
            species.rarity === "Epic" && !species.shiny
              ? currUser.epicCards - WILDCARD_COST
              : species.rarity === "Epic" && species.shiny
              ? currUser.epicCards - SHINY_WILDCARD_COST
              : currUser.epicCards,
          legendaryCards:
            species.rarity === "Legendary" && !species.shiny
              ? currUser.legendaryCards - WILDCARD_COST
              : species.rarity === "Legendary" && species.shiny
              ? currUser.legendaryCards - SHINY_WILDCARD_COST
              : currUser.legendaryCards,
          instanceCount: currUser.instanceCount + 1
        }
      });
      const instance = await ctx.prisma.instance.create({
        data: { userId: ctx.session.user.id, speciesId: input.speciesId }
      });
      return {
        instance: instance,
        user: user
      };
    }),

  sellInstance: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { totalYield: true, balance: true, instanceCount: true }
      });
      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }
      const exists = await ctx.prisma.instance.findUnique({
        where: { id: input.id },
        select: { speciesId: true }
      });
      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Instance does not exist."
        });
      }
      const species = await ctx.prisma.species.findUnique({
        where: { id: exists.speciesId }
      });
      if (!species) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Species does not exist."
        });
      }
      const newBalance =
        currUser.balance + species.sellPrice > MAX_BALANCE
          ? MAX_BALANCE
          : currUser.balance + species.sellPrice;
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield - species.yield,
          balance: newBalance,
          instanceCount: currUser.instanceCount - 1
        }
      });
      const instance = await ctx.prisma.instance.delete({
        where: { id: input.id }
      });
      return {
        instance: instance,
        user: user
      };
    }),

  sellInstances: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string())
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = [];
      const currUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { totalYield: true, balance: true, instanceCount: true }
      });
      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }
      let sumYield = 0;
      let sumSellPrice = 0;
      for (let i of input.ids) {
        const exists = await ctx.prisma.instance.findUnique({
          where: { id: i },
          select: { speciesId: true }
        });
        if (!exists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Instance does not exist."
          });
        }
        const species = await ctx.prisma.species.findUnique({
          where: { id: exists.speciesId }
        });
        if (!species) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Species does not exist."
          });
        }
        sumYield += species.yield;
        sumSellPrice += species.sellPrice;
        const instance = await ctx.prisma.instance.delete({
          where: { id: i }
        });
        result.push(instance.id);
      }
      const newBalance =
        currUser.balance + sumSellPrice > MAX_BALANCE
          ? MAX_BALANCE
          : currUser.balance + sumSellPrice;
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield - sumYield,
          balance: newBalance,
          instanceCount: currUser.instanceCount - input.ids.length
        }
      });
      return {
        instances: result,
        user: user
      };
    }),

  getStarter: protectedProcedure
    .input(
      z.object({
        speciesId: z.string(),
        region: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          totalYield: true,
          balance: true,
          instanceCount: true,
          johtoStarter: true,
          hoennStarter: true,
          sinnohStarter: true,
          unovaStarter: true
        }
      });
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
      const species = await ctx.prisma.species.findUnique({
        where: {
          id: input.speciesId
        }
      });
      if (!species) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Species does not exist."
        });
      }
      if (species.region !== input.region) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Species does not come from ${input.region}`
        });
      }
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield + species.yield,
          instanceCount: currUser.instanceCount + 1,
          johtoStarter: input.region === "Johto" ? true : currUser.johtoStarter,
          hoennStarter: input.region === "Hoenn" ? true : currUser.hoennStarter,
          sinnohStarter:
            input.region === "Sinnoh" ? true : currUser.sinnohStarter,
          unovaStarter: input.region === "Unova" ? true : currUser.unovaStarter
        }
      });
      const instance = await ctx.prisma.instance.create({
        data: { userId: ctx.session.user.id, speciesId: input.speciesId }
      });
      return {
        instance: instance,
        user: user
      };
    })
});
