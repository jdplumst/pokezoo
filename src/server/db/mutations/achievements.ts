import "server-only";

import { db } from "~/server/db";
import { achievements, profiles, userAchievements } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { calcNewYield } from "~/lib/calc-new-yield";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";

export async function claimAchievement(achievementId: string) {
  const session = await isAuthed();

  const currProfile = await hasProfile();

  const achievementData = (
    await db
      .select()
      .from(achievements)
      .where(eq(achievements.id, achievementId))
  )[0];

  if (!achievementData) {
    throw new Error("The achievement you are trying to claim does not exist.");
  }

  const exists = (
    await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, session.user.id),
          eq(userAchievements.achievementId, achievementId),
        ),
      )
  )[0];

  if (exists) {
    revalidatePath("/achievements");
  }

  const newYield = calcNewYield(
    currProfile.profile.totalYield,
    achievementData.yield,
    "add",
  );

  await db.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({ totalYield: newYield })
      .where(eq(profiles.userId, session.user.id));

    await tx.insert(userAchievements).values({
      userId: session.user.id,
      achievementId: achievementId,
    });
  });

  revalidatePath("/achievements");
}
