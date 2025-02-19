"use server";

import { redirect } from "next/navigation";
import { trades } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";
import { z } from "zod";
import {
  acceptTrade,
  cancelTrade,
  initiateTrade,
  offerTrade,
} from "~/server/db/mutations/trades";

export async function initiateTradeAction(
  _previousState: unknown,
  formData: FormData,
) {
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

  return await initiateTrade(input.data.instanceId, input.data.description);
}

export async function offerTradeAction(
  _previousState: unknown,
  formData: FormData,
) {
  const formSchema = z.object({ tradeId: z.string(), instanceId: z.string() });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      error: "You must select a Pokémon to trade.",
    };
  }

  return await offerTrade(input.data.tradeId, input.data.instanceId);
}

export async function cancelTradeAction(tradeId: string) {
  return await cancelTrade(tradeId);
}

export async function withdrawTradeAction(tradeId: string) {
  return await withdrawTradeAction(tradeId);
}

export async function acceptTradeAction(tradeId: string) {
  return await acceptTrade(tradeId);
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
