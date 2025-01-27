import { MAX_BALANCE } from "@/src/constants";
import { auth } from "@/src/server/auth";
import { db } from "@/src/server/db";
import { instances, profiles, species, trades } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function POST(req: Request) {
  const bodySchema = z.object({
    ids: z.array(z.string()),
  });

  const bodyData = await req.json();
  const body = bodySchema.safeParse(bodyData);

  if (body.error) {
    return Response.json({
      error: "Something went wrong. Please try again.",
    });
  }

  const session = await auth();
  if (!session) {
    return Response.json({
      error: "You are not authorized to fetch this data.",
    });
  }

  for (const i of body.data.ids) {
    await db.transaction(async (tx) => {
      const exists = (
        await tx
          .select({ id: instances.id, speciesId: instances.speciesId })
          .from(instances)
          .where(eq(instances.id, i))
      )[0];

      if (!exists) {
        return Response.json({
          error: "You are trying to sell a Pokémon that you do not own.",
        });
      }

      const speciesData = (
        await tx.select().from(species).where(eq(species.id, exists.speciesId))
      )[0];

      if (!speciesData) {
        return Response.json({
          error: "You are trying to sell a Pokémon that does not exist.",
        });
      }

      await tx.delete(instances).where(eq(instances.id, i));

      const currProfile = (
        await tx
          .select()
          .from(profiles)
          .where(eq(profiles.userId, session.user.id))
      )[0];

      if (!currProfile) {
        return Response.json({
          error: "You are not authorized to make this request.",
        });
      }

      await tx
        .update(trades)
        .set({ offererId: null, offererInstanceId: null })
        .where(eq(trades.offererInstanceId, exists.id));

      await tx.delete(trades).where(eq(trades.initiatorInstanceId, exists.id));

      await tx
        .update(profiles)
        .set({
          totalYield: currProfile.totalYield - speciesData.yield,
          balance:
            currProfile.balance + speciesData.sellPrice > MAX_BALANCE
              ? MAX_BALANCE
              : currProfile.balance + speciesData.sellPrice,
          instanceCount: currProfile.instanceCount - 1,
        })
        .where(eq(profiles.userId, session.user.id));
    });
  }
  return Response.json({
    message: "You have successfully sold your Pokémon!",
  });
}
