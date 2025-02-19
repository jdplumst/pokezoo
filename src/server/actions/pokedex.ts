"use server";

import { z } from "zod";
import { type ErrorResponse, type MessageResponse } from "~/lib/types";
import { purchasePokemon } from "~/server/db/mutations/pokedex";

export async function purchasePokemonAction(
  _previousState: unknown,
  formData: FormData,
): Promise<MessageResponse | ErrorResponse> {
  const formSchema = z.object({
    speciesId: z.string(),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }

  return await purchasePokemon(input.data.speciesId);
}
