import { auth } from "@/src/server/auth";
import { db } from "@/src/server/db";
import { charms, profiles, userCharms } from "@/src/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export async function POST(req: Request) {
  const bodySchema = z.object({
    charmId: z.number(),
  });

  const body = bodySchema.safeParse(await req.json());

  if (body.error) {
    return Response.json({
      error: "The charm you are trying to purchase does not exist.",
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
      .select({ balance: profiles.balance })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
  )[0];

  if (!currProfile) {
    return Response.json({
      error: "You are not authorized to purchase this wildcard.",
    });
  }

  const charmData = (
    await db.select().from(charms).where(eq(charms.id, body.data.charmId))
  )[0];

  if (!charmData) {
    return Response.json({
      error: "The charm you are trying to purchase does not exist.",
    });
  }

  const exists = (
    await db
      .select()
      .from(userCharms)
      .where(
        and(
          eq(userCharms.charmId, body.data.charmId),
          eq(userCharms.userId, session.user.id),
        ),
      )
  )[0];

  if (exists) {
    return Response.json({ error: "You have already purchased this charm." });
  }

  if (currProfile.balance < charmData.cost) {
    return Response.json({ error: "You cannot afford this charm." });
  }

  await db.transaction(async (tx) => {
    await tx
      .insert(userCharms)
      .values({ userId: session.user.id, charmId: body.data.charmId });

    await tx
      .update(profiles)
      .set({ balance: currProfile.balance - charmData.cost })
      .where(eq(profiles.userId, session.user.id));
  });

  return Response.json({ name: charmData.name });
}
