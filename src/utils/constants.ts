import { DBHabitat, DBRarity, DBRegion, DBSpeciesType } from "@/utils/zod";

export const MAX_BALANCE = 1000000000;
export const MAX_YIELD = 1000000000;

export const WILDCARD_COST = 10;
export const SHINY_WILDCARD_COST = 100;

export const RegionsList = Object.values(DBRegion);
export const RaritiesList = Object.values(DBRarity);
export const TypesList = Object.values(DBSpeciesType);
export const HabitatList = Object.values(DBHabitat);
