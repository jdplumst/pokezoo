"use server";
import "server-only";
import { redirect } from "next/navigation";
import { alias } from "drizzle-orm/pg-core";
import {
  instances,
  profiles,
  rarities,
  species,
  trades,
} from "~/server/db/schema";
import { db } from "~/server/db";
import { and, desc, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { hasProfile, isAuthed } from "~/server/actions/auth";
import { z } from "zod";

export async function getTrades() {
  await isAuthed();

  const initiator = alias(profiles, "initiator");
  const offerer = alias(profiles, "offerer");
  const initiatorInstance = alias(instances, "initiatorInstance");
  const offererInstance = alias(instances, "offererInstance");
  const initiatorSpecies = alias(species, "initiatorSpecies");
  const offererSpecies = alias(species, "offererSpecies");
  const initiatorRarity = alias(rarities, "initiatorRarity");
  const offererRarity = alias(rarities, "offererRarity");

  const tradesData = await db
    .select({
      id: trades.id,
      description: trades.description,
      initiatorId: initiator.userId,
      initatorName: initiator.username,
      initiatorPokemonId: initiatorInstance.id,
      initiatorPokemonName: initiatorSpecies.name,
      initiatorPokemonImg: initiatorSpecies.img,
      initiatorPokemonShiny: initiatorSpecies.shiny,
      initiatorPokemonRarity: initiatorRarity.name,
      offererId: offerer.userId,
      offererName: offerer.username,
      offererPokemonId: offererInstance.id,
      offererPokemonName: offererSpecies.name,
      offererPokemonImg: offererSpecies.img,
      offererPokemonShiny: offererSpecies.shiny,
      offererPokemonRarity: offererRarity.name,
    })
    .from(trades)
    .innerJoin(initiator, eq(trades.initiatorId, initiator.userId))
    .leftJoin(offerer, eq(trades.offererId, offerer.userId))
    .innerJoin(
      initiatorInstance,
      eq(trades.initiatorInstanceId, initiatorInstance.id),
    )
    .innerJoin(
      initiatorSpecies,
      eq(initiatorInstance.speciesId, initiatorSpecies.id),
    )
    .innerJoin(
      initiatorRarity,
      eq(initiatorSpecies.rarityId, initiatorRarity.id),
    )
    .leftJoin(offererInstance, eq(trades.offererInstanceId, offererInstance.id))
    .leftJoin(offererSpecies, eq(offererInstance.speciesId, offererSpecies.id))
    .leftJoin(offererRarity, eq(offererSpecies.rarityId, offererRarity.id))
    .orderBy(desc(trades.modifyDate));

  return tradesData;
}

export async function initiateTrade(
  _previousState: unknown,
  formData: FormData,
) {
  const session = await isAuthed();

  await hasProfile();

  const formSchema = z.object({
    instanceId: z.string().min(1),
    description: z.string().max(100),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      error: "You must select a Pokémon to trade.",
    };
  }

  const initiatorId = session.user.id;

  const instanceData = (
    await db
      .select()
      .from(instances)
      .where(eq(instances.id, input.data.instanceId))
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
          eq(trades.initiatorInstanceId, input.data.instanceId),
          eq(trades.offererInstanceId, input.data.instanceId),
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
    initiatorInstanceId: input.data.instanceId,
    description: input.data.description,
  });

  return {
    message: "You have successfully added a trade!",
  };
}

export async function offerTrade(_previousState: unknown, formData: FormData) {
  const session = await isAuthed();

  await hasProfile();

  const formSchema = z.object({ tradeId: z.string(), instanceId: z.string() });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      error: "You must select a Pokémon to trade.",
    };
  }

  const offererId = session.user.id;

  const instanceData = (
    await db
      .select()
      .from(instances)
      .where(eq(instances.id, input.data.instanceId))
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
    await db.select().from(trades).where(eq(trades.id, input.data.tradeId))
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
          eq(trades.initiatorInstanceId, input.data.instanceId),
          eq(trades.offererInstanceId, input.data.instanceId),
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
      offererInstanceId: input.data.instanceId,
      modifyDate: new Date(),
    })
    .where(eq(trades.id, input.data.tradeId));

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
      .select({ totalYield: profiles.totalYield })
      .from(profiles)
      .where(eq(profiles.userId, tradeData.initiatorId))
  )[0];

  const offerer = (
    await db
      .select({ totalYield: profiles.totalYield })
      .from(profiles)
      .where(eq(profiles.userId, tradeData.offererId))
  )[0];

  await db.transaction(async (tx) => {
    await tx
      .update(instances)
      .set({ userId: tradeData.offererId!, modifyDate: new Date() })
      .where(eq(instances.id, tradeData.initiatorInstanceId));

    await tx
      .update(instances)
      .set({ userId: tradeData.initiatorId, modifyDate: new Date() })
      .where(eq(instances.id, tradeData.offererInstanceId!));

    await tx
      .update(profiles)
      .set({
        totalYield:
          initiator.totalYield -
          initiatorInstance.yield +
          offererInstance.yield,
      })
      .where(eq(profiles.userId, tradeData.initiatorId));

    await tx
      .update(profiles)
      .set({
        totalYield:
          offerer.totalYield - offererInstance.yield + initiatorInstance.yield,
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
