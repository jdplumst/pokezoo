import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { instances, trades } from "@/server/db/schema";
import { eq, or } from "drizzle-orm";
import { z } from "zod";

export async function POST(req: Request) {
  const bodySchema = z.object({
    instanceId: z.string(),
    description: z.string().max(100),
  });

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

  const initiatorId = session.user.id;

  const instanceData = (
    await db
      .select()
      .from(instances)
      .where(eq(instances.id, body.data.instanceId))
  )[0];

  if (!instanceData) {
    return Response.json({
      error: "The pokémon you tried to trade does not exist.",
    });
  }

  if (instanceData.userId !== initiatorId) {
    return Response.json({
      error: "The pokémon you tried to trade does not belong to you.",
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
      error: "The pokémon you are trying to trade is already in a trade.",
    });
  }

  await db.insert(trades).values({
    initiatorId: initiatorId,
    initiatorInstanceId: body.data.instanceId,
    description: body.data.description,
  });

  return Response.json({
    message: "You have successfully added a trade!",
  });
}
