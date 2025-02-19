import { test as setup } from "@playwright/test";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  instances,
  profiles,
  trades,
  userAchievements,
  userCharms,
  userQuests,
} from "~/server/db/schema";

setup("setting up database", async ({}) => {
  console.log("setting up database...");

  // Delete data for user Green
  const green = (
    await db
      .delete(profiles)
      .where(eq(profiles.username, "Green"))
      .returning({ userId: profiles.userId })
  )[0];

  if (!green) return;

  await db.delete(instances).where(eq(instances.userId, green.userId));
  await db.delete(trades).where(eq(trades.initiatorId, green.userId));
  await db
    .update(trades)
    .set({
      offererId: null,
      offererInstanceId: null,
      modifyDate: new Date(),
    })
    .where(eq(trades.offererId, green.userId));
  await db
    .delete(userAchievements)
    .where(eq(userAchievements.userId, green.userId));
  await db.delete(userCharms).where(eq(userCharms.userId, green.userId));
  await db.delete(userQuests).where(eq(userQuests.userId, green.userId));
});
