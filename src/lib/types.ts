import { z } from "zod";

export const ThemeValues = ["blue", "purple", "green", "orange"] as const;
export type Theme = (typeof ThemeValues)[number];
export const ZodTheme = z.enum(ThemeValues);

export const EventValues = ["Christmas", "New Year's", "PokéZoo Day"] as const;
export type Event = (typeof EventValues)[number];
export const ZodEvent = z.enum(EventValues);

export const SortValues = [
  "Oldest",
  "Newest",
  "Pokedex",
  "Pokedex Desc.",
  "Rarity",
  "Rarity Desc.",
] as const;
export type Sort = (typeof SortValues)[number];
export const ZodSort = z.enum(SortValues);

export const TimeValues = ["day", "night"] as const;
export type Time = (typeof TimeValues)[number];
export const ZodTime = z.enum(TimeValues);

export const RegionValues = [
  "Kanto",
  "Johto",
  "Hoenn",
  "Sinnoh",
  "Unova",
  "Kalos",
  "Alola",
  "Galar",
  "Hisui",
  "Paldea",
] as const;
export type Region = (typeof RegionValues)[number];
export const ZodRegion = z.enum(RegionValues);

export const RarityValues = [
  "Common",
  "Rare",
  "Epic",
  "Legendary",
  "Mega",
  "Ultra Beast",
  "Gigantamax",
  "Paradox",
] as const;
export type Rarity = (typeof RarityValues)[number];
export const ZodRarity = z.enum(RarityValues);

export const SpeciesTypeValues = [
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
export type SpeciesType = (typeof SpeciesTypeValues)[number];
export const ZodSpeciesType = z.enum(SpeciesTypeValues);

export const HabitatValues = [
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
export type Habitat = (typeof HabitatValues)[number];
export const ZodHabitat = z.enum(HabitatValues);

export const AttributeValues = [
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
export type Attribute = (typeof AttributeValues)[number];
export const ZodAttribute = z.enum(AttributeValues);

export const AchievementTypeValues = [
  "Rarity",
  "Habitat",
  "Type",
  "All",
] as const;
export type AchievementType = (typeof AchievementTypeValues)[number];
export const ZodAchievementType = z.enum(AchievementTypeValues);

export type MessageResponse = { success: true; message: string };
export type ErrorResponse = { success: false; error: string };
