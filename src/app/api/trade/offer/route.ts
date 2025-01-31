import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { instances, trades } from "@/server/db/schema";
import { eq, or } from "drizzle-orm";
import { z } from "zod";

export async function POST(req: Request) {
  const bodySchema = z.object({ tradeId: z.string(), instanceId: z.string() });
  const body = bodySchema.safeParse(await req.json());

  if (body.error) {
    return Response.json({
      error: "You must select a Pokémon to trade.",
    });
  }

  const session = await auth();
  if (!session) {
    return Response.json({
      error: "You are not authorized to fetch this data.",
    });
  }

  const offererId = session.user.id;

  const instanceData = (
    await db
      .select()
      .from(instances)
      .where(eq(instances.id, body.data.instanceId))
  )[0];

  if (!instanceData) {
    return Response.json({
      error: "The pokémon you are trying to trade does not exist.",
    });
  }

  if (instanceData?.userId !== offererId) {
    return Response.json({
      error: "The pokémon you are trying to trade does not belong to you.",
    });
  }

  const tradeData = (
    await db.select().from(trades).where(eq(trades.id, body.data.tradeId))
  )[0];

  if (!tradeData) {
    return Response.json({
      error: "The trade you are trying to make an offer for does not exist.",
    });
  }

  if (tradeData.offererId) {
    return Response.json({
      error: "There is already an offer for this trade.",
    });
  }

  if (tradeData.initiatorId === session.user.id) {
    return Response.json({
      error: "You can't give an offer for your own trade.",
    });
  }

  const exists = (
    await db
      .select()
      .from(trades)
      .where(
        or(
          eq(trades.initiatorInstanceId, body.data.instanceId),
          eq(trades.offererInstanceId, body.data.instanceId),
        ),
      )
  )[0];

  if (exists) {
    return Response.json({
      error: "The pokémon you are trying to offer is already in a trade.",
    });
  }

  await db
    .update(trades)
    .set({
      offererId: session.user.id,
      offererInstanceId: body.data.instanceId,
      modifyDate: new Date(),
    })
    .where(eq(trades.id, body.data.tradeId));

  return Response.json({
    message: "You have successfully added an offer to the trade.",
  });
}
