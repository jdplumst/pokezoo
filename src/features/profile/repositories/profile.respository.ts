import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { CATCHING_CHARM_ID, MARK_CHARM_ID } from "~/lib/constants";
import { auth } from "~/server/auth";
import { type Database, db } from "~/server/db";
import { profiles, userCharms } from "~/server/db/schema";

export async function getProfileForTopbar() {
	const session = await auth();

	const catchingCharm = alias(userCharms, "catchingCharm");

	const profileData = await db
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
				eq(catchingCharm.charmId, CATCHING_CHARM_ID),
			),
		)
		.where(eq(profiles.userId, session?.user.id ?? ""));

	if (profileData.length === 0) {
		return null;
	}

	return profileData[0];
}

export async function getProfile(db: Database, userId: string) {
	const catchingCharm = alias(userCharms, "catchingCharm");
	const markCharm = alias(userCharms, "markCharm");

	const currProfile = (
		await db
			.select()
			.from(profiles)
			.leftJoin(
				catchingCharm,
				and(
					eq(profiles.userId, catchingCharm.userId),
					eq(catchingCharm.charmId, CATCHING_CHARM_ID),
				),
			)
			.leftJoin(
				markCharm,
				and(
					eq(profiles.userId, markCharm.userId),
					eq(markCharm.charmId, MARK_CHARM_ID),
				),
			)
			.where(eq(profiles.userId, userId))
	)[0];

	return currProfile;
}
