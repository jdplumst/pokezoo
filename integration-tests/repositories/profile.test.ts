import { describe, expect, it, beforeAll, afterAll, vi } from "vitest";
import { eq, inArray } from "drizzle-orm";
import { db } from "~/server/db";
import { profiles, users, userCharms, charms } from "~/server/db/schema";
import { CATCHING_CHARM_ID } from "~/lib/constants";
import { getProfileForTopbar } from "~/server/repositories/profile";

let mockAuthResponse: { user: { id: string } } | null = null;

vi.mock("~/server/auth", () => ({
  auth: vi.fn().mockImplementation(() => Promise.resolve(mockAuthResponse)),
}));

const setupAuthMock = (userId: string | null) => {
  mockAuthResponse = userId ? { user: { id: userId } } : null;
};

describe("Profile Repository", () => {
  const testUsers = [
    {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
    },
    {
      id: "test-user-with-charm-id",
      name: "Test User With Charm",
      email: "testwithcharm@example.com",
    },
    {
      id: "test-user-with-multiple-charms-id",
      name: "Test User With Multiple Charms",
      email: "testmultiplecharms@example.com",
    },
    {
      id: "user-without-profile",
      name: "No Profile User",
      email: "noprofile@example.com",
    },
  ];

  const testProfiles = [
    {
      id: "test-profile-id",
      userId: "test-user-id",
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
    {
      id: "test-profile-with-charm-id",
      userId: "test-user-with-charm-id",
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
    {
      id: "test-profile-with-multiple-charms-id",
      userId: "test-user-with-multiple-charms-id",
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
  ];

  const testCharms = [
    {
      id: CATCHING_CHARM_ID,
      name: "Catching Charm",
      img: "catching-charm.png",
      cost: 100,
      description: "Increases catch rate",
    },
    {
      id: 2,
      name: "Other Charm",
      img: "other-charm.png",
      cost: 200,
      description: "Does something else",
    },
  ];

  beforeAll(async () => {
    await db.insert(users).values(testUsers);
    await db.insert(profiles).values(testProfiles);
    await db.insert(charms).values(testCharms);

    await db.insert(userCharms).values([
      {
        userId: testUsers[1].id,
        charmId: testCharms[0].id,
      },
      {
        userId: testUsers[2].id,
        charmId: testCharms[0].id,
      },
      {
        userId: testUsers[2].id,
        charmId: testCharms[1].id,
      },
    ]);
  });

  afterAll(async () => {
    await db.delete(userCharms).where(
      inArray(
        userCharms.userId,
        testUsers.map((u) => u.id),
      ),
    );

    await db.delete(charms).where(
      inArray(
        charms.id,
        testCharms.map((c) => c.id),
      ),
    );
    await db.delete(profiles).where(
      inArray(
        profiles.userId,
        testUsers.map((u) => u.id),
      ),
    );
    await db.delete(users).where(
      inArray(
        users.id,
        testUsers.map((u) => u.id),
      ),
    );
  });

  describe("getProfileForTopbar", () => {
    it("should return profile data for authenticated user without catching charm", async () => {
      setupAuthMock(testUsers[0].id);

      const result = await getProfileForTopbar();

      expect(result).toEqual({
        id: testProfiles[0].id,
        username: testProfiles[0].username,
        admin: testProfiles[0].admin,
        totalYield: testProfiles[0].totalYield,
        balance: testProfiles[0].balance,
        instanceCount: testProfiles[0].instanceCount,
        commonCards: testProfiles[0].commonCards,
        rareCards: testProfiles[0].rareCards,
        epicCards: testProfiles[0].epicCards,
        legendaryCards: testProfiles[0].legendaryCards,
        catchingCharm: null,
      });
    });

    it("should return profile data for authenticated user with catching charm", async () => {
      setupAuthMock(testUsers[1].id);

      const result = await getProfileForTopbar();

      expect(result).toEqual({
        id: testProfiles[1].id,
        username: testProfiles[1].username,
        admin: testProfiles[1].admin,
        totalYield: testProfiles[1].totalYield,
        balance: testProfiles[1].balance,
        instanceCount: testProfiles[1].instanceCount,
        commonCards: testProfiles[1].commonCards,
        rareCards: testProfiles[1].rareCards,
        epicCards: testProfiles[1].epicCards,
        legendaryCards: testProfiles[1].legendaryCards,
        catchingCharm: testCharms[0].id,
      });
    });

    it("should return null for unauthenticated user", async () => {
      setupAuthMock(null);

      const result = await getProfileForTopbar();

      expect(result).toBeNull();
    });

    it("should return null for user with no profile", async () => {
      setupAuthMock(testUsers[3].id);

      const result = await getProfileForTopbar();

      expect(result).toBeNull();
    });

    it("should handle admin user correctly", async () => {
      await db
        .update(profiles)
        .set({ admin: true })
        .where(eq(profiles.userId, testUsers[0].id));

      setupAuthMock(testUsers[0].id);

      const result = await getProfileForTopbar();

      expect(result?.admin).toBe(true);
    });

    it("should return correct data when user has multiple charms but only catching charm is selected", async () => {
      setupAuthMock(testUsers[2].id);

      const result = await getProfileForTopbar();

      expect(result).toEqual({
        id: testProfiles[2].id,
        username: testProfiles[2].username,
        admin: testProfiles[2].admin,
        totalYield: testProfiles[2].totalYield,
        balance: testProfiles[2].balance,
        instanceCount: testProfiles[2].instanceCount,
        commonCards: testProfiles[2].commonCards,
        rareCards: testProfiles[2].rareCards,
        epicCards: testProfiles[2].epicCards,
        legendaryCards: testProfiles[2].legendaryCards,
        catchingCharm: testCharms[0].id,
      });
    });

    it("should handle empty string user ID gracefully", async () => {
      setupAuthMock("");

      const result = await getProfileForTopbar();

      expect(result).toBeNull();
    });
  });
});
