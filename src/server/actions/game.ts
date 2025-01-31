import "server-only";
import { isAuthed } from "@/server/actions/auth";
import { db } from "@/server/db";
import { profiles } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

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
