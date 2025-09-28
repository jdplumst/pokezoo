import { inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { db } from "~/server/db";
import {
  profiles,
  species,
  users,
  rarities,
  types,
  habitats,
  regions,
} from "~/server/db/schema";
import { getStarters } from "~/server/repositories/species";

let mockAuthResponse: { user: { id: string } } | null = null;

vi.mock("~/server/auth", () => ({
  auth: vi.fn().mockImplementation(() => Promise.resolve(mockAuthResponse)),
}));

const setupAuthMock = (userId: string | null) => {
  mockAuthResponse = userId ? { user: { id: userId } } : null;
};

describe("Species Repository", () => {
  const testUsers = [
    {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
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
  ];

  const testRarities = [
    { id: 1, name: "Common" },
    { id: 2, name: "Uncommon" },
    { id: 3, name: "Rare" },
    { id: 4, name: "Legendary" },
  ];

  const testTypes = [
    { id: 1, name: "Grass" },
    { id: 2, name: "Fire" },
    { id: 3, name: "Water" },
    { id: 4, name: "Poison" },
  ];

  const testHabitats = [
    { id: 1, name: "Grassland" },
    { id: 2, name: "Mountain" },
    { id: 3, name: "Waters-Edge" },
  ];

  const testRegions = [
    { id: 1, name: "Kanto" },
    { id: 2, name: "Johto" },
    { id: 3, name: "Hoenn" },
  ];

  const testSpecies = [
    {
      id: "bulbasaur-1",
      name: "Bulbasaur",
      typeOneId: 1, // Grass
      typeTwoId: 4, // Poison
      yield: 10,
      img: "https://example.com/bulbasaur.png",
      sellPrice: 100,
      generation: 1,
      starter: true,
      pokedexNumber: 1,
      rarityId: 1,
      shiny: false,
      regionId: 1, // Kanto
      habitatId: 1,
    },
    {
      id: "charmander-4",
      name: "Charmander",
      typeOneId: 2, // Fire
      typeTwoId: null,
      yield: 10,
      img: "https://example.com/charmander.png",
      sellPrice: 100,
      generation: 1,
      starter: true,
      pokedexNumber: 4,
      rarityId: 1,
      shiny: false,
      regionId: 1, // Kanto
      habitatId: 1,
    },
    {
      id: "squirtle-7",
      name: "Squirtle",
      typeOneId: 3, // Water
      typeTwoId: null,
      yield: 10,
      img: "https://example.com/squirtle.png",
      sellPrice: 100,
      generation: 1,
      starter: true,
      pokedexNumber: 7,
      rarityId: 1,
      shiny: false,
      regionId: 1, // Kanto
      habitatId: 1,
    },
  ];

  beforeAll(async () => {
    await db.insert(users).values(testUsers);
    await db.insert(profiles).values(testProfiles);
    await db.insert(rarities).values(testRarities);
    await db.insert(types).values(testTypes);
    await db.insert(habitats).values(testHabitats);
    await db.insert(regions).values(testRegions);
    await db.insert(species).values(testSpecies);

    setupAuthMock("test-user-id");
  });

  afterAll(async () => {
    await db.delete(species).where(
      inArray(
        species.id,
        testSpecies.map((s) => s.id),
      ),
    );
    // Clean up related tables
    await db.delete(regions).where(
      inArray(
        regions.id,
        testRegions.map((r) => r.id),
      ),
    );
    await db.delete(habitats).where(
      inArray(
        habitats.id,
        testHabitats.map((h) => h.id),
      ),
    );
    await db.delete(types).where(
      inArray(
        types.id,
        testTypes.map((t) => t.id),
      ),
    );
    await db.delete(rarities).where(
      inArray(
        rarities.id,
        testRarities.map((r) => r.id),
      ),
    );
    await db.delete(profiles).where(
      inArray(
        profiles.id,
        testProfiles.map((p) => p.id),
      ),
    );
    await db.delete(users).where(
      inArray(
        users.id,
        testUsers.map((u) => u.id),
      ),
    );
  });

  describe("getStarters", () => {
    it("returns kanto starters", async () => {
      const starters = await getStarters(1);

      expect(starters.length).toBe(3);
      expect(starters[0].name).toBe("Bulbasaur");
      expect(starters[1].name).toBe("Charmander");
      expect(starters[2].name).toBe("Squirtle");
    });
  });
});
