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

        // orderBy: {
        //   createDate:
        //     input.order === "Oldest"
        //       ? "asc"
        //       : input.order === "Newest"
        //       ? "desc"
        //       : undefined,
        //   species: {
        //     pokedexNumber: input.order === "Pokedex" ? "asc" : undefined,
        //     rarity: input.order === "Rarity" ? "asc" : undefined
        //   }
        // }
        // orderBy: [
        //   {
        //     createDate:
        //       input.order === "Oldest"
        //         ? "asc"
        //         : input.order === "Newest"
        //         ? "desc"
        //         : undefined
        //   },
        //   {
        //     species: {
        //       pokedexNumber: input.order === "Pokedex" ? "asc" : undefined
        //     }
        //   }
        //   // { species: { rarity: input.order === "Rarity" ? "asc" : undefined } }
        // ]
        // orderBy: [
        //   ...(input.order === "Oldest" ? )
        // input.order === "Newest" && { createDate: "desc" }
        // {
        //   ...(input.order === "Pokedex" && {
        //     species: { pokedexNumber: "asc" }
        //   })
        // },
        // { ...(input.order === "Rarity" && { species: { rarity: "asc" } }) }
        // ]
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
              shiny: true
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
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield + species.yield,
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
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield - species.yield,
          balance: currUser.balance + species.sellPrice,
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
        console.log("-----------------------");
        console.log(i);
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
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield - sumYield,
          balance: currUser.balance + sumSellPrice,
          instanceCount: currUser.instanceCount - input.ids.length
        }
      });
      return {
        instances: result,
        user: user
      };
    }),

  getJohto: protectedProcedure
    .input(
      z.object({
        speciesId: z.string(),
        userId: z.string(),
        cost: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          totalYield: true,
          balance: true,
          instanceCount: true,
          johtoStarter: true
        }
      });
      if (!currUser) {
        throw Error("Not authorized to make this request");
      }
      if (currUser.johtoStarter) {
        throw Error("You have already received a Johto starter.");
      }
      const species = await ctx.prisma.species.findUnique({
        where: {
          id: input.speciesId
        }
      });
      if (!species) {
        throw Error("Species does not exist.");
      }
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield + species.yield,
          balance: currUser.balance - input.cost,
          instanceCount: currUser.instanceCount + 1,
          johtoStarter: true
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

  getHoenn: protectedProcedure
    .input(
      z.object({
        speciesId: z.string(),
        userId: z.string(),
        cost: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          totalYield: true,
          balance: true,
          instanceCount: true,
          hoennStarter: true
        }
      });
      if (!currUser) {
        throw Error("Not authorized to make this request");
      }
      if (currUser.hoennStarter) {
        throw Error("You have already received a Hoenn starter.");
      }
      const species = await ctx.prisma.species.findUnique({
        where: {
          id: input.speciesId
        }
      });
      if (!species) {
        throw Error("Species does not exist.");
      }
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield + species.yield,
          balance: currUser.balance - input.cost,
          instanceCount: currUser.instanceCount + 1,
          hoennStarter: true
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

  getSinnoh: protectedProcedure
    .input(
      z.object({
        speciesId: z.string(),
        userId: z.string(),
        cost: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          totalYield: true,
          balance: true,
          instanceCount: true,
          sinnohStarter: true
        }
      });
      if (!currUser) {
        throw Error("Not authorized to make this request");
      }
      if (currUser.sinnohStarter) {
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
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          totalYield: currUser.totalYield + species.yield,
          balance: currUser.balance - input.cost,
          instanceCount: currUser.instanceCount + 1,
          sinnohStarter: true
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
