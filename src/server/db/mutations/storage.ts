import "server-only";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { instances, profiles, species } from "~/server/db/schema";
import { type ErrorResponse, type MessageResponse } from "~/lib/types";
import { type hasProfile } from "~/server/db/queries/auth";
import { calcNewYield } from "~/lib/calc-new-yield";
import { withinInstanceLimit } from "~/lib/within-instance-limit";
import { redirect } from "next/navigation";

export async function moveToParty(
  instanceId: string,
  userId: string,
  currProfile: Awaited<ReturnType<typeof hasProfile>>,
): Promise<MessageResponse | ErrorResponse | undefined> {
  const instanceData = (
    await db
      .select()
      .from(instances)
      .innerJoin(species, eq(instances.speciesId, species.id))
      .where(and(eq(instances.userId, userId), eq(instances.id, instanceId)))
  )[0];

  if (!instanceData) {
    revalidatePath("/storage");
  }

  if (instanceData.instance.box === 0) {
    revalidatePath("/storage");
    return;
  }

  if (
    !withinInstanceLimit(
      currProfile.profile.instanceCount + 1,
      !!currProfile.catchingCharm,
    )
  ) {
    return {
      success: false,
      error:
        "You will go over your Pokémon limit. Sell Pokémon in your party or move some into your storage if you want to move this pokémon into your party.",
    };
  }

  const newYield = calcNewYield(
    currProfile.profile.totalYield,
    instanceData.species.yield,
    "add",
  );

  await db.transaction(async (tx) => {
    await tx
      .update(instances)
      .set({ box: 0, modifyDate: new Date() })
      .where(eq(instances.id, instanceId));

    await tx
      .update(profiles)
      .set({
        instanceCount: currProfile.profile.instanceCount + 1,
        totalYield: newYield,
      })
      .where(eq(profiles.id, currProfile.profile.id));
  });
  revalidatePath("/storage");

  return {
    success: true,
    message: "The pokémon has been moved to your party.",
  };
}

export async function switchBox(
  instanceId: string,
  box: number,
  userId: string,
): Promise<MessageResponse | ErrorResponse> {
  const currInstance = (
    await db
      .select({ box: instances.box })
      .from(instances)
      .where(and(eq(instances.id, instanceId), eq(instances.userId, userId)))
  )[0];

  if (!currInstance || currInstance.box === 0) {
    redirect("/storage");
  }

  const instancesInBox = await db
    .select()
    .from(instances)
    .where(eq(instances.box, box));

  if (instancesInBox.length >= 30) {
    return {
      success: false,
      error: "The box you are trying to move to is full.",
    };
  }

  await db
    .update(instances)
    .set({ box: box, modifyDate: new Date() })
    .where(eq(instances.id, instanceId));

  return {
    success: true,
    message: "You have moved your pokémon to a different box.",
  };
}
