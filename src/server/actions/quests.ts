"use server";

import { claimQuest } from "~/server/db/mutations/quests";

export async function claimQuestAction(userQuestId: string) {
  return await claimQuest(userQuestId);
}
