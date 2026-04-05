import type { types } from "~/server/db/schema";

export const TEST_TYPES = {
	grass: { id: 1, name: "Grass" },
	fire: { id: 2, name: "Fire" },
	water: { id: 3, name: "Water" },
	poison: { id: 4, name: "Poison" },
	electric: { id: 5, name: "Electric" },
} satisfies Record<string, typeof types.$inferSelect>;

export const TEST_TYPE_IDS = Object.values(TEST_TYPES).map((t) => t.id);
