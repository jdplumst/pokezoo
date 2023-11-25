import { Region, Rarity, SpeciesType, Habitat } from "@prisma/client";

export const MAX_BALANCE = 1000000000;
export const MAX_YIELD = 1000000000;

export const WILDCARD_COST = 10;
export const SHINY_WILDCARD_COST = 100;

export const RegionsList: Region[] = Object.values(Region);
export const RaritiesList: Rarity[] = Object.values(Rarity);
export const TypesList: SpeciesType[] = Object.values(SpeciesType);
export const HabitatList: Habitat[] = Object.values(Habitat);
