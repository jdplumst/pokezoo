import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { isAuthed } from "~/server/db/queries/auth";
import { instances, profiles, regions, species } from "~/server/db/schema";

export async function createProfile(username: string, starterId: string) {
  const session = await isAuthed();

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
    return {
      error: "You have already completed the onboarding process.",
    };
  }

  const usernameExists = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, username));

  if (usernameExists.length > 0) {
    return {
      error: "The username you have selected is already taken.",
    };
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
      .where(eq(species.id, starterId))
  )[0];

  if (!speciesData) {
    return {
      error: "The starter you are trying to select does not exist.",
    };
  }

  if (!speciesData.starter) {
    return {
      error: "The starter you are trying to select is not a starter.",
    };
  }

  if (speciesData.region !== "Kanto") {
    return {
      error: "The starter you are trying to select is not from Kanto.",
    };
  }

  await db.transaction(async (tx) => {
    await tx.insert(profiles).values({
      userId: session.user.id,
      username: username,
      totalYield: speciesData.yield,
      instanceCount: 1,
      balance: 500,
    });

    await tx
      .insert(instances)
      .values({ userId: session.user.id, speciesId: starterId });
  });

  return redirect("/game");
}
