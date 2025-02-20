import { test as setup } from "@playwright/test";
import { and, eq, ne } from "drizzle-orm";
import { db } from "~/server/db";
import {
  instances,
  profiles,
  species,
  trades,
  userAchievements,
  userCharms,
  userQuests,
} from "~/server/db/schema";

setup("setting up database", async ({}) => {
  console.log("setting up database...");

  // Set up data for user Green
  const green = (
    await db
      .delete(profiles)
      .where(eq(profiles.username, "Green"))
      .returning({ userId: profiles.userId })
  )[0];

  if (green) {
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
  }

  // Set up data for user Red
  const red = (
    await db.select().from(profiles).where(eq(profiles.username, "Red"))
  )[0];

  if (!red) throw new Error("User Red was not found.");

  const charmander = (
    await db.select().from(species).where(eq(species.name, "charmander"))
  )[0];

  await db
    .delete(instances)
    .where(
      and(
        eq(instances.userId, red.userId),
        ne(instances.speciesId, charmander.id),
      ),
    );

  await db
    .update(profiles)
    .set({ balance: 0, totalYield: 100, instanceCount: 2000 })
    .where(eq(profiles.userId, red.userId));

  await db.delete(trades).where(eq(trades.initiatorId, red.userId));

  await db
    .update(trades)
    .set({
      offererId: null,
      offererInstanceId: null,
      modifyDate: new Date(),
    })
    .where(eq(trades.offererId, red.userId));

  await db
    .delete(userAchievements)
    .where(eq(userAchievements.userId, red.userId));

  await db.delete(userCharms).where(eq(userCharms.userId, red.userId));

  await db.delete(userQuests).where(eq(userQuests.userId, red.userId));

  // Set up data for user Blue
  const blue = (
    await db.select().from(profiles).where(eq(profiles.username, "Blue"))
  )[0];

  if (!blue) throw new Error("User Blue was not found.");

  const squirtle = (
    await db.select().from(species).where(eq(species.name, "squirtle"))
  )[0];

  await db
    .delete(instances)
    .where(
      and(
        eq(instances.userId, blue.userId),
        ne(instances.speciesId, squirtle.id),
      ),
    );

  await db
    .update(profiles)
    .set({ balance: 100000000, totalYield: 100, instanceCount: 2000 })
    .where(eq(profiles.userId, blue.userId));

  await db.delete(trades).where(eq(trades.initiatorId, blue.userId));

  await db
    .update(trades)
    .set({
      offererId: null,
      offererInstanceId: null,
      modifyDate: new Date(),
    })
    .where(eq(trades.offererId, blue.userId));

  await db
    .delete(userAchievements)
    .where(eq(userAchievements.userId, blue.userId));

  await db.delete(userCharms).where(eq(userCharms.userId, blue.userId));

  await db.delete(userQuests).where(eq(userQuests.userId, blue.userId));
});
