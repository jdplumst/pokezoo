"use server";

import { hasProfile, isAuthed } from "@/server/actions/auth";
import { db } from "@/server/db";
import { instances, profiles, regions, species } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function selectStarter(
  _previousState: unknown,
  formData: FormData,
) {
  const session = await isAuthed();

  const currProfile = await hasProfile();

  const formSchema = z.object({
    starterId: z.string(),
  });

  const input = formSchema.safeParse(Object.fromEntries(formData));

  if (input.error) {
    return {
      error: "Something went wrong. Please try again.",
    };
  }

  const speciesData = (
    await db
      .select({ region: regions.name, yield: species.yield })
      .from(species)
      .leftJoin(regions, eq(species.regionId, regions.id))
      .where(eq(species.id, input.data.starterId))
  )[0];

  if (!speciesData) {
    return {
      error: "You must select a starter pokémon.",
    };
  }

  if (speciesData.region === "Johto" && currProfile.profile.johtoStarter) {
    return {
      error: "You have already received a Johto starter.",
    };
  } else if (
    speciesData.region === "Hoenn" &&
    currProfile.profile.hoennStarter
  ) {
    return {
      error: "You have already received a Hoenn starter.",
    };
  } else if (
    speciesData.region === "Sinnoh" &&
    currProfile.profile.sinnohStarter
  ) {
    return {
      error: "You have already received a Sinnoh starter.",
    };
  } else if (
    speciesData.region === "Unova" &&
    currProfile.profile.unovaStarter
  ) {
    return {
      error: "You have already received a Unova starter.",
    };
  } else if (
    speciesData.region === "Kalos" &&
    currProfile.profile.kalosStarter
  ) {
    return {
      error: "You have already received a Kalos starter.",
    };
  } else if (
    speciesData.region === "Alola" &&
    currProfile.profile.alolaStarter
  ) {
    return {
      error: "You have already received an Alola starter.",
    };
  } else if (
    speciesData.region === "Galar" &&
    currProfile.profile.galarStarter
  ) {
    return {
      error: "You have already received a Galar starter.",
    };
  } else if (
    speciesData.region === "Hisui" &&
    currProfile.profile.hisuiStarter
  ) {
    return {
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
      .values({ userId: session.user.id, speciesId: input.data.starterId });
  });

  return {
    message: `You have received a ${speciesData.region} starter!`,
  };
}
