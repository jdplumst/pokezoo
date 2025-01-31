import { auth } from "@/src/server/auth";
import { db } from "@/src/server/db";
import { instances, profiles, regions, species } from "@/src/server/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { type NextRequest } from "next/server";
import { z } from "zod";

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

export async function POST(req: Request) {
  const bodySchema = z.object({
    starterId: z.string(),
  });

  const body = bodySchema.safeParse(await req.json());

  if (body.error) {
    return Response.json({
      error: "You must select a starter pokémon.",
    });
  }

  const session = await auth();
  if (!session) {
    return Response.json({
      error: "You are not authorized to fetch this data.",
    });
  }

  const currProfile = (
    await db
      .select({
        totalYield: profiles.totalYield,
        balance: profiles.balance,
        instanceCount: profiles.instanceCount,
        johtoStarter: profiles.johtoStarter,
        hoennStarter: profiles.hoennStarter,
        sinnohStarter: profiles.sinnohStarter,
        unovaStarter: profiles.unovaStarter,
        kalosStarter: profiles.kalosStarter,
        alolaStarter: profiles.alolaStarter,
        galarStarter: profiles.galarStarter,
        hisuiStarter: profiles.hisuiStarter,
      })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
  )[0];

  if (!currProfile) {
    return Response.json({
      error: "You are not authorized to fetch this data.",
    });
  }

  const speciesData = (
    await db
      .select({ region: regions.name, yield: species.yield })
      .from(species)
      .leftJoin(regions, eq(species.regionId, regions.id))
      .where(eq(species.id, body.data.starterId))
  )[0];

  if (!speciesData) {
    return Response.json({
      error: "The starter you are trying to select does not exist.",
    });
  }

  if (speciesData.region === "Johto" && currProfile.johtoStarter) {
    return Response.json({
      error: "You have already received a Johto starter.",
    });
  } else if (speciesData.region === "Hoenn" && currProfile.hoennStarter) {
    return Response.json({
      error: "You have already received a Hoenn starter.",
    });
  } else if (speciesData.region === "Sinnoh" && currProfile.sinnohStarter) {
    return Response.json({
      error: "You have already received a Sinnoh starter.",
    });
  } else if (speciesData.region === "Unova" && currProfile.unovaStarter) {
    return Response.json({
      error: "You have already received a Unova starter.",
    });
  } else if (speciesData.region === "Kalos" && currProfile.kalosStarter) {
    return Response.json({
      error: "You have already received a Kalos starter.",
    });
  } else if (speciesData.region === "Alola" && currProfile.alolaStarter) {
    return Response.json({
      error: "You have already received an Alola starter.",
    });
  } else if (speciesData.region === "Galar" && currProfile.galarStarter) {
    return Response.json({
      error: "You have already received a Galar starter.",
    });
  } else if (speciesData.region === "Hisui" && currProfile.hisuiStarter) {
    return Response.json({
      error: "You have already received a Hisui starter.",
    });
  }

  await db.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({
        totalYield: currProfile.totalYield + speciesData.yield,
        instanceCount: currProfile.instanceCount + 1,
        johtoStarter:
          speciesData.region === "Johto" ? true : currProfile.johtoStarter,
        hoennStarter:
          speciesData.region === "Hoenn" ? true : currProfile.hoennStarter,
        sinnohStarter:
          speciesData.region === "Sinnoh" ? true : currProfile.sinnohStarter,
        unovaStarter:
          speciesData.region === "Unova" ? true : currProfile.unovaStarter,
        kalosStarter:
          speciesData.region === "Kalos" ? true : currProfile.kalosStarter,
        alolaStarter:
          speciesData.region === "Alola" ? true : currProfile.alolaStarter,
        galarStarter:
          speciesData.region === "Galar" ? true : currProfile.galarStarter,
        hisuiStarter:
          speciesData.region === "Hisui" ? true : currProfile.hisuiStarter,
      })
      .where(eq(profiles.userId, session.user.id));

    await tx
      .insert(instances)
      .values({ userId: session.user.id, speciesId: body.data.starterId });
  });

  return Response.json({
    message: `You have received a ${speciesData.region} starter!`,
  });
}
