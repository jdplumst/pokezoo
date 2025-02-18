import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { profiles } from "~/server/db/schema";
import { isAuthed } from "~/server/queries/auth";

export async function getGame() {
  const session = await isAuthed();

  const currProfile = (
    await db
      .select({
        claimedDaily: profiles.claimedDaily,
        claimedNightly: profiles.claimedNightly,
        johtoStarter: profiles.johtoStarter,
        hoennStarter: profiles.hoennStarter,
        sinnohStarter: profiles.sinnohStarter,
        unovaStarter: profiles.unovaStarter,
        kalosStarter: profiles.kalosStarter,
        alolaStarter: profiles.alolaStarter,
        galarStarter: profiles.galarStarter,
        hisuiStarter: profiles.hisuiStarter,
      })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
  )[0];

  if (!currProfile) {
    redirect("/onboarding");
  }

  return { currProfile };
}
