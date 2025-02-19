"use server";

import { z } from "zod";
import { createProfile } from "~/server/db/mutations/onboarding";

export async function createProfileAction(
  _previousState: unknown,
  formData: FormData,
) {
  const formSchema = z.object({
    username: z.string().min(3).max(30),
    starterId: z.string(),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      error:
        "You must select a starter pokémon, and your username must be between 3 and 30 characters.",
    };
  }

  return await createProfile(input.data.username, input.data.starterId);
}
