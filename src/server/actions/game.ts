"use server";

import { z } from "zod";
import { type MessageResponse, type ErrorResponse } from "~/lib/types";
import {
  claimReward,
  moveToStorage,
  sellPokemon,
} from "~/server/db/mutations/game";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";

export async function claimRewardAction(
  _previousState: unknown,
  _formData: FormData,
) {
  return await claimReward();
}

export async function sellPokemonAction(
  _previousState: unknown,
  formData: FormData,
): Promise<MessageResponse | ErrorResponse> {
  const formSchema = z.object({
    ids: z.preprocess((ids) => {
      if (typeof ids === "string") return ids.split(",");
    }, z.array(z.string())),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }

  return await sellPokemon(input.data.ids);
}

export async function moveToStorageAction(
  _previousState: unknown,
  formData: FormData,
): Promise<MessageResponse | ErrorResponse | undefined> {
  const session = await isAuthed();

  const currProfile = await hasProfile();

  const formSchema = z.object({
    instanceId: z.string(),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }

  return await moveToStorage(
    input.data.instanceId,
    session.user.id,
    currProfile,
  );
}
