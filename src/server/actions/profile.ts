import "server-only";
import { isAuthed } from "./auth";
import { alias } from "drizzle-orm/pg-core";
import { profiles, userCharms } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "../db";

export async function getProfile() {
  const session = await isAuthed();

  const catchingCharm = alias(userCharms, "catchingCharm");

  const profileData = (
    await db
      .select({
        id: profiles.id,
        username: profiles.username,
        admin: profiles.admin,
        totalYield: profiles.totalYield,
        balance: profiles.balance,
        instanceCount: profiles.instanceCount,
        claimedDaily: profiles.claimedDaily,
        claimedNightly: profiles.claimedNightly,
        claimedEvent: profiles.claimedEvent,
        commonCards: profiles.commonCards,
        rareCards: profiles.rareCards,
        epicCards: profiles.epicCards,
        legendaryCards: profiles.legendaryCards,
        johtoStarter: profiles.johtoStarter,
        hoennStarter: profiles.hoennStarter,
        sinnohStarter: profiles.sinnohStarter,
        unovaStarter: profiles.unovaStarter,
        kalosStarter: profiles.kalosStarter,
        alolaStarter: profiles.alolaStarter,
        galarStarter: profiles.galarStarter,
        hisuiStarter: profiles.hisuiStarter,
        catchingCharm: catchingCharm.charmId,
      })
      .from(profiles)
      .leftJoin(
        catchingCharm,
        and(
          eq(profiles.userId, catchingCharm.userId),
          eq(catchingCharm.charmId, 1),
        ),
      )
      .where(eq(profiles.userId, session.user.id))
  )[0];

  return profileData;
}
