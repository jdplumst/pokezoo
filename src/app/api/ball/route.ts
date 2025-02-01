import { getTime } from "@/server/actions/cookies";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import {
  balls,
  instances,
  profiles,
  rarities,
  regions,
  species,
  userCharms,
} from "@/server/db/schema";
import { calcNewYield } from "@/utils/calcNewYield";
import { updateUserQuest } from "@/utils/updateUserQuest";
import { withinInstanceLimit } from "@/utils/withinInstanceLimit";
import { type ZodRarity } from "@/utils/zod";
import { and, eq, inArray, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";

export async function POST(req: Request) {
  const bodySchema = z.object({
    ballId: z.string(),
    quantity: z.number(),
    regionName: z.string().optional(),
  });

  const body = bodySchema.safeParse(await req.json());

  if (body.error) {
    return Response.json({
      error: "Something went wrong. Please try again.",
    });
  }

  const session = await auth();
  if (!session) {
    return Response.json({
      error: "You are not authorized to purchase this wildcard.",
    });
  }

  const time = getTime();

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
    return Response.json({
      error: "You are not authorized to purchase this wildcard.",
    });
  }

  const currBall = (
    await db.select().from(balls).where(eq(balls.id, body.data.ballId))
  )[0];

  if (!currBall) {
    return Response.json({
      error: "The ball you are trying to purchase does not exist.",
    });
  }

  if (currProfile.balance < currBall.cost * body.data.quantity) {
    return Response.json({ error: "You cannot afford these balls." });
  }

  if (
    !withinInstanceLimit(
      currProfile.instanceCount + body.data.quantity,
      !!currProfile.catchingCharm,
    )
  ) {
    return Response.json({
      error:
        "You will go over your Pokémon limit. Reduce the number of balls you are purchasing or sell Pokémon if you want to buy more.",
    });
  }

  if (currBall.name === "Premier" && !body.data.regionName) {
    return Response.json({
      error: "Must select a valid region for Premier Balls.",
    });
  }

  if (currBall.name === "Premier" && body.data.regionName) {
    // eslint-disable-next-line no-var
    var currRegion = (
      await db
        .select()
        .from(regions)
        .where(eq(regions.name, body.data.regionName))
    )[0];

    if (!currRegion) {
      return Response.json({
        error: "Must select a valid region for Premier Balls.",
      });
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
  for (let i = 0; i < body.data.quantity; i++) {
    generatedRarities.push(randomizer[Math.floor(Math.random() * 100)]);
  }

  let newYield = 0;

  const speciesList: {
    name: string;
    img: string;
    shiny: boolean;
    rarity: z.infer<typeof ZodRarity>;
  }[] = [];

  // Determine the new species the user gets
  await db.transaction(async (tx) => {
    for (let i = 0; i < body.data.quantity; i++) {
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
        return Response.json({
          error:
            "Something went wrong trying to purchase Pokémon. Please try again.",
        });
      }

      speciesList.push({
        name: currSpecies.species.name,
        img: currSpecies.species.img,
        shiny: currSpecies.species.shiny,
        rarity: currSpecies.rarity as z.infer<typeof ZodRarity>,
      });

      // Update userQuest count field
      await updateUserQuest(currSpecies.species, session.user.id, currBall);

      newYield += currSpecies.species.yield;

      await tx
        .insert(instances)
        .values({ userId: session.user.id, speciesId: currSpecies.species.id });
    }
  });

  const totalNewYield = calcNewYield(currProfile.totalYield, newYield);

  await db.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({
        totalYield: totalNewYield,
        balance: currProfile.balance - currBall.cost * body.data.quantity,
        instanceCount: currProfile.instanceCount + body.data.quantity,
      })
      .where(eq(profiles.userId, session.user.id));
  });

  return Response.json({ speciesList });
}
