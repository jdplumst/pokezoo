import { asc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import "server-only";
import { db } from "~/server/db";
import {
  habitats,
  instances,
  rarities,
  regions,
  species,
  types,
} from "~/server/db/schema";

export async function getStorage(box: number) {
  if (box < 1 || box > 8) {
    return [];
  }

  const typeOne = alias(types, "typeOne");
  const typeTwo = alias(types, "typeTwo");

  return await db
    .select({
      id: instances.id,
      pokedexNumber: species.pokedexNumber,
      name: species.name,
      rarity: rarities.name,
      yield: species.yield,
      img: species.img,
      sellPrice: species.sellPrice,
      shiny: species.shiny,
      typeOne: typeOne.name,
      typeTwo: typeTwo.name,
      generation: species.generation,
      habitat: habitats.name,
      region: regions.name,
    })
    .from(instances)
    .innerJoin(species, eq(species.id, instances.speciesId))
    .innerJoin(regions, eq(species.regionId, regions.id))
    .innerJoin(rarities, eq(species.rarityId, rarities.id))
    .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
    .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
    .innerJoin(habitats, eq(species.habitatId, habitats.id))
    .where(eq(instances.box, box))
    .orderBy(asc(instances.modifyDate));
}
