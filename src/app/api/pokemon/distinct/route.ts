import { auth } from "@/src/server/auth";
import { db } from "@/src/server/db";
import { instances, rarities, species, trades } from "@/src/server/db/schema";
import { and, eq, ilike, notInArray } from "drizzle-orm";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");

  const session = await auth();
  if (!session) {
    throw new Error("You are not authorized to fetch this data.");
  }

  const instancesInInitiatedTrades = db
    .select({ id: trades.initiatorInstanceId })
    .from(trades)
    .where(eq(trades.initiatorId, session.user.id));

  const instancesInOfferedTrades = db
    .select({ id: trades.offererInstanceId })
    .from(trades)
    .where(eq(trades.offererId, session.user.id));

  const instanceData = await db
    .selectDistinctOn([instances.speciesId], {
      id: instances.id,
      speciesId: instances.speciesId,
      name: species.name,
      img: species.img,
      shiny: species.shiny,
      rarity: rarities.name,
    })
    .from(instances)
    .innerJoin(species, eq(species.id, instances.speciesId))
    .innerJoin(rarities, eq(rarities.id, species.rarityId))
    .where(
      and(
        eq(instances.userId, session.user.id),
        ilike(species.name, "%" + name + "%"),
        notInArray(instances.id, instancesInInitiatedTrades),
        notInArray(instances.id, instancesInOfferedTrades),
      ),
    )
    .limit(30);

  return Response.json({ pokemon: instanceData });
}
