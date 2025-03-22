import { eq } from "drizzle-orm";
import "server-only";
import { db } from "~/server/db";
import { instances, species } from "~/server/db/schema";

export async function getStorage(box: number) {
  if (box < 1 || box > 8) {
    return [];
  }

  return await db
    .select()
    .from(instances)
    .innerJoin(species, eq(species.id, instances.speciesId))
    .where(eq(instances.box, box));
}
