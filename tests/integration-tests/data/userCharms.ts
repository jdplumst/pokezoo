import type { userCharms } from "~/server/db/schema";
import { TEST_CHARMS } from "./charms";
import { TEST_USERS } from "./users";

export const TEST_USER_CHARMS = {
	single: {
		id: "test-user-catching",
		userId: TEST_USERS.charmUser.id,
		charmId: TEST_CHARMS.catching.id,
	},
	multi1: {
		id: "test-multi-user-charm-1",
		userId: TEST_USERS.multipleCharmsUser.id,
		charmId: TEST_CHARMS.catching.id,
	},
	multi2: {
		id: "test-multi-user-charm-2",
		userId: TEST_USERS.multipleCharmsUser.id,
		charmId: TEST_CHARMS.other.id,
	},
} satisfies Record<string, Partial<typeof userCharms.$inferSelect>>;

export const TEST_USER_CHARM_IDS = Object.values(TEST_USER_CHARMS).map(
	(uc) => uc.id,
);
