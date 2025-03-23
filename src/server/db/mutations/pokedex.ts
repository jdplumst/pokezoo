import "server-only";

import { eq } from "drizzle-orm";
import { calcNewYield } from "~/lib/calc-new-yield";
import { SHINY_WILDCARD_COST, WILDCARD_COST } from "~/lib/constants";
import { updateUserQuest } from "~/lib/update-user-quest";
import { withinInstanceLimit } from "~/lib/within-instance-limit";
import { db } from "~/server/db";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";
import { instances, profiles, rarities, species } from "~/server/db/schema";
import { type ErrorResponse, type MessageResponse } from "~/lib/types";

export async function purchasePokemon(
  speciesId: string,
): Promise<MessageResponse | ErrorResponse> {
  const session = await isAuthed();

  const currProfile = await hasProfile();

  const currSpecies = (
    await db
      .select()
      .from(species)
      .leftJoin(rarities, eq(species.rarityId, rarities.id))
      .where(eq(species.id, speciesId))
  )[0];

  if (!currSpecies) {
    return {
      success: false,
      error: "The Pokémon you are trying to purchase does not exist.",
    };
  }

  if (
    (currSpecies.rarity?.name === "Common" &&
      !currSpecies.species.shiny &&
      currProfile.profile.commonCards < WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Common" &&
      currSpecies.species.shiny &&
      currProfile.profile.commonCards < SHINY_WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Rare" &&
      !currSpecies.species.shiny &&
      currProfile.profile.rareCards < WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Rare" &&
      currSpecies.species.shiny &&
      currProfile.profile.rareCards < SHINY_WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Epic" &&
      !currSpecies.species.shiny &&
      currProfile.profile.epicCards < WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Epic" &&
      currSpecies.species.shiny &&
      currProfile.profile.epicCards < SHINY_WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Legendary" &&
      !currSpecies.species.shiny &&
      currProfile.profile.legendaryCards < WILDCARD_COST) ||
    (currSpecies.rarity?.name === "Legendary" &&
      currSpecies.species.shiny &&
      currProfile.profile.legendaryCards < SHINY_WILDCARD_COST)
  ) {
    return { success: false, error: "You cannot afford this Pokémon." };
  }

  if (
    !withinInstanceLimit(
      currProfile.profile.instanceCount,
      !!currProfile.catchingCharm,
    )
  ) {
    return {
      success: false,
      error:
        "You have reached your Pokémon limit. Sell Pokémon if you want to buy more.",
    };
  }

  await updateUserQuest(currSpecies.species, session.user.id);

  const newYield = calcNewYield(
    currProfile.profile.totalYield,
    currSpecies.species.yield,
    "add",
  );

  await db.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({
        totalYield: newYield,
        commonCards:
          currSpecies.rarity?.name === "Common" && !currSpecies.species.shiny
            ? currProfile.profile.commonCards - WILDCARD_COST
            : currSpecies.rarity?.name === "Common" && currSpecies.species.shiny
              ? currProfile.profile.commonCards - SHINY_WILDCARD_COST
              : currProfile.profile.commonCards,
        rareCards:
          currSpecies.rarity?.name === "Rare" && !currSpecies.species.shiny
            ? currProfile.profile.rareCards - WILDCARD_COST
            : currSpecies.rarity?.name === "Rare" && currSpecies.species.shiny
              ? currProfile.profile.rareCards - SHINY_WILDCARD_COST
              : currProfile.profile.rareCards,
        epicCards:
          currSpecies.rarity?.name === "Epic" && !currSpecies.species.shiny
            ? currProfile.profile.epicCards - WILDCARD_COST
            : currSpecies.rarity?.name === "Epic" && currSpecies.species.shiny
              ? currProfile.profile.epicCards - SHINY_WILDCARD_COST
              : currProfile.profile.epicCards,
        legendaryCards:
          currSpecies.rarity?.name === "Legendary" && !currSpecies.species.shiny
            ? currProfile.profile.legendaryCards - WILDCARD_COST
            : currSpecies.rarity?.name === "Legendary" &&
                currSpecies.species.shiny
              ? currProfile.profile.legendaryCards - SHINY_WILDCARD_COST
              : currProfile.profile.legendaryCards,
        instanceCount: currProfile.profile.instanceCount + 1,
      })
      .where(eq(profiles.userId, session.user.id));

    await tx
      .insert(instances)
      .values({ userId: session.user.id, speciesId: speciesId });
  });

  return {
    success: true,
    message: `You have successfully purhcased a ${currSpecies.species.shiny === true ? `Shiny` : ``} ${currSpecies.species.name[0].toUpperCase() + currSpecies.species.name.slice(1)}!`,
  };
}
