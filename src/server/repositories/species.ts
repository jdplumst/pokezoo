import { and, asc, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { regions, species } from "~/server/db/schema";

export async function getStarters(regionId: number) {
  const starters = await db
    .select({
      id: species.id,
      name: species.name,
      img: species.img,
    })
    .from(species)
    .innerJoin(regions, eq(species.regionId, regions.id))
    .where(and(eq(species.regionId, regionId), eq(species.starter, true)))
    .orderBy(asc(species.pokedexNumber));

  return starters;
}
