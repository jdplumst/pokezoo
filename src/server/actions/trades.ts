import "server-only";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { alias } from "drizzle-orm/pg-core";
import { instances, profiles, rarities, species, trades } from "../db/schema";
import { db } from "../db";
import { asc, desc, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
      initiatorId: initiator.userId,
      initatorName: initiator.username,
      initiatorPokemonId: initiatorInstance.id,
      initiatorPokemonName: initiatorSpecies.name,
      initiatorPokemonImg: initiatorSpecies.img,
      initiatorPokemonRarity: initiatorRarity.name,
      offererId: offerer.id,
      offererName: offerer.username,
      offererPokemonId: offererInstance.id,
      offererPokemonName: offererSpecies.name,
      offererPokemonImg: offererSpecies.img,
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

export async function addTrade(instanceId: string, description: string) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const initiatorId = session.user.id;

  const instanceData = (
    await db.select().from(instances).where(eq(instances.id, instanceId))
  )[0];

  if (!instanceData) {
    throw new Error("The pokémon you tried to trade does not exist.");
  }

  if (instanceData.userId !== initiatorId) {
    throw new Error("The pokémon you tried to trade does not belong to you.");
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
    throw new Error(
      "The pokémon you are trying to trade is already in a trade.",
    );
  }

  await db.insert(trades).values({
    initiatorId: initiatorId,
    initiatorInstanceId: instanceId,
    description: description,
  });

  revalidatePath("/trades");
}
