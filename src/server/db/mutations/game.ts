import "server-only";

import { eq } from "drizzle-orm";
import { MAX_BALANCE } from "~/lib/constants";
import { db } from "~/server/db";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";
import { getTime } from "~/server/db/queries/cookies";
import { instances, profiles, species, trades } from "~/server/db/schema";
import { type MessageResponse, type ErrorResponse } from "~/lib/types";

type Cards = {
  Common: number;
  Rare: number;
  Epic: number;
  Legendary: number;
};

export async function claimReward(): Promise<
  | ErrorResponse
  | {
      success: true;
      reward: number;
      cards: Cards;
    }
> {
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
  const cards: Cards = {
    Common: 0,
    Rare: 0,
    Epic: 0,
    Legendary: 0,
  };
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
        success: false,
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
        success: false,
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
    success: true,
    reward: reward,
    cards: cards,
  };
}

export async function sellPokemon(
  ids: string[],
): Promise<MessageResponse | ErrorResponse> {
  const session = await isAuthed();

  for (const i of ids) {
    await db.transaction(async (tx) => {
      const exists = (
        await tx
          .select({ id: instances.id, speciesId: instances.speciesId })
          .from(instances)
          .where(eq(instances.id, i))
      )[0];

      if (!exists) {
        return {
          success: false,
          error: "You are trying to sell a Pokémon that you do not own.",
        };
      }

      const speciesData = (
        await tx.select().from(species).where(eq(species.id, exists.speciesId))
      )[0];

      if (!speciesData) {
        return {
          success: false,
          error: "You are trying to sell a Pokémon that does not exist.",
        };
      }

      const currProfile = await hasProfile();

      await tx.delete(instances).where(eq(instances.id, i));

      await tx
        .update(trades)
        .set({ offererId: null, offererInstanceId: null })
        .where(eq(trades.offererInstanceId, exists.id));

      await tx.delete(trades).where(eq(trades.initiatorInstanceId, exists.id));

      await tx
        .update(profiles)
        .set({
          totalYield: currProfile.profile.totalYield - speciesData.yield,
          balance:
            currProfile.profile.balance + speciesData.sellPrice > MAX_BALANCE
              ? MAX_BALANCE
              : currProfile.profile.balance + speciesData.sellPrice,
          instanceCount: currProfile.profile.instanceCount - 1,
        })
        .where(eq(profiles.userId, session.user.id));
    });
  }
  return {
    success: true,
    message: "You have successfully sold your Pokémon!",
  };
}
