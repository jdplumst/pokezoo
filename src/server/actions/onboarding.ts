import "server-only";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { db } from "../db";
import { profiles, species } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function getOnboarding() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const currProfile = (
    await db.select().from(profiles).where(eq(profiles.userId, session.user.id))
  )[0];

  if (currProfile) {
    redirect("/game");
  }

  const starters = await db
    .select({
      id: species.id,
      name: species.name,
      img: species.img,
    })
    .from(species)
    .where(and(eq(species.starter, true), eq(species.regionId, 1)))
    .orderBy(species.pokedexNumber);

  return starters;
}
