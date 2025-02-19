"use server";

import { z } from "zod";
import {
  type ErrorResponse,
  type MessageResponse,
  ZodRarity,
} from "~/lib/types";
import {
  purchaseBalls,
  purchaseCharm,
  purchaseWildcard,
  type PurchasedSpecies,
} from "~/server/db/mutations/shop";

export async function purchaseBallsAction(
  _previousState: unknown,
  formData: FormData,
): Promise<
  ErrorResponse | { success: true; purchasedSpecies: PurchasedSpecies }
> {
  const formSchema = z.object({
    ballId: z.string(),
    quantity: z.coerce.number().min(1).max(10),
    regionName: z.string().optional(),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }

  return await purchaseBalls(
    input.data.ballId,
    input.data.quantity,
    input.data.regionName,
  );
}

export async function purchaseCharmAction(
  _previousState: unknown,
  formData: FormData,
): Promise<MessageResponse | ErrorResponse> {
  const formSchema = z.object({
    charmId: z.coerce.number(),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      success: false,
      error: "The charm you are trying to purchase does not exist.",
    };
  }

  return await purchaseCharm(input.data.charmId);
}

export async function purchaseWildcardAction(
  _previousState: unknown,
  formData: FormData,
): Promise<MessageResponse | ErrorResponse> {
  const formSchema = z.object({
    tradedWildcard: ZodRarity,
    purchasedWildcard: ZodRarity,
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }

  return await purchaseWildcard(
    input.data.tradedWildcard,
    input.data.purchasedWildcard,
  );
}
