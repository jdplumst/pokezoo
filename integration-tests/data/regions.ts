import type { regions } from "~/server/db/schema";

export const TEST_REGIONS = {
	kanto: { id: 1, name: "Kanto" },
	johto: { id: 2, name: "Johto" },
	hoenn: { id: 3, name: "Hoenn" },
} satisfies Record<string, typeof regions.$inferSelect>;

export const TEST_REGION_IDS = Object.values(TEST_REGIONS).map((r) => r.id);
