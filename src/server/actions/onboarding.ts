import "server-only";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { profiles, species } from "@/server/db/schema";
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
