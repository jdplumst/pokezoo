"use server";
import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/server//db";
import { balls, charms, profiles, userCharms } from "@/server/db/schema";
import { redirect } from "next/navigation";
import { isAuthed } from "@/server/actions/auth";

export async function getShopData() {
  const session = await isAuthed();

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
