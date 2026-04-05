import { inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { db } from "~/server/db";
import { charms, profiles, userCharms, users } from "~/server/db/schema";
import { getProfileForTopbar } from "~/server/repositories/profile";
import { TEST_CHARM_IDS, TEST_CHARMS } from "../data/charms";
import { TEST_PROFILE_IDS, TEST_PROFILES } from "../data/profiles";
import { TEST_USER_CHARM_IDS, TEST_USER_CHARMS } from "../data/userCharms";
import { TEST_USER_IDS, TEST_USERS } from "../data/users";

let mockAuthResponse: { user: { id: string } } | null = null;

vi.mock("~/server/auth", () => ({
	auth: vi.fn().mockImplementation(() => Promise.resolve(mockAuthResponse)),
}));

const setupAuthMock = (userId: string | null) => {
	mockAuthResponse = userId ? { user: { id: userId } } : null;
};

describe("Profile Repository", () => {
	beforeAll(async () => {
		await db
			.insert(users)
			.values([
				TEST_USERS.testUser,
				TEST_USERS.charmUser,
				TEST_USERS.multipleCharmsUser,
				TEST_USERS.withoutProfileUser,
				TEST_USERS.adminUser,
			]);
		await db
			.insert(profiles)
			.values([
				TEST_PROFILES.testProfile,
				TEST_PROFILES.charmProfile,
				TEST_PROFILES.multipleCharmsProfile,
				TEST_PROFILES.adminProfile,
			]);
		await db.insert(charms).values([TEST_CHARMS.catching, TEST_CHARMS.other]);

		await db
			.insert(userCharms)
			.values([
				TEST_USER_CHARMS.single,
				TEST_USER_CHARMS.multi1,
				TEST_USER_CHARMS.multi2,
			]);
	});

	afterAll(async () => {
		await db
			.delete(userCharms)
			.where(inArray(userCharms.userId, TEST_USER_CHARM_IDS));

		await db.delete(charms).where(inArray(charms.id, TEST_CHARM_IDS));
		await db.delete(profiles).where(inArray(profiles.userId, TEST_PROFILE_IDS));
		await db.delete(users).where(inArray(users.id, TEST_USER_IDS));
	});

	describe("getProfileForTopbar", () => {
		it("should return profile data for authenticated user without catching charm", async () => {
			setupAuthMock(TEST_USERS.testUser.id);

			const result = await getProfileForTopbar();

			const { userId, ...expected } = TEST_PROFILES.testProfile;
			expect(result).toEqual({
				...expected,
				catchingCharm: null,
			});
		});

		it("should return profile data for authenticated user with catching charm", async () => {
			setupAuthMock(TEST_USERS.charmUser.id);

			const result = await getProfileForTopbar();

			const { userId, ...expected } = TEST_PROFILES.charmProfile;
			expect(result).toEqual({
				...expected,
				catchingCharm: TEST_CHARMS.catching.id,
			});
		});

		it("should return null for unauthenticated user", async () => {
			setupAuthMock(null);

			const result = await getProfileForTopbar();

			expect(result).toBeNull();
		});

		it("should return null for user with no profile", async () => {
			setupAuthMock(TEST_USERS.withoutProfileUser.id);

			const result = await getProfileForTopbar();

			expect(result).toBeNull();
		});

		it("should handle admin user correctly", async () => {
			setupAuthMock(TEST_USERS.adminUser.id);

			const result = await getProfileForTopbar();

			expect(result?.admin).toBe(true);
		});

		it("should return correct data when user has multiple charms but only catching charm is selected", async () => {
			setupAuthMock(TEST_USERS.multipleCharmsUser.id);

			const result = await getProfileForTopbar();

			const { userId, ...expected } = TEST_PROFILES.multipleCharmsProfile;
			expect(result).toEqual({
				...expected,
				catchingCharm: TEST_CHARMS.catching.id,
			});
		});

		it("should handle empty string user ID gracefully", async () => {
			setupAuthMock("");

			const result = await getProfileForTopbar();

			expect(result).toBeNull();
		});
	});
});
