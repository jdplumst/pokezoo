//@ts-nocheck

import { AchievementType } from "@prisma/client";
import { prisma } from "../src/server/db";

const populateGenFourAchievements = async () => {
  await prisma.achievement.create({
    data: {
      description: "Catch all Common Pokémon in Sinnoh",
      tier: 1,
      yield: 1000,
      type: AchievementType.Rarity,
      attribute: "Common",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Rare Pokémon in Sinnoh",
      tier: 2,
      yield: 2000,
      type: AchievementType.Rarity,
      attribute: "Rare",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Epic Pokémon in Sinnoh",
      tier: 3,
      yield: 5000,
      type: AchievementType.Rarity,
      attribute: "Epic",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Legendary Pokémon in Sinnoh",
      tier: 4,
      yield: 10000,
      type: AchievementType.Rarity,
      attribute: "Legendary",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Grassland Pokémon in Sinnoh",
      tier: 3,
      yield: 5000,
      type: AchievementType.Habitat,
      attribute: "grassland",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Forest Pokémon in Sinnoh",
      tier: 3,
      yield: 5000,
      type: AchievementType.Habitat,
      attribute: "forest",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Waters-Edge Pokémon in Sinnoh",
      tier: 2,
      yield: 2000,
      type: AchievementType.Habitat,
      attribute: "waters-edge",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Sea Pokémon in Sinnoh",
      tier: 2,
      yield: 2000,
      type: AchievementType.Habitat,
      attribute: "sea",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Cave Pokémon in Sinnoh",
      tier: 1,
      yield: 1000,
      type: AchievementType.Habitat,
      attribute: "cave",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Mountain Pokémon in Sinnoh",
      tier: 2,
      yield: 2000,
      type: AchievementType.Habitat,
      attribute: "mountain",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Rough-Terrain Pokémon in Sinnoh",
      tier: 1,
      yield: 1000,
      type: AchievementType.Habitat,
      attribute: "rough-terrain",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Urban Pokémon in Sinnoh",
      tier: 2,
      yield: 2000,
      type: AchievementType.Habitat,
      attribute: "urban",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Rare (Habitat) Pokémon in Sinnoh",
      tier: 4,
      yield: 10000,
      type: AchievementType.Habitat,
      attribute: "rare",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Normal Type Pokémon in Sinnoh",
      tier: 1,
      yield: 1000,
      type: AchievementType.Type,
      attribute: "normal",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Fire Type Pokémon in Sinnoh",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: "fire",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Fighting Type Pokémon in Sinnoh",
      tier: 3,
      yield: 5000,
      type: AchievementType.Type,
      attribute: "fighting",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Water Type Pokémon in Sinnoh",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: "water",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Flying Type Pokémon in Sinnoh",
      tier: 3,
      yield: 5000,
      type: AchievementType.Type,
      attribute: "flying",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Grass Type Pokémon in Sinnoh",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: "grass",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Poison Type Pokémon in Sinnoh",
      tier: 1,
      yield: 1000,
      type: AchievementType.Type,
      attribute: "poison",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Electric Type Pokémon in Sinnoh",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: "electric",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Ground Type Pokémon in Sinnoh",
      tier: 1,
      yield: 1000,
      type: AchievementType.Type,
      attribute: "ground",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Psychic Type Pokémon in Sinnoh",
      tier: 4,
      yield: 10000,
      type: AchievementType.Type,
      attribute: "psychic",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Rock Type Pokémon in Sinnoh",
      tier: 1,
      yield: 1000,
      type: AchievementType.Type,
      attribute: "rock",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Ice Type Pokémon in Sinnoh",
      tier: 1,
      yield: 1000,
      type: AchievementType.Type,
      attribute: "ice",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Bug Type Pokémon in Sinnoh",
      tier: 1,
      yield: 1000,
      type: AchievementType.Type,
      attribute: "bug",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Dragon Type Pokémon in Sinnoh",
      tier: 4,
      yield: 10000,
      type: AchievementType.Type,
      attribute: "dragon",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Ghost Type Pokémon in Sinnoh",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: "ghost",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Dark Type Pokémon in Sinnoh",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: "dark",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Steel Type Pokémon in Sinnoh",
      tier: 4,
      yield: 10000,
      type: AchievementType.Type,
      attribute: "steel",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Fairy Type Pokémon in Sinnoh",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: "fairy",
      generation: 4,
      shiny: false,
    },
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Pokémon in Sinnoh",
      tier: 5,
      yield: 20000,
      type: AchievementType.All,
      attribute: "all",
      generation: 4,
      shiny: false,
    },
  });
};

populateGenFourAchievements();
