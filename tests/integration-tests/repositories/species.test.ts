import { inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "~/server/db";
import {
	habitats,
	profiles,
	rarities,
	regions,
	species,
	types,
	users,
} from "~/server/db/schema";
import { getStarters } from "~/server/repositories/species";
import { TEST_HABITAT_IDS, TEST_HABITATS } from "../data/habitats";
import { TEST_PROFILE_IDS, TEST_PROFILES } from "../data/profiles";
import { TEST_RARITIES, TEST_RARITY_IDS } from "../data/rarities";
import { TEST_REGION_IDS, TEST_REGIONS } from "../data/regions";
import { TEST_SPECIES, TEST_SPECIES_IDS } from "../data/species";
import { TEST_TYPE_IDS, TEST_TYPES } from "../data/types";
import { TEST_USER_IDS, TEST_USERS } from "../data/users";

describe("Species Repository", () => {
	beforeAll(async () => {
		await db.insert(users).values([TEST_USERS.testUser]);
		await db.insert(profiles).values([TEST_PROFILES.testProfile]);
		await db
			.insert(rarities)
			.values([
				TEST_RARITIES.common,
				TEST_RARITIES.rare,
				TEST_RARITIES.epic,
				TEST_RARITIES.legendary,
			]);
		await db
			.insert(types)
			.values([
				TEST_TYPES.grass,
				TEST_TYPES.fire,
				TEST_TYPES.water,
				TEST_TYPES.poison,
			]);
		await db
			.insert(habitats)
			.values([
				TEST_HABITATS.grassland,
				TEST_HABITATS.mountain,
				TEST_HABITATS.watersEdge,
			]);
		await db
			.insert(regions)
			.values([TEST_REGIONS.kanto, TEST_REGIONS.johto, TEST_REGIONS.hoenn]);
		await db
			.insert(species)
			.values([
				TEST_SPECIES.bulbasaur,
				TEST_SPECIES.charmander,
				TEST_SPECIES.squirtle,
			]);
	});

	afterAll(async () => {
		await db.delete(species).where(inArray(species.id, TEST_SPECIES_IDS));
		// Clean up related tables
		await db.delete(regions).where(inArray(regions.id, TEST_REGION_IDS));
		await db.delete(habitats).where(inArray(habitats.id, TEST_HABITAT_IDS));
		await db.delete(types).where(inArray(types.id, TEST_TYPE_IDS));
		await db.delete(rarities).where(inArray(rarities.id, TEST_RARITY_IDS));
		await db.delete(profiles).where(inArray(profiles.id, TEST_PROFILE_IDS));
		await db.delete(users).where(inArray(users.id, TEST_USER_IDS));
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
