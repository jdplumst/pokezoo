import { eq, or } from "drizzle-orm";
import type { Database } from "~/server/db";
import { trades } from "~/server/db/schema";

export async function getTradeWithInstance(db: Database, instanceId: string) {
	return (
		await db
			.select()
			.from(trades)
			.where(
				or(
					eq(trades.initiatorInstanceId, instanceId),
					eq(trades.offererInstanceId, instanceId),
				),
			)
	)[0];
}

export async function createTrade(
	db: Database,
	initiatorId: string,
	instanceId: string,
	description?: string,
) {
	await db.insert(trades).values({
		initiatorId: initiatorId,
		initiatorInstanceId: instanceId,
		description: description,
	});
}
