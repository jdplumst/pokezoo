import "server-only";

import { and, eq, or } from "drizzle-orm";
import { db } from "~/server/db";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";
import { instances, profiles, species, trades } from "~/server/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { type ErrorResponse, type MessageResponse } from "~/lib/types";

export async function initiateTrade(
  instanceId: string,
  description: string,
): Promise<MessageResponse | ErrorResponse> {
  const session = await isAuthed();

  await hasProfile();

  const initiatorId = session.user.id;

  const instanceData = (
    await db.select().from(instances).where(eq(instances.id, instanceId))
  )[0];

  if (!instanceData) {
    return {
      success: false,
      error: "The pokémon you tried to trade does not exist.",
    };
  }

  if (instanceData.userId !== initiatorId) {
    return {
      success: false,
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
      success: false,
      error: "The pokémon you are trying to trade is already in a trade.",
    };
  }

  await db.insert(trades).values({
    initiatorId: initiatorId,
    initiatorInstanceId: instanceId,
    description: description,
  });

  return {
    success: true,
    message: "You have successfully added a trade!",
  };
}

export async function offerTrade(
  tradeId: string,
  instanceId: string,
): Promise<MessageResponse | ErrorResponse> {
  const session = await isAuthed();

  await hasProfile();

  const offererId = session.user.id;

  const instanceData = (
    await db.select().from(instances).where(eq(instances.id, instanceId))
  )[0];

  if (!instanceData) {
    return {
      success: false,
      error: "The pokémon you are trying to trade does not exist.",
    };
  }

  if (instanceData?.userId !== offererId) {
    return {
      success: false,
      error: "The pokémon you are trying to trade does not belong to you.",
    };
  }

  const tradeData = (
    await db.select().from(trades).where(eq(trades.id, tradeId))
  )[0];

  if (!tradeData) {
    return {
      success: false,
      error: "The trade you are trying to make an offer for does not exist.",
    };
  }

  if (tradeData.offererId) {
    return {
      success: false,
      error: "There is already an offer for this trade.",
    };
  }

  if (tradeData.initiatorId === session.user.id) {
    return {
      success: false,
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
      success: false,
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
    success: true,
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

export async function withdrawTrade(tradeId: string) {
  const session = await isAuthed();

  await hasProfile();

  const tradeData = (
    await db.select().from(trades).where(eq(trades.id, tradeId))
  )[0];
  if (!tradeData) {
    redirect("/trades");
  }
  if (tradeData.offererId !== session.user.id) {
    redirect("/trades");
  }
  await db
    .update(trades)
    .set({
      offererId: null,
      offererInstanceId: null,
      modifyDate: new Date(),
    })
    .where(eq(trades.id, tradeId));
  redirect("/trades");
}

export async function acceptTrade(tradeId: string) {
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

  if (!tradeData.offererId || !tradeData.offererInstanceId) {
    redirect("/trades");
  }

  const initiatorInstance = (
    await db
      .select({
        id: instances.id,
        userId: instances.userId,
        yield: species.yield,
        box: instances.box,
      })
      .from(instances)
      .innerJoin(species, eq(instances.speciesId, species.id))
      .where(
        and(
          eq(instances.id, tradeData.initiatorInstanceId),
          eq(instances.userId, tradeData.initiatorId),
        ),
      )
  )[0];

  const offererInstance = (
    await db
      .select({
        id: instances.id,
        userId: instances.userId,
        yield: species.yield,
        box: instances.box,
      })
      .from(instances)
      .innerJoin(species, eq(instances.speciesId, species.id))
      .where(
        and(
          eq(instances.id, tradeData.offererInstanceId),
          eq(instances.userId, tradeData.offererId),
        ),
      )
  )[0];

  if (!initiatorInstance) {
    await db.delete(trades).where(eq(trades.id, tradeId));

    redirect("/trades");
  }

  if (!offererInstance) {
    await db
      .update(trades)
      .set({
        offererId: null,
        offererInstanceId: null,
        modifyDate: new Date(),
      })
      .where(eq(trades.id, tradeId));

    redirect("/trades");
  }

  const initiator = (
    await db
      .select({
        totalYield: profiles.totalYield,
        instanceCount: profiles.instanceCount,
      })
      .from(profiles)
      .where(eq(profiles.userId, tradeData.initiatorId))
  )[0];

  const offerer = (
    await db
      .select({
        totalYield: profiles.totalYield,
        instanceCount: profiles.instanceCount,
      })
      .from(profiles)
      .where(eq(profiles.userId, tradeData.offererId))
  )[0];

  await db.transaction(async (tx) => {
    await tx
      .update(instances)
      .set({
        userId: tradeData.offererId!,
        modifyDate: new Date(),
        box: offererInstance.box,
      })
      .where(eq(instances.id, tradeData.initiatorInstanceId));

    await tx
      .update(instances)
      .set({
        userId: tradeData.initiatorId,
        modifyDate: new Date(),
        box: initiatorInstance.box,
      })
      .where(eq(instances.id, tradeData.offererInstanceId!));

    await tx
      .update(profiles)
      .set({
        totalYield:
          initiator.totalYield -
          initiatorInstance.yield +
          offererInstance.yield,
        instanceCount:
          initiatorInstance.box > 0
            ? initiator.instanceCount + 1
            : initiator.instanceCount,
      })
      .where(eq(profiles.userId, tradeData.initiatorId));

    await tx
      .update(profiles)
      .set({
        totalYield:
          offerer.totalYield - offererInstance.yield + initiatorInstance.yield,
        instanceCount:
          offererInstance.box > 0
            ? offerer.instanceCount + 1
            : offerer.instanceCount,
      })
      .where(eq(profiles.userId, tradeData.offererId!));

    await tx.delete(trades).where(eq(trades.id, tradeId));

    await tx
      .delete(trades)
      .where(
        or(
          eq(trades.initiatorInstanceId, initiatorInstance.id),
          eq(trades.initiatorInstanceId, offererInstance.id),
        ),
      );

    await tx
      .update(trades)
      .set({ offererId: null, offererInstanceId: null })
      .where(
        or(
          eq(trades.offererInstanceId, initiatorInstance.id),
          eq(trades.offererInstanceId, offererInstance.id),
        ),
      );
  });

  revalidatePath("/game");
  revalidatePath("/achievements");
  redirect("/trades");
}

export async function declineTrade(tradeId: string) {
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

  if (!tradeData.offererId || !tradeData.offererInstanceId) {
    redirect("/trades");
  }

  await db
    .update(trades)
    .set({
      offererId: null,
      offererInstanceId: null,
      modifyDate: new Date(),
    })
    .where(eq(trades.id, tradeId));

  redirect("/trades");
}
