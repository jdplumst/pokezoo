import { db } from "@/src/server/db/index";
import { type NextApiRequest, type NextApiResponse } from "next";
import {
  profiles,
  quests,
  type selectProfileSchema,
  userQuests,
} from "@/src/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { MAX_BALANCE } from "@/src/constants";
import { env } from "@/src/env";
import { type z } from "zod";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  if (!authorization || authorization.split(" ")[1] !== env.CRON_TOKEN) {
    throw new Error("Not authorized to make this request.");
  }
  try {
    const date = new Date();
    const dayOfWeek = date.getDay();
    const day = date.getDate();
    const month = date.getMonth() + 1;

    // Set claimedEvent field
    let completedEvent = null;

    if (
      (day === 25 && month === 12) ||
      (day === 1 && month === 1) ||
      (day === 5 && month === 4)
    ) {
      completedEvent = false;
    } else if ((day === 8 && month === 1) || (day === 13 && month === 4)) {
      completedEvent = true;
    }

    // Set user quests
    await db.execute(
      sql`DELETE FROM "pokezoo_userQuest"
              WHERE "pokezoo_userQuest"."questId" IN (
              SELECT id
              FROM "pokezoo_quest"
              WHERE "pokezoo_quest"."type" = 1)`,
    );

    if (dayOfWeek === 0) {
      await db.execute(
        sql`DELETE FROM "pokezoo_userQuest"
              WHERE "pokezoo_userQuest"."questId" IN (
              SELECT id
              FROM "pokezoo_quest"
              WHERE "pokezoo_quest"."type" = 2)`,
      );
    }

    if (day === 1) {
      await db.execute(
        sql`DELETE FROM "pokezoo_userQuest"
              WHERE "pokezoo_userQuest"."questId" IN (
              SELECT id
              FROM "pokezoo_quest"
              WHERE "pokezoo_quest"."type" = 3)`,
      );
    }

    // Update balance from yield
    const profilesData = await db.select().from(profiles);

    for (const profile of profilesData) {
      const newBalance =
        profile.balance + profile.totalYield > MAX_BALANCE
          ? MAX_BALANCE
          : profile.balance + profile.totalYield;

      await setQuests(profile, 1);
      if (dayOfWeek === 0) {
        await setQuests(profile, 2);
      }
      if (day === 1) {
        await setQuests(profile, 3);
      }

      await db
        .update(profiles)
        .set({
          balance: newBalance,
          claimedDaily: false,
          claimedNightly: false,
          claimedEvent: completedEvent ?? profile.claimedEvent,
        })
        .where(eq(profiles.id, profile.id));
    }
    return Response.json(
      {
        msg: "Successfully updated all user's dollars and reset daily and nightly claims",
      },
      { status: 200 },
    );
  } catch (_) {
    throw new Error(
      "User's dollars and daily and nightly claims not updated successfully",
    );
  }
}

async function setQuests(
  currProfile: z.infer<typeof selectProfileSchema>,
  questType: number,
) {
  const randomQuests = await db
    .select()
    .from(quests)
    .where(eq(quests.typeId, questType))
    .orderBy(sql`RANDOM()`)
    .limit(5);

  for (const currQuest of randomQuests) {
    await db.insert(userQuests).values({
      userId: currProfile.userId,
      questId: currQuest.id,
      count: 0,
      claimed: false,
    });
  }
}
