import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { profiles, userCharms } from "~/server/db/schema";
import { alias } from "drizzle-orm/pg-core";
import { auth } from "~/server/auth";

export async function isAuthed() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return session;
}

export async function hasProfile() {
  const session = await isAuthed();

  const catchingCharm = alias(userCharms, "catchingCharm");
  const markCharm = alias(userCharms, "markCharm");

  const currProfile = (
    await db
      .select()
      .from(profiles)
      .leftJoin(catchingCharm, eq(profiles.userId, catchingCharm.userId))
      .leftJoin(markCharm, eq(profiles.userId, markCharm.userId))
      .where(eq(profiles.userId, session.user.id))
  )[0];

  if (!currProfile) {
    redirect("/onboarding");
  }

  return currProfile;
}
