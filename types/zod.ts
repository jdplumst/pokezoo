import {
  AchievementType,
  Attribute,
  Habitat,
  Instance,
  Rarity,
  Region,
  SpeciesType
} from "@prisma/client";
import { z } from "zod";

export const ZodSort = z.enum(["Oldest", "Newest", "Pokedex", "Rarity"]);

// Prisma enums
export const ZodRarity = z.nativeEnum(Rarity);
export const ZodRegion = z.nativeEnum(Region);
export const ZodSpeciesType = z.nativeEnum(SpeciesType);
export const ZodHabitat = z.nativeEnum(Habitat);
export const ZodAttribute = z.nativeEnum(Attribute);
export const ZodAchievementType = z.nativeEnum(AchievementType);