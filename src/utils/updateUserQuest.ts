import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
  type selectSpeciesSchema,
  type selectBallSchema,
  type selectUserQuestSchema,
  userQuests,
} from "../server/db/schema";
import { and, eq } from "drizzle-orm";
import { type z } from "zod";

export async function updateUserQuest(
  species: z.infer<typeof selectSpeciesSchema>,
  db: PostgresJsDatabase<typeof import("../server/db/schema")>,
  id: string,
  ball?: z.infer<typeof selectBallSchema>,
) {
  const currUserQuests = await db
    .select()
    .from(userQuests)
    .where(and(eq(userQuests.userId, id), eq(userQuests.claimed, false)));

  for (const currUserQuest of currUserQuests) {
    switch (currUserQuest.questId) {
      // Purchase 1 Poké Ball
      case 1:
      // Purchase 10 Poké Balls
      case 7:
        if (ball?.name === "Poké") {
          await updateUserQuestCount(db, currUserQuest);
        }
        break;

      // Purchase 1 Great Ball
      case 2:
      // Purchase 10 Great Balls
      case 8:
        if (ball?.name === "Great") {
          await updateUserQuestCount(db, currUserQuest);
        }
        break;

      // Purchase 1 Net Ball
      case 3:
      // Purchase 10 Net Balls
      case 10:
        if (ball?.name === "Net") {
          await updateUserQuestCount(db, currUserQuest);
        }
        break;

      // Purchase 1 Safari Ball
      case 4:
      // Purchase 10 Safari Balls
      case 11:
        if (ball?.name === "Safari") {
          await updateUserQuestCount(db, currUserQuest);
        }
        break;

      // Catch 1 Common Pokémon
      case 5:
      // Catch 10 Common Pokémon
      case 12:
        if (species.rarityId === 1) {
          await updateUserQuestCount(db, currUserQuest);
        }
        break;

      // Catch 1 Rare Pokémon
      case 6:
      // Catch 10 Rare Pokémon
      case 13:
        if (species.rarityId === 2) {
          await updateUserQuestCount(db, currUserQuest);
        }
        break;

      // Purchase 1 Ultra Ball
      case 9:
      // Purchase 10 Ultra Balls
      case 17:
        if (ball?.name === "Ultra") {
          await updateUserQuestCount(db, currUserQuest);
        }
        break;

      // Catch 1 Epic Pokémon
      case 14:
      // Catch 10 Epic Pokémon
      case 20:
        if (species.rarityId === 3) {
          await updateUserQuestCount(db, currUserQuest);
        }
        break;

      // Catch 1 Legendary Pokémon
      case 15:
      // Catch 10 Legendary Pokémon
      case 21:
        if (species.rarityId === 4) {
          await updateUserQuestCount(db, currUserQuest);
        }
        break;

      // Purchase 1 Master Ball
      case 16:
      // Purchase 10 Master Balls
      case 18:
        if (ball?.name === "Master") {
          await updateUserQuestCount(db, currUserQuest);
        }
        break;

      // Purhcase 1 Luxury Ball
      case 19:
        if (ball?.name === "Luxury") {
          await updateUserQuestCount(db, currUserQuest);
        }
        break;

      default:
        throw new Error("Invalid quest");
    }
  }
}

async function updateUserQuestCount(
  db: PostgresJsDatabase<typeof import("../server/db/schema")>,
  currUserQuest: z.infer<typeof selectUserQuestSchema>,
) {
  await db
    .update(userQuests)
    .set({
      count: currUserQuest.count + 1,
    })
    .where(eq(userQuests.id, currUserQuest.id));
}
