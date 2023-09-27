import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { Prisma } from "@prisma/client";

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
          ? { createDate: Prisma.SortOrder.asc }
          : input.order === "Newest"
          ? { createDate: Prisma.SortOrder.desc }
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

  // getInfiniteInstances: protectedProcedure
  //   .input(
  //     z.object({
  //       limit: z.number().min(1).max(100),
  //       cursor: z.string().nullish(),
  //       order: z.string()
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const instances = await ctx.prisma.instance.findMany({
  //       take: input.limit + 1,
  //       where: { userId: ctx.session.user.id },
  //       cursor: { id: input.cursor ? input.cursor : undefined },
  // orderBy: [
  //   {
  //     createDate:
  //       input.order === "oldest"
  //         ? "asc"
  //         : input.order === "newest"
  //         ? "desc"
  //         : undefined
  //   },
  //   {
  //     species: {
  //       pokedexNumber: input.order === "pokdex" ? "asc" : undefined,
  //       rarity: input.order === "rarity" ? "asc" : undefined
  //     }
  //   }
  // ]
  //     });

  //     let nextCursor: typeof input.cursor | undefined = undefined;
  //     if (instances.length > input.limit) {
  //       const nextItem = instances.pop();
  //       nextCursor = nextItem!.id;
  //     }
  //     return { instances: instances, nextCursor: nextCursor };
  //   }),

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

  purchaseInstance: protectedProcedure
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
        throw Error("Not authorized to make this request");
      }
      if (currUser.balance < input.cost) {
        throw Error("You cannot afford this ball.");
      }
      const species = await ctx.prisma.species.findUnique({
        where: {
          id: input.speciesId
        }
      });
      if (!species) {
        throw Error("Species does not exist.");
      }
      if (currUser.instanceCount >= 2000) {
        throw Error(
          "You have reached your limit. Sell Pokémon if you want to buy more."
        );
      }
      const newYield =
        currUser.totalYield + species.yield > 1000000000
          ? 1000000000
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
        throw Error("Not authorized to make this request");
      }
      const exists = await ctx.prisma.instance.findUnique({
        where: { id: input.id },
        select: { speciesId: true }
      });
      if (!exists) {
        throw Error("Instance does not exist.");
      }
      const species = await ctx.prisma.species.findUnique({
        where: { id: exists.speciesId }
      });
      if (!species) {
        throw Error("Species does not exist.");
      }
      const newBalance =
        currUser.balance + species.sellPrice > 1000000000
          ? 1000000000
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
        throw Error("Not authorized to make this request");
      }
      let sumYield = 0;
      let sumSellPrice = 0;
      for (let i of input.ids) {
        const exists = await ctx.prisma.instance.findUnique({
          where: { id: i },
          select: { speciesId: true }
        });
        if (!exists) {
          throw Error("Instance does not exist.");
        }
        const species = await ctx.prisma.species.findUnique({
          where: { id: exists.speciesId }
        });
        if (!species) {
          throw Error("Species does not exist.");
        }
        sumYield += species.yield;
        sumSellPrice += species.sellPrice;
        const instance = await ctx.prisma.instance.delete({
          where: { id: i }
        });
        result.push(instance.id);
      }
      const newBalance =
        currUser.balance + sumSellPrice > 1000000000
          ? 1000000000
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
          sinnohStarter: true
        }
      });
      if (!currUser) {
        throw Error("Not authorized to make this request");
      }
      if (input.region === "Johto" && currUser.johtoStarter) {
        throw Error("You have already received a Johto starter.");
      } else if (input.region === "Hoenn" && currUser.hoennStarter) {
        throw Error("You have already received a Hoenn starter.");
      } else if (input.region === "Sinnoh" && currUser.sinnohStarter) {
        throw Error("You have already received a Sinnoh starter.");
      }
      const species = await ctx.prisma.species.findUnique({
        where: {
          id: input.speciesId
        }
      });
      if (!species) {
        throw Error("Species does not exist.");
      }
      if (species.region !== input.region) {
        throw Error(`Species does not come from ${input.region}`);
      }
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield + species.yield,
          instanceCount: currUser.instanceCount + 1,
          johtoStarter: input.region === "Johto" ? true : currUser.johtoStarter,
          hoennStarter: input.region === "Hoenn" ? true : currUser.hoennStarter,
          sinnohStarter:
            input.region === "Sinnoh" ? true : currUser.sinnohStarter
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
