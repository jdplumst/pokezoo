import { auth } from "@/src/server/auth";
import { db } from "@/src/server/db";
import { regions, species } from "@/src/server/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const regionId = req.nextUrl.searchParams.get("regionId");
  if (!regionId) {
    return Response.json({
      error: "You must select a region.",
    });
  }

  const parsedRegionId = parseInt(regionId);
  if (isNaN(parsedRegionId)) {
    return Response.json({
      error: "You must select a region.",
    });
  }
  console.log(parsedRegionId);

  const session = await auth();
  if (!session) {
    return Response.json({
      error: "You are not authorized to fetch this data",
    });
  }

  const starters = await db
    .select({
      id: species.id,
      name: species.name,
      img: species.img,
    })
    .from(species)
    .innerJoin(regions, eq(species.regionId, regions.id))
    .where(and(eq(species.regionId, parsedRegionId), eq(species.starter, true)))
    .orderBy(asc(species.pokedexNumber));

  return Response.json({ starters });
}
