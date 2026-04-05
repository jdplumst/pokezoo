import { eq, inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
	createTrade,
	getTradeWithInstance,
} from "~/features/trades/repositories/trades.repository";
import { db } from "~/server/db";
import {
	habitats,
	instances,
	profiles,
	rarities,
	regions,
	species,
	trades,
	types,
	users,
} from "~/server/db/schema";
import { TEST_HABITAT_IDS, TEST_HABITATS } from "../data/habitats";
import { TEST_INSTANCE_IDS, TEST_INSTANCES } from "../data/instances";
import { TEST_PROFILE_IDS, TEST_PROFILES } from "../data/profiles";
import { TEST_RARITIES, TEST_RARITY_IDS } from "../data/rarities";
import { TEST_REGION_IDS, TEST_REGIONS } from "../data/regions";
import { TEST_SPECIES, TEST_SPECIES_IDS } from "../data/species";
import { TEST_TRADE_IDS, TEST_TRADES } from "../data/trades";
import { TEST_TYPE_IDS, TEST_TYPES } from "../data/types";
import { TEST_USER_IDS, TEST_USERS } from "../data/users";

describe("Trades Repository", () => {
	beforeAll(async () => {
		await db
			.insert(users)
			.values([TEST_USERS.testUser, TEST_USERS.offererUser]);
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
				TEST_TYPES.electric,
			]);
		await db
			.insert(habitats)
			.values([
				TEST_HABITATS.grassland,
				TEST_HABITATS.mountain,
				TEST_HABITATS.watersEdge,
				TEST_HABITATS.forest,
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
				TEST_SPECIES.pikachu,
			]);
		await db
			.insert(instances)
			.values([
				TEST_INSTANCES.bulbasaur,
				TEST_INSTANCES.charamnder,
				TEST_INSTANCES.squirtle,
				TEST_INSTANCES.pikachuOffer,
			]);
		await db
			.insert(trades)
			.values([TEST_TRADES.bulbasaur, TEST_TRADES.charmanderPikachu]);
	});

	afterAll(async () => {
		await db.delete(trades).where(inArray(trades.id, TEST_TRADE_IDS));
		await db.delete(instances).where(inArray(instances.id, TEST_INSTANCE_IDS));
		await db.delete(species).where(inArray(species.id, TEST_SPECIES_IDS));
		await db.delete(regions).where(inArray(regions.id, TEST_REGION_IDS));
		await db.delete(habitats).where(inArray(habitats.id, TEST_HABITAT_IDS));
		await db.delete(types).where(inArray(types.id, TEST_TYPE_IDS));
		await db.delete(rarities).where(inArray(rarities.id, TEST_RARITY_IDS));
		await db.delete(profiles).where(inArray(profiles.id, TEST_PROFILE_IDS));
		await db.delete(users).where(inArray(users.id, TEST_USER_IDS));
	});

	describe("getTradeWithInstance", () => {
		it("returns a trade with the instance as initiator instance", async () => {
			const trade = await getTradeWithInstance(db, TEST_INSTANCES.bulbasaur.id);
			expect(trade).toEqual(TEST_TRADES.bulbasaur);
		});

		it("returns a trade with the instance as offerer instance", async () => {
			const trade = await getTradeWithInstance(
				db,
				TEST_INSTANCES.pikachuOffer.id,
			);
			expect(trade).toEqual(TEST_TRADES.charmanderPikachu);
		});

		it("returns undefined when the instance is not part of any trade", async () => {
			const trade = await getTradeWithInstance(db, TEST_INSTANCES.squirtle.id);
			expect(trade).toBeUndefined();
		});
	});

	describe("createTrade", () => {
		it("creates a trade with a description", async () => {
			await createTrade(
				db,
				TEST_USERS.testUser.id,
				TEST_INSTANCES.squirtle.id,
				"This is a description",
			);
			const trade = await getTradeWithInstance(db, TEST_INSTANCES.squirtle.id);
			expect(trade).toBeDefined();
			expect(trade.initiatorId).toEqual(TEST_USERS.testUser.id);
			expect(trade.initiatorInstanceId).toEqual(TEST_INSTANCES.squirtle.id);
			expect(trade.description).toEqual("This is a description");

			await db
				.delete(trades)
				.where(eq(trades.initiatorInstanceId, TEST_INSTANCES.squirtle.id));
		});

		it("creates a trade without a description", async () => {
			await createTrade(db, TEST_USERS.testUser.id, TEST_INSTANCES.squirtle.id);

			const trade = await getTradeWithInstance(db, TEST_INSTANCES.squirtle.id);
			expect(trade).toBeDefined();
			expect(trade.initiatorId).toEqual(TEST_USERS.testUser.id);
			expect(trade.initiatorInstanceId).toEqual(TEST_INSTANCES.squirtle.id);
			expect(trade.description).toBeNull();

			await db
				.delete(trades)
				.where(eq(trades.initiatorInstanceId, TEST_INSTANCES.squirtle.id));
		});
	});
});
