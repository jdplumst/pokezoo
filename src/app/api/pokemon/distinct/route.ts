import { auth } from "@/src/server/auth";
import { db } from "@/src/server/db";
import { instances, rarities, species } from "@/src/server/db/schema";
import { and, eq, ilike } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");

  const session = await auth();
  if (!session) {
    throw new Error("You are not authorized to fetch this data.");
  }

  const instanceData = await db
    .selectDistinctOn([instances.speciesId], {
      id: instances.id,
      speciesId: instances.speciesId,
      name: species.name,
      img: species.img,
      rarity: rarities.name,
    })
    .from(instances)
    .innerJoin(species, eq(species.id, instances.speciesId))
    .innerJoin(rarities, eq(rarities.id, species.rarityId))
    .where(
      and(
        eq(instances.userId, session.user.id),
        ilike(species.name, "%" + name + "%"),
      ),
    )
    .limit(30);

  return Response.json({ pokemon: instanceData });
}
