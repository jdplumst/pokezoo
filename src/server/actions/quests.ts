import "server-only";
import { db } from "../db";
import { profiles, quests, questTypes, userQuests } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { isAuthed } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getQuests() {
  const session = await isAuthed();
  if (!session) {
    redirect("/");
  }

  const currUserQuests = await db
    .select()
    .from(userQuests)
    .leftJoin(quests, eq(userQuests.questId, quests.id))
    .leftJoin(questTypes, eq(quests.typeId, questTypes.id))
    .where(eq(userQuests.userId, session.user.id))
    .orderBy(questTypes.id);

  return currUserQuests;
}

export async function claimQuest(userQuestId: string) {
  const session = await isAuthed();
  if (!session) {
    redirect("/");
  }

  const currUserQuest = (
    await db
      .select()
      .from(userQuests)
      .where(
        and(
          eq(userQuests.id, userQuestId),
          eq(userQuests.userId, session.user.id),
        ),
      )
  )[0];

  if (!currUserQuest) {
    throw new Error("User quest was not found.");
  }

  const currQuest = (
    await db.select().from(quests).where(eq(quests.id, currUserQuest.questId))
  )[0];

  if (!currQuest) {
    throw new Error("Quest was not found.");
  }

  // Validate that user can claim this quest
  if (currUserQuest.claimed) {
    revalidatePath("/quests");
  }

  if (currUserQuest.count < currQuest.goal) {
    revalidatePath("/quests");
  }

  const currProfile = (
    await db.select().from(profiles).where(eq(profiles.userId, session.user.id))
  )[0];

  if (!currProfile) {
    redirect("/onboarding");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(userQuests)
      .set({ claimed: true })
      .where(
        and(
          eq(userQuests.id, userQuestId),
          eq(userQuests.userId, session.user.id),
        ),
      );

    await tx
      .update(profiles)
      .set({ balance: currProfile.balance + currQuest.reward })
      .where(eq(profiles.userId, session.user.id));
  });

  revalidatePath("/quests");
}
