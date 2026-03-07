import "server-only";

import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { isAuthed } from "~/server/db/queries/auth";
import { profiles, userCharms } from "~/server/db/schema";

export async function getTopbar() {
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
				commonCards: profiles.commonCards,
				rareCards: profiles.rareCards,
				epicCards: profiles.epicCards,
				legendaryCards: profiles.legendaryCards,
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

	if (!profileData) {
		redirect("/onboarding");
	}

	return profileData;
}
