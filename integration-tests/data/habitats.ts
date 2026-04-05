import type { habitats } from "~/server/db/schema";

export const TEST_HABITATS = {
	grassland: { id: 1, name: "Grassland" },
	mountain: { id: 2, name: "Mountain" },
	watersEdge: { id: 3, name: "Waters-Edge" },
} satisfies Record<string, typeof habitats.$inferSelect>;

export const TEST_HABITAT_IDS = Object.values(TEST_HABITATS).map((h) => h.id);
