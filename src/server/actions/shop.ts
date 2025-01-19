"use server";

import { and, eq, inArray, or, sql } from "drizzle-orm";
import { db } from "../db";
import {
  balls,
  charms,
  instances,
  profiles,
  regions,
  species,
  userCharms,
} from "../db/schema";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { alias } from "drizzle-orm/pg-core";
import { authOptions } from "@/src/pages/api/auth/[...nextauth]";
import { withinInstanceLimit } from "@/src/utils/withinInstanceLimit";
import { getTime } from "./cookies";
import { updateUserQuest } from "@/src/utils/updateUserQuest";
import { calcNewYield } from "@/src/utils/calcNewYield";

export async function getShopData(session: Session) {
  const ballsData = await db.select().from(balls);

  const charmsData = await db.select().from(charms);

  const currProfile = (
    await db
      .select({ balance: profiles.balance })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
  )[0];

  if (!currProfile) {
    redirect("/game");
  }

  const userCharmsData = await db
    .select()
    .from(userCharms)
    .leftJoin(charms, eq(userCharms.charmId, charms.id))
    .where(eq(userCharms.userId, session.user.id));

  return { ballsData, charmsData, userCharmsData };
}

export async function purchaseBalls(
  ballId: string,
  quantity: number,
  regionId?: number,
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const time = await getTime();

  const catchingCharm = alias(userCharms, "catchingCharm");
  const currProfile = (
    await db
      .select({
        totalYield: profiles.totalYield,
        balance: profiles.balance,
        instanceCount: profiles.instanceCount,
        catchingCharm: catchingCharm.charmId,
      })
      .from(profiles)
      .leftJoin(
        catchingCharm,
        and(
          eq(profiles.userId, catchingCharm.userId),
          eq(catchingCharm.charmId, 1),
        ),
      )
      .where(eq(profiles.userId, session.user.id))
  )[0];

  if (!currProfile) {
    redirect("/game");
  }

  const currBall = (
    await db.select().from(balls).where(eq(balls.id, ballId))
  )[0];

  if (!currBall) {
    return { error: "The ball you are trying to purchase does not exist." };
  }

  if (currProfile.balance < currBall.cost * quantity) {
    return { error: "You cannot afford these balls." };
  }

  if (
    !withinInstanceLimit(
      currProfile.instanceCount + quantity,
      !!currProfile.catchingCharm,
    )
  ) {
    return {
      error:
        "You will go over your Pokémon limit. Reduce the number of balls you are purchasing or sell Pokémon if you want to buy more.",
    };
  }

  if (currBall.name === "Premier" && !regionId) {
    return { error: "Must select a valid region for Premier Balls." };
  }

  if (currBall.name === "Premier" && regionId) {
    const currRegion = (
      await db.select().from(regions).where(eq(regions.id, regionId))
    )[0];

    if (!currRegion) {
      return { error: "Must select a valid region for Premier Balls." };
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

  const speciesList: { name: string; img: string; shiny: boolean }[] = [];

  // Determine the new species the user gets
  await db.transaction(async (tx) => {
    for (let i = 0; i < quantity; i++) {
      const currSpecies = (
        await db
          .select()
          .from(species)
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
                ? eq(species.regionId, regionId!)
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

      speciesList.push({
        name: currSpecies.name,
        img: currSpecies.img,
        shiny: currSpecies.shiny,
      });

      // Update userQuest count field
      await updateUserQuest(currSpecies, session.user.id, currBall);

      newYield += currSpecies.yield;

      await tx
        .insert(instances)
        .values({ userId: session.user.id, speciesId: currSpecies.id });
    }
  });

  const totalNewYield = calcNewYield(currProfile.totalYield, newYield);

  await db.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({
        totalYield: totalNewYield,
        balance: currProfile.balance - currBall.cost * quantity,
        instanceCount: currProfile.instanceCount + quantity,
      })
      .where(eq(profiles.userId, session.user.id));
  });

  return { speciesList };
}
