import "server-only";

import { eq } from "drizzle-orm";
import { MAX_BALANCE } from "~/lib/constants";
import { db } from "~/server/db";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";
import { getTime } from "~/server/db/queries/cookies";
import { profiles } from "~/server/db/schema";

export async function claimReward() {
  const session = await isAuthed();

  const currProfile = await hasProfile();

  const reward = Math.round(
    Math.random() *
      (0.125 * currProfile.profile.totalYield -
        0.075 * currProfile.profile.totalYield) +
      0.075 * currProfile.profile.totalYield,
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

  const time = await getTime();

  if (time === "day") {
    if (currProfile.profile.claimedDaily) {
      return {
        error: "You have already claimed this reward. Claim it again tomorrow.",
      };
    }

    await db
      .update(profiles)
      .set({
        balance: currProfile.profile.balance + newBalance,
        claimedDaily: true,
        commonCards: currProfile.profile.commonCards + cards.Common,
        rareCards: currProfile.profile.rareCards + cards.Rare,
        epicCards: currProfile.profile.epicCards + cards.Epic,
        legendaryCards: currProfile.profile.legendaryCards + cards.Legendary,
      })
      .where(eq(profiles.userId, session.user.id));
  } else {
    if (currProfile.profile.claimedNightly) {
      return {
        error: "You have already claimed this reward. Claim it again tomorrow.",
      };
    }
    await db
      .update(profiles)
      .set({
        balance: currProfile.profile.balance + newBalance,
        claimedNightly: true,
        commonCards: currProfile.profile.commonCards + cards.Common,
        rareCards: currProfile.profile.rareCards + cards.Rare,
        epicCards: currProfile.profile.epicCards + cards.Epic,
        legendaryCards: currProfile.profile.legendaryCards + cards.Legendary,
      })
      .where(eq(profiles.userId, session.user.id));
  }

  return {
    reward: reward,
    cards: cards,
  };
}
