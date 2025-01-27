import { SHINY_WILDCARD_COST, WILDCARD_COST } from "@/src/constants";
import { auth } from "@/src/server/auth";
import { db } from "@/src/server/db";
import {
  instances,
  profiles,
  rarities,
  species,
  userCharms,
} from "@/src/server/db/schema";
import { calcNewYield } from "@/src/utils/calcNewYield";
import { updateUserQuest } from "@/src/utils/updateUserQuest";
import { withinInstanceLimit } from "@/src/utils/withinInstanceLimit";
import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";

export async function POST(req: Request) {
  const bodySchema = z.object({
    speciesId: z.string(),
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
      error: "You are not authorized to fetch this data.",
    });
  }

  const catchingCharm = alias(userCharms, "catchingCharm");

  const currProfile = (
    await db
      .select({
        totalYield: profiles.totalYield,
        instanceCount: profiles.instanceCount,
        commonCards: profiles.commonCards,
        rareCards: profiles.rareCards,
        epicCards: profiles.epicCards,
        legendaryCards: profiles.legendaryCards,
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
      error: "You are not authorized to make this request.",
    });
  }

  const currSpecies = (
    await db
      .select()
      .from(species)
      .leftJoin(rarities, eq(species.rarityId, rarities.id))
      .where(eq(species.id, body.data.speciesId))
  )[0];

  if (!currSpecies) {
    return Response.json({
      error: "The Pokémon you are trying to purchase does not exist.",
    });
  }

  if (
    (currSpecies.rarity?.name === "Common" &&
      !currSpecies.species.shiny &&
      currProfile.commonCards < WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Common" &&
      currSpecies.species.shiny &&
      currProfile.commonCards < SHINY_WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Rare" &&
      !currSpecies.species.shiny &&
      currProfile.rareCards < WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Rare" &&
      currSpecies.species.shiny &&
      currProfile.rareCards < SHINY_WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Epic" &&
      !currSpecies.species.shiny &&
      currProfile.epicCards < WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Epic" &&
      currSpecies.species.shiny &&
      currProfile.epicCards < SHINY_WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Legendary" &&
      !currSpecies.species.shiny &&
      currProfile.legendaryCards < WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Legendary" &&
      currSpecies.species.shiny &&
      currProfile.legendaryCards < SHINY_WILDCARD_COST)
  ) {
    return Response.json({ error: "You cannot afford this Pokémon." });
  }

  if (
    !withinInstanceLimit(currProfile.instanceCount, !!currProfile.catchingCharm)
  ) {
    return Response.json({
      error:
        "You have reached your Pokémon limit. Sell Pokémon if you want to buy more.",
    });
  }

  await updateUserQuest(currSpecies.species, session.user.id);

  const newYield = calcNewYield(
    currProfile.totalYield,
    currSpecies.species.yield,
  );

  await db.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({
        totalYield: newYield,
        commonCards:
          currSpecies.rarity?.name === "Common" && !currSpecies.species.shiny
            ? currProfile.commonCards - WILDCARD_COST
            : currSpecies.rarity?.name === "Common" && currSpecies.species.shiny
              ? currProfile.commonCards - SHINY_WILDCARD_COST
              : currProfile.commonCards,
        rareCards:
          currSpecies.rarity?.name === "Rare" && !currSpecies.species.shiny
            ? currProfile.rareCards - WILDCARD_COST
            : currSpecies.rarity?.name === "Rare" && currSpecies.species.shiny
              ? currProfile.rareCards - SHINY_WILDCARD_COST
              : currProfile.rareCards,
        epicCards:
          currSpecies.rarity?.name === "Epic" && !currSpecies.species.shiny
            ? currProfile.epicCards - WILDCARD_COST
            : currSpecies.rarity?.name === "Epic" && currSpecies.species.shiny
              ? currProfile.epicCards - SHINY_WILDCARD_COST
              : currProfile.epicCards,
        legendaryCards:
          currSpecies.rarity?.name === "Legendary" && !currSpecies.species.shiny
            ? currProfile.legendaryCards - WILDCARD_COST
            : currSpecies.rarity?.name === "Legendary" &&
                currSpecies.species.shiny
              ? currProfile.legendaryCards - SHINY_WILDCARD_COST
              : currProfile.legendaryCards,
        instanceCount: currProfile.instanceCount + 1,
      })
      .where(eq(profiles.userId, session.user.id));

    await tx
      .insert(instances)
      .values({ userId: session.user.id, speciesId: body.data.speciesId });
  });

  return Response.json({
    message: `You have successfully purhcased a ${currSpecies.species.shiny && `Shiny`} ${currSpecies.species.name[0].toUpperCase() + currSpecies.species.name.slice(1)}!`,
  });
}
