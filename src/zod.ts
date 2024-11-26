import { z } from "zod";

export const ZodTheme = z.enum(["blue", "purple", "green", "orange"]);

export const ZodSort = z.enum([
  "Oldest",
  "Newest",
  "Pokedex",
  "PokedexDesc",
  "Rarity",
  "RarityDesc",
]);

export const ZodTime = z.enum(["day", "night"]);

// Drizzle enums
export const DBRegion = [
  "Kanto",
  "Johto",
  "Hoenn",
  "Sinnoh",
  "Unova",
  "Kalos",
  "Alola",
  "Galar",
  "Hisui",
] as const;
export const ZodRegion = z.enum(DBRegion);

export const DBRarity = [
  "Common",
  "Rare",
  "Epic",
  "Legendary",
  "Mega",
  "Ultra Beast",
  "Gigantamax",
] as const;
export const ZodRarity = z.enum(DBRarity);

export const DBSpeciesType = [
  "Normal",
  "Grass",
  "Bug",
  "Fire",
  "Electric",
  "Ground",
  "Water",
  "Fighting",
  "Poison",
  "Rock",
  "Ice",
  "Ghost",
  "Psychic",
  "Fairy",
  "Dark",
  "Dragon",
  "Steel",
  "Flying",
] as const;
export const ZodSpeciesType = z.enum(DBSpeciesType);

export const DBHabitat = [
  "Grassland",
  "Forest",
  "Waters-Edge",
  "Sea",
  "Cave",
  "Mountain",
  "Rough-Terrain",
  "Urban",
  "Rare",
] as const;
export const ZodHabitat = z.enum(DBHabitat);

export const DBAttribute = [
  "Common",
  "Rare",
  "Epic",
  "Legendary",
  "Grassland",
  "Forest",
  "Waters-Edge",
  "Sea",
  "Cave",
  "Mountain",
  "Rough-Terrain",
  "Urban",
  "Normal",
  "Fire",
  "Fighting",
  "Water",
  "Flying",
  "Grass",
  "Poison",
  "Electric",
  "Ground",
  "Psychic",
  "Rock",
  "Ice",
  "Bug",
  "Dragon",
  "Ghost",
  "Steel",
  "Fairy",
  "Dark",
  "All",
] as const;
export const ZodAttribute = z.enum(DBAttribute);

export const DBAchivementType = ["Rarity", "Habitat", "Type", "All"] as const;
export const ZodAchievementType = z.enum(DBAchivementType);

export const ZodSpecies = z.object({
  id: z.string(),
  pokedexNumber: z.number(),
  name: z.string(),
  rarity: z.string(),
  yield: z.number(),
  img: z.string(),
  sellPrice: z.number(),
  shiny: z.boolean(),
  typeOne: z.string(),
  typeTwo: z.string().nullish(),
  generation: z.number(),
  habitat: z.string(),
  region: z.string(),
});

export const ZodAchievement = z.object({
  id: z.string(),
  description: z.string(),
  tier: z.number(),
  yield: z.number(),
  type: z.string(),
  attribute: z.string(),
  region: z.string(),
  shiny: z.boolean(),
  generation: z.number(),
});
