// @ts-nocheck

import { db } from "@/src/server/db";
import { achievements } from "@/src/server/db/schema";
import { ZodAchievementType, ZodAttribute, ZodRegion } from "@/src/utils/zod";

const populateGenSixAchievements = async () => {
  await db.insert(achievements).values({
    description: "Catch all Common Pokémon in Kalos",
    tier: 1,
    yield: 1000,
    type: ZodAchievementType.Values.Rarity,
    attribute: ZodAttribute.Values.Common,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Rare Pokémon in Kalos",
    tier: 2,
    yield: 2000,
    type: ZodAchievementType.Values.Rarity,
    attribute: ZodAttribute.Values.Rare,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Epic Pokémon in Kalos",
    tier: 3,
    yield: 5000,
    type: ZodAchievementType.Values.Rarity,
    attribute: ZodAttribute.Values.Epic,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Legendary Pokémon in Kalos",
    tier: 4,
    yield: 10000,
    type: ZodAchievementType.Values.Rarity,
    attribute: ZodAttribute.Values.Legendary,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Grassland Pokémon in Kalos",
    tier: 3,
    yield: 5000,
    type: ZodAchievementType.Values.Habitat,
    attribute: ZodAttribute.Values.Grassland,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Forest Pokémon in Kalos",
    tier: 3,
    yield: 5000,
    type: ZodAchievementType.Values.Habitat,
    attribute: ZodAttribute.Values.Forest,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Waters-Edge Pokémon in Kalos",
    tier: 2,
    yield: 2000,
    type: ZodAchievementType.Values.Habitat,
    attribute: ZodAttribute.Values.WatersEdge,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Sea Pokémon in Kalos",
    tier: 2,
    yield: 2000,
    type: ZodAchievementType.Values.Habitat,
    attribute: ZodAttribute.Values.Sea,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Cave Pokémon in Kalos",
    tier: 1,
    yield: 1000,
    type: ZodAchievementType.Values.Habitat,
    attribute: ZodAttribute.Values.Cave,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Mountain Pokémon in Kalos",
    tier: 2,
    yield: 2000,
    type: ZodAchievementType.Values.Habitat,
    attribute: ZodAttribute.Values.Mountain,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Rough-Terrain Pokémon in Kalos",
    tier: 1,
    yield: 1000,
    type: ZodAchievementType.Values.Habitat,
    attribute: ZodAttribute.Values.RoughTerrain,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Urban Pokémon in Kalos",
    tier: 2,
    yield: 2000,
    type: ZodAchievementType.Values.Habitat,
    attribute: ZodAttribute.Values.Urban,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Rare (Habitat) Pokémon in Kalos",
    tier: 4,
    yield: 10000,
    type: ZodAchievementType.Values.Habitat,
    attribute: ZodAttribute.Values.Rare,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Normal Type Pokémon in Kalos",
    tier: 1,
    yield: 1000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Normal,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Fire Type Pokémon in Kalos",
    tier: 2,
    yield: 2000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Fire,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Fighting Type Pokémon in Kalos",
    tier: 3,
    yield: 5000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Fighting,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Water Type Pokémon in Kalos",
    tier: 2,
    yield: 2000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Water,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Flying Type Pokémon in Kalos",
    tier: 3,
    yield: 5000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Flying,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Grass Type Pokémon in Kalos",
    tier: 2,
    yield: 2000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Grass,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Poison Type Pokémon in Kalos",
    tier: 1,
    yield: 1000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Poison,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Electric Type Pokémon in Kalos",
    tier: 2,
    yield: 2000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Electric,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Ground Type Pokémon in Kalos",
    tier: 1,
    yield: 1000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Ground,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Psychic Type Pokémon in Kalos",
    tier: 4,
    yield: 10000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Psychic,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Rock Type Pokémon in Kalos",
    tier: 1,
    yield: 1000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Rock,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Ice Type Pokémon in Kalos",
    tier: 1,
    yield: 1000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Ice,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Bug Type Pokémon in Kalos",
    tier: 1,
    yield: 1000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Bug,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Dragon Type Pokémon in Kalos",
    tier: 4,
    yield: 10000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Dragon,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Ghost Type Pokémon in Kalos",
    tier: 2,
    yield: 2000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Ghost,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Dark Type Pokémon in Kalos",
    tier: 2,
    yield: 2000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Dark,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Steel Type Pokémon in Kalos",
    tier: 4,
    yield: 10000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Steel,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Fairy Type Pokémon in Kalos",
    tier: 2,
    yield: 2000,
    type: ZodAchievementType.Values.Type,
    attribute: ZodAttribute.Values.Fairy,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
  await db.insert(achievements).values({
    description: "Catch all Pokémon in Kalos",
    tier: 5,
    yield: 20000,
    type: ZodAchievementType.Values.All,
    attribute: ZodAttribute.Values.All,
    generation: 6,
    shiny: false,
    region: ZodRegion.Values.Kalos,
  });
};

populateGenSixAchievements();
