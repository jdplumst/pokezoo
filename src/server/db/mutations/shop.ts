import "server-only";

import { and, eq, inArray, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { calcNewYield } from "~/lib/calc-new-yield";
import { type Rarity } from "~/lib/types";
import { updateUserQuest } from "~/lib/update-user-quest";
import { withinInstanceLimit } from "~/lib/within-instance-limit";
import { db } from "~/server/db";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";
import { getTime } from "~/server/db/queries/cookies";
import {
  balls,
  charms,
  instances,
  profiles,
  rarities,
  regions,
  species,
  userCharms,
} from "~/server/db/schema";

export async function purchaseBalls(
  ballId: string,
  quantity: number,
  regionName?: string,
) {
  const session = await isAuthed();

  const currProfile = await hasProfile();

  const time = await getTime();

  const currBall = (
    await db.select().from(balls).where(eq(balls.id, ballId))
  )[0];

  if (!currBall) {
    return { error: "The ball you are trying to purchase does not exist." };
  }

  if (currProfile.profile.balance < currBall.cost * quantity) {
    return { error: "You cannot afford these balls." };
  }

  if (
    !withinInstanceLimit(
      currProfile.profile.instanceCount + quantity,
      !!currProfile.catchingCharm,
    )
  ) {
    return {
      error:
        "You will go over your Pokémon limit. Reduce the number of balls you are purchasing or sell Pokémon if you want to buy more.",
    };
  }

  if (currBall.name === "Premier" && !regionName) {
    return {
      error: "Must select a valid region for Premier Balls.",
    };
  }

  if (currBall.name === "Premier" && regionName) {
    // eslint-disable-next-line no-var
    var currRegion = (
      await db.select().from(regions).where(eq(regions.name, regionName))
    )[0];

    if (!currRegion) {
      return {
        error: "Must select a valid region for Premier Balls.",
      };
    }
  }

  // Determine if shiny
  const shinyRandomizer = Math.floor(Math.random() * 4096) + 1;
  let shiny = false;
  if (shinyRandomizer === 8) {
    shiny = true;
  }

  // Variables to keep track of which species to filter
  let habitats = [3, 4, 6, 7, 8, 9]; // Habitats found both day and night
  let types = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  // Filter species based on time
  if (time === "day") {
    habitats.push(1);
  } else if (time === "night") {
    habitats.push(2, 5);
  }

  // Filter species based on ball
  if (currBall.name === "Net") {
    types = types.filter((t) => t === 3 || t === 7);
  } else if (currBall.name === "Dusk") {
    types = types.filter((t) => t === 12 || t === 15);
  } else if (currBall.name === "Dive") {
    habitats = habitats.filter((h) => h === 3 || h === 4);
  } else if (currBall.name === "Safari") {
    habitats = habitats.filter((h) => h === 6 || h === 7);
  }

  // Determine rarity
  const randomizer = [];
  for (let i = 0; i < currBall.commonChance; i++) {
    randomizer.push(1);
  }
  for (let i = 0; i < currBall.rareChance; i++) {
    randomizer.push(2);
  }
  for (let i = 0; i < currBall.epicChance; i++) {
    randomizer.push(3);
  }
  for (let i = 0; i < currBall.legendaryChance; i++) {
    randomizer.push(4);
  }
  for (let i = 0; i < currBall.megaChance; i++) {
    randomizer.push(5);
  }
  for (let i = 0; i < currBall.ubChance; i++) {
    randomizer.push(6);
  }
  for (let i = 0; i < currBall.gmaxChance; i++) {
    randomizer.push(7);
  }

  const generatedRarities: number[] = [];
  for (let i = 0; i < quantity; i++) {
    generatedRarities.push(randomizer[Math.floor(Math.random() * 100)]);
  }

  let newYield = 0;

  const purchasedSpecies: {
    name: string;
    img: string;
    shiny: boolean;
    rarity: Rarity;
  }[] = [];

  // Determine the new species the user gets
  await db.transaction(async (tx) => {
    for (let i = 0; i < quantity; i++) {
      const currSpecies = (
        await db
          .select({
            species: species,
            rarity: rarities.name,
          })
          .from(species)
          .innerJoin(rarities, eq(species.rarityId, rarities.id))
          .where(
            and(
              eq(species.rarityId, generatedRarities.pop()!),
              inArray(species.habitatId, habitats),
              or(
                inArray(species.typeOneId, types),
                inArray(species.typeTwoId, types),
              ),
              eq(species.shiny, shiny),
              currBall.name === "Premier"
                ? eq(species.regionId, currRegion.id)
                : undefined,
            ),
          )
          .orderBy(sql`RANDOM()`)
      )[0];

      if (!currSpecies) {
        return {
          error:
            "Something went wrong trying to purchase Pokémon. Please try again.",
        };
      }

      purchasedSpecies.push({
        name: currSpecies.species.name,
        img: currSpecies.species.img,
        shiny: currSpecies.species.shiny,
        rarity: currSpecies.rarity as Rarity,
      });

      await updateUserQuest(currSpecies.species, session.user.id, currBall);

      newYield += currSpecies.species.yield;

      await tx
        .insert(instances)
        .values({ userId: session.user.id, speciesId: currSpecies.species.id });
    }
  });

  const totalNewYield = calcNewYield(currProfile.profile.totalYield, newYield);

  await db.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({
        totalYield: totalNewYield,
        balance: currProfile.profile.balance - currBall.cost * quantity,
        instanceCount: currProfile.profile.instanceCount + quantity,
      })
      .where(eq(profiles.userId, session.user.id));
  });

  revalidatePath("/game");
  revalidatePath("/shop");
  return { purchasedSpecies };
}

