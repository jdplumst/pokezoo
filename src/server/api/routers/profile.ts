import { z } from "zod";
import { adminProcedure, protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { MAX_BALANCE } from "@/src/constants";
import { instances, profiles, userCharms } from "../../db/schema";
import { ZodTime } from "@/src/zod";
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
          catchingCharm: catchingCharm.charmId
        })
        .from(profiles)
        .leftJoin(
          catchingCharm,
          and(eq(profiles.userId, catchingCharm.userId), eq(catchingCharm.charmId, 1))
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
            markCharm: markCharm.charmId
          })
          .from(profiles)
          .leftJoin(markCharm, and(eq(profiles.userId, markCharm.userId), eq(markCharm.charmId, 2)))
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }

      const reward = Math.round(
        Math.random() *
        (0.125 * currUser.totalYield - 0.075 * currUser.totalYield) +
        0.075 * currUser.totalYield
      );
      const newBalance = reward > MAX_BALANCE ? MAX_BALANCE : reward;

      const loopNum = currUser.markCharm ? 3 : 1;
      const cards = { "Common": 0, "Rare": 0, "Epic": 0, "Legendary": 0 }
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
            message: "Daily reward already claimed"
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
            legendaryCards: currUser.legendaryCards + cards.Legendary
          })
          .where(eq(profiles.userId, ctx.session.user.id));
      } else {
        if (currUser.claimedNightly) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Nightly reward already claimed"
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
            legendaryCards: currUser.legendaryCards + cards.Legendary
          })
          .where(eq(profiles.userId, ctx.session.user.id));
      }

      return {
        reward: reward,
        cards: cards
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
          message: "Not authorized to make this request"
        });
      }

      if (input.username.length === 0 || input.username.length > 20) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username must be between 1 and 20 characters long"
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
          message: "Username is already taken"
        });
      }

      await ctx.db
        .update(profiles)
        .set({ username: input.username })
        .where(eq(profiles.userId, ctx.session.user.id));

      return { message: "Username set successfully" };
    }),

  resetTestAccounts: adminProcedure.query(async ({ ctx }) => {
    const test1 = (await ctx.db.select({ userId: profiles.userId })
      .from(profiles)
      .where(eq(profiles.username, env.TEST_UNAME1)))[0]

    const test2 = (await ctx.db.select({ userId: profiles.userId })
      .from(profiles)
      .where(eq(profiles.username, env.TEST_UNAME2)))[0]

    await ctx.db.delete(instances)
      .where(or(eq(instances.userId, test1.userId), eq(instances.userId, test2.userId)))

    await ctx.db.transaction(async (tx) => {

      await tx.insert(instances)
        .values([{ userId: test1.userId, speciesId: "clfyshzqj0004nsk4chot6pqs" }, // venusaur
        { userId: test1.userId, speciesId: "pe6bkapnh3epk8lamm66f09x" }, // mega venusaur
        { userId: test1.userId, speciesId: "clfysi0v0000insk4eftjqexl" }, // caterpie
        { userId: test1.userId, speciesId: "clfysi8xi0036nsk4ibiscs84" }, // growlithe
        { userId: test1.userId, speciesId: "clfysinxa007ynsk4zjeg92np" }, // articuno
        { userId: test1.userId, speciesId: "clfysip03008ansk4z1ydgeig" }, // mewtwo
        { userId: test1.userId, speciesId: "yjeup9ivefukn1ksdperh61j" }, // mega mewtwo x 
        { userId: test1.userId, speciesId: "oz37qaolixehlv3w9g7jfjuk" }, // mega mewtwo y 
        { userId: test1.userId, speciesId: "clgz4r0ug000ons60pauizq8x" }, // totodile
        { userId: test1.userId, speciesId: "clgz4sf630004nszczb8by3l4" }, // furret
        { userId: test1.userId, speciesId: "clgz4sj81001knszcs677k3ql" }, // togepi
        { userId: test1.userId, speciesId: "clgz4smhb002onszckmvcc5bh" }, // sudowoodo
        { userId: test1.userId, speciesId: "clgz4sq9d0040nszc87ar6163" }, // umbreon
        { userId: test1.userId, speciesId: "vwzl4l5v77gqa4xgq6tducpd" }, // heracross
        { userId: test1.userId, speciesId: "clgz4t5o50094nszcg9krd8rv" }, // raikou
        { userId: test1.userId, speciesId: "clgz4t7b9009onszcvjth7bn1" }, // tyranitar
        { userId: test1.userId, speciesId: "clgz4t7l5009snszcrw2g3dvt" }, // lugia
        { userId: test1.userId, speciesId: "clhu77xl20004ns4yybjj0na6" }, // grovyle
        { userId: test1.userId, speciesId: "clhu784as003cns4y0hhame7z" }, // gardevoir
        { userId: test1.userId, speciesId: "mdhkisuwk4l62nzqpu7cbpkx" }, // mega mawile
        { userId: test1.userId, speciesId: "clhu78ka900b0ns4y2rp3rcaf" }, // castform
        { userId: test1.userId, speciesId: "cljwyppdl0000nsivbl8z6gpi" }, // castform sunny
        { userId: test1.userId, speciesId: "cljwyppdm0004nsivbpl1e6z8" }, // castform rainy
        { userId: test1.userId, speciesId: "cljwyppdm0008nsivni2547jo" }, // castform snowy
        { userId: test1.userId, speciesId: "clhu78np000ckns4ykjs1ybng" }, // walrein
        { userId: test1.userId, speciesId: "clhu78qa100dsns4yc0cgleqf" }, // metagross
        { userId: test1.userId, speciesId: "clhu78roo00egns4ykypkl78c" }, // kyogre
        { userId: test1.userId, speciesId: "k7njnnlah5nb25enytqc11x4" }, // primal kyogre
        { userId: test1.userId, speciesId: "cljuwt6yd002onsqrwj0exw05" }, // shellos west
        { userId: test1.userId, speciesId: "cljuxq2ib000kns1uca337dhg" }, // shellos east
        { userId: test1.userId, speciesId: "cln3kqfj10004nsmbge4ngd2j" }, // hippowdon female
        { userId: test1.userId, speciesId: "cljuwthiu005snsqrndwfocxc" }, // hippowdon male
        { userId: test1.userId, speciesId: "cljuwtr8q0090nsqrhbw3nxkz" }, // rotom
        { userId: test1.userId, speciesId: "cljuy74dd000sns1uenpabxgy" }, // rotom heat 
        { userId: test1.userId, speciesId: "cljuy74dd000wns1ujwvalfj1" }, // rotom wash
        { userId: test1.userId, speciesId: "cljuy74dd0010ns1uk68ntzpx" }, // rotom frost
        { userId: test1.userId, speciesId: "cljuy74dd0014ns1ub2q2pyio" }, // rotom fan
        { userId: test1.userId, speciesId: "cljuy74de0018ns1uncx14ovw" }, // rotom mow
        { userId: test1.userId, speciesId: "cln26ctib0000ns4rsdmmdzu1" }, // vicitini
        { userId: test1.userId, speciesId: "cln26dfjv0068ns4rgq5n2epn" }, // basculin red striped
        { userId: test1.userId, speciesId: "cln26sao60000nshsau8x5snh" }, // basculin blue striped
        { userId: test1.userId, speciesId: "cln26dr7g009kns4r2czei6wo" }, // ducklett
        { userId: test1.userId, speciesId: "yuhe8mlzn1zthu5c6j82dg1z" }, // greninja
        { userId: test1.userId, speciesId: "g30cbiomlk2c9xjhofwrzo5s" }, // ash greninja
        { userId: test1.userId, speciesId: "c1fgrigg5jypq4q31mh801ce" }, // meowstic female
        { userId: test1.userId, speciesId: "ltczoemho73745k9w44k4u5b" } // meowstic male)
        ])

      await tx.update(profiles)
        .set({ instanceCount: 46, balance: 0, totalYield: 39310 })
        .where(eq(profiles.username, env.TEST_UNAME1))
    })

    await ctx.db.update(profiles)
      .set({ instanceCount: 0, balance: 0, totalYield: 0 })
      .where(eq(profiles.username, env.TEST_UNAME2))

    return { message: "Test accounts reset successfully" }
  }),
});
