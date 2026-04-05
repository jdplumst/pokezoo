import type { rarities } from "~/server/db/schema";

export const TEST_RARITIES = {
	common: { id: 1, name: "Common" },
	rare: { id: 2, name: "Rare" },
	epic: { id: 3, name: "Epic" },
	legendary: { id: 4, name: "Legendary" },
} satisfies Record<string, typeof rarities.$inferSelect>;

export const TEST_RARITY_IDS = Object.values(TEST_RARITIES).map((r) => r.id);
