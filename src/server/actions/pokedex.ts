"use server";

import { z } from "zod";
import { purchasePokemon } from "~/server/db/mutations/pokedex";

export async function purchasePokemonAction(
  _previousState: unknown,
  formData: FormData,
) {
  const formSchema = z.object({
    speciesId: z.string(),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      error: "Something went wrong. Please try again.",
    };
  }

  return await purchasePokemon(input.data.speciesId);
}
