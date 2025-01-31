import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { instances, profiles, regions, species } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function POST(req: Request) {
  const bodySchema = z.object({
    username: z.string().min(3).max(30),
    starterId: z.string(),
  });

  const body = bodySchema.safeParse(await req.json());

  if (body.error) {
    return Response.json({
      error:
        "You must select a starter pokémon, and your username must be between 3 and 30 characters.",
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
      })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
  )[0];

  if (currProfile) {
    return Response.json({
      error: "You have already completed the onboarding process.",
    });
  }

  const usernameExists = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, body.data.username));

  if (usernameExists.length > 0) {
    return Response.json({
      error: "The username you have selected is already taken.",
    });
  }

  const speciesData = (
    await db
      .select({
        region: regions.name,
        yield: species.yield,
        starter: species.starter,
      })
      .from(species)
      .leftJoin(regions, eq(species.regionId, regions.id))
      .where(eq(species.id, body.data.starterId))
  )[0];

  if (!speciesData) {
    return Response.json({
      error: "The starter you are trying to select does not exist.",
    });
  }

  if (!speciesData.starter) {
    return Response.json({
      error: "The starter you are trying to select is not a starter.",
    });
  }

  if (speciesData.region !== "Kanto") {
    return Response.json({
      error: "The starter you are trying to select is not from Kanto.",
    });
  }

  await db.transaction(async (tx) => {
    await tx.insert(profiles).values({
      userId: session.user.id,
      username: body.data.username,
      totalYield: speciesData.yield,
      instanceCount: 1,
      balance: 500,
    });

    await tx
      .insert(instances)
      .values({ userId: session.user.id, speciesId: body.data.starterId });
  });

  return Response.json({
    message: `You have completed the onboarding process!`,
  });
}
