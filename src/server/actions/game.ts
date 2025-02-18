"use server";

import { hasProfile, isAuthed } from "~/server/db/queries/auth";
import { db } from "~/server/db";
import { instances, profiles, species, trades } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { MAX_BALANCE } from "~/lib/constants";
import { z } from "zod";
import { claimReward } from "~/server/db/mutations/game";

export async function claimRewardAction(
  _previousState: unknown,
  _formData: FormData,
) {
  return await claimReward();
}

export async function sellPokemon(_previousState: unknown, formData: FormData) {
  const session = await isAuthed();

  console.log(formData);
  const formSchema = z.object({
    ids: z.preprocess((ids) => {
      if (typeof ids === "string") return ids.split(",");
    }, z.array(z.string())),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    console.error(input.error.flatten());
    return {
      error: "Something went wrong. Please try again.",
    };
  }

  for (const i of input.data.ids) {
    await db.transaction(async (tx) => {
      const exists = (
        await tx
          .select({ id: instances.id, speciesId: instances.speciesId })
          .from(instances)
          .where(eq(instances.id, i))
      )[0];

      if (!exists) {
        return {
          error: "You are trying to sell a Pokémon that you do not own.",
        };
      }

      const speciesData = (
        await tx.select().from(species).where(eq(species.id, exists.speciesId))
      )[0];

      if (!speciesData) {
        return {
          error: "You are trying to sell a Pokémon that does not exist.",
        };
      }

      const currProfile = await hasProfile();

      await tx.delete(instances).where(eq(instances.id, i));

      await tx
        .update(trades)
        .set({ offererId: null, offererInstanceId: null })
        .where(eq(trades.offererInstanceId, exists.id));

      await tx.delete(trades).where(eq(trades.initiatorInstanceId, exists.id));

      await tx
        .update(profiles)
        .set({
          totalYield: currProfile.profile.totalYield - speciesData.yield,
          balance:
            currProfile.profile.balance + speciesData.sellPrice > MAX_BALANCE
              ? MAX_BALANCE
              : currProfile.profile.balance + speciesData.sellPrice,
          instanceCount: currProfile.profile.instanceCount - 1,
        })
        .where(eq(profiles.userId, session.user.id));
    });
  }
  return {
    message: "You have successfully sold your Pokémon!",
  };
}
