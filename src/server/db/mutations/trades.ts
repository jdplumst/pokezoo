import "server-only";

import { eq, or } from "drizzle-orm";
import { db } from "~/server/db";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";
import { instances, trades } from "~/server/db/schema";
import { redirect } from "next/navigation";

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

export async function offerTrade(tradeId: string, instanceId: string) {
  const session = await isAuthed();

  await hasProfile();

  const offererId = session.user.id;

  const instanceData = (
    await db.select().from(instances).where(eq(instances.id, instanceId))
  )[0];

  if (!instanceData) {
    return {
      error: "The pokémon you are trying to trade does not exist.",
    };
  }

  if (instanceData?.userId !== offererId) {
    return {
      error: "The pokémon you are trying to trade does not belong to you.",
    };
  }

  const tradeData = (
    await db.select().from(trades).where(eq(trades.id, tradeId))
  )[0];

  if (!tradeData) {
    return {
      error: "The trade you are trying to make an offer for does not exist.",
    };
  }

  if (tradeData.offererId) {
    return {
      error: "There is already an offer for this trade.",
    };
  }

  if (tradeData.initiatorId === session.user.id) {
    return {
      error: "You can't give an offer for your own trade.",
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
      error: "The pokémon you are trying to offer is already in a trade.",
    };
  }

  await db
    .update(trades)
    .set({
      offererId: session.user.id,
      offererInstanceId: instanceId,
      modifyDate: new Date(),
    })
    .where(eq(trades.id, tradeId));

  return {
    message: "You have successfully added an offer to the trade.",
  };
}

export async function cancelTrade(tradeId: string) {
  const session = await isAuthed();

  await hasProfile();

  const tradeData = (
    await db.select().from(trades).where(eq(trades.id, tradeId))
  )[0];

  if (!tradeData) {
    redirect("/trades");
  }

  if (tradeData.initiatorId !== session.user.id) {
    redirect("/trades");
  }

  await db.delete(trades).where(eq(trades.id, tradeId));

  redirect("/trades");
}
