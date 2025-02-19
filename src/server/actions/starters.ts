"use server";

import { z } from "zod";
import { type ErrorResponse, type MessageResponse } from "~/lib/types";
import { selectStarter } from "~/server/db/mutations/starters";

export async function selectStarterAction(
  _previousState: unknown,
  formData: FormData,
): Promise<MessageResponse | ErrorResponse> {
  const formSchema = z.object({
    starterId: z.string(),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }

  return await selectStarter(input.data.starterId);
}
