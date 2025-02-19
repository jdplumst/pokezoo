import "server-only";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { hasProfile, isAuthed } from "~/server/db/queries/auth";
import { instances, profiles, regions, species } from "~/server/db/schema";
import { type ErrorResponse, type MessageResponse } from "~/lib/types";

export async function selectStarter(
  starterId: string,
): Promise<MessageResponse | ErrorResponse> {
  const session = await isAuthed();

  const currProfile = await hasProfile();

  const speciesData = (
    await db
      .select({ region: regions.name, yield: species.yield })
      .from(species)
      .leftJoin(regions, eq(species.regionId, regions.id))
      .where(eq(species.id, starterId))
  )[0];

  if (!speciesData) {
    return {
      success: false,
      error: "You must select a starter pokémon.",
    };
  }

  if (speciesData.region === "Johto" && currProfile.profile.johtoStarter) {
    return {
      success: false,
      error: "You have already received a Johto starter.",
    };
  } else if (
    speciesData.region === "Hoenn" &&
    currProfile.profile.hoennStarter
  ) {
    return {
      success: false,
      error: "You have already received a Hoenn starter.",
    };
  } else if (
    speciesData.region === "Sinnoh" &&
    currProfile.profile.sinnohStarter
  ) {
    return {
      success: false,
      error: "You have already received a Sinnoh starter.",
    };
  } else if (
    speciesData.region === "Unova" &&
    currProfile.profile.unovaStarter
  ) {
    return {
      success: false,
      error: "You have already received a Unova starter.",
    };
  } else if (
    speciesData.region === "Kalos" &&
    currProfile.profile.kalosStarter
  ) {
    return {
      success: false,
      error: "You have already received a Kalos starter.",
    };
  } else if (
    speciesData.region === "Alola" &&
    currProfile.profile.alolaStarter
  ) {
    return {
      success: false,
      error: "You have already received an Alola starter.",
    };
  } else if (
    speciesData.region === "Galar" &&
    currProfile.profile.galarStarter
  ) {
    return {
      success: false,
      error: "You have already received a Galar starter.",
    };
  } else if (
    speciesData.region === "Hisui" &&
    currProfile.profile.hisuiStarter
  ) {
    return {
      success: false,
      error: "You have already received a Hisui starter.",
    };
  }

  await db.transaction(async (tx) => {
    await tx
      .update(profiles)
      .set({
        totalYield: currProfile.profile.totalYield + speciesData.yield,
        instanceCount: currProfile.profile.instanceCount + 1,
        johtoStarter:
          speciesData.region === "Johto"
            ? true
            : currProfile.profile.johtoStarter,
        hoennStarter:
          speciesData.region === "Hoenn"
            ? true
            : currProfile.profile.hoennStarter,
        sinnohStarter:
          speciesData.region === "Sinnoh"
            ? true
            : currProfile.profile.sinnohStarter,
        unovaStarter:
          speciesData.region === "Unova"
            ? true
            : currProfile.profile.unovaStarter,
        kalosStarter:
          speciesData.region === "Kalos"
            ? true
            : currProfile.profile.kalosStarter,
        alolaStarter:
          speciesData.region === "Alola"
            ? true
            : currProfile.profile.alolaStarter,
        galarStarter:
          speciesData.region === "Galar"
            ? true
            : currProfile.profile.galarStarter,
        hisuiStarter:
          speciesData.region === "Hisui"
            ? true
            : currProfile.profile.hisuiStarter,
      })
      .where(eq(profiles.userId, session.user.id));

    await tx
      .insert(instances)
      .values({ userId: session.user.id, speciesId: starterId });
  });

  return {
    success: true,
    message: `You have received a ${speciesData.region} starter!`,
  };
}
