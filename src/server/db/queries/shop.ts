import "server-only";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { balls, charms, userCharms } from "~/server/db/schema";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";

export async function getShopData() {
  const session = await isAuthed();

  await hasProfile();

  const ballsData = await db.select().from(balls).orderBy(balls.cost);

  const charmsData = await db.select().from(charms);

  const userCharmsData = await db
    .select()
    .from(userCharms)
    .where(eq(userCharms.userId, session.user.id));

  return { ballsData, charmsData, userCharmsData };
}
