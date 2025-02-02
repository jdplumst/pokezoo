"use server";
import "server-only";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import {
  achievements,
  achievementTypes,
  attributes,
  habitats,
  instances,
  profiles,
  rarities,
  regions,
  species,
  types,
  userAchievements,
} from "@/server//db/schema";
import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { revalidatePath } from "next/cache";
import { calcNewYield } from "@/utils/calcNewYield";

export async function getAchievements() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const typeOne = alias(types, "typeOne");
  const typeTwo = alias(types, "typeTwo");

  const achievementsData = await db
    .select({
      id: achievements.id,
      description: achievements.description,
      tier: achievements.tier,
      yield: achievements.yield,
      type: achievementTypes.name,
      attribute: attributes.name,
      region: regions.name,
      shiny: achievements.shiny,
      generation: achievements.generation,
      claimed: userAchievements.id,
    })
    .from(achievements)
    .leftJoin(
      userAchievements,
      and(
        eq(userAchievements.achievementId, achievements.id),
        eq(userAchievements.userId, session.user.id),
      ),
    )
    .innerJoin(achievementTypes, eq(achievements.typeId, achievementTypes.id))
    .innerJoin(attributes, eq(achievements.attributeId, attributes.id))
    .innerJoin(regions, eq(achievements.regionId, regions.id));

  const speciesData = await db
    .select({
      speciesId: species.id,
      instanceId: instances.id,
      region: regions.name,
      rarity: rarities.name,
      habitat: habitats.name,
      shiny: species.shiny,
      typeOne: typeOne.name,
      typeTwo: typeTwo.name,
    })
    .from(species)
    .leftJoin(
      instances,
      and(
        eq(instances.speciesId, species.id),
        eq(instances.userId, session.user.id),
      ),
    )
    .innerJoin(regions, eq(regions.id, species.regionId))
    .innerJoin(rarities, eq(rarities.id, species.rarityId))
    .innerJoin(habitats, eq(habitats.id, species.habitatId))
    .innerJoin(typeOne, eq(typeOne.id, species.typeOneId))
    .leftJoin(typeTwo, eq(typeTwo.id, species.typeTwoId));

  const fullAchievements = [];

  for (const a of achievementsData) {
    let max = 0;
    let value = 0;

    if (a.type === "All") {
      max = speciesData.filter(
        (s) =>
          s.region === a.region &&
          s.shiny === a.shiny &&
          ["Common", "Rare", "Epic", "Legendary"].includes(s.rarity),
      ).length;
      value = speciesData.filter(
        (i) =>
          i.instanceId &&
          i.region === a.region &&
          i.shiny === a.shiny &&
          ["Common", "Rare", "Epic", "Legendary"].includes(i.rarity),
      ).length;
    } else if (a.type === "Rarity") {
      max = speciesData.filter(
        (s) =>
          s.rarity === a.attribute &&
          (a.generation ? s.region === a.region : s.region) &&
          s.shiny === a.shiny,
      ).length;
      value = speciesData.filter(
        (i) =>
          i.instanceId &&
          i.rarity === a.attribute &&
          (a.generation ? i.region === a.region : i.region) &&
          i.shiny === a.shiny,
      ).length;
    } else if (a.type === "Habitat") {
      max = speciesData.filter(
        (s) =>
          s.habitat === a.attribute &&
          s.region === a.region &&
          s.shiny === a.shiny &&
          ["Common", "Rare", "Epic", "Legendary"].includes(s.rarity),
      ).length;
      value = speciesData.filter(
        (i) =>
          i.instanceId &&
          i.habitat === a.attribute &&
          i.region === a.region &&
          i.shiny === a.shiny &&
          ["Common", "Rare", "Epic", "Legendary"].includes(i.rarity),
      ).length;
    } else if (a.type === "Type") {
      max = speciesData.filter(
        (s) =>
          (s.typeOne === a.attribute || s.typeTwo === a.attribute) &&
          s.region === a.region &&
          s.shiny === a.shiny &&
          ["Common", "Rare", "Epic", "Legendary"].includes(s.rarity),
      ).length;
      value = speciesData.filter(
        (i) =>
          i.instanceId &&
          (i.typeOne === a.attribute || i.typeTwo === a.attribute) &&
          i.region === a.region &&
          i.shiny === a.shiny &&
          ["Common", "Rare", "Epic", "Legendary"].includes(i.rarity),
      ).length;
    }

    const percent = Math.round((value / max) * 100);

    fullAchievements.push({
      achievement: a,
      max: max,
      value: value,
      percent: percent,
    });
  }

  fullAchievements.sort(function (a, b) {
    if (a.achievement.claimed == b.achievement.claimed) {
      return b.percent - a.percent;
    }
    return a.achievement.claimed ? 1 : -1;
  });

  return fullAchievements;
}

export async function claimAchievement(achievementId: string) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const currProfile = (
    await db
      .select({ totalYield: profiles.totalYield })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
  )[0];

  if (!currProfile) {
    redirect("/onboarding)");
  }

  const achievementData = (
    await db
      .select()
      .from(achievements)
      .where(eq(achievements.id, achievementId))
  )[0];

  if (!achievementData) {
    throw new Error("The achievement you are trying to claim does not exist.");
  }

  const exists = (
    await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, session.user.id),
          eq(userAchievements.achievementId, achievementId),
        ),
      )
  )[0];

  if (exists) {
    revalidatePath("/achievements");
  }

  const newYield = calcNewYield(currProfile.totalYield, achievementData.yield);

  await db.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({ totalYield: newYield })
      .where(eq(profiles.userId, session.user.id));

    await tx.insert(userAchievements).values({
      userId: session.user.id,
      achievementId: achievementId,
    });
  });

  revalidatePath("/achievements");
}
