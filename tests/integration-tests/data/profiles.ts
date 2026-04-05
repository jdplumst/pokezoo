import type { profiles } from "~/server/db/schema";
import { TEST_USERS } from "./users";

export const TEST_PROFILES = {
	testProfile: {
		id: "test-profile-id",
		userId: TEST_USERS.testUser.id,
		username: "testuser",
		admin: false,
		totalYield: 1000,
		balance: 500,
		instanceCount: 10,
		commonCards: 5,
		rareCards: 3,
		epicCards: 2,
		legendaryCards: 1,
	},
	charmProfile: {
		id: "test-profile-with-charm-id",
		userId: TEST_USERS.charmUser.id,
		username: "testuserwithcharm",
		admin: false,
		totalYield: 1000,
		balance: 500,
		instanceCount: 10,
		commonCards: 5,
		rareCards: 3,
		epicCards: 2,
		legendaryCards: 1,
	},
	multipleCharmsProfile: {
		id: "test-profile-with-multiple-charms-id",
		userId: TEST_USERS.multipleCharmsUser.id,
		username: "testuserwithmultiplecharms",
		admin: false,
		totalYield: 1000,
		balance: 500,
		instanceCount: 10,
		commonCards: 5,
		rareCards: 3,
		epicCards: 2,
		legendaryCards: 1,
	},
	adminProfile: {
		id: "test-admin-profile-id",
		userId: TEST_USERS.adminUser.id,
		username: "testuser",
		admin: true,
		totalYield: 1000,
		balance: 500,
		instanceCount: 10,
		commonCards: 5,
		rareCards: 3,
		epicCards: 2,
		legendaryCards: 1,
	},
} satisfies Record<string, Partial<typeof profiles.$inferSelect>>;

export const TEST_PROFILE_IDS = Object.values(TEST_PROFILES).map((p) => p.id);
