import { z } from "zod";
import { adminProcedure, protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { MAX_BALANCE } from "@/src/constants";
import { instances, profiles, userCharms } from "../../db/schema";
import { ZodRarity, ZodTime } from "@/src/zod";
import { and, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { env } from "@/src/env";

export const profileRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const catchingCharm = alias(userCharms, "catchingCharm");

    const profileData = (
      await ctx.db
        .select({
          id: profiles.id,
          username: profiles.username,
          admin: profiles.admin,
          totalYield: profiles.totalYield,
          balance: profiles.balance,
          instanceCount: profiles.instanceCount,
          claimedDaily: profiles.claimedDaily,
          claimedNightly: profiles.claimedNightly,
          claimedEvent: profiles.claimedEvent,
          commonCards: profiles.commonCards,
          rareCards: profiles.rareCards,
          epicCards: profiles.epicCards,
          legendaryCards: profiles.legendaryCards,
          johtoStarter: profiles.johtoStarter,
          hoennStarter: profiles.hoennStarter,
          sinnohStarter: profiles.sinnohStarter,
          unovaStarter: profiles.unovaStarter,
          kalosStarter: profiles.kalosStarter,
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

    return profileData;
  }),

  claimReward: protectedProcedure
    .input(z.object({ time: ZodTime }))
    .mutation(async ({ ctx, input }) => {
      const markCharm = alias(userCharms, "markCharm");

      const currUser = (
        await ctx.db
          .select({
            balance: profiles.balance,
            claimedDaily: profiles.claimedDaily,
            claimedNightly: profiles.claimedNightly,
            totalYield: profiles.totalYield,
            commonCards: profiles.commonCards,
            rareCards: profiles.rareCards,
            epicCards: profiles.epicCards,
            legendaryCards: profiles.legendaryCards,
            markCharm: markCharm.charmId,
          })
          .from(profiles)
          .leftJoin(
            markCharm,
            and(
              eq(profiles.userId, markCharm.userId),
              eq(markCharm.charmId, 2),
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

      const reward = Math.round(
        Math.random() *
          (0.125 * currUser.totalYield - 0.075 * currUser.totalYield) +
          0.075 * currUser.totalYield,
      );
      const newBalance = reward > MAX_BALANCE ? MAX_BALANCE : reward;

      const loopNum = currUser.markCharm ? 3 : 1;
      const cards = { Common: 0, Rare: 0, Epic: 0, Legendary: 0 };
      for (let i = 0; i < loopNum; i++) {
        const random = Math.random();
        if (random < 0.5) {
          cards.Common += 1;
        } else if (random < 0.85) {
          cards.Rare += 1;
        } else if (random < 0.99) {
          cards.Epic += 1;
        } else {
          cards.Legendary += 1;
        }
      }

      if (input.time === "day") {
        if (currUser.claimedDaily) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Daily reward already claimed",
          });
        }
        await ctx.db
          .update(profiles)
          .set({
            balance: currUser.balance + newBalance,
            claimedDaily: true,
            commonCards: currUser.commonCards + cards.Common,
            rareCards: currUser.rareCards + cards.Rare,
            epicCards: currUser.epicCards + cards.Epic,
            legendaryCards: currUser.legendaryCards + cards.Legendary,
          })
          .where(eq(profiles.userId, ctx.session.user.id));
      } else {
        if (currUser.claimedNightly) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Nightly reward already claimed",
          });
        }
        await ctx.db
          .update(profiles)
          .set({
            balance: currUser.balance + newBalance,
            claimedNightly: true,
            commonCards: currUser.commonCards + cards.Common,
            rareCards: currUser.rareCards + cards.Rare,
            epicCards: currUser.epicCards + cards.Epic,
            legendaryCards: currUser.legendaryCards + cards.Legendary,
          })
          .where(eq(profiles.userId, ctx.session.user.id));
      }

      return {
        reward: reward,
        cards: cards,
      };
    }),

  selectUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currUser = (
        await ctx.db
          .select({ username: profiles.username })
          .from(profiles)
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request",
        });
      }

      if (input.username.length === 0 || input.username.length > 20) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username must be between 1 and 20 characters long",
        });
      }

      const exists = (
        await ctx.db
          .select({ username: profiles.username })
          .from(profiles)
          .where(eq(profiles.username, input.username))
      )[0];
      if (
        exists &&
        exists.username?.toLowerCase() === input.username.toLowerCase()
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username is already taken",
        });
      }

      await ctx.db
        .update(profiles)
        .set({ username: input.username })
        .where(eq(profiles.userId, ctx.session.user.id));

      return { message: "Username set successfully" };
    }),

  purchaseWildcards: protectedProcedure
    .input(
      z.object({
        tradedCard: ZodRarity,
        purchasedCard: ZodRarity,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currUser = (
        await ctx.db
          .select({
            commonCards: profiles.commonCards,
            rareCards: profiles.rareCards,
            epicCards: profiles.epicCards,
            legendaryCards: profiles.legendaryCards,
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

      switch (input.tradedCard + ", " + input.purchasedCard) {
        case "Common, Rare":
          if (currUser.commonCards < 2) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You cannot afford this wildcard",
            });
          }
          await ctx.db
            .update(profiles)
            .set({
              commonCards: currUser.commonCards - 2,
              rareCards: currUser.rareCards + 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
          break;

        case "Common, Epic":
          if (currUser.commonCards < 4) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You cannot afford this wildcard",
            });
          }
          await ctx.db
            .update(profiles)
            .set({
              commonCards: currUser.commonCards - 4,
              epicCards: currUser.epicCards + 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
          break;

        case "Common, Legendary":
          if (currUser.commonCards < 50) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You cannot afford this wildcard",
            });
          }
          await ctx.db
            .update(profiles)
            .set({
              commonCards: currUser.commonCards - 50,
              legendaryCards: currUser.legendaryCards + 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
          break;

        case "Rare, Common":
          if (currUser.rareCards < 1) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You cannot afford this wildcard",
            });
          }
          await ctx.db
            .update(profiles)
            .set({
              rareCards: currUser.rareCards - 1,
              commonCards: currUser.commonCards + 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
          break;

        case "Rare, Epic":
          if (currUser.rareCards < 3) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You cannot afford this wildcard",
            });
          }
          await ctx.db
            .update(profiles)
            .set({
              rareCards: currUser.rareCards - 3,
              epicCards: currUser.epicCards + 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
          break;

        case "Rare, Legendary":
          if (currUser.rareCards < 35) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You cannot afford this wildcard",
            });
          }
          await ctx.db
            .update(profiles)
            .set({
              rareCards: currUser.rareCards - 35,
              legendaryCards: currUser.legendaryCards + 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
          break;

        case "Epic, Common":
          if (currUser.epicCards < 1) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You cannot afford this wildcard",
            });
          }
          await ctx.db
            .update(profiles)
            .set({
              epicCards: currUser.epicCards - 1,
              commonCards: currUser.commonCards + 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
          break;

        case "Epic, Rare":
          if (currUser.epicCards < 1) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You cannot afford this wildcard",
            });
          }
          await ctx.db
            .update(profiles)
            .set({
              epicCards: currUser.epicCards - 1,
              rareCards: currUser.rareCards + 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
          break;

        case "Epic, Legendary":
          if (currUser.epicCards < 15) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You cannot afford this wildcard",
            });
          }
          await ctx.db
            .update(profiles)
            .set({
              epicCards: currUser.epicCards - 15,
              legendaryCards: currUser.legendaryCards + 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
          break;

        case "Legendary, Common":
          if (currUser.legendaryCards < 1) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You cannot afford this wildcard",
            });
          }
          await ctx.db
            .update(profiles)
            .set({
              legendaryCards: currUser.legendaryCards - 1,
              commonCards: currUser.commonCards + 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
          break;

        case "Legendary, Rare":
          if (currUser.legendaryCards < 1) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You cannot afford this wildcard",
            });
          }
          await ctx.db
            .update(profiles)
            .set({
              legendaryCards: currUser.legendaryCards - 1,
              rareCards: currUser.rareCards + 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
          break;

        case "Legendary, Epic":
          if (currUser.legendaryCards < 1) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "You cannot afford this wildcard",
            });
          }
          await ctx.db
            .update(profiles)
            .set({
              legendaryCards: currUser.legendaryCards - 1,
              epicCards: currUser.epicCards + 1,
            })
            .where(eq(profiles.userId, ctx.session.user.id));
          break;

        default:
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid wildcard trade",
          });
      }

      return {
        message: "Successfully traded wildcard",
      };
    }),

  resetTestAccounts: adminProcedure.query(async ({ ctx }) => {
    const test1 = (
      await ctx.db
        .select({ userId: profiles.userId })
        .from(profiles)
        .where(eq(profiles.username, env.TEST_UNAME1))
    )[0];

    const test2 = (
      await ctx.db
        .select({ userId: profiles.userId })
        .from(profiles)
        .where(eq(profiles.username, env.TEST_UNAME2))
    )[0];

    await ctx.db
      .delete(instances)
      .where(
        or(
          eq(instances.userId, test1.userId),
          eq(instances.userId, test2.userId),
        ),
      );

    await ctx.db.transaction(async (tx) => {
      await tx.insert(instances).values([
        {
          userId: test1.userId,
          speciesId: "clfyshzqj0004nsk4chot6pqs",
          modifyDate: new Date("2025-01-10"),
        }, // venusaur
        {
          userId: test1.userId,
          speciesId: "pe6bkapnh3epk8lamm66f09x",
          modifyDate: new Date("2025-01-09"),
        }, // mega venusaur
        {
          userId: test1.userId,
          speciesId: "clfysi0v0000insk4eftjqexl",
          modifyDate: new Date("2025-02-01"),
        }, // caterpie
        {
          userId: test1.userId,
          speciesId: "clfysi8xi0036nsk4ibiscs84",
          modifyDate: new Date("2025-02-25"),
        }, // growlithe
        {
          userId: test1.userId,
          speciesId: "clfysinxa007ynsk4zjeg92np",
          modifyDate: new Date("2025-01-01"),
        }, // articuno
        {
          userId: test1.userId,
          speciesId: "clfysip03008ansk4z1ydgeig",
          modifyDate: new Date("2025-01-03"),
        }, // mewtwo
        {
          userId: test1.userId,
          speciesId: "yjeup9ivefukn1ksdperh61j",
          modifyDate: new Date("2025-01-07"),
        }, // mega mewtwo x
        {
          userId: test1.userId,
          speciesId: "oz37qaolixehlv3w9g7jfjuk",
          modifyDate: new Date("2025-01-20"),
        }, // mega mewtwo y
        {
          userId: test1.userId,
          speciesId: "clgz4r0ug000ons60pauizq8x",
          modifyDate: new Date("2025-02-15"),
        }, // totodile
        {
          userId: test1.userId,
          speciesId: "clgz4sf630004nszczb8by3l4",
          modifyDate: new Date("2025-03-21"),
        }, // furret
        {
          userId: test1.userId,
          speciesId: "clgz4sj81001knszcs677k3ql",
          modifyDate: new Date("2025-01-08"),
        }, // togepi
        {
          userId: test1.userId,
          speciesId: "clgz4smhb002onszckmvcc5bh",
          modifyDate: new Date("2025-01-11"),
        }, // sudowoodo
        {
          userId: test1.userId,
          speciesId: "clgz4sq9d0040nszc87ar6163",
          modifyDate: new Date("2025-02-11"),
        }, // umbreon
        {
          userId: test1.userId,
          speciesId: "vwzl4l5v77gqa4xgq6tducpd",
          modifyDate: new Date("2025-03-11"),
        }, // heracross
        {
          userId: test1.userId,
          speciesId: "clgz4t5o50094nszcg9krd8rv",
          modifyDate: new Date("2025-02-12"),
        }, // raikou
        {
          userId: test1.userId,
          speciesId: "clgz4t7b9009onszcvjth7bn1",
          modifyDate: new Date("2025-03-12"),
        }, // tyranitar
        {
          userId: test1.userId,
          speciesId: "clgz4t7l5009snszcrw2g3dvt",
          modifyDate: new Date("2025-01-25"),
        }, // lugia
        {
          userId: test1.userId,
          speciesId: "clhu77xl20004ns4yybjj0na6",
          modifyDate: new Date("2025-08-01"),
        }, // grovyle
        {
          userId: test1.userId,
          speciesId: "clhu784as003cns4y0hhame7z",
          modifyDate: new Date("2025-07-01"),
        }, // gardevoir
        {
          userId: test1.userId,
          speciesId: "mdhkisuwk4l62nzqpu7cbpkx",
          modifyDate: new Date("2025-05-01"),
        }, // mega mawile
        {
          userId: test1.userId,
          speciesId: "clhu78ka900b0ns4y2rp3rcaf",
          modifyDate: new Date("2025-05-02"),
        }, // castform
        {
          userId: test1.userId,
          speciesId: "cljwyppdl0000nsivbl8z6gpi",
          modifyDate: new Date("2025-12-01"),
        }, // castform sunny
        {
          userId: test1.userId,
          speciesId: "cljwyppdm0004nsivbpl1e6z8",
          modifyDate: new Date("2025-11-01"),
        }, // castform rainy
        {
          userId: test1.userId,
          speciesId: "cljwyppdm0008nsivni2547jo",
          modifyDate: new Date("2025-11-11"),
        }, // castform snowy
        {
          userId: test1.userId,
          speciesId: "clhu78np000ckns4ykjs1ybng",
          modifyDate: new Date("2025-06-01"),
        }, // walrein
        {
          userId: test1.userId,
          speciesId: "clhu78qa100dsns4yc0cgleqf",
          modifyDate: new Date("2025-10-01"),
        }, // metagross
        {
          userId: test1.userId,
          speciesId: "clhu78roo00egns4ykypkl78c",
          modifyDate: new Date("2025-01-17"),
        }, // kyogre
        {
          userId: test1.userId,
          speciesId: "k7njnnlah5nb25enytqc11x4",
          modifyDate: new Date("2025-03-17"),
        }, // primal kyogre
        {
          userId: test1.userId,
          speciesId: "cljuwt6yd002onsqrwj0exw05",
          modifyDate: new Date("2025-02-17"),
        }, // shellos west
        {
          userId: test1.userId,
          speciesId: "cljuxq2ib000kns1uca337dhg",
          modifyDate: new Date("2025-04-02"),
        }, // shellos east
        {
          userId: test1.userId,
          speciesId: "cln3kqfj10004nsmbge4ngd2j",
          modifyDate: new Date("2025-05-20"),
        }, // hippowdon female
        {
          userId: test1.userId,
          speciesId: "cljuwthiu005snsqrndwfocxc",
          modifyDate: new Date("2025-04-20"),
        }, // hippowdon male
        {
          userId: test1.userId,
          speciesId: "cljuwtr8q0090nsqrhbw3nxkz",
          modifyDate: new Date("2025-04-11"),
        }, // rotom
        {
          userId: test1.userId,
          speciesId: "cljuy74dd000sns1uenpabxgy",
          modifyDate: new Date("2025-04-21"),
        }, // rotom heat
        {
          userId: test1.userId,
          speciesId: "cljuy74dd000wns1ujwvalfj1",
          modifyDate: new Date("2025-01-19"),
        }, // rotom wash
        {
          userId: test1.userId,
          speciesId: "cljuy74dd0010ns1uk68ntzpx",
          modifyDate: new Date("2025-03-19"),
        }, // rotom frost
        {
          userId: test1.userId,
          speciesId: "cljuy74dd0014ns1ub2q2pyio",
          modifyDate: new Date("2025-04-25"),
        }, // rotom fan
        {
          userId: test1.userId,
          speciesId: "cljuy74de0018ns1uncx14ovw",
          modifyDate: new Date("2025-05-25"),
        }, // rotom mow
        {
          userId: test1.userId,
          speciesId: "cln26ctib0000ns4rsdmmdzu1",
          modifyDate: new Date("2025-04-03"),
        }, // vicitini
        {
          userId: test1.userId,
          speciesId: "cln26dfjv0068ns4rgq5n2epn",
          modifyDate: new Date("2025-02-08"),
        }, // basculin red striped
        {
          userId: test1.userId,
          speciesId: "cln26sao60000nshsau8x5snh",
          modifyDate: new Date("2025-03-08"),
        }, // basculin blue striped
        {
          userId: test1.userId,
          speciesId: "cln26dr7g009kns4r2czei6wo",
          modifyDate: new Date("2025-04-08"),
        }, // ducklett
        {
          userId: test1.userId,
          speciesId: "yuhe8mlzn1zthu5c6j82dg1z",
          modifyDate: new Date("2025-01-22"),
        }, // greninja
        {
          userId: test1.userId,
          speciesId: "g30cbiomlk2c9xjhofwrzo5s",
          modifyDate: new Date("2025-01-23"),
        }, // ash greninja
        {
          userId: test1.userId,
          speciesId: "c1fgrigg5jypq4q31mh801ce",
          modifyDate: new Date("2025-02-22"),
        }, // meowstic female
        {
          userId: test1.userId,
          speciesId: "ltczoemho73745k9w44k4u5b",
          modifyDate: new Date("2025-03-22"),
        }, // meowstic male)
      ]);

      await tx
        .update(profiles)
        .set({ instanceCount: 46, balance: 0, totalYield: 39310 })
        .where(eq(profiles.username, env.TEST_UNAME1));
    });

    await ctx.db
      .update(profiles)
      .set({ instanceCount: 0, balance: 0, totalYield: 0 })
      .where(eq(profiles.username, env.TEST_UNAME2));

    return { message: "Test accounts reset successfully" };
  }),
});
