"use server";

import { z } from "zod";
import { type ErrorResponse, type MessageResponse } from "~/lib/types";
import { moveToParty, switchBox } from "~/server/db/mutations/storage";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";

export async function moveToPartyAction(
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

  return await moveToParty(input.data.instanceId, session.user.id, currProfile);
}

export async function switchBoxAction(
  _previousState: unknown,
  formData: FormData,
): Promise<MessageResponse | ErrorResponse> {
  const session = await isAuthed();

  await hasProfile();

  const formSchema = z.object({
    instanceId: z.string(),
    box: z.coerce.number().min(1).max(30),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }

  return await switchBox(
    input.data.instanceId,
    input.data.box,
    session.user.id,
  );
}
