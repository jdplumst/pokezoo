import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { quests, questTypes, userQuests } from "~/server/db/schema";
import { isAuthed } from "~/server/queries/auth";

export async function getQuests() {
  const session = await isAuthed();
  if (!session) {
    redirect("/");
  }

  const currUserQuests = await db
    .select()
    .from(userQuests)
    .innerJoin(quests, eq(userQuests.questId, quests.id))
    .innerJoin(questTypes, eq(quests.typeId, questTypes.id))
    .where(eq(userQuests.userId, session.user.id))
    .orderBy(questTypes.id);

  return currUserQuests;
}
