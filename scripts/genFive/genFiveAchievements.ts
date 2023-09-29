import { AchievementType, Attribute, Region } from "@prisma/client";
import { prisma } from "../../src/server/db";

const populateGenFiveAchievements = async () => {
  await prisma.achievement.create({
    data: {
      description: "Catch all Common Pokémon in Unova",
      tier: 1,
      yield: 1000,
      type: AchievementType.Rarity,
      attribute: Attribute.Common,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Rare Pokémon in Unova",
      tier: 2,
      yield: 2000,
      type: AchievementType.Rarity,
      attribute: Attribute.Rare,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Epic Pokémon in Unova",
      tier: 3,
      yield: 5000,
      type: AchievementType.Rarity,
      attribute: Attribute.Epic,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Legendary Pokémon in Unova",
      tier: 4,
      yield: 10000,
      type: AchievementType.Rarity,
      attribute: Attribute.Legendary,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Grassland Pokémon in Unova",
      tier: 3,
      yield: 5000,
      type: AchievementType.Habitat,
      attribute: Attribute.Grassland,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Forest Pokémon in Unova",
      tier: 3,
      yield: 5000,
      type: AchievementType.Habitat,
      attribute: Attribute.Forest,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Waters-Edge Pokémon in Unova",
      tier: 2,
      yield: 2000,
      type: AchievementType.Habitat,
      attribute: Attribute.WatersEdge,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Sea Pokémon in Unova",
      tier: 2,
      yield: 2000,
      type: AchievementType.Habitat,
      attribute: Attribute.Sea,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Cave Pokémon in Unova",
      tier: 1,
      yield: 1000,
      type: AchievementType.Habitat,
      attribute: Attribute.Cave,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Mountain Pokémon in Unova",
      tier: 2,
      yield: 2000,
      type: AchievementType.Habitat,
      attribute: Attribute.Mountain,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Rough-Terrain Pokémon in Unova",
      tier: 1,
      yield: 1000,
      type: AchievementType.Habitat,
      attribute: Attribute.RoughTerrain,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Urban Pokémon in Unova",
      tier: 2,
      yield: 2000,
      type: AchievementType.Habitat,
      attribute: Attribute.Urban,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Rare (Habitat) Pokémon in Unova",
      tier: 4,
      yield: 10000,
      type: AchievementType.Habitat,
      attribute: Attribute.Rare,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Normal Type Pokémon in Unova",
      tier: 1,
      yield: 1000,
      type: AchievementType.Type,
      attribute: Attribute.Normal,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Fire Type Pokémon in Unova",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: Attribute.Fire,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Fighting Type Pokémon in Unova",
      tier: 3,
      yield: 5000,
      type: AchievementType.Type,
      attribute: Attribute.Fighting,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Water Type Pokémon in Unova",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: Attribute.Water,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Flying Type Pokémon in Unova",
      tier: 3,
      yield: 5000,
      type: AchievementType.Type,
      attribute: Attribute.Flying,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Grass Type Pokémon in Unova",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: Attribute.Grass,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Poison Type Pokémon in Unova",
      tier: 1,
      yield: 1000,
      type: AchievementType.Type,
      attribute: Attribute.Poison,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Electric Type Pokémon in Unova",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: Attribute.Electric,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Ground Type Pokémon in Unova",
      tier: 1,
      yield: 1000,
      type: AchievementType.Type,
      attribute: Attribute.Ground,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Psychic Type Pokémon in Unova",
      tier: 4,
      yield: 10000,
      type: AchievementType.Type,
      attribute: Attribute.Psychic,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Rock Type Pokémon in Unova",
      tier: 1,
      yield: 1000,
      type: AchievementType.Type,
      attribute: Attribute.Rock,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Ice Type Pokémon in Unova",
      tier: 1,
      yield: 1000,
      type: AchievementType.Type,
      attribute: Attribute.Ice,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Bug Type Pokémon in Unova",
      tier: 1,
      yield: 1000,
      type: AchievementType.Type,
      attribute: Attribute.Bug,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Dragon Type Pokémon in Unova",
      tier: 4,
      yield: 10000,
      type: AchievementType.Type,
      attribute: Attribute.Dragon,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Ghost Type Pokémon in Unova",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: Attribute.Ghost,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Dark Type Pokémon in Unova",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: Attribute.Dark,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Steel Type Pokémon in Unova",
      tier: 4,
      yield: 10000,
      type: AchievementType.Type,
      attribute: Attribute.Steel,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Fairy Type Pokémon in Unova",
      tier: 2,
      yield: 2000,
      type: AchievementType.Type,
      attribute: Attribute.Fairy,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
  await prisma.achievement.create({
    data: {
      description: "Catch all Pokémon in Unova",
      tier: 5,
      yield: 20000,
      type: AchievementType.All,
      attribute: Attribute.All,
      generation: 4,
      shiny: false,
      region: Region.Unova
    }
  });
};

populateGenFiveAchievements();
