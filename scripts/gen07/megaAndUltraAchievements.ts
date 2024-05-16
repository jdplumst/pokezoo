import { db } from "@/src/server/db";
import { achievements } from "@/src/server/db/schema";

const populateMegaAndUltraAchievements = async () => {
  console.log("here");
  await db.insert(achievements).values({
    description: "Catch all Mega Pokémon",
    tier: 6,
    yield: 50000,
    typeId: 1,
    attributeId: 32,
    generation: 0,
    shiny: false,
    regionId: 6, // this value doesn't matter since generation is 0
  });

  await db.insert(achievements).values({
    description: "Catch all Ultra Beast Pokémon",
    tier: 6,
    yield: 50000,
    typeId: 1,
    attributeId: 33,
    generation: 0,
    shiny: false,
    regionId: 7, // this value doesn't matter since generation is 0
  });
};

populateMegaAndUltraAchievements();
