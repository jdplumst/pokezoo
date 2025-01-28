import "server-only";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { alias } from "drizzle-orm/pg-core";
import { instances, profiles, rarities, species, trades } from "../db/schema";
import { db } from "../db";
import { desc, eq } from "drizzle-orm";

export async function getTrades() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

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

export async function cancelTrade(tradeId: string) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

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
  const session = await auth();
  if (!session) {
    redirect("/");
  }

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

export async function declineTrade(tradeId: string) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

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
