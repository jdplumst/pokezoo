"use server";

import { hasProfile, isAuthed } from "@/server/actions/auth";
import { db } from "@/server/db";
import { instances, profiles, rarities, species } from "@/server/db/schema";
import { calcNewYield } from "@/utils/calcNewYield";
import { SHINY_WILDCARD_COST, WILDCARD_COST } from "@/utils/constants";
import { updateUserQuest } from "@/utils/updateUserQuest";
import { withinInstanceLimit } from "@/utils/withinInstanceLimit";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function purchasePokemon(
  _previousState: unknown,
  formData: FormData,
) {
  const session = await isAuthed();

  const currProfile = await hasProfile();

  const formSchema = z.object({
    speciesId: z.string(),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      error: "Something went wrong. Please try again.",
    };
  }

  const currSpecies = (
    await db
      .select()
      .from(species)
      .leftJoin(rarities, eq(species.rarityId, rarities.id))
      .where(eq(species.id, input.data.speciesId))
  )[0];

  if (!currSpecies) {
    return {
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
    return { error: "You cannot afford this Pokémon." };
  }

  if (
    !withinInstanceLimit(
      currProfile.profile.instanceCount,
      !!currProfile.catchingCharm,
    )
  ) {
    return {
      error:
        "You have reached your Pokémon limit. Sell Pokémon if you want to buy more.",
    };
  }

  await updateUserQuest(currSpecies.species, session.user.id);

  const newYield = calcNewYield(
    currProfile.profile.totalYield,
    currSpecies.species.yield,
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
      .values({ userId: session.user.id, speciesId: input.data.speciesId });
  });

  return {
    message: `You have successfully purhcased a ${currSpecies.species.shiny === true ? `Shiny` : ``} ${currSpecies.species.name[0].toUpperCase() + currSpecies.species.name.slice(1)}!`,
  };
}
