import "server-only";
import { isAuthed } from "./auth";
import { db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function getGame() {
  const session = await isAuthed();

  const currProfile = (
    await db
      .select({
        claimedDaily: profiles.claimedDaily,
        claimedNightly: profiles.claimedNightly,
      })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
  )[0];

  if (!currProfile) {
    redirect("/onboarding");
  }

  return { currProfile };
}
