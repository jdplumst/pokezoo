import "server-only";

import { eq, or } from "drizzle-orm";
import { db } from "~/server/db";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";
import { instances, trades } from "~/server/db/schema";

export async function initiateTrade(instanceId: string, description: string) {
  const session = await isAuthed();

  await hasProfile();

  const initiatorId = session.user.id;

  const instanceData = (
    await db.select().from(instances).where(eq(instances.id, instanceId))
  )[0];

  if (!instanceData) {
    return {
      error: "The pokémon you tried to trade does not exist.",
    };
  }

  if (instanceData.userId !== initiatorId) {
    return {
      error: "The pokémon you tried to trade does not belong to you.",
    };
  }

  const exists = (
    await db
      .select()
      .from(trades)
      .where(
        or(
          eq(trades.initiatorInstanceId, instanceId),
          eq(trades.offererInstanceId, instanceId),
        ),
      )
  )[0];

  if (exists) {
    return {
      error: "The pokémon you are trying to trade is already in a trade.",
    };
  }

  await db.insert(trades).values({
    initiatorId: initiatorId,
    initiatorInstanceId: instanceId,
    description: description,
  });

  return {
    message: "You have successfully added a trade!",
  };
}
