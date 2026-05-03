import type { trades } from "~/server/db/schema";
import { TEST_INSTANCES } from "./instances";
import { TEST_USERS } from "./users";

export const TEST_TRADES = {
	bulbasaur: {
		id: "bulbasaur-trade",
		initiatorId: TEST_USERS.testUser.id,
		initiatorInstanceId: TEST_INSTANCES.bulbasaur.id,
		offererId: null,
		offererInstanceId: null,
		createDate: new Date("2026-01-01"),
		modifyDate: new Date("2026-01-01"),
		description: "trade without an offer",
	},
	charmanderPikachu: {
		id: "charmander-pikachu-trade",
		initiatorId: TEST_USERS.testUser.id,
		initiatorInstanceId: TEST_INSTANCES.charmander.id,
		offererId: TEST_USERS.offererUser.id,
		offererInstanceId: TEST_INSTANCES.pikachuOffer.id,
		createDate: new Date("2026-01-01"),
		modifyDate: new Date("2026-01-01"),
		description: "trade with an offer",
	},
} satisfies Record<string, typeof trades.$inferSelect>;

export const TEST_TRADE_IDS = Object.values(TEST_TRADES).map((t) => t.id);
