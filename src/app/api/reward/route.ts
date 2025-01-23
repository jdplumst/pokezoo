import { authOptions } from "@/src/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { alias } from "drizzle-orm/pg-core";
import "server-only";
import { and, eq } from "drizzle-orm";
import { MAX_BALANCE } from "@/src/constants";
import { profiles, userCharms } from "@/src/server/db/schema";
import { db } from "@/src/server/db";
import { z } from "zod";
import { ZodTime } from "@/src/zod";

export async function POST(req: Request) {
  const bodySchema = z.object({
    time: ZodTime,
  });

  const bodyData = await req.json();
  const body = bodySchema.safeParse(bodyData);

  if (body.error) {
    return Response.json({
      error: "Something went wrong. Please try again.",
    });
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({
      error: "You are not authorized to claim this reward.",
    });
  }

  const markCharm = alias(userCharms, "markCharm");

  const currProfile = (
    await db
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
        and(eq(profiles.userId, markCharm.userId), eq(markCharm.charmId, 2)),
      )
      .where(eq(profiles.userId, session.user.id))
  )[0];

  if (!currProfile) {
    return Response.json({
      error: "You are not authorized to claim this reward.",
    });
  }

  const reward = Math.round(
    Math.random() *
      (0.125 * currProfile.totalYield - 0.075 * currProfile.totalYield) +
      0.075 * currProfile.totalYield,
  );
  const newBalance = reward > MAX_BALANCE ? MAX_BALANCE : reward;

  const loopNum = currProfile.markCharm ? 3 : 1;
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

  if (body.data.time === "day") {
    if (currProfile.claimedDaily) {
      return Response.json({
        error: "You have already claimed this reward. Claim it again tomorrow.",
      });
    }

    await db
      .update(profiles)
      .set({
        balance: currProfile.balance + newBalance,
        claimedDaily: true,
        commonCards: currProfile.commonCards + cards.Common,
        rareCards: currProfile.rareCards + cards.Rare,
        epicCards: currProfile.epicCards + cards.Epic,
        legendaryCards: currProfile.legendaryCards + cards.Legendary,
      })
      .where(eq(profiles.userId, session.user.id));
  } else {
    if (currProfile.claimedNightly) {
      return Response.json({
        error: "You have already claimed this reward. Claim it again tomorrow.",
      });
    }
    await db
      .update(profiles)
      .set({
        balance: currProfile.balance + newBalance,
        claimedNightly: true,
        commonCards: currProfile.commonCards + cards.Common,
        rareCards: currProfile.rareCards + cards.Rare,
        epicCards: currProfile.epicCards + cards.Epic,
        legendaryCards: currProfile.legendaryCards + cards.Legendary,
      })
      .where(eq(profiles.userId, session.user.id));
  }

  return Response.json({
    reward: reward,
    cards: cards,
  });
}
