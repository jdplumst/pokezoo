"use server";

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { instances, profiles, regions, species } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { isAuthed } from "@/server/actions/auth";
import { z } from "zod";

export async function getOnboarding() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const currProfile = (
    await db.select().from(profiles).where(eq(profiles.userId, session.user.id))
  )[0];

  if (currProfile) {
    redirect("/game");
  }

  const starters = await db
    .select({
      id: species.id,
      name: species.name,
      img: species.img,
    })
    .from(species)
    .where(and(eq(species.starter, true), eq(species.regionId, 1)))
    .orderBy(species.pokedexNumber);

  return starters;
}

export async function createProfile(
  _previousState: unknown,
  formData: FormData,
) {
  const session = await isAuthed();

  const formSchema = z.object({
    username: z.string().min(3).max(30),
    starterId: z.string(),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      error:
        "You must select a starter pokémon, and your username must be between 3 and 30 characters.",
    };
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
    return {
      error: "You have already completed the onboarding process.",
    };
  }

  const usernameExists = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, input.data.username));

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
      .where(eq(species.id, input.data.starterId))
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
      username: input.data.username,
      totalYield: speciesData.yield,
      instanceCount: 1,
      balance: 500,
    });

    await tx
      .insert(instances)
      .values({ userId: session.user.id, speciesId: input.data.starterId });
  });

  return redirect("/game");
}
