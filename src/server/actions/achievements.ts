"use server";

import { claimAchievement } from "~/server/db/mutations/achievements";

export async function claimAchievementAction(achievementId: string) {
  await claimAchievement(achievementId);
}
