"use server";

import { z } from "zod";
import {
  acceptTrade,
  cancelTrade,
  declineTrade,
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

export async function declineTradeAction(tradeId: string) {
  return await declineTrade(tradeId);
}
