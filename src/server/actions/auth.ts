"use server";
import "server-only";

import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { profiles, userCharms } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

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
