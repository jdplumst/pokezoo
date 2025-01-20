import "server-only";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { balls, charms, profiles, userCharms } from "../db/schema";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export async function getShopData(session: Session) {
  const ballsData = await db.select().from(balls);

  const charmsData = await db.select().from(charms);

  const currProfile = (
    await db
      .select({ balance: profiles.balance })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
  )[0];

  if (!currProfile) {
    redirect("/game");
  }

  const userCharmsData = await db
    .select()
    .from(userCharms)
    .where(eq(userCharms.userId, session.user.id));

  return { ballsData, charmsData, userCharmsData };
}
