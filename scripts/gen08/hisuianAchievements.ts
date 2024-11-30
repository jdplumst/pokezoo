import { db } from "@/src/server/db";
import { achievements } from "@/src/server/db/schema";

const populateHisuianAchievements = async () => {
  await db.insert(achievements).values({
    description: "Catch all Common Pokémon in Hisui",
    tier: 1,
    yield: 1000,
    typeId: 1,
    attributeId: 1,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Rare Pokémon in Hisui",
    tier: 2,
    yield: 2000,
    typeId: 1,
    attributeId: 2,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Epic Pokémon in Hisui",
    tier: 3,
    yield: 5000,
    typeId: 1,
    attributeId: 3,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Legendary Pokémon in Hisui",
    tier: 4,
    yield: 10000,
    typeId: 1,
    attributeId: 4,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Grassland Pokémon in Hisui",
    tier: 3,
    yield: 5000,
    typeId: 2,
    attributeId: 5,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Forest Pokémon in Hisui",
    tier: 3,
    yield: 5000,
    typeId: 2,
    attributeId: 6,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Waters-Edge Pokémon in Hisui",
    tier: 2,
    yield: 2000,
    typeId: 2,
    attributeId: 7,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Sea Pokémon in Hisui",
    tier: 2,
    yield: 2000,
    typeId: 2,
    attributeId: 8,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Cave Pokémon in Hisui",
    tier: 1,
    yield: 1000,
    typeId: 2,
    attributeId: 9,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Mountain Pokémon in Hisui",
    tier: 2,
    yield: 2000,
    typeId: 2,
    attributeId: 10,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Urban Pokémon in Hisui",
    tier: 2,
    yield: 2000,
    typeId: 2,
    attributeId: 12,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Rare (Habitat) Pokémon in Hisui",
    tier: 4,
    yield: 10000,
    typeId: 2,
    attributeId: 2,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Normal Type Pokémon in Hisui",
    tier: 1,
    yield: 1000,
    typeId: 3,
    attributeId: 13,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Fire Type Pokémon in Hisui",
    tier: 2,
    yield: 2000,
    typeId: 3,
    attributeId: 14,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Fighting Type Pokémon in Hisui",
    tier: 3,
    yield: 5000,
    typeId: 3,
    attributeId: 15,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Water Type Pokémon in Hisui",
    tier: 2,
    yield: 2000,
    typeId: 3,
    attributeId: 16,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Flying Type Pokémon in Hisui",
    tier: 3,
    yield: 5000,
    typeId: 3,
    attributeId: 17,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Grass Type Pokémon in Hisui",
    tier: 2,
    yield: 2000,
    typeId: 3,
    attributeId: 18,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Poison Type Pokémon in Hisui",
    tier: 1,
    yield: 1000,
    typeId: 3,
    attributeId: 19,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Electric Type Pokémon in Hisui",
    tier: 2,
    yield: 2000,
    typeId: 3,
    attributeId: 20,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Ground Type Pokémon in Hisui",
    tier: 1,
    yield: 1000,
    typeId: 3,
    attributeId: 21,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Psychic Type Pokémon in Hisui",
    tier: 4,
    yield: 10000,
    typeId: 3,
    attributeId: 22,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Rock Type Pokémon in Hisui",
    tier: 1,
    yield: 1000,
    typeId: 3,
    attributeId: 23,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Ice Type Pokémon in Hisui",
    tier: 1,
    yield: 1000,
    typeId: 3,
    attributeId: 24,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Bug Type Pokémon in Hisui",
    tier: 1,
    yield: 1000,
    typeId: 3,
    attributeId: 25,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Dragon Type Pokémon in Hisui",
    tier: 4,
    yield: 10000,
    typeId: 3,
    attributeId: 26,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Ghost Type Pokémon in Hisui",
    tier: 2,
    yield: 2000,
    typeId: 3,
    attributeId: 27,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Steel Type Pokémon in Hisui",
    tier: 4,
    yield: 10000,
    typeId: 3,
    attributeId: 28,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Fairy Type Pokémon in Hisui",
    tier: 2,
    yield: 2000,
    typeId: 3,
    attributeId: 29,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Dark Type Pokémon in Hisui",
    tier: 2,
    yield: 2000,
    typeId: 3,
    attributeId: 30,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Pokémon in Hisui",
    tier: 5,
    yield: 20000,
    typeId: 4,
    attributeId: 31,
    generation: 8,
    shiny: false,
    regionId: 9,
  });
  await db.insert(achievements).values({
    description: "Catch all Gigantamax Pokémon",
    tier: 6,
    yield: 50000,
    typeId: 1,
    attributeId: 34,
    generation: 0,
    shiny: false,
    regionId: 7, // this value doesn't matter since generation is 0
  });
};

populateHisuianAchievements();
