import { auth } from "@/src/server/auth";
import { db } from "@/src/server/db";
import { profiles } from "@/src/server/db/schema";
import { ZodRarity } from "@/src/zod";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function POST(req: Request) {
  const bodySchema = z.object({
    tradedWildcard: ZodRarity,
    purchasedWildcard: ZodRarity,
  });

  const body = bodySchema.safeParse(await req.json());

  if (body.error) {
    return Response.json({
      error: "Something went wrong. Please try again.",
    });
  }

  const session = await auth();
  if (!session) {
    return Response.json({
      error: "You are not authorized to purchase this wildcard.",
    });
  }

  const currProfile = (
    await db
      .select({
        commonCards: profiles.commonCards,
        rareCards: profiles.rareCards,
        epicCards: profiles.epicCards,
        legendaryCards: profiles.legendaryCards,
      })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
  )[0];

  if (!currProfile) {
    return Response.json({
      error: "You are not authorized to purchase this wildcard.",
    });
  }

  switch (body.data.tradedWildcard + ", " + body.data.purchasedWildcard) {
    case "Common, Rare":
      if (currProfile.commonCards < 2) {
        return Response.json({ error: "You cannot afford this wildcard." });
      }
      await db
        .update(profiles)
        .set({
          commonCards: currProfile.commonCards - 2,
          rareCards: currProfile.rareCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Common, Epic":
      if (currProfile.commonCards < 4) {
        return Response.json({ error: "You cannot afford this wildcard." });
      }
      await db
        .update(profiles)
        .set({
          commonCards: currProfile.commonCards - 4,
          epicCards: currProfile.epicCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Common, Legendary":
      if (currProfile.commonCards < 50) {
        return Response.json({ error: "You cannot afford this wildcard." });
      }
      await db
        .update(profiles)
        .set({
          commonCards: currProfile.commonCards - 50,
          legendaryCards: currProfile.legendaryCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Rare, Common":
      if (currProfile.rareCards < 1) {
        return Response.json({ error: "You cannot afford this wildcard." });
      }
      await db
        .update(profiles)
        .set({
          rareCards: currProfile.rareCards - 1,
          commonCards: currProfile.commonCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Rare, Epic":
      if (currProfile.rareCards < 2) {
        return Response.json({ error: "You cannot afford this wildcard." });
      }
      await db
        .update(profiles)
        .set({
          rareCards: currProfile.rareCards - 2,
          epicCards: currProfile.epicCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Rare, Legendary":
      if (currProfile.rareCards < 35) {
        return Response.json({ error: "You cannot afford this wildcard." });
      }
      await db
        .update(profiles)
        .set({
          rareCards: currProfile.rareCards - 35,
          legendaryCards: currProfile.legendaryCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Epic, Common":
      if (currProfile.epicCards < 1) {
        return Response.json({ error: "You cannot afford this wildcard." });
      }
      await db
        .update(profiles)
        .set({
          epicCards: currProfile.epicCards - 1,
          commonCards: currProfile.commonCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Epic, Rare":
      if (currProfile.epicCards < 1) {
        return Response.json({ error: "You cannot afford this wildcard." });
      }
      await db
        .update(profiles)
        .set({
          epicCards: currProfile.epicCards - 1,
          rareCards: currProfile.rareCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Epic, Legendary":
      if (currProfile.epicCards < 15) {
        return Response.json({ error: "You cannot afford this wildcard." });
      }
      await db
        .update(profiles)
        .set({
          epicCards: currProfile.epicCards - 15,
          legendaryCards: currProfile.legendaryCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Legendary, Common":
      if (currProfile.legendaryCards < 1) {
        return Response.json({ error: "You cannot afford this wildcard." });
      }
      await db
        .update(profiles)
        .set({
          legendaryCards: currProfile.legendaryCards - 1,
          commonCards: currProfile.commonCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Legendary, Rare":
      if (currProfile.legendaryCards < 1) {
        return Response.json({ error: "You cannot afford this wildcard." });
      }
      await db
        .update(profiles)
        .set({
          legendaryCards: currProfile.legendaryCards - 1,
          rareCards: currProfile.rareCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    case "Legendary, Epic":
      if (currProfile.legendaryCards < 1) {
        return Response.json({ error: "You cannot afford this wildcard." });
      }
      await db
        .update(profiles)
        .set({
          legendaryCards: currProfile.legendaryCards - 1,
          epicCards: currProfile.epicCards + 1,
        })
        .where(eq(profiles.userId, session.user.id));
      break;

    default:
      return Response.json({
        error: "Something went wrong. Please try again.",
      });
  }

  return Response.json({
    message: `You have successfully purchased a ${body.data.purchasedWildcard} Wildcard.`,
  });
}
