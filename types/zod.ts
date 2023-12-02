import {
  AchievementType,
  Attribute,
  Habitat,
  Rarity,
  Region,
  SpeciesType
} from "@prisma/client";
import { z } from "zod";

export const ZodSort = z.enum([
  "Oldest",
  "Newest",
  "Pokedex",
  "PokedexDesc",
  "Rarity",
  "RarityDesc"
]);

export const ZodTime = z.enum(["day", "night"]);

// let oink: [string, ...string[]] = ["Rarity", "Habitat", "Type", "All"];
// const ZodOink = z.enum(["Rarity", "Habitat", "Type", "All"]);
// export const DBOink = Object.values(ZodOink) as [string, ...string[]];
// const TypeOink = <z.infer<typeof ZodOink>>;

// Prisma enums
export const ZodRarity = z.nativeEnum(Rarity);
export const ZodRegion = z.nativeEnum(Region);
export const ZodSpeciesType = z.nativeEnum(SpeciesType);
export const ZodHabitat = z.nativeEnum(Habitat);
export const ZodAttribute = z.nativeEnum(Attribute);
export const ZodAchievementType = z.nativeEnum(AchievementType);
