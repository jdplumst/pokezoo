"use server";

import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { charms, profiles, userCharms } from "~/server/db/schema";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";
import { z } from "zod";
import { ZodRarity } from "~/lib/types";
import { purchaseBalls } from "~/server/db/mutations/shop";

export async function purchaseBallsAction(
  _previousState: unknown,
  formData: FormData,
) {
  const formSchema = z.object({
    ballId: z.string(),
    quantity: z.coerce.number().min(1).max(10),
    regionName: z.string().optional(),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    console.error(input.error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }

  return await purchaseBalls(
    input.data.ballId,
    input.data.quantity,
    input.data.regionName,
  );
}

export async function purchaseCharm(
  _previousState: unknown,
  formData: FormData,
) {
  const session = await isAuthed();

  const currProfile = await hasProfile();

  const formSchema = z.object({
    charmId: z.coerce.number(),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      error: "The charm you are trying to purchase does not exist.",
    };
  }

  const charmData = (
    await db.select().from(charms).where(eq(charms.id, input.data.charmId))
  )[0];

  if (!charmData) {
    return {
      error: "The charm you are trying to purchase does not exist.",
    };
  }

  const exists = (
    await db
      .select()
      .from(userCharms)
      .where(
        and(
          eq(userCharms.charmId, input.data.charmId),
          eq(userCharms.userId, session.user.id),
        ),
      )
  )[0];

  if (exists) {
    return { error: "You have already purchased this charm." };
  }

  if (currProfile.profile.balance < charmData.cost) {
    return { error: "You cannot afford this charm." };
  }

  await db.transaction(async (tx) => {
    await tx
      .insert(userCharms)
      .values({ userId: session.user.id, charmId: input.data.charmId });

    await tx
      .update(profiles)
      .set({ balance: currProfile.profile.balance - charmData.cost })
      .where(eq(profiles.userId, session.user.id));
  });

  return {
    message: `You have successfully purchased the ${charmData.name} Charm!`,
  };
}

export async function purchaseWildcard(
  _previousState: unknown,
  formData: FormData,
) {
  const session = await isAuthed();

  const currProfile = await hasProfile();

  const formSchema = z.object({
    tradedWildcard: ZodRarity,
    purchasedWildcard: ZodRarity,
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      error: "Something went wrong. Please try again.",
    };
  }

  switch (input.data.tradedWildcard + ", " + input.data.purchasedWildcard) {
    case "Common, Rare":
      if (currProfile.profile.commonCards < 2) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          commonCards: currProfile.profile.commonCards - 2,
          rareCards: currProfile.profile.rareCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Common, Epic":
      if (currProfile.profile.commonCards < 4) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          commonCards: currProfile.profile.commonCards - 4,
          epicCards: currProfile.profile.epicCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Common, Legendary":
      if (currProfile.profile.commonCards < 50) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          commonCards: currProfile.profile.commonCards - 50,
          legendaryCards: currProfile.profile.legendaryCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Rare, Common":
      if (currProfile.profile.rareCards < 1) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          rareCards: currProfile.profile.rareCards - 1,
          commonCards: currProfile.profile.commonCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Rare, Epic":
      if (currProfile.profile.rareCards < 2) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          rareCards: currProfile.profile.rareCards - 2,
          epicCards: currProfile.profile.epicCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Rare, Legendary":
      if (currProfile.profile.rareCards < 35) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          rareCards: currProfile.profile.rareCards - 35,
          legendaryCards: currProfile.profile.legendaryCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Epic, Common":
      if (currProfile.profile.epicCards < 1) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          epicCards: currProfile.profile.epicCards - 1,
          commonCards: currProfile.profile.commonCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Epic, Rare":
      if (currProfile.profile.epicCards < 1) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          epicCards: currProfile.profile.epicCards - 1,
          rareCards: currProfile.profile.rareCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Epic, Legendary":
      if (currProfile.profile.epicCards < 15) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          epicCards: currProfile.profile.epicCards - 15,
          legendaryCards: currProfile.profile.legendaryCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Legendary, Common":
      if (currProfile.profile.legendaryCards < 1) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          legendaryCards: currProfile.profile.legendaryCards - 1,
          commonCards: currProfile.profile.commonCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Legendary, Rare":
      if (currProfile.profile.legendaryCards < 1) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          legendaryCards: currProfile.profile.legendaryCards - 1,
          rareCards: currProfile.profile.rareCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Legendary, Epic":
      if (currProfile.profile.legendaryCards < 1) {
        return { error: "You cannot afford this wildcard." };
      }
      await db
        .update(profiles)
        .set({
          legendaryCards: currProfile.profile.legendaryCards - 1,
          epicCards: currProfile.profile.epicCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    default:
      return {
        error: "Something went wrong. Please try again.",
      };
  }

  return {
    message: `You have successfully purchased a ${input.data.purchasedWildcard} Wildcard.`,
  };
}
