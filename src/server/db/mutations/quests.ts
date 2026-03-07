import "server-only";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { isAuthed } from "~/server/db/queries/auth";
import { profiles, quests, userQuests } from "~/server/db/schema";

export async function claimQuest(userQuestId: string) {
	const session = await isAuthed();

	const currUserQuest = (
		await db
			.select()
			.from(userQuests)
			.where(
				and(
					eq(userQuests.id, userQuestId),
					eq(userQuests.userId, session.user.id),
				),
			)
	)[0];

	if (!currUserQuest) {
		throw new Error("User quest was not found.");
	}

	const currQuest = (
		await db.select().from(quests).where(eq(quests.id, currUserQuest.questId))
	)[0];

	if (!currQuest) {
		throw new Error("Quest was not found.");
	}

	// Validate that user can claim this quest
	if (currUserQuest.claimed) {
		revalidatePath("/quests");
		return;
	}

	if (currUserQuest.count < currQuest.goal) {
		revalidatePath("/quests");
		return;
	}

	const currProfile = (
		await db.select().from(profiles).where(eq(profiles.userId, session.user.id))
	)[0];

	if (!currProfile) {
		redirect("/onboarding");
	}

	await db.transaction(async (tx) => {
		await tx
			.update(userQuests)
			.set({ claimed: true })
			.where(
				and(
					eq(userQuests.id, userQuestId),
					eq(userQuests.userId, session.user.id),
				),
			);

		await tx
			.update(profiles)
			.set({ balance: currProfile.balance + currQuest.reward })
			.where(eq(profiles.userId, session.user.id));
	});

	revalidatePath("/quests");
}
