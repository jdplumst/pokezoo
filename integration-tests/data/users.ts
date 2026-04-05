import type { users } from "~/server/db/schema";

export const TEST_USERS = {
	testUser: {
		id: "test-user-id",
		name: "Test User",
		email: "test@example.com",
	},
	charmUser: {
		id: "test-user-with-charm-id",
		name: "Test User With Charm",
		email: "testwithcharm@example.com",
	},
	multipleCharmsUser: {
		id: "test-user-with-multiple-charms-id",
		name: "Test User With Multiple Charms",
		email: "testmultiplecharms@example.com",
	},
	withoutProfileUser: {
		id: "test-user-without-profile",
		name: "Test No Profile User",
		email: "noprofile@example.com",
	},
	adminUser: {
		id: "test-admin-user",
		name: "Test Admin User",
		email: "admin@example.com",
	},
} satisfies Record<string, Partial<typeof users.$inferSelect>>;

export const TEST_USER_IDS = Object.values(TEST_USERS).map((u) => u.id);
