import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { MAX_BALANCE } from "~/lib/constants";
import { db } from "~/server/db";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";
import { getTime } from "~/server/db/queries/cookies";
import {
  habitats,
  instances,
  profiles,
  rarities,
  regions,
  species,
  trades,
  types,
} from "~/server/db/schema";
import { type MessageResponse, type ErrorResponse } from "~/lib/types";
import { redirect } from "next/navigation";
import { getAvailableBoxes } from "~/lib/get-available-boxes";
import { revalidatePath } from "next/cache";
import { calcNewYield } from "~/lib/calc-new-yield";
import { alias } from "drizzle-orm/pg-core";

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
          .select({
            id: instances.id,
            speciesId: instances.speciesId,
            box: instances.box,
          })
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
          instanceCount:
            exists.box === 0
              ? currProfile.profile.instanceCount - 1
              : currProfile.profile.instanceCount,
        })
        .where(eq(profiles.userId, session.user.id));
    });
  }
  return {
    success: true,
    message: "You have successfully sold your Pokémon!",
  };
}

export async function moveToStorage(
  instanceId: string,
  userId: string,
  currProfile: Awaited<ReturnType<typeof hasProfile>>,
): Promise<MessageResponse | ErrorResponse | undefined> {
  const instanceData = (
    await db
      .select()
      .from(instances)
      .innerJoin(species, eq(instances.speciesId, species.id))
      .where(and(eq(instances.userId, userId), eq(instances.id, instanceId)))
  )[0];

  if (!instanceData) {
    redirect("/game");
  }

  const boxes = await getAvailableBoxes();
  if (!boxes) {
    return {
      success: false,
      error:
        "Your storage is full. Sell some of your pokémon in your storage and try again.",
    };
  }

  const newYield = calcNewYield(
    currProfile.profile.totalYield,
    instanceData.species.yield,
    "subtract",
  );

  await db.transaction(async (tx) => {
    await tx
      .update(instances)
      .set({ box: boxes[0], modifyDate: new Date() })
      .where(eq(instances.id, instanceId));

    await tx
      .update(profiles)
      .set({
        instanceCount: currProfile.profile.instanceCount - 1,
        totalYield: newYield,
      })
      .where(eq(profiles.userId, userId));
  });

  revalidatePath("/game");
  return {
    success: true,
    message: "The pokémon has been moved to your storage.",
  };
}

export async function claimEvent(userId: string) {
  const currProfile = await hasProfile();

  const typeOne = alias(types, "typeOne");
  const typeTwo = alias(types, "typeTwo");

  const gift = (
    await db
      .select({
        id: species.id,
        pokedexNumber: species.pokedexNumber,
        name: species.name,
        rarity: rarities.name,
        yield: species.yield,
        img: species.img,
        sellPrice: species.sellPrice,
        shiny: species.shiny,
        typeOne: typeOne.name,
        typeTwo: typeTwo.name,
        generation: species.generation,
        habitat: habitats.name,
        region: regions.name,
      })
      .from(species)
      .innerJoin(regions, eq(species.regionId, regions.id))
      .innerJoin(rarities, eq(species.rarityId, rarities.id))
      .innerJoin(habitats, eq(species.habitatId, habitats.id))
      .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
      .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
      .where(eq(species.shiny, true))
      .orderBy(sql`RANDOM()`)
      .limit(1)
  )[0];

  const newYield = calcNewYield(
    currProfile.profile.totalYield,
    gift.yield,
    "add",
  );

  await db.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({
        claimedEvent: true,
        totalYield: newYield,
        instanceCount: currProfile.profile.instanceCount + 1,
      })
      .where(eq(profiles.userId, userId));

    await tx.insert(instances).values({ userId: userId, speciesId: gift.id });
  });

  return { success: true, gift: gift };
}