export async function purchaseCharm(charmId: number) {
  const session = await isAuthed();

  const currProfile = await hasProfile();

  const charmData = (
    await db.select().from(charms).where(eq(charms.id, charmId))
  )[0];

  if (!charmData) {
    return {
      error: "The charm you are trying to purchase does not exist.",
    };
  }

  const exists = (
    await db
      .select()
      .from(userCharms)
      .where(
        and(
          eq(userCharms.charmId, charmId),
          eq(userCharms.userId, session.user.id),
        ),
      )
  )[0];

  if (exists) {
    return { error: "You have already purchased this charm." };
  }

  if (currProfile.profile.balance < charmData.cost) {
    return { error: "You cannot afford this charm." };
  }

  await db.transaction(async (tx) => {
    await tx
      .insert(userCharms)
      .values({ userId: session.user.id, charmId: charmId });

    await tx
      .update(profiles)
      .set({ balance: currProfile.profile.balance - charmData.cost })
      .where(eq(profiles.userId, session.user.id));
  });

  return {
    message: `You have successfully purchased the ${charmData.name} Charm!`,
  };
}

export async function purchaseWildcard(
  tradedWildcard: Rarity,
  purchasedWildcard: Rarity,
) {
  const session = await isAuthed();

  const currProfile = await hasProfile();

  switch (tradedWildcard + ", " + purchasedWildcard) {
    case "Common, Rare":
      if (currProfile.profile.commonCards < 2) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          commonCards: currProfile.profile.commonCards - 2,
          rareCards: currProfile.profile.rareCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Common, Epic":
      if (currProfile.profile.commonCards < 4) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          commonCards: currProfile.profile.commonCards - 4,
          epicCards: currProfile.profile.epicCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Common, Legendary":
      if (currProfile.profile.commonCards < 50) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          commonCards: currProfile.profile.commonCards - 50,
          legendaryCards: currProfile.profile.legendaryCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Rare, Common":
      if (currProfile.profile.rareCards < 1) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          rareCards: currProfile.profile.rareCards - 1,
          commonCards: currProfile.profile.commonCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Rare, Epic":
      if (currProfile.profile.rareCards < 2) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          rareCards: currProfile.profile.rareCards - 2,
          epicCards: currProfile.profile.epicCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Rare, Legendary":
      if (currProfile.profile.rareCards < 35) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          rareCards: currProfile.profile.rareCards - 35,
          legendaryCards: currProfile.profile.legendaryCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Epic, Common":
      if (currProfile.profile.epicCards < 1) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          epicCards: currProfile.profile.epicCards - 1,
          commonCards: currProfile.profile.commonCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Epic, Rare":
      if (currProfile.profile.epicCards < 1) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          epicCards: currProfile.profile.epicCards - 1,
          rareCards: currProfile.profile.rareCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Epic, Legendary":
      if (currProfile.profile.epicCards < 15) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          epicCards: currProfile.profile.epicCards - 15,
          legendaryCards: currProfile.profile.legendaryCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Legendary, Common":
      if (currProfile.profile.legendaryCards < 1) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          legendaryCards: currProfile.profile.legendaryCards - 1,
          commonCards: currProfile.profile.commonCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Legendary, Rare":
      if (currProfile.profile.legendaryCards < 1) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          legendaryCards: currProfile.profile.legendaryCards - 1,
          rareCards: currProfile.profile.rareCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Legendary, Epic":
      if (currProfile.profile.legendaryCards < 1) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          legendaryCards: currProfile.profile.legendaryCards - 1,
          epicCards: currProfile.profile.epicCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    default:
      return {
        error: "Something went wrong. Please try again.",
      };
  }

  return {
    message: `You have successfully purchased a ${purchasedWildcard} Wildcard.`,
  };
}
