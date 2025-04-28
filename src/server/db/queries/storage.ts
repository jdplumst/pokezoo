import "server-only";

import { and, asc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "~/server/db";
import {
  habitats,
  instances,
  rarities,
  regions,
  species,
  types,
} from "~/server/db/schema";
import { isAuthed } from "./auth";

export async function getStorage(box: number) {
  const auth = await isAuthed();

  if (box < 1 || box > 30) {
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
    .where(and(eq(instances.box, box), eq(instances.userId, auth.user.id)))
    .orderBy(asc(instances.modifyDate));
}
